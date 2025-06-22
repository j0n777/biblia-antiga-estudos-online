
-- Verificar as restrições existentes na tabela bible_word_definitions
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'bible_word_definitions'::regclass 
AND contype = 'c';

-- Remover a restrição problemática se existir
ALTER TABLE bible_word_definitions DROP CONSTRAINT IF EXISTS bible_word_definitions_language_check;

-- Adicionar uma nova restrição mais permissiva para idiomas
ALTER TABLE bible_word_definitions ADD CONSTRAINT bible_word_definitions_language_check 
CHECK (language IN ('en', 'pt', 'pt-br', 'es', 'fr', 'de', 'it', 'he', 'gr'));
