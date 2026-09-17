-- Schema base do Bíblia de Estudos Original, reconstruído a partir do Postgres da VPS em 2026
-- (init-db/01_schema.sql). O projeto Supabase original (gwgljnfvkdkrodzcyxai) não existe mais e
-- não deixou migrações; esta é a fonte de verdade do schema. Roda ANTES das migrações de 2025
-- (que só criam bible_word_mappings/word_definition_cache com IF NOT EXISTS).
-- As policies de RLS estão em 20260917120000_rls_policies.sql. Seeds: ver supabase/README.md.
-- ============================================================
-- BÍBLIA ANTIGA ESTUDOS ONLINE — Schema Completo PostgreSQL
-- ============================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para full-text search

-- ============================================================
-- ROLE para PostgREST (simula anon/authenticated do Supabase)
-- ============================================================
DO $$ BEGIN
  CREATE ROLE anon NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE ROLE authenticated NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE ROLE service_role NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Grants básicos para PostgREST
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated; -- RLS decide linha a linha
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated, service_role;

-- ============================================================
-- 1. VERSÕES BÍBLICAS
-- ============================================================
CREATE TABLE IF NOT EXISTS bible_versions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  language TEXT NOT NULL,
  language_name TEXT NOT NULL,
  is_original BOOLEAN NOT NULL DEFAULT FALSE,
  original_language TEXT
);

COMMENT ON TABLE bible_versions IS 'Versões da Bíblia disponíveis (nvi, kja, kjv, rvr, svd, apee)';

-- ============================================================
-- 2. LIVROS BÍBLICOS
-- ============================================================
CREATE TABLE IF NOT EXISTS bible_books (
  book_id TEXT NOT NULL,
  version_id TEXT NOT NULL DEFAULT 'nvi',
  name TEXT NOT NULL,
  testament TEXT NOT NULL CHECK (testament IN ('old', 'new')),
  position INTEGER NOT NULL,
  chapters_count INTEGER NOT NULL,
  PRIMARY KEY (book_id, version_id),
  CONSTRAINT fk_bible_books_version FOREIGN KEY (version_id) REFERENCES bible_versions(id)
);

CREATE INDEX IF NOT EXISTS idx_bible_books_version ON bible_books(version_id);
CREATE INDEX IF NOT EXISTS idx_bible_books_testament ON bible_books(testament);

-- ============================================================
-- 3. CAPÍTULOS
-- ============================================================
CREATE TABLE IF NOT EXISTS bible_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id TEXT NOT NULL,
  version_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  verses_count INTEGER NOT NULL,
  CONSTRAINT bible_chapters_book_fk FOREIGN KEY (version_id, book_id)
    REFERENCES bible_books(version_id, book_id),
  UNIQUE (version_id, book_id, chapter_number)
);

CREATE INDEX IF NOT EXISTS idx_bible_chapters_lookup ON bible_chapters(version_id, book_id, chapter_number);

-- ============================================================
-- 4. VERSÍCULOS
-- ============================================================
CREATE TABLE IF NOT EXISTS bible_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL,
  book_id TEXT NOT NULL,
  version_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  CONSTRAINT bible_verses_chapter_fk FOREIGN KEY (version_id, book_id, chapter_number)
    REFERENCES bible_chapters(version_id, book_id, chapter_number)
);

CREATE INDEX IF NOT EXISTS idx_bible_verses_chapter ON bible_verses(chapter_id);
CREATE INDEX IF NOT EXISTS idx_bible_verses_lookup ON bible_verses(version_id, book_id, chapter_number, verse_number);
CREATE INDEX IF NOT EXISTS idx_bible_verses_text_search ON bible_verses USING GIN(to_tsvector('simple', text));

-- ============================================================
-- 5. DEFINIÇÕES DE PALAVRAS (STRONG'S CONCORDANCE)
-- ============================================================
CREATE TABLE IF NOT EXISTS bible_word_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  language TEXT NOT NULL,
  transliteration TEXT,
  definition TEXT NOT NULL,
  strongs_number TEXT,
  strongs_type TEXT CHECK (strongs_type IN ('hebrew', 'greek')),
  pronunciation TEXT,
  part_of_speech TEXT,
  definition_pt TEXT,
  definition_es TEXT,
  definition_fr TEXT,
  etymology TEXT,
  usage_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT bible_word_definitions_language_check
    CHECK (language IN ('en', 'pt', 'pt-br', 'es', 'fr', 'de', 'it', 'he', 'gr'))
);

