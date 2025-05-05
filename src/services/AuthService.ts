
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if user is authenticated
 * @returns Promise resolving to authentication status
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session?.user;
};
