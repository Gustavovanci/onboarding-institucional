// src/pages/ProfilePage.tsx
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';
import { User, Edit3, Save, X, Building, Briefcase } from 'lucide-react'; // Ícone da Câmera removido

const institutes = ["ICHC", "INRAD", "INCOR", "IOT", "IMREA", "ICESP", "ICr", "IPq", "Iper"];
const professions = ["Médico(a)", "Enfermeiro(a)", "Técnico(a) de Enfermagem", "Fisioterapeuta", "Nutricionista", "Psicólogo(a)", "Terapeuta Ocupacional", "Administrativo", "Voluntário(a)", "Técnico(a) em Nutrição"];

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    institute: user?.institute || '',
    profession: user?.profession || '',
    bio: user?.bio || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  // A ref para o input de arquivo foi removida

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateUserProfile({
        displayName: formData.displayName,
        institute: formData.institute,
        profession: formData.profession,
        bio: formData.bio,
    });
    setIsSaving(false);
    setIsEditing(false);
  };
  
  // A função handlePictureChange foi removida

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="card-elevated max-w-4xl mx-auto">
        {/* Header do Perfil */}
        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 p-8 border-b border-gray-200">
          <div className="relative">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&size=128&background=random`}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {/* O botão da câmera foi removido daqui */}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <input 
                type="text" 
                name="displayName"
                value={formData.displayName} 
                onChange={handleInputChange} 
                className="text-3xl font-bold text-gray-900 bg-gray-100 rounded-lg p-2 w-full"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{user?.displayName}</h1>
            )}
            <p className="text-gray-500 mt-1">{user?.email}</p>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center space-x-2"><Edit3 className="w-4 h-4"/><span>Editar Perfil</span></button>
          ) : (
            <div className="flex space-x-2">
              <button onClick={handleSave} className="btn-primary flex items-center space-x-2" disabled={isSaving}><Save className="w-4 h-4"/><span>{isSaving ? 'Salvando...' : 'Salvar'}</span></button>
              <button onClick={() => setIsEditing(false)} className="p-3 bg-gray-200 rounded-lg text-gray-600 hover:bg-gray-300"><X className="w-4 h-4"/></button>
            </div>
          )}
        </div>
        
        {/* Corpo do Perfil */}
        <div className="p-8 space-y-6">
          {/* Bio */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Sua Bio</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Escreva um pouco sobre você..."
                className="w-full p-3 bg-gray-100 rounded-lg"
              />
            ) : (
              <p className="text-gray-600 italic">{user?.bio || 'Nenhuma bio adicionada.'}</p>
            )}
          </div>
          <hr/>
          {/* Detalhes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Building className="w-6 h-6 text-blue-600"/></div>
              <div>
                <p className="text-sm text-gray-500">Instituto</p>
                {isEditing ? (
                  <select name="institute" value={formData.institute} onChange={handleInputChange} className="font-semibold text-gray-800 bg-gray-100 rounded-lg p-2">
                    {institutes.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                ) : (
                  <p className="font-semibold text-gray-800">{user?.institute}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><Briefcase className="w-6 h-6 text-green-600"/></div>
              <div>
                <p className="text-sm text-gray-500">Profissão</p>
                {isEditing ? (
                  <select name="profession" value={formData.profession} onChange={handleInputChange} className="font-semibold text-gray-800 bg-gray-100 rounded-lg p-2">
                    {professions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                ) : (
                  <p className="font-semibold text-gray-800">{user?.profession}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;