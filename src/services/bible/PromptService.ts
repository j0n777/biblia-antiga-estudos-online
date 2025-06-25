
import { supabase } from '@/integrations/supabase/client';

export interface AIPrompt {
  id: string;
  name: string;
  version: number;
  prompt: string;
  language: string;
  context_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TranslationOperation {
  id: string;
  batch_id: string;
  prompt_id: string;
  strongs_numbers: string[];
  target_language: string;
  success_count: number;
  error_count: number;
  total_tokens?: number;
  cost_usd?: number;
  duration_ms?: number;
  created_at: string;
}

/**
 * Get active prompt for a specific context and language
 */
export const getActivePrompt = async (
  contextType: string,
  language: string = 'pt'
): Promise<AIPrompt | null> => {
  try {
    const promptName = `${contextType}_${language}`;
    
    const { data, error } = await supabase
      .from('ai_prompts')
      .select('*')
      .eq('name', promptName)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching prompt:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getActivePrompt:', error);
    return null;
  }
};

/**
 * Log translation operation
 */
export const logTranslationOperation = async (
  batchId: string,
  promptId: string,
  strongsNumbers: string[],
  targetLanguage: string,
  successCount: number,
  errorCount: number,
  totalTokens?: number,
  costUsd?: number,
  durationMs?: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('translation_operations')
      .insert({
        batch_id: batchId,
        prompt_id: promptId,
        strongs_numbers: strongsNumbers,
        target_language: targetLanguage,
        success_count: successCount,
        error_count: errorCount,
        total_tokens: totalTokens,
        cost_usd: costUsd,
        duration_ms: durationMs
      });
    
    if (error) {
      console.error('Error logging translation operation:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in logTranslationOperation:', error);
    return false;
  }
};

/**
 * Get translation operation statistics
 */
export const getTranslationStats = async (): Promise<{
  totalOperations: number;
  totalTranslated: number;
  totalErrors: number;
  totalCost: number;
  averageSuccessRate: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('translation_operations')
      .select('success_count, error_count, cost_usd');
    
    if (error) {
      console.error('Error fetching translation stats:', error);
      return {
        totalOperations: 0,
        totalTranslated: 0,
        totalErrors: 0,
        totalCost: 0,
        averageSuccessRate: 0
      };
    }
    
    const totalOperations = data.length;
    const totalTranslated = data.reduce((sum, op) => sum + (op.success_count || 0), 0);
    const totalErrors = data.reduce((sum, op) => sum + (op.error_count || 0), 0);
    const totalCost = data.reduce((sum, op) => sum + (parseFloat(op.cost_usd?.toString() || '0')), 0);
    const averageSuccessRate = totalOperations > 0 
      ? (totalTranslated / (totalTranslated + totalErrors)) * 100 
      : 0;
    
    return {
      totalOperations,
      totalTranslated,
      totalErrors,
      totalCost,
      averageSuccessRate
    };
  } catch (error) {
    console.error('Error in getTranslationStats:', error);
    return {
      totalOperations: 0,
      totalTranslated: 0,
      totalErrors: 0,
      totalCost: 0,
      averageSuccessRate: 0
    };
  }
};

/**
 * Get all available prompts for management
 */
export const getAllPrompts = async (): Promise<AIPrompt[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_prompts')
      .select('*')
      .order('context_type', { ascending: true })
      .order('language', { ascending: true })
      .order('version', { ascending: false });
    
    if (error) {
      console.error('Error fetching all prompts:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAllPrompts:', error);
    return [];
  }
};