CREATE INDEX IF NOT EXISTS idx_word_definitions_strongs ON bible_word_definitions(strongs_number);
CREATE INDEX IF NOT EXISTS idx_word_definitions_language ON bible_word_definitions(language);
CREATE INDEX IF NOT EXISTS idx_word_definitions_strongs_type ON bible_word_definitions(strongs_type);

-- ============================================================
-- 6. MAPEAMENTO DE PALAVRAS ENTRE VERSÕES
-- ============================================================
CREATE TABLE IF NOT EXISTS bible_word_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_version_id TEXT NOT NULL,
  target_version_id TEXT NOT NULL,
  source_book_id TEXT NOT NULL,
  source_chapter_number INTEGER NOT NULL,
  source_verse_number INTEGER NOT NULL,
  source_word_position INTEGER NOT NULL,
  source_word TEXT NOT NULL,
  target_word TEXT NOT NULL,
  strongs_number TEXT,
  confidence_score DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_version_id, source_book_id, source_chapter_number, source_verse_number, source_word_position)
);

CREATE INDEX IF NOT EXISTS idx_word_mappings_source ON bible_word_mappings(source_version_id, source_book_id, source_chapter_number, source_verse_number);
CREATE INDEX IF NOT EXISTS idx_word_mappings_strongs ON bible_word_mappings(strongs_number);

-- ============================================================
-- 7. CACHE DE DEFINIÇÕES PROCESSADAS
-- ============================================================
CREATE TABLE IF NOT EXISTS word_definition_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  version_id TEXT NOT NULL,
  language TEXT NOT NULL,
  definition_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(word, version_id, language)
);

CREATE INDEX IF NOT EXISTS idx_word_cache_lookup ON word_definition_cache(word, version_id, language);
CREATE INDEX IF NOT EXISTS idx_word_cache_expires ON word_definition_cache(expires_at);

-- ============================================================
-- 8. ESTUDOS BÍBLICOS PRÉ-DEFINIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS bible_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_key TEXT NOT NULL,
  title JSONB NOT NULL,  -- {pt: "...", en: "...", es: "..."}
  content JSONB NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  points INTEGER DEFAULT 10,
  next_study_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 9. CONQUISTAS (GAMIFICAÇÃO)
-- ============================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value TEXT,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 10. PROMPTS DE IA
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  language TEXT,
  context_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 11. PERFIS DE USUÁRIO
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY,  -- Referencia auth.users no Supabase; aqui é UUID do usuário
  email TEXT,
  username TEXT UNIQUE,
  nickname TEXT,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  country TEXT,
  birth_year INTEGER,
  preferred_language TEXT DEFAULT 'pt',
  preferred_bible_version TEXT DEFAULT 'nvi',
  font_size TEXT DEFAULT 'large',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  streak_freeze_count INTEGER DEFAULT 0,
  last_streak_date DATE,
  experience_points INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 12. SESSÕES DE LEITURA
-- ============================================================
CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  chapters_read INTEGER DEFAULT 0,
  verses_read INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reading_sessions_user ON reading_sessions(user_id, session_date);

-- ============================================================
-- 13. LIVROS COMPLETADOS
-- ============================================================
CREATE TABLE IF NOT EXISTS book_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  version_id TEXT NOT NULL,
  chapters_completed INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_book_completions_user ON book_completions(user_id);

-- ============================================================
-- 14. VERSÍCULOS SALVOS
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  version_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  highlight_color TEXT,
  note TEXT,
  saved_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_verses_user ON saved_verses(user_id);

-- ============================================================
-- 15. DESTAQUES POR VERSÍCULO
-- ============================================================
CREATE TABLE IF NOT EXISTS highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_highlights_user ON highlights(user_id);

-- ============================================================
-- 16. NOTAS POR VERSÍCULO
-- ============================================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);

-- ============================================================
-- 17. CONQUISTAS DO USUÁRIO
-- ============================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- ============================================================
-- 18. PROGRESSO EM ESTUDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  study_id UUID REFERENCES bible_studies(id),
  points_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_user_study_progress_user ON user_study_progress(user_id);

