
import StrongsDebugPanel from '@/components/bible/StrongsDebugPanel';
import PageLayout from '@/components/layout/PageLayout';

const StrongsDebug = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-bible-background">
        <StrongsDebugPanel />
      </div>
    </PageLayout>
  );
};

export default StrongsDebug;
