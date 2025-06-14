
import UserHeader from '@/components/profile/UserHeader';
import RecentReadingSection from '@/components/profile/RecentReadingSection';
import SavedVersesSection from '@/components/profile/SavedVersesSection';
import GuestModeAlert from '@/components/profile/GuestModeAlert';
import { UserProfile, SavedVerse, ReadingHistory } from '@/types/bible.types';

interface ProfileContentProps {
  profile: UserProfile | null;
  isAuthenticated: boolean | null;
  savedVerses: SavedVerse[];
  recentReadings: ReadingHistory[];
  bookNames: Record<string, string>;
  onOpenHistoryDialog: () => void;
  onCreateAccount: () => void;
  onReadVerse: (bookId: string, chapterNumber: number, verseNumber: number) => void;
  onOpenChapter: (bookId: string, chapter: number) => void;
}

const ProfileContent = ({
  profile,
  isAuthenticated,
  savedVerses,
  recentReadings,
  bookNames,
  onOpenHistoryDialog,
  onCreateAccount,
  onReadVerse,
  onOpenChapter
}: ProfileContentProps) => {
  return (
    <div className="space-y-4">
      {!isAuthenticated && (
        <div className="card p-4">
          <GuestModeAlert onCreateAccount={onCreateAccount} />
        </div>
      )}
      
      <div className="card p-4">
        <UserHeader 
          profile={profile}
          isAuthenticated={isAuthenticated}
          onOpenHistoryDialog={onOpenHistoryDialog}
          onCreateAccount={onCreateAccount}
        />
      </div>
      
      <div className="card">
        <RecentReadingSection 
          recentReadings={recentReadings}
          bookNames={bookNames}
          onViewAllHistory={onOpenHistoryDialog}
          onOpenChapter={onOpenChapter}
        />
      </div>
      
      <div className="card">
        <SavedVersesSection 
          savedVerses={savedVerses}
          bookNames={bookNames}
          onViewAllVerses={onOpenHistoryDialog}
          onReadVerse={onReadVerse}
        />
      </div>
    </div>
  );
};

export default ProfileContent;
