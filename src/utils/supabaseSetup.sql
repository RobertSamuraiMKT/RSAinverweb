-- ========================================================================================
-- DESPLIEGUE DEFINITIVO DE SEGURIDAD EN LA NUBE PARA RSA INVER (SUPABASE AUTH + RLS)
-- ========================================================================================
-- Este script crea las tablas relacionales vinculadas directamente al sistema de autenticación
-- bancaria nativo de Supabase (auth.users) y activa Row Level Security (RLS) definitivo.
-- Implementa funciones "security definer" con el search_path seguro para evitar suplantaciones,
-- evita recursión infinita cualificando objetos, y separa las políticas CRUD de forma granular.

-- 1. Habilitar la extensión de identificadores únicos
create extension if not exists "uuid-ossp";

-- 2. Tabla de Perfiles de Inversores (vinculada a auth.users)
create table public.investor_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  full_name text not null,
  company_name text,
  phone text,
  email text not null,
  is_admin boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabla de Expedientes / Ofertas Activas
create table public.asset_offers (
  id uuid default uuid_generate_v4() primary key,
  investor_id uuid references public.investor_profiles(id) on delete cascade not null,
  asset_title text not null,
  bank_or_servicer text not null,
  offer_amount numeric not null,
  original_price numeric default 0 not null,
  phase text not null,
  pbc_passed boolean default false not null,
  signing_date text,
  notes text,
  reference text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabla de Documentos Requeridos
create table public.missing_docs (
  id uuid default uuid_generate_v4() primary key,
  offer_id uuid references public.asset_offers(id) on delete cascade not null,
  name text not null,
  is_provided boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Tabla de Historial Auditable
create table public.offer_history (
  id uuid default uuid_generate_v4() primary key,
  offer_id uuid references public.asset_offers(id) on delete cascade not null,
  event_type text not null,
  title text not null,
  description text not null,
  registered_by text not null,
  from_value text,
  to_value text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================================================
-- AUTOMATIZACIÓN DE ALTA PRIVADA (TRIGGER PARA CREACIÓN DESDE BACKEND SUPABASE)
-- ========================================================================================

create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
begin
  base_username := split_part(new.email, '@', 1);
  
  insert into public.investor_profiles (id, username, full_name, email, is_admin)
  values (
    new.id,
    base_username || '_' || substr(md5(random()::text), 1, 4),
    coalesce(new.raw_user_meta_data->>'full_name', 'Inversor ' || base_username),
    new.email,
    false
  );
  return new;
end;
$$ language plpgsql security definer set search_path = '';

-- Restringir explícitamente permisos de ejecución a la función interna del trigger
revoke all on function public.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================================================================================
-- FUNCIONES DE AUTORIZACIÓN Y PROCEDIMIENTOS SEGUROS (RPC)
-- ========================================================================================

-- Función con permisos elevados que consulta de forma atómica si la sesión actual es admin.
-- REGLA SIMPLIFICADA DE PRODUCCIÓN: el rol admin se decide por email autenticado.
create or replace function public.is_admin()
returns boolean as $$
declare
  v_email text;
begin
  select lower(email) into v_email
  from auth.users
  where id = auth.uid();

  return v_email in ('rsa@rsainver.com');
end;
$$ language plpgsql security definer set search_path = '';

-- Prohibir acceso a sesiones anónimas y habilitarlo estrictamente para sesiones autenticadas
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- RPC de lectura del perfil propio para depuración/control de sesión.
-- El rol devuelto se decide por email autenticado, no por investor_profiles.is_admin.
create or replace function public.get_my_profile()
returns table (
  id uuid,
  email text,
  username text,
  full_name text,
  is_admin boolean
) as $$
begin
  return query
  select
    u.id,
    u.email::text,
    coalesce(p.username, split_part(u.email, '@', 1))::text as username,
    coalesce(p.full_name, u.raw_user_meta_data->>'full_name', 'Inversor')::text as full_name,
    (lower(u.email) in ('rsa@rsainver.com')) as is_admin
  from auth.users u
  left join public.investor_profiles p on p.id = u.id
  where u.id = auth.uid();
end;
$$ language plpgsql security definer set search_path = '';

revoke all on function public.get_my_profile() from public;
grant execute on function public.get_my_profile() to authenticated;

-- ----------------------------------------------------------------------------------------
-- RPC SEGURO: MARK_MISSING_DOC_PROVIDED
-- Garantiza que el cliente inversor pueda alterar de forma exclusiva la columna is_provided
-- previa validación atómica relacional, anulando vulnerabilidades del lado del cliente.
-- ----------------------------------------------------------------------------------------
create or replace function public.mark_missing_doc_provided(p_doc_id uuid, p_is_provided boolean)
returns boolean as $$
declare
  v_is_owner boolean;
begin
  -- Verificar propiedad de forma cualificada enlazando el documento con la oferta del cliente
  select true into v_is_owner
  from public.missing_docs md
  join public.asset_offers ao on ao.id = md.offer_id
  where md.id = p_doc_id and ao.investor_id = auth.uid();

  if coalesce(v_is_owner, false) then
    update public.missing_docs
    set is_provided = p_is_provided
    where id = p_doc_id;
    return true;
  else
    raise exception 'Acceso denegado o documento inexistente para este inversor.';
  end if;
end;
$$ language plpgsql security definer set search_path = '';

-- Restringir ejecución de la función de alteración estrictamente a clientes autenticadas
revoke all on function public.mark_missing_doc_provided(uuid, boolean) from public;
grant execute on function public.mark_missing_doc_provided(uuid, boolean) to authenticated;

-- ========================================================================================
-- ACTIVACIÓN Y DESGLOSE ESTRICTO DE POLÍTICAS RLS (CRUD SEPARADO Y CUALIFICADO)
-- ========================================================================================

alter table public.investor_profiles enable row level security;
alter table public.asset_offers enable row level security;
alter table public.missing_docs enable row level security;
alter table public.offer_history enable row level security;

-- ----------------------------------------------------------------------------------------
-- POLÍTICAS: INVESTOR_PROFILES
-- ----------------------------------------------------------------------------------------
create policy "investor_profiles_select_self" 
  on public.investor_profiles for select to authenticated 
  using ( auth.uid() = id );

create policy "investor_profiles_select_admin" 
  on public.investor_profiles for select to authenticated 
  using ( public.is_admin() );

create policy "investor_profiles_insert_admin" 
  on public.investor_profiles for insert to authenticated 
  with check ( public.is_admin() );

create policy "investor_profiles_update_admin" 
  on public.investor_profiles for update to authenticated 
  using ( public.is_admin() );

create policy "investor_profiles_delete_admin" 
  on public.investor_profiles for delete to authenticated 
  using ( public.is_admin() );

-- ----------------------------------------------------------------------------------------
-- POLÍTICAS: ASSET_OFFERS
-- ----------------------------------------------------------------------------------------
create policy "asset_offers_select_self" 
  on public.asset_offers for select to authenticated 
  using ( auth.uid() = investor_id );

create policy "asset_offers_select_admin" 
  on public.asset_offers for select to authenticated 
  using ( public.is_admin() );

create policy "asset_offers_insert_admin" 
  on public.asset_offers for insert to authenticated 
  with check ( public.is_admin() );

create policy "asset_offers_update_admin" 
  on public.asset_offers for update to authenticated 
  using ( public.is_admin() );

create policy "asset_offers_delete_admin" 
  on public.asset_offers for delete to authenticated 
  using ( public.is_admin() );

-- ----------------------------------------------------------------------------------------
-- POLÍTICAS: MISSING_DOCS
-- ----------------------------------------------------------------------------------------
create policy "missing_docs_select_self" 
  on public.missing_docs for select to authenticated 
  using ( exists (
    select 1 from public.asset_offers 
    where asset_offers.id = missing_docs.offer_id 
    and asset_offers.investor_id = auth.uid()
  ));

-- IMPORTANTE: La actualización directa de missing_docs queda restringida exclusivamente
-- a los administradores. Los clientes inversores deben canalizar su actualización
-- obligatoriamente a través del RPC seguro public.mark_missing_doc_provided(...)
create policy "missing_docs_select_admin" 
  on public.missing_docs for select to authenticated 
  using ( public.is_admin() );

create policy "missing_docs_insert_admin" 
  on public.missing_docs for insert to authenticated 
  with check ( public.is_admin() );

create policy "missing_docs_update_admin" 
  on public.missing_docs for update to authenticated 
  using ( public.is_admin() );

create policy "missing_docs_delete_admin" 
  on public.missing_docs for delete to authenticated 
  using ( public.is_admin() );

-- ----------------------------------------------------------------------------------------
-- POLÍTICAS: OFFER_HISTORY
-- ----------------------------------------------------------------------------------------
create policy "offer_history_select_self" 
  on public.offer_history for select to authenticated 
  using ( exists (
    select 1 from public.asset_offers 
    where asset_offers.id = offer_history.offer_id 
    and asset_offers.investor_id = auth.uid()
  ));

create policy "offer_history_select_admin" 
  on public.offer_history for select to authenticated 
  using ( public.is_admin() );

create policy "offer_history_insert_admin" 
  on public.offer_history for insert to authenticated 
  with check ( public.is_admin() );

create policy "offer_history_update_admin" 
  on public.offer_history for update to authenticated 
  using ( public.is_admin() );

create policy "offer_history_delete_admin" 
  on public.offer_history for delete to authenticated 
  using ( public.is_admin() );
