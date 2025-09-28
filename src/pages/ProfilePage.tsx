// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';
import { Edit3, Save, X, Building, Briefcase, Palette, Heart, Star } from 'lucide-react';
import { INSTITUTOS_CONFIG } from '../types';
import { COLOR_THEMES, STATUS_EMOJIS, CUSTOM_TITLES } from '../config/personalization';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'personal'>('basic');
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    colorTheme: user?.personalizations?.colorTheme || 'classic',
    statusEmoji: user?.personalizations?.statusEmoji || 'happy',
    customTitle: user?.personalizations?.customTitle || 'explorer',
  });
  const [isSaving, setIsSaving] = useState(false);

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
  
  // ++ CORREÇÃO: FUNÇÃO DEDICADA PARA ATUALIZAR A PERSONALIZAÇÃO ++
  // Isso garante que o estado seja atualizado de forma mais clara e reativa.
  const handlePersonalizationChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        personalizations: {
          colorTheme: formData.colorTheme,
          statusEmoji: formData.statusEmoji,
          customTitle: formData.customTitle,
          favoriteQuote: user?.personalizations?.favoriteQuote || "",
        }
      });
      setIsEditing(false);
    } catch (error) { console.error("Erro ao salvar perfil:", error);
    } finally { setIsSaving(false); }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-0 overflow-hidden max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 p-8 border-b">
          <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"/>
          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <input type="text" name="displayName" value={formData.displayName} onChange={handleInputChange} className="text-3xl font-bold text-gray-900 bg-gray-100 rounded-lg p-2 w-full"/>
            ) : ( <h1 className="text-3xl font-bold text-gray-900">{user.displayName}</h1> )}
            <p className="text-gray-500 mt-1">{user.email}</p>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center gap-2"><Edit3 className="w-4 h-4"/><span>Editar Perfil</span></button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={isSaving}><Save className="w-4 h-4"/><span>{isSaving ? "Salvando..." : "Salvar"}</span></button>
              <button onClick={() => setIsEditing(false)} className="p-3 bg-gray-200 rounded-xl text-gray-600 hover:bg-gray-300"><X className="w-4 h-4"/></button>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="p-2 bg-gray-50 border-b flex justify-center gap-2">
            <button onClick={() => setActiveTab('basic')} className={`px-4 py-2 rounded-lg font-semibold text-sm ${activeTab === 'basic' ? 'bg-brand-azure text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Básico</button>
            <button onClick={() => setActiveTab('personal')} className={`px-4 py-2 rounded-lg font-semibold text-sm ${activeTab === 'personal' ? 'bg-brand-azure text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Personalização</button>
          </div>
        )}

        <div className="p-8">
          {(!isEditing || activeTab === 'basic') && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Sua Bio</h3>
                {isEditing ? (
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className="w-full p-3 bg-gray-100 rounded-lg"/>
                ) : ( <p className="text-gray-600 italic">{user.bio || 'Nenhuma bio adicionada.'}</p> )}
              </div>
              <hr />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Building className="w-6 h-6 text-brand-azure"/></div><div><p className="text-sm text-gray-500">Instituto</p><p className="font-semibold text-gray-800">{INSTITUTOS_CONFIG[user.instituto]?.fullName || user.instituto}</p></div></div>
                <div className="flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><Briefcase className="w-6 h-6 text-brand-teal"/></div><div><p className="text-sm text-gray-500">Profissão</p><p className="font-semibold text-gray-800">{user.profession || 'Não definida'}</p></div></div>
              </div>
            </div>
          )}
          
          {isEditing && activeTab === 'personal' && (
            <div className="space-y-8">
              <div>
                <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3"><Palette className="w-5 h-5"/>Tema de Cores</label>
                <div className="flex flex-wrap gap-3">
                  {COLOR_THEMES.map(theme => (
                    <button key={theme.id} onClick={() => handlePersonalizationChange('colorTheme', theme.id)} className={`w-12 h-12 rounded-full ${theme.primary} transition-transform hover:scale-110 ${formData.colorTheme === theme.id ? 'ring-4 ring-offset-2 ring-brand-azure' : ''}`} title={theme.name}></button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3"><Heart className="w-5 h-5"/>Emoji de Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_EMOJIS.map(emoji => (
                    <button key={emoji.id} onClick={() => handlePersonalizationChange('statusEmoji', emoji.id)} className={`text-4xl p-2 rounded-lg transition-all ${formData.statusEmoji === emoji.id ? 'bg-blue-100 scale-110' : 'hover:bg-gray-100'}`} title={emoji.name}>{emoji.emoji}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2"><Star className="w-5 h-5"/>Título</label>
                <select name="customTitle" value={formData.customTitle} onChange={handleInputChange} className="w-full p-3 bg-gray-100 rounded-lg">
                  {CUSTOM_TITLES.map(title => <option key={title.id} value={title.id}>{title.icon} {title.title}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;