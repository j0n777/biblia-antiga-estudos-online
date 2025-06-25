
-- Create table for AI prompts management
CREATE TABLE public.ai_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  prompt TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'pt',
  context_type TEXT NOT NULL, -- 'translation', 'study', etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking translation operations
CREATE TABLE public.translation_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id TEXT NOT NULL,
  prompt_id UUID REFERENCES public.ai_prompts(id),
  strongs_numbers TEXT[] NOT NULL,
  target_language TEXT NOT NULL DEFAULT 'pt',
  success_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER,
  cost_usd NUMERIC(10,6),
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial prompts for Strong's translation
INSERT INTO public.ai_prompts (name, prompt, language, context_type) VALUES
('strongs_translation_pt', 'Traduza as seguintes definições bíblicas do dicionário Strong''s do inglês para o português brasileiro. Mantenha o formato "NÚMERO: DEFINIÇÃO" e seja preciso com os termos teológicos e bíblicos:', 'pt', 'translation'),
('strongs_translation_es', 'Traduzca las siguientes definiciones bíblicas del diccionario Strong''s del inglés al español. Mantenga el formato "NÚMERO: DEFINICIÓN" y sea preciso con los términos teológicos y bíblicos:', 'es', 'translation'),
('strongs_translation_fr', 'Traduisez les définitions bibliques suivantes du dictionnaire Strong''s de l''anglais vers le français. Conservez le format "NUMÉRO: DÉFINITION" et soyez précis avec les termes théologiques et bibliques:', 'fr', 'translation');

-- Add RLS policies for ai_prompts
ALTER TABLE public.ai_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to ai_prompts" ON public.ai_prompts FOR SELECT USING (true);

-- Add RLS policies for translation_operations
ALTER TABLE public.translation_operations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to translation_operations" ON public.translation_operations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to translation_operations" ON public.translation_operations FOR INSERT WITH CHECK (true);
