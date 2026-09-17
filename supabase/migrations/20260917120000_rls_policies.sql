-- RLS do Bíblia de Estudos Original (17/09/2026). O schema reconstruído na VPS não tinha nenhuma
-- policy (o backend era um Postgres caseiro atrás de nginx). Na Supabase hospedada a anon key é
-- pública, então: catálogo bíblico é leitura livre; dados de usuário só do próprio dono;
-- conteúdo comunitário (shares, likes, seguidores, notas públicas, perfis) é legível por todos.

-- ---------- catálogo: leitura livre ----------
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['bible_versions','bible_books','bible_chapters','bible_verses','bible_word_definitions','bible_word_mappings','bible_studies','achievements','ai_prompts','word_definition_cache'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "public read" ON public.%I', t);
    EXECUTE format('CREATE POLICY "public read" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t);
  END LOOP;
END $$;

-- cache de definições: o app grava a partir do cliente (inclusive visitante)
DROP POLICY IF EXISTS "cache insert" ON public.word_definition_cache;
CREATE POLICY "cache insert" ON public.word_definition_cache FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "cache update" ON public.word_definition_cache;
CREATE POLICY "cache update" ON public.word_definition_cache FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- ---------- perfis: leitura pública (ranking/comunidade), escrita só do dono ----------
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles read" ON public.user_profiles;
CREATE POLICY "profiles read" ON public.user_profiles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "profiles insert own" ON public.user_profiles;
CREATE POLICY "profiles insert own" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "profiles update own" ON public.user_profiles;
CREATE POLICY "profiles update own" ON public.user_profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ---------- dados privados do usuário: tudo só do dono ----------
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['reading_sessions','book_completions','saved_verses','highlights','user_achievements','user_study_progress','user_study_credits','ai_bible_studies'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "own rows" ON public.%I', t);
    EXECUTE format('CREATE POLICY "own rows" ON public.%I FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())', t);
  END LOOP;
END $$;

-- ---------- notas: dono vê/edita as suas; notas públicas são legíveis por todos ----------
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notes read" ON public.notes;
CREATE POLICY "notes read" ON public.notes FOR SELECT TO anon, authenticated USING (is_public = true OR user_id = auth.uid());
DROP POLICY IF EXISTS "notes write own" ON public.notes;
CREATE POLICY "notes write own" ON public.notes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "notes update own" ON public.notes;
CREATE POLICY "notes update own" ON public.notes FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "notes delete own" ON public.notes;
CREATE POLICY "notes delete own" ON public.notes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ---------- comunidade: leitura pública, escrita do dono ----------
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "shares read" ON public.shares;
CREATE POLICY "shares read" ON public.shares FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "shares write own" ON public.shares;
CREATE POLICY "shares write own" ON public.shares FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "shares update own" ON public.shares;
CREATE POLICY "shares update own" ON public.shares FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "shares delete own" ON public.shares;
CREATE POLICY "shares delete own" ON public.shares FOR DELETE TO authenticated USING (user_id = auth.uid());

ALTER TABLE public.share_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "likes read" ON public.share_likes;
CREATE POLICY "likes read" ON public.share_likes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "likes insert own" ON public.share_likes;
CREATE POLICY "likes insert own" ON public.share_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "likes delete own" ON public.share_likes;
CREATE POLICY "likes delete own" ON public.share_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "followers read" ON public.followers;
CREATE POLICY "followers read" ON public.followers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "followers insert own" ON public.followers;
CREATE POLICY "followers insert own" ON public.followers FOR INSERT TO authenticated WITH CHECK (follower_id = auth.uid());
DROP POLICY IF EXISTS "followers delete own" ON public.followers;
CREATE POLICY "followers delete own" ON public.followers FOR DELETE TO authenticated USING (follower_id = auth.uid());

-- Funções RPC (update_user_streak_and_xp, check_and_award_achievements) rodam como invoker:
-- as escritas passam pelas policies acima, então só afetam linhas do próprio usuário.