-- ============================================================
-- 19. CRÉDITOS DE ESTUDOS IA
-- ============================================================
CREATE TABLE IF NOT EXISTS user_study_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  free_studies_used_this_month INTEGER DEFAULT 0,
  free_studies_reset_month TEXT DEFAULT to_char(now(), 'YYYY-MM'),
  paid_studies_remaining INTEGER DEFAULT 0,
  subscription_type TEXT,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================
-- 20. ESTUDOS GERADOS POR IA (por usuário)
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_bible_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  book_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  version_id TEXT NOT NULL,
  study_content JSONB NOT NULL,
  status TEXT DEFAULT 'completed',
  tokens_used INTEGER,
  cost_usd NUMERIC(10,6),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_studies_user ON ai_bible_studies(user_id);

-- ============================================================
-- 21. COMPARTILHAMENTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  verse_numbers INTEGER[] NOT NULL,
  comment TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS share_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id UUID REFERENCES shares(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(share_id, user_id)
);

-- ============================================================
-- 22. SEGUIDORES
-- ============================================================
CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- ============================================================
-- FUNÇÕES UTILITÁRIAS
-- ============================================================

-- Limpar cache expirado
CREATE OR REPLACE FUNCTION clean_expired_word_cache()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM word_definition_cache WHERE expires_at < now();
END;
$$;

-- Atualizar streak e XP do usuário
CREATE OR REPLACE FUNCTION update_user_streak_and_xp(user_uuid UUID)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_last_date DATE;
  v_current_streak INTEGER;
  v_today DATE := CURRENT_DATE;
BEGIN
  SELECT last_streak_date, current_streak
  INTO v_last_date, v_current_streak
  FROM user_profiles WHERE id = user_uuid;

  IF v_last_date IS NULL OR v_last_date < v_today - INTERVAL '1 day' THEN
    -- Streak quebrado ou primeiro dia
    UPDATE user_profiles SET
      current_streak = 1,
      streak_count = streak_count + 1,
      last_streak_date = v_today,
      updated_at = now()
    WHERE id = user_uuid;
  ELSIF v_last_date = v_today - INTERVAL '1 day' THEN
    -- Continuidade do streak
    UPDATE user_profiles SET
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_streak_date = v_today,
      updated_at = now()
    WHERE id = user_uuid;
  END IF;
  -- Se v_last_date = v_today, não faz nada (já registrado hoje)
END;
$$;

-- Reset mensal de estudos gratuitos
CREATE OR REPLACE FUNCTION reset_monthly_free_studies()
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_current_month TEXT := to_char(now(), 'YYYY-MM');
BEGIN
  UPDATE user_study_credits SET
    free_studies_used_this_month = 0,
    free_studies_reset_month = v_current_month,
    updated_at = now()
  WHERE free_studies_reset_month != v_current_month;
END;
$$;

-- Checar e conceder conquistas ao usuário
CREATE OR REPLACE FUNCTION check_and_award_achievements(user_uuid UUID)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_profile user_profiles%ROWTYPE;
  v_chapters_read INTEGER;
  v_achievement RECORD;
BEGIN
  SELECT * INTO v_profile FROM user_profiles WHERE id = user_uuid;
  SELECT COALESCE(SUM(chapters_read), 0) INTO v_chapters_read
  FROM reading_sessions WHERE user_id = user_uuid;

  FOR v_achievement IN SELECT * FROM achievements LOOP
    IF NOT EXISTS (
      SELECT 1 FROM user_achievements
      WHERE user_id = user_uuid AND achievement_id = v_achievement.id AND is_completed = TRUE
    ) THEN
      -- Lógica simplificada de concessão de conquistas
      IF v_achievement.requirement_type = 'chapters_read' AND
         v_chapters_read >= COALESCE(v_achievement.requirement_value::INTEGER, 0) THEN
        INSERT INTO user_achievements(user_id, achievement_id, progress, is_completed)
        VALUES(user_uuid, v_achievement.id, v_chapters_read, TRUE)
        ON CONFLICT(user_id, achievement_id) DO UPDATE
        SET progress = v_chapters_read, is_completed = TRUE, earned_at = now();
      END IF;
    END IF;
  END LOOP;
END;
$$;

-- ============================================================
-- GRANTS PARA POSTGREST
-- ============================================================
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;
