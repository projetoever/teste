-- GET LED CENAS — MODELO CONCEITUAL PARA MIGRAÇÃO FUTURA, NÃO EXECUTADO.
-- Requer Supabase Auth, políticas de autorização por empresa e endpoints públicos server-side.
create table if not exists app_organizations (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  created_at timestamptz not null default now()
);
create table if not exists app_memberships (
  organization_id uuid not null references app_organizations(id),
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('owner','admin','operator')),
  primary key(organization_id,user_id)
);
create table if not exists app_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app_organizations(id),
  internal_title text not null,
  created_at timestamptz not null default now()
);
create table if not exists app_scene_templates (
  id text primary key,
  title text not null,
  category text not null,
  requirements jsonb not null default '[]'::jsonb,
  room_types jsonb not null default '[]'::jsonb,
  is_active boolean not null default true
);
create table if not exists app_forms (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references app_projects(id),
  public_title text not null,
  public_config jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  status text not null default 'draft' check (status in ('draft','published','revoked','expired')),
  token_hash text unique,
  expires_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists app_form_scene_snapshots (
  form_id uuid not null references app_forms(id),
  scene_id text not null references app_scene_templates(id),
  public_title text not null,
  public_description text not null,
  rank integer not null,
  primary key(form_id,scene_id)
);
create table if not exists app_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references app_forms(id),
  selected_scene_ids text[] not null,
  notes text,
  submitted_at timestamptz not null default now(),
  status text not null default 'received' check (status in ('received','reviewed','approved','programmed','tested','delivered'))
);
create table if not exists app_audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid not null references app_organizations(id),
  actor_id uuid,
  object_type text not null,
  object_id uuid,
  action text not null,
  at timestamptz not null default now()
);
-- RLS enabled on ALL tables. No permissive policies supplied until the authorization boundary
-- and organization membership logic have been implemented/tested end-to-end.
alter table app_organizations enable row level security;
alter table app_memberships enable row level security;
alter table app_projects enable row level security;
alter table app_scene_templates enable row level security;
alter table app_forms enable row level security;
alter table app_form_scene_snapshots enable row level security;
alter table app_submissions enable row level security;
alter table app_audit_logs enable row level security;
