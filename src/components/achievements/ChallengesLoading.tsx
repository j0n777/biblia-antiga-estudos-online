
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ChallengesLoading = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full mb-4" />
      {[1, 2].map(i => (
        <Card key={i} className="p-4 rounded-xl">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-2 items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-5 w-28 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-2 w-full mt-3" />
        </Card>
      ))}
    </div>
  );
};

export default ChallengesLoading;
