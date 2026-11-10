-- ============================================================================
-- COMPLICES D'AILLEURS — SCHÉMA POSTGRESQL & ROW LEVEL SECURITY (SUPABASE)
-- ============================================================================
-- À exécuter dans Supabase Dashboard -> SQL Editor
-- Garantit l'isolation stricte des données entre utilisatrices, la confidentialité
-- absolue du carnet bien-être personnel, et les permissions du rôle 'admin'
-- pour Émilie et Virginie.

create extension if not exists "pgcrypto";

-- 1. TABLE DES PROFILS UTILISATRICES & RÔLES ('member' | 'admin')
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  phone text,
  birth_date date,
  role text not null default 'member' check (role in ('member', 'admin')),
  email_verified boolean not null default false,
  marketing_opt_in boolean not null default false,
  terms_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. RÉPONSES AU QUESTIONNAIRE « MES ENVIES D'AILLEURS » (partageable avec Émilie & Virginie)
create table if not exists public.escape_quiz_responses (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  primary_profile text,
  recommended_slugs text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- 3. CARNET BIEN-ÊTRE PERSONNEL « MES RITUELS POUR MOI »
-- STRICTEMENT PRIVÉ : même les administratrices n'y ont pas accès.
create table if not exists public.private_wellness_journal (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  skin_profile jsonb not null default '{}'::jsonb,
  completed_rituals jsonb not null default '{}'::jsonb,
  completed_challenges text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- 4. PASSEPORT COMPLICES (Tampons numériques)
create table if not exists public.passport_stamps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stamp_code text not null,
  label text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, stamp_code)
);

-- 5. ESCAPADES FAVORITES (« MES PROCHAINES ESCAPADES »)
create table if not exists public.favorite_escapes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  experience_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, experience_slug)
);

-- 6. CADEAUX COMPLICES, E-BOOKS & CONSEILS (gérés depuis le back-office)
create table if not exists public.member_resources (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('ebook', 'fiche', 'beaute', 'yoga')),
  title text not null,
  subtitle text,
  author text,
  description text,
  content_body text,
  file_url text,
  badge text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 7. CONCOURS INSTAGRAM COMPLICES D'AILLEURS
create table if not exists public.contests (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  prize text not null,
  start_date date,
  end_date date,
  rules_text text not null,
  is_active boolean not null default false,
  winner_user_id uuid references public.profiles(id) on delete set null,
  draw_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 8. PARTICIPATIONS AUX CONCOURS (distinctes de la newsletter)
create table if not exists public.contest_entries (
  id uuid primary key default gen_random_uuid(),
  contest_id uuid not null references public.contests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rules_accepted boolean not null default true,
  created_at timestamptz not null default now(),
  unique (contest_id, user_id)
);

-- 9. HISTORIQUE DES CONSENTEMENTS RGPD
create table if not exists public.consent_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  consent_type text not null, -- 'terms_privacy' | 'marketing_email' | 'contest_rules'
  granted boolean not null,
  recorded_at timestamptz not null default now()
);

-- 10. JOURNAL D'AUDIT ADMINISTRATIF
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id) on delete set null,
  admin_email text not null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- FONCTION UTILITAIRE : VÉRIFICATION DU RÔLE ADMIN CÔTÉ BASE DE DONNÉES
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================================
-- ACTIVATION DU ROW LEVEL SECURITY (RLS) SUR TOUTES LES TABLES
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.escape_quiz_responses enable row level security;
alter table public.private_wellness_journal enable row level security;
alter table public.passport_stamps enable row level security;
alter table public.favorite_escapes enable row level security;
alter table public.member_resources enable row level security;
alter table public.contests enable row level security;
alter table public.contest_entries enable row level security;
alter table public.consent_logs enable row level security;
alter table public.admin_audit_logs enable row level security;

-- POLITIQUES RLS : PROFILES
create policy "Membre lit son propre profil ou Admin lit tous les profils"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Membre crée son propre profil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Membre modifie son propre profil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Membre supprime son propre compte"
  on public.profiles for delete
  using (auth.uid() = id or public.is_admin());

-- POLITIQUES RLS : QUESTIONNAIRE D'ESCAPADE (partageable avec les administratrices)
create policy "Membre ou Admin lit le questionnaire d'escapade"
  on public.escape_quiz_responses for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Membre enregistre son questionnaire d'escapade"
  on public.escape_quiz_responses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- POLITIQUES RLS : CARNET BIEN-ÊTRE PERSONNEL (STRICTEMENT PRIVÉ — AUCUN ACCÈS ADMIN)
create policy "Seule l'utilisatrice accède à son carnet bien-être privé"
  on public.private_wellness_journal for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- POLITIQUES RLS : PASSEPORT COMPLICES
create policy "Membre ou Admin lit les tampons du passeport"
  on public.passport_stamps for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Membre ajoute ses tampons"
  on public.passport_stamps for insert
  with check (auth.uid() = user_id);

-- POLITIQUES RLS : FAVORIS
create policy "Membre ou Admin lit les escapades favorites"
  on public.favorite_escapes for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Membre gère ses escapades favorites"
  on public.favorite_escapes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- POLITIQUES RLS : RESSOURCES & CADEAUX COMPLICES
create policy "Membres connectées lisent les ressources publiées"
  on public.member_resources for select
  using ((auth.uid() is not null and is_published = true) or public.is_admin());

create policy "Seules Émilie et Virginie (Admin) gèrent les ressources"
  on public.member_resources for all
  using (public.is_admin())
  with check (public.is_admin());

-- POLITIQUES RLS : CONCOURS
create policy "Tout le monde peut voir les concours actifs ou Admin voit tout"
  on public.contests for select
  using (is_active = true or public.is_admin());

create policy "Seules Émilie et Virginie (Admin) gèrent les concours"
  on public.contests for all
  using (public.is_admin())
  with check (public.is_admin());

-- POLITIQUES RLS : PARTICIPATIONS AUX CONCOURS
create policy "Membre voit sa participation ou Admin voit toutes les participations"
  on public.contest_entries for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Membre valide participe au concours"
  on public.contest_entries for insert
  with check (auth.uid() = user_id);

-- POLITIQUES RLS : CONSENTEMENTS RGPD
create policy "Membre ou Admin consulte l'historique des consentements"
  on public.consent_logs for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Membre enregistre ses consentements"
  on public.consent_logs for insert
  with check (auth.uid() = user_id);

-- POLITIQUES RLS : JOURNAL D'AUDIT ADMIN
create policy "Seules les administratrices accèdent au journal d'audit"
  on public.admin_audit_logs for all
  using (public.is_admin())
  with check (public.is_admin());
