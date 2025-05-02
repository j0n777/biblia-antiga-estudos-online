
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserProfile } from '@/types/bible.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateUserProfile } from '@/services/AchievementService';
import { toast } from '@/hooks/use-toast';

type ProfileFormProps = {
  profile: UserProfile | null;
  onProfileUpdate: () => void;
};

type FormData = {
  display_name: string;
  nickname: string;
  country: string;
  birth_year: string;
  preferred_language: string;
  preferred_bible_version: string;
};

const ProfileForm = ({ profile, onProfileUpdate }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: profile ? {
      display_name: profile.display_name || '',
      nickname: profile.nickname || '',
      country: profile.country || '',
      birth_year: profile.birth_year?.toString() || '',
      preferred_language: profile.preferred_language || '',
      preferred_bible_version: profile.preferred_bible_version || '',
    } : {}
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const updatedProfile: Partial<UserProfile> = {
        display_name: data.display_name,
        nickname: data.nickname,
        country: data.country,
        birth_year: data.birth_year ? parseInt(data.birth_year, 10) : undefined,
        preferred_language: data.preferred_language,
        preferred_bible_version: data.preferred_bible_version,
      };
      
      const success = await updateUserProfile(updatedProfile);
      
      if (success) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
        onProfileUpdate();
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar seu perfil. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar seu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="display_name">Nome completo</Label>
            <Input
              id="display_name"
              type="text"
              {...register("display_name")}
              className="bg-parchment-light"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="nickname">Apelido (para ranking)</Label>
            <Input
              id="nickname"
              type="text"
              {...register("nickname", { 
                required: "Apelido é obrigatório",
                minLength: { value: 3, message: "Mínimo de 3 caracteres" }
              })}
              className="bg-parchment-light"
            />
            {errors.nickname && (
              <p className="text-xs text-red-500">{errors.nickname.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                type="text"
                {...register("country")}
                className="bg-parchment-light"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="birth_year">Ano de nascimento</Label>
              <Input
                id="birth_year"
                type="number"
                {...register("birth_year")}
                className="bg-parchment-light"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="preferred_language">Idioma preferido</Label>
            <Input
              id="preferred_language"
              type="text"
              {...register("preferred_language")}
              placeholder="pt-BR"
              className="bg-parchment-light"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="preferred_bible_version">Versão da Bíblia preferida</Label>
            <Input
              id="preferred_bible_version"
              type="text"
              {...register("preferred_bible_version")}
              placeholder="nvi"
              className="bg-parchment-light"
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Perfil"}
        </Button>
      </form>
    </Card>
  );
};

export default ProfileForm;
