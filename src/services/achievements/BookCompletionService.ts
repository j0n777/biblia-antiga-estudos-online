
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if book is completed and award achievement
 */
export async function checkBookCompletion(bookId: string, versionId: string): Promise<void> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) return;

    // Get book info to check total chapters
    const { data: bookData, error: bookError } = await supabase
      .from('bible_books')
      .select('chapters_count')
      .eq('book_id', bookId)
      .eq('version_id', versionId)
      .single();

    if (bookError || !bookData) {
      console.error('Error fetching book data:', bookError);
      return;
    }

    // Check how many chapters user has read for this book
    const { data: historyData, error: historyError } = await supabase
      .from('reading_sessions')
      .select('chapters_read')
      .eq('user_id', userId);

    if (historyError) {
      console.error('Error fetching reading history:', historyError);
      return;
    }

    const totalChaptersRead = historyData?.reduce((sum, session) => sum + (session.chapters_read || 0), 0) || 0;

    // If user completed the book, record it
    if (totalChaptersRead >= bookData.chapters_count) {
      const { error: completionError } = await supabase
        .from('book_completions')
        .upsert({
          user_id: userId,
          book_id: bookId,
          version_id: versionId,
          chapters_completed: bookData.chapters_count
        }, {
          onConflict: 'user_id,book_id,version_id'
        });

      if (completionError) {
        console.error('Error recording book completion:', completionError);
      }
    }

  } catch (error) {
    console.error('Error in checkBookCompletion:', error);
  }
}
