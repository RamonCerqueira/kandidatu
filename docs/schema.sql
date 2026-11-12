-- ============================================================================
-- KANDIDATU — Schema PostgreSQL de referência para o Backend Java (Spring/JPA)
-- Alinhado com os contratos Zod em src/schemas/*.ts
-- Moeda padrão: XOF (Franco CFA da África Ocidental)
-- Regiões: BISSAU, BAFATA, GABU, CACHEU, OIO, BIOMBO, QUINARA, TOMBALI, BOLAMA_BIJAGOS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('CANDIDATE', 'COMPANY', 'ADMIN')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE candidate_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(160) NOT NULL,
  photo_url TEXT,
  birth_date DATE,
  nationality VARCHAR(80) DEFAULT 'Guineense',
  city VARCHAR(100),
  phone VARCHAR(24) NOT NULL,
  whatsapp VARCHAR(24),
  address TEXT,
  summary TEXT,
  objective TEXT,
  availability VARCHAR(30),
  curriculum_json JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  organization_type VARCHAR(40) NOT NULL DEFAULT 'EMPRESA_PRIVADA' CHECK (organization_type IN ('EMPRESA_PRIVADA', 'ONG', 'ORGANISMO_INTERNACIONAL', 'INSTITUICAO_PUBLICA', 'ENSINO_FORMACAO')),
  legal_name VARCHAR(200) NOT NULL,
  trade_name VARCHAR(200),
  tax_id VARCHAR(60) NOT NULL,
  size_range VARCHAR(20),
  logo_url TEXT,
  cover_url TEXT,
  sector VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  region VARCHAR(30) NOT NULL,
  city VARCHAR(100),
  address TEXT,
  contact_name VARCHAR(160),
  contact_role VARCHAR(120),
  phone VARCHAR(24) NOT NULL,
  whatsapp VARCHAR(24),
  email VARCHAR(180) NOT NULL,
  website TEXT,
  socials_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  employees INT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  moderation_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (moderation_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  education VARCHAR(80),
  experience VARCHAR(80),
  vacancies INT NOT NULL DEFAULT 1,
  region VARCHAR(30) NOT NULL,
  city VARCHAR(100),
  salary_min BIGINT,
  salary_max BIGINT,
  currency CHAR(3) NOT NULL DEFAULT 'XOF',
  contract_type VARCHAR(20) NOT NULL CHECK (contract_type IN ('CLT', 'TEMPORARIO', 'ESTAGIO', 'FREELANCE', 'VOLUNTARIADO')),
  work_mode VARCHAR(20) NOT NULL CHECK (work_mode IN ('PRESENCIAL', 'REMOTO', 'HIBRIDO')),
  workload VARCHAR(80),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'CLOSED', 'DRAFT')),
  moderation_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (moderation_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  deadline DATE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE saved_jobs (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, job_id)
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'SENT' CHECK (status IN ('SENT', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'APPROVED', 'REJECTED', 'CANCELLED')),
  recruitment_stage VARCHAR(20) NOT NULL DEFAULT 'NEW' CHECK (recruitment_stage IN ('NEW', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'APPROVED', 'REJECTED')),
  favorite BOOLEAN NOT NULL DEFAULT FALSE,
  internal_notes TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (job_id, candidate_user_id)
);

CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('ONLINE', 'PRESENCIAL')),
  location TEXT NOT NULL,
  instructions TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('NEW_JOB', 'APPLICATION_UPDATE', 'INTERVIEW_INVITE', 'MESSAGE')),
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE abuse_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('JOB', 'COMPANY', 'USER')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED', 'DISMISSED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE commercial_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  price_xof BIGINT NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('MENSAL', 'TRIMESTRAL', 'ANUAL')),
  job_slots INT NOT NULL,
  featured_slots INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES commercial_plans(id),
  amount_xof BIGINT NOT NULL,
  method VARCHAR(60) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'PAID', 'FAILED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE free_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(160) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(120) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('INICIANTE', 'INTERMEDIO', 'AVANCADO')),
  reading_minutes INT NOT NULL DEFAULT 10,
  summary TEXT NOT NULL,
  lessons_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sponsored_course_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name VARCHAR(200) NOT NULL,
  course_title VARCHAR(200) NOT NULL,
  category VARCHAR(120) NOT NULL,
  region VARCHAR(30) NOT NULL,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('PRESENCIAL', 'ONLINE', 'HIBRIDO')),
  banner_url TEXT,
  description TEXT NOT NULL,
  course_price_xof BIGINT,
  ad_fee_paid_xof BIGINT NOT NULL DEFAULT 0,
  placement VARCHAR(30) NOT NULL CHECK (placement IN ('SPOTLIGHT_TOP', 'CATALOG_CARD', 'SIDEBAR_BANNER')),
  target_url TEXT NOT NULL,
  whatsapp VARCHAR(30),
  starts_at DATE NOT NULL,
  ends_at DATE NOT NULL,
  impressions INT NOT NULL DEFAULT 0,
  clicks INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

