
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserProfile } from '@/types/bible.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateUserProfile } from '@/services/ProfileService';
import { isUserAuthenticated } from '@/services/AuthService';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type ProfileFormProps = {
  profile: UserProfile | null;
  onProfileUpdate: () => void;
};

type FormData = {
  display_name: string;
  nickname: string;
  country: string;
  birth_year: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
};

const ProfileForm = ({ profile, onProfileUpdate }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { t } = useLanguage();
  
  // Check authentication status
  useState(() => {
    const checkAuth = async () => {
      const authStatus = await isUserAuthenticated();
      setIsAuthenticated(authStatus);
    };
    checkAuth();
  });

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: profile ? {
      display_name: profile.display_name || '',
      nickname: profile.nickname || '',
      country: profile.country || '',
      birth_year: profile.birth_year?.toString() || '',
      email: profile.email || '',
      phone: profile.phone || '',
      password: '',
      password_confirm: ''
    } : {}
  });

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const updatedProfile: Partial<UserProfile> = {
        display_name: data.display_name,
        nickname: data.nickname,
        country: data.country,
        birth_year: data.birth_year ? parseInt(data.birth_year, 10) : undefined,
        email: data.email,
        phone: data.phone,
      };
      
      const success = await updateUserProfile(updatedProfile);
      
      if (success) {
        toast({
          title: t('profile.updated'),
          description: t('profile.updateSuccess'),
        });
        onProfileUpdate();
      } else {
        toast({
          title: t('common.error'),
          description: t('profile.updateError'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t('common.error'),
        description: t('profile.errorMessage'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="parchment-container">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-ancient-brown text-white text-4xl">
              {profile?.display_name?.[0] || profile?.nickname?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {!isAuthenticated && (
          <div className="bg-ancient-gold/10 border border-ancient-gold/30 p-3 rounded-md mb-4">
            <p className="text-ancient-brown text-sm text-center">
              {t('profile.createAccountPrompt')}
            </p>
            <div className="mt-2 flex justify-center">
              <Button
                type="button"
                variant="default"
                className="bg-ancient-gold hover:bg-ancient-gold/90 text-white"
                onClick={() => window.location.href = '/auth'}
              >
                {t('auth.createAccount')}
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="display_name">{t('profile.fullName')}</Label>
            <Input
              id="display_name"
              type="text"
              {...register("display_name")}
              className="bg-parchment-light"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="nickname">{t('profile.nickname')}</Label>
            <Input
              id="nickname"
              type="text"
              {...register("nickname", { 
                required: t('validation.nicknameRequired'),
                minLength: { value: 3, message: t('validation.minCharacters') }
              })}
              className="bg-parchment-light"
            />
            {errors.nickname && (
              <p className="text-xs text-red-500">{errors.nickname.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="country">{t('profile.country')}</Label>
              <Input
                id="country"
                type="text"
                {...register("country")}
                className="bg-parchment-light"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="birth_year">{t('profile.birthYear')}</Label>
              <Input
                id="birth_year"
                type="number"
                {...register("birth_year")}
                className="bg-parchment-light"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('validation.invalidEmail')
                }
              })}
              className="bg-parchment-light"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">{t('profile.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="bg-parchment-light"
            />
          </div>
          
          {isAuthenticated && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('auth.newPassword')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="bg-parchment-light pr-10"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? 
                      <EyeOff size={16} className="text-ancient-brown" /> : 
                      <Eye size={16} className="text-ancient-brown" />
                    }
                  </button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password_confirm">{t('auth.confirmPassword')}</Label>
                <Input
                  id="password_confirm"
                  type="password"
                  {...register("password_confirm", {
                    validate: value => 
                      value === password || !password || t('validation.passwordMatch')
                  })}
                  className="bg-parchment-light"
                />
                {errors.password_confirm && (
                  <p className="text-xs text-red-500">{errors.password_confirm.message}</p>
                )}
              </div>
            </>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 
            t('common.saving') : 
            isAuthenticated ? 
              t('common.save') : 
              t('auth.createAccount')
          }
        </Button>
      </form>
    </Card>
  );
};

export default ProfileForm;
