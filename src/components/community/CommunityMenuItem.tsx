
import { LucideIcon } from 'lucide-react';

interface CommunityMenuItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}

const CommunityMenuItem = ({
  title,
  description,
  icon: Icon,
  active,
  onClick
}: CommunityMenuItemProps) => (
  <button 
    className={`flex items-start gap-3 p-3 w-full text-left rounded-lg ${
      active 
        ? 'bg-parchment-dark/10 border-l-4 border-ancient-gold' 
        : 'hover:bg-parchment-dark/5'
    }`} 
    onClick={onClick}
  >
    <div className={`mt-1 ${active ? 'text-ancient-gold' : 'text-ancient-brown/60'}`}>
      <Icon size={20} />
    </div>
    <div>
      <h3 className={`font-medium ${active ? 'text-scripture-heading' : 'text-scripture-text'}`}>
        {title}
      </h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </button>
);

export default CommunityMenuItem;
