
import { ReadingHistory } from '@/types/bible.types';
import { getReadingHistory } from './ReadingHistoryService';

/**
 * Get the last three readings from the user's history
 * @returns Promise resolving to array of the last three reading history entries
 */
export async function getLastThreeReadings(): Promise<ReadingHistory[]> {
  try {
    const history = await getReadingHistory(3);
    return history;
  } catch (error) {
    console.error('Error getting last readings:', error);
    return [];
  }
}
