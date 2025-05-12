
// Export all reading-related services from this index file

// Reading position services
export {
  saveReadingPosition,
  getLastReadingPosition,
  clearReadingPosition
} from './ReadingPositionService';

// Reading history services
export {
  getReadingHistory,
  trackReading,
  clearReadingHistory
} from './ReadingHistoryService';

// Reading metadata services
export {
  getLastThreeReadings
} from './ReadingMetadataService';
