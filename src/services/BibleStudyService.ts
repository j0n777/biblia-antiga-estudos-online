
import { supabase } from '@/integrations/supabase/client';
import { BibleStudy, StudyProgress } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

// Get all Bible studies
export const getAllBibleStudies = async (): Promise<BibleStudy[]> => {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .order('category');
      
    if (error) {
      console.error('Error fetching Bible studies:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAllBibleStudies:', error);
    return [];
  }
};

// Get specific Bible study by ID
export const getBibleStudyById = async (id: string): Promise<BibleStudy | null> => {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching Bible study:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getBibleStudyById:', error);
    return null;
  }
};

// Get study content in user's preferred language
export const getLocalizedStudyContent = (
  study: BibleStudy | null, 
  language: string = 'en'
): { title: string, content: string } => {
  // Default to English if the requested language is not available
  const fallbackLang = 'en';
  
  if (!study) {
    return { title: '', content: '' };
  }
  
  // Try to get content in user's language, fall back to English if not available
  const title = (study.title[language] as string) || (study.title[fallbackLang] as string) || '';
  const content = (study.content[language] as string) || (study.content[fallbackLang] as string) || '';
  
  return { title, content };
};

// Mark study as completed
export const completeStudy = async (studyId: string): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    // If not logged in, store in localStorage
    if (!sessionData?.session?.user) {
      const completedStudies = JSON.parse(localStorage.getItem('completedStudies') || '[]');
      if (!completedStudies.includes(studyId)) {
        completedStudies.push(studyId);
        localStorage.setItem('completedStudies', JSON.stringify(completedStudies));
      }
      
      toast({
        title: "Estudo concluído!",
        description: "Crie uma conta para salvar seu progresso e ganhar pontos.",
        action: {
          altText: "Cadastrar",
          onClick: () => window.location.href = "/auth"
        }
      });
      return true;
    }
    
    // If logged in, save to database
    const { data: study } = await supabase
      .from('bible_studies')
      .select('points')
      .eq('id', studyId)
      .single();
      
    const points = study?.points || 10;
    
    const { error } = await supabase
      .from('user_study_progress')
      .insert({
        user_id: sessionData.session.user.id,
        study_id: studyId,
        points_earned: points
      })
      .select();
      
    if (error) {
      // If there's a unique violation, the study was already completed
      if (error.code === '23505') {
        toast({
          title: "Estudo já concluído",
          description: "Você já completou este estudo anteriormente."
        });
        return true;
      }
      
      console.error('Error completing study:', error);
      return false;
    }
    
    // Update user's experience points
    await supabase.rpc('add_experience_points', {
      user_id: sessionData.session.user.id,
      points: points
    });
    
    toast({
      title: "Estudo concluído!",
      description: `Você ganhou ${points} pontos!`
    });
    
    return true;
  } catch (error) {
    console.error('Error in completeStudy:', error);
    return false;
  }
};

// Get user's completed studies
export const getUserCompletedStudies = async (): Promise<string[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    // If not logged in, get from localStorage
    if (!sessionData?.session?.user) {
      const completedStudies = JSON.parse(localStorage.getItem('completedStudies') || '[]');
      return completedStudies;
    }
    
    // If logged in, get from database
    const { data, error } = await supabase
      .from('user_study_progress')
      .select('study_id')
      .eq('user_id', sessionData.session.user.id);
      
    if (error) {
      console.error('Error fetching completed studies:', error);
      return [];
    }
    
    return data.map(progress => progress.study_id);
  } catch (error) {
    console.error('Error in getUserCompletedStudies:', error);
    return [];
  }
};
