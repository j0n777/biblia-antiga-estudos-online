
-- Expandir a tabela bible_word_definitions para suportar múltiplos idiomas
ALTER TABLE bible_word_definitions 
ADD COLUMN IF NOT EXISTS strongs_type TEXT CHECK (strongs_type IN ('hebrew', 'greek')),
ADD COLUMN IF NOT EXISTS pronunciation TEXT,
ADD COLUMN IF NOT EXISTS part_of_speech TEXT,
ADD COLUMN IF NOT EXISTS definition_pt TEXT,
ADD COLUMN IF NOT EXISTS definition_es TEXT,
ADD COLUMN IF NOT EXISTS definition_fr TEXT,
ADD COLUMN IF NOT EXISTS etymology TEXT,
ADD COLUMN IF NOT EXISTS usage_notes TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Criar tabela para mapear palavras entre versões bíblicas
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(source_version_id, source_book_id, source_chapter_number, source_verse_number, source_word_position)
);

-- Criar índices para otimizar buscas
CREATE INDEX IF NOT EXISTS idx_word_definitions_strongs ON bible_word_definitions(strongs_number);
CREATE INDEX IF NOT EXISTS idx_word_definitions_language ON bible_word_definitions(language);
CREATE INDEX IF NOT EXISTS idx_word_mappings_source ON bible_word_mappings(source_version_id, source_book_id, source_chapter_number, source_verse_number);
CREATE INDEX IF NOT EXISTS idx_word_mappings_strongs ON bible_word_mappings(strongs_number);

-- Criar tabela para cache de definições processadas
CREATE TABLE IF NOT EXISTS word_definition_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  version_id TEXT NOT NULL,
  language TEXT NOT NULL,
  definition_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(word, version_id, language)
);

-- Criar índice para o cache
CREATE INDEX IF NOT EXISTS idx_word_cache_lookup ON word_definition_cache(word, version_id, language);
CREATE INDEX IF NOT EXISTS idx_word_cache_expires ON word_definition_cache(expires_at);

-- Função para limpar cache expirado
CREATE OR REPLACE FUNCTION clean_expired_word_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM word_definition_cache WHERE expires_at < now();
END;
$$;
