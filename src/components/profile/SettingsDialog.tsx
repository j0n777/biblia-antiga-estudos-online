
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings2 } from 'lucide-react';
import { updateUserProfile } from '@/services/AchievementService';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/bible.types';
import ProfileForm from './ProfileForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, Language } from '@/contexts/LanguageContext';

type SettingsDialogProps = {
  profile: UserProfile | null;
  onProfileUpdate: () => void;
};

const SettingsDialog = ({ profile, onProfileUpdate }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'profile'>('general');
  const { language, setLanguage, t } = useLanguage();

  const handleClose = () => {
    setOpen(false);
    setActiveTab('general'); // Reset to default tab when closing
  };

  const handleSwitchChange = async (checked: boolean, setting: keyof UserProfile) => {
    try {
      if (!profile) return;
      
      await updateUserProfile({
        [setting]: checked
      });
      
      onProfileUpdate();
    } catch (error) {
      console.error("Error updating setting:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar configuração.",
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as Language);
    toast({
      title: t('settings.language'),
      description: `${t('common.save')}: ${getLanguageName(newLanguage as Language)}`,
    });
  };

  const getLanguageName = (lang: Language) => {
    const names = {
      'pt-BR': 'Português (Brasil)',
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'ar': 'العربية'
    };
    return names[lang];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 size={20} className="text-scripture-heading" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-parchment-light">
        <DialogHeader>
          <DialogTitle className="font-oldstyle">{t('settings.title')}</DialogTitle>
          <DialogDescription>
            {t('settings.title')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 ${activeTab === 'general' ? 'border-b-2 border-ancient-brown' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              {t('settings.title')}
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-ancient-brown' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              {t('profile.title')}
            </button>
          </div>
          
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="app-language" className="text-base">{t('settings.language')}</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="app-language" className="w-full">
                    <SelectValue placeholder={t('settings.language')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="use-system-language" className="text-base">{t('settings.language')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.language')}
                  </p>
                </div>
                <Switch 
                  id="use-system-language" 
                  // This would typically be a setting in the user profile
                  defaultChecked={true}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'use_system_language' as any)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="text-base">{t('settings.notifications')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notifications')}
                  </p>
                </div>
                <Switch 
                  id="notifications" 
                  defaultChecked={true}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'notifications_enabled' as any)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-scroll" className="text-base">Auto-rolagem</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.bibleVersion')}
                  </p>
                </div>
                <Switch 
                  id="auto-scroll" 
                  defaultChecked={false}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'auto_scroll' as any)}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <ProfileForm profile={profile} onProfileUpdate={onProfileUpdate} />
          )}
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleClose}>{t('common.close')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
