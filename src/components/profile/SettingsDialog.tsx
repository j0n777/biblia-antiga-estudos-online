
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
  const [fontSize, setFontSize] = useState<string>(profile?.font_size || 'medium');

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
        font_size: size as 'small' | 'medium' | 'large'
      });
      
      toast({
        title: t('settings.fontSize'),
        description: `${t('settings.fontSizeChanged')}: ${getFontSizeName(size as 'small' | 'medium' | 'large')}`,
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
  
  const getFontSizeName = (size: 'small' | 'medium' | 'large') => {
    const names = {
      'small': t('settings.fontSizeSmall') || 'Pequeno',
      'medium': t('settings.fontSizeMedium') || 'Médio',
      'large': t('settings.fontSizeLarge') || 'Grande'
    };
    return names[size];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 size={20} className="text-scripture-heading" />
        </Button>
      </DialogTrigger>
      <DialogContent className="settings-dialog-content">
        <DialogHeader>
          <DialogTitle className="font-oldstyle">Configurações</DialogTitle>
          <DialogDescription>
            Personalize sua experiência
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="settings-dialog-tabs">
            <button
              className={`settings-dialog-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              Configurações
            </button>
            <button
              className={`settings-dialog-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Meu Perfil
            </button>
          </div>
          
          {activeTab === 'general' && (
            <div className="space-y-6 settings-container">
              <div className="space-y-4">
                <Label htmlFor="app-language" className="text-base">Idioma</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="app-language" className="w-full">
                    <SelectValue placeholder="Selecionar idioma" />
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
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base flex items-center">
                    <Type size={18} className="mr-2" />
                    Tamanho da Fonte
                  </Label>
                </div>
                <RadioGroup 
                  value={fontSize} 
                  onValueChange={handleFontSizeChange} 
                  className="settings-radio-group"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small" className="text-xs cursor-pointer">
                      Pequeno
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="text-base cursor-pointer">
                      Médio
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large" className="text-xl cursor-pointer">
                      Grande
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="use-system-language" className="text-base">Usar idioma do sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Detectar automaticamente o idioma do dispositivo
                  </p>
                </div>
                <Switch 
                  id="use-system-language" 
                  defaultChecked={true}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'use_system_language' as any)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="text-base">Notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber lembretes de leitura diária
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
                    Rolar automaticamente durante a leitura
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
          <Button variant="outline" onClick={handleClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
