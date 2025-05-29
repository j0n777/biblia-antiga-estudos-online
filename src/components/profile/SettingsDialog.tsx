import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings2, Type } from 'lucide-react';
import { updateUserProfile } from '@/services/ProfileService';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/bible.types';
import ProfileForm from './ProfileForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type SettingsDialogProps = {
  profile: UserProfile | null;
  onProfileUpdate: () => void;
};

const SettingsDialog = ({ profile, onProfileUpdate }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'profile'>('general');
  const { language, setLanguage, t } = useLanguage();
  const [fontSize, setFontSize] = useState<string>(profile?.font_size || 'large');

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
        title: t('common.error'),
        description: t('settings.updateError'),
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

  const handleFontSizeChange = async (size: string) => {
    setFontSize(size);
    
    try {
      await updateUserProfile({
        font_size: size as 'large' | 'extra-large' | 'huge'
      });
      
      toast({
        title: t('settings.fontSize'),
        description: `${t('settings.fontSizeChanged')}: ${getFontSizeName(size as 'large' | 'extra-large' | 'huge')}`,
      });
      
      onProfileUpdate();
    } catch (error) {
      console.error("Error updating font size:", error);
    }
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
  
  const getFontSizeName = (size: 'large' | 'extra-large' | 'huge') => {
    const names = {
      'large': t('settings.fontSize.large') || 'Normal',
      'extra-large': t('settings.fontSize.extraLarge') || 'Grande',
      'huge': t('settings.fontSize.huge') || 'Extra Grande'
    };
    return names[size];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-lg">
          <Settings2 size={20} className="text-scripture-heading" />
        </Button>
      </DialogTrigger>
      <DialogContent className="settings-dialog-content rounded-xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-oldstyle text-scripture-heading">
            {t('settings.title') || 'Configurações'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Personalize sua experiência
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex border-b mb-6 w-full rounded-lg bg-parchment-light/50">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all rounded-lg ${
                activeTab === 'general' 
                  ? 'bg-ancient-gold text-white shadow-sm' 
                  : 'text-scripture-text hover:text-ancient-gold hover:bg-ancient-gold/10'
              }`}
              onClick={() => setActiveTab('general')}
            >
              {t('settings.title') || 'Configurações'}
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all rounded-lg ${
                activeTab === 'profile' 
                  ? 'bg-ancient-gold text-white shadow-sm' 
                  : 'text-scripture-text hover:text-ancient-gold hover:bg-ancient-gold/10'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              {t('settings.profile') || 'Meu Perfil'}
            </button>
          </div>
          
          {activeTab === 'general' && (
            <div className="space-y-6 settings-container">
              <div className="space-y-4 p-4 bg-parchment-light/30 rounded-xl">
                <Label htmlFor="app-language" className="text-base font-medium text-scripture-heading">
                  {t('settings.language') || 'Idioma'}
                </Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="app-language" className="w-full bg-white border-parchment-dark/30 rounded-lg">
                    <SelectValue placeholder="Selecionar idioma" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="pt-BR" className="rounded-lg">Português (Brasil)</SelectItem>
                    <SelectItem value="en" className="rounded-lg">English</SelectItem>
                    <SelectItem value="es" className="rounded-lg">Español</SelectItem>
                    <SelectItem value="fr" className="rounded-lg">Français</SelectItem>
                    <SelectItem value="ar" className="rounded-lg">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4 p-4 bg-parchment-light/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium text-scripture-heading flex items-center">
                    <Type size={18} className="mr-2 text-ancient-gold" />
                    {t('settings.fontSize') || 'Tamanho da Fonte'}
                  </Label>
                </div>
                <RadioGroup 
                  value={fontSize} 
                  onValueChange={handleFontSizeChange} 
                  className="grid grid-cols-3 gap-3"
                >
                  <div className="flex items-center space-x-2 p-3 border border-parchment-dark/30 rounded-lg hover:bg-ancient-gold/5">
                    <RadioGroupItem value="large" id="large" className="border-ancient-gold text-ancient-gold" />
                    <Label htmlFor="large" className="text-base cursor-pointer text-scripture-text">
                      {t('settings.fontSize.large') || 'Normal'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-parchment-dark/30 rounded-lg hover:bg-ancient-gold/5">
                    <RadioGroupItem value="extra-large" id="extra-large" className="border-ancient-gold text-ancient-gold" />
                    <Label htmlFor="extra-large" className="text-lg cursor-pointer text-scripture-text">
                      {t('settings.fontSize.extraLarge') || 'Grande'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-parchment-dark/30 rounded-lg hover:bg-ancient-gold/5">
                    <RadioGroupItem value="huge" id="huge" className="border-ancient-gold text-ancient-gold" />
                    <Label htmlFor="huge" className="text-xl cursor-pointer text-scripture-text">
                      {t('settings.fontSize.huge') || 'Extra Grande'}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-parchment-light/30 rounded-xl">
                  <div className="space-y-0.5">
                    <Label htmlFor="use-system-language" className="text-base font-medium text-scripture-heading">
                      {t('settings.systemLanguage') || 'Usar idioma do sistema'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Detectar automaticamente o idioma do dispositivo
                    </p>
                  </div>
                  <Switch 
                    id="use-system-language" 
                    defaultChecked={true}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'use_system_language' as any)}
                    className="data-[state=checked]:bg-ancient-gold"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-parchment-light/30 rounded-xl">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-base font-medium text-scripture-heading">
                      {t('settings.notifications') || 'Notificações'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.dailyReminders') || 'Receber lembretes de leitura diária'}
                    </p>
                  </div>
                  <Switch 
                    id="notifications" 
                    defaultChecked={true}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'notifications_enabled' as any)}
                    className="data-[state=checked]:bg-ancient-gold"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-parchment-light/30 rounded-xl">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-scroll" className="text-base font-medium text-scripture-heading">
                      {t('settings.autoScroll') || 'Auto-rolagem'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.autoScrollReading') || 'Rolar automaticamente durante a leitura'}
                    </p>
                  </div>
                  <Switch 
                    id="auto-scroll" 
                    defaultChecked={false}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'auto_scroll' as any)}
                    className="data-[state=checked]:bg-ancient-gold"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="bg-parchment-light/30 rounded-xl p-4">
              <ProfileForm profile={profile} onProfileUpdate={onProfileUpdate} />
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4 border-t border-parchment-dark/20">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="bg-parchment-light border-parchment-dark/30 text-scripture-text hover:bg-parchment hover:text-scripture-heading rounded-lg"
          >
            {t('common.close') || 'Fechar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
