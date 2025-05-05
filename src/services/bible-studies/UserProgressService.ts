
import { supabase } from '@/integrations/supabase/client';

/**
 * Complete a Bible study
 * @param studyId Bible study ID
 * @returns Promise resolving to boolean indicating success
 */
export async function completeStudy(studyId: string): Promise<boolean> {
  try {
    // Primeiro verifique se o usuário já completou este estudo
    const { data: existingData } = await supabase
      .from('user_study_progress')
      .select('*')
      .eq('study_id', studyId)
      .eq('user_id', await getCurrentUserId())
      .single();
    
    if (existingData) {
      console.log('Study already completed');
      return true;
    }
    
    // Se não, marque como completo
    const { error } = await supabase
      .from('user_study_progress')
      .insert([
        {
          study_id: studyId,
          user_id: await getCurrentUserId(),
          completed_at: new Date().toISOString(),
        },
      ]);
    
    if (error) {
      console.error('Error completing study:', error);
      return false;
    }
    
    // Atualize os pontos do usuário
    const { data: studyData } = await supabase
      .from('bible_studies')
      .select('points')
      .eq('id', studyId)
      .single();
    
    if (studyData?.points) {
      await updateUserPoints(studyData.points);
    }
    
    return true;
  } catch (error) {
    console.error('Error completing study:', error);
    return false;
  }
}

/**
 * Get all completed studies for the current user
 * @returns Promise resolving to array of completed study IDs
 */
export async function getCompletedStudies(): Promise<string[]> {
  try {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('user_study_progress')
      .select('study_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return (data || []).map(item => item.study_id);
  } catch (error) {
    console.error('Error getting completed studies:', error);
    return [];
  }
}

/**
 * Get current user ID
 * @returns Promise resolving to user ID
 */
async function getCurrentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  
  if (data.session?.user?.id) {
    return data.session.user.id;
  }
  
  // Para usuários não autenticados, use um ID de convidado armazenado no localStorage
  const guestId = localStorage.getItem('guestId') || `guest-${Date.now()}`;
  localStorage.setItem('guestId', guestId);
  
  return guestId;
}

/**
 * Update user points
 * @param points Points to add
 * @returns Promise resolving to boolean indicating success
 */
async function updateUserPoints(points: number): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    
    // Verificar se o usuário existe no perfil
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('experience_points')
      .eq('user_id', userId)
      .single();
    
    if (profileData) {
      // Atualizar pontos existentes
      const { error } = await supabase
        .from('user_profiles')
        .update({
          experience_points: (profileData.experience_points || 0) + points,
        })
        .eq('user_id', userId);
      
      if (error) throw error;
    } else {
      // Criar novo perfil com pontos iniciais
      const { error } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: userId,
            experience_points: points,
          },
        ]);
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user points:', error);
    return false;
  }
}
