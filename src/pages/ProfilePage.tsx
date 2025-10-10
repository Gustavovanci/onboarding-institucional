// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';
import { Edit3, Save, X, Palette, Heart, Star } from 'lucide-react';
import { COLOR_THEMES, STATUS_EMOJIS, CUSTOM_TITLES } from '../config/personalization';
import { type User, type UserPersonalizations } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface ProfilePreviewCardProps {
  user: Partial<User>;
  className?: string;
}

const defaultPersonalizationsForComponent: UserPersonalizations = {
  colorTheme: 'classic',
  statusEmoji: 'happy',
  customTitle: 'explorer',
};

const findById = (array: any[], id: string | undefined, defaultId: string) =>
  array.find(item => item.id === id) || array.find(item => item.id === defaultId);

const ProfilePreviewCard = ({ user, className = "" }: ProfilePreviewCardProps) => {
  const personalizations = user.personalizations || defaultPersonalizationsForComponent;
  const theme = findById(COLOR_THEMES, personalizations.colorTheme, 'classic');
  const emoji = findById(STATUS_EMOJIS, personalizations.statusEmoji, 'happy');
  const title = findById(CUSTOM_TITLES, personalizations.customTitle, 'explorer');
  const gradientClass = theme?.primary || 'from-blue-500 to-teal-500';

  return (
    <motion.div layout className={`relative overflow-hidden rounded-2xl shadow-lg border ${className}`}>
      <div className={`p-6 text-white relative bg-gradient-to-r ${gradientClass}`}>
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <img
              crossOrigin="anonymous"
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&size=80&background=ffffff&color=333333`}
              alt={user.displayName}
              className="w-16 h-16 rounded-full border-2 border-white shadow-lg object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 text-lg shadow-md">{emoji?.emoji || '😊'}</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg drop-shadow">{title?.icon || '🧭'}</span>
              <span className="text-sm font-medium opacity-90 drop-shadow">{title?.title || 'Explorador'}</span>
            </div>
            <h3 className="text-xl font-bold drop-shadow">{user.displayName}</h3>
            <p className="text-sm opacity-90 drop-shadow">{user.profession}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    colorTheme: user?.personalizations?.colorTheme || 'classic',
    statusEmoji: user?.personalizations?.statusEmoji || 'happy',
    customTitle: user?.personalizations?.customTitle || 'explorer',
  });

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        displayName: user.displayName,
        bio: user.bio || '',
        colorTheme: user.personalizations?.colorTheme || 'classic',
        statusEmoji: user.personalizations?.statusEmoji || 'happy',
        customTitle: user.personalizations?.customTitle || 'explorer',
      });
    }
  }, [user, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handlePersonalizationChange = (field: 'colorTheme' | 'statusEmoji' | 'customTitle', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        personalizations: {
          ...(user.personalizations || defaultPersonalizationsForComponent),
          colorTheme: formData.colorTheme,
          statusEmoji: formData.statusEmoji,
          customTitle: formData.customTitle,
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner/></div>;
  }
  
  const previewUser = { 
    ...user, 
    displayName: formData.displayName, 
    personalizations: { 
      ...(user.personalizations || defaultPersonalizationsForComponent), 
      ...formData 
    } 
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div id="tour-step-5-profile-page" className="card-elevated max-w-4xl mx-auto p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 p-8 border-b">
          <img 
            crossOrigin="anonymous"
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <input type="text" name="displayName" value={formData.displayName} onChange={handleInputChange} className="text-3xl font-bold text-gray-900 bg-gray-100 rounded-lg p-2 w-full"/>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{user.displayName}</h1>
            )}
            <p className="text-gray-500 mt-1">{user.email}</p>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center gap-2"><Edit3 className="w-4 h-4"/> <span>Editar Perfil</span></button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={isSaving}><Save className="w-4 h-4"/> <span>{isSaving ? "Salvando..." : "Salvar"}</span></button>
              <button onClick={() => setIsEditing(false)} className="p-3 bg-gray-200 rounded-xl text-gray-600 hover:bg-gray-300"><X className="w-4 h-4"/></button>
            </div>
          )}
        </div>
        <div className="p-8">
            {!isEditing ? (
                 <ProfilePreviewCard user={user} className="w-full" />
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-8 items-start">
                  <div className="space-y-8">
                    <div>
                      <label className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Palette className="w-5 h-5 text-blue-500"/> Tema de Cores</label>
                      <div className="grid grid-cols-3 gap-3">
                        {COLOR_THEMES.map(theme => (
                          <button key={theme.id} onClick={() => handlePersonalizationChange('colorTheme', theme.id)} className={`p-2 rounded-xl border-2 transition-all ${formData.colorTheme === theme.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-transparent hover:border-gray-300'}`} title={theme.name}>
                            <div className={`w-full h-10 rounded-lg bg-gradient-to-r ${theme.primary}`} />
                            <p className="text-xs text-center mt-1 text-gray-600">{theme.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Heart className="w-5 h-5 text-red-500"/> Emoji de Status</label>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_EMOJIS.map(emoji => (
                          <button 
                            key={emoji.id} 
                            onClick={() => handlePersonalizationChange('statusEmoji', emoji.id)} 
                            className={`text-3xl w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 ${formData.statusEmoji === emoji.id ? 'scale-110 ring-2 ring-blue-500' : 'hover:bg-gray-100 hover:scale-110'}`} 
                            title={emoji.name}
                          >
                            {emoji.emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500"/> Título</label>
                      <select name="customTitle" value={formData.customTitle} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition">
                        {CUSTOM_TITLES.map(title => (
                          <option key={title.id} value={title.id}>{title.icon} {title.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="sticky top-24">
                     <h3 className="font-semibold text-gray-700 text-center mb-3">Preview</h3>
                     <ProfilePreviewCard user={previewUser} />
                  </div>
                </motion.div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;