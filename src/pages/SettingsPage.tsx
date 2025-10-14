// src/pages/SettingsPage.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building, Briefcase, Edit, Save, X, User as UserIcon, Send, Clock } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { INSTITUTOS_ARRAY, PROFESSIONS_ARRAY, type Instituto, INSTITUTOS_CONFIG } from "@/types";
import { COLOR_THEMES, STATUS_EMOJIS, CUSTOM_TITLES } from "@/config/personalization";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";
import ProfilePreviewCard from "@/components/profile/ProfilePreviewCard";

// Este componente é uma cópia funcional do ProfilePage, focado na edição.
const SettingsPage = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(true); // Começa em modo de edição
  const [isSaving, setIsSaving] = useState(false);
  const [changeRequested, setChangeRequested] = useState(false);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    instituto: user?.instituto || "Outros",
    profession: user?.profession || "",
    bio: user?.bio || "",
    colorTheme: user?.personalizations?.colorTheme || "classic",
    statusEmoji: user?.personalizations?.statusEmoji || "happy",
    customTitle: user?.personalizations?.customTitle || "explorer",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        instituto: user.instituto || "Outros",
        profession: user.profession || "",
        bio: user.bio || "",
        colorTheme: user.personalizations?.colorTheme || "classic",
        statusEmoji: user.personalizations?.statusEmoji || "happy",
        customTitle: user.personalizations?.customTitle || "explorer",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
  
    if (formData.instituto !== user.instituto) {
      const requestRef = doc(db, 'instituteChangeRequests', user.uid);
      await setDoc(requestRef, {
        userId: user.uid,
        userName: user.displayName,
        currentInstitute: user.instituto,
        requestedInstitute: formData.instituto,
        status: 'pending',
        requestedAt: serverTimestamp(),
      });
      setChangeRequested(true);
    }
  
    await updateUserProfile({
      displayName: formData.displayName,
      profession: formData.profession,
      bio: formData.bio,
      personalizations: {
        colorTheme: formData.colorTheme,
        statusEmoji: formData.statusEmoji,
        customTitle: formData.customTitle,
      },
    });
  
    setIsSaving(false);
    setIsEditing(false); // Volta para o modo de visualização após salvar
  };

  if (!user) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }

  const selectableInstitutes = INSTITUTOS_ARRAY.filter((i) => i !== "Outros");

  const tempUserForPreview = {
    ...user,
    ...formData,
    email: user.email, 
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
       <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Configurações do Perfil</h1>
        <p className="mt-2 text-lg text-gray-600">Ajuste suas informações e personalize sua experiência.</p>
      </div>
      <div className="card-elevated max-w-4xl mx-auto p-0 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div>
                    <label htmlFor="displayName" className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><UserIcon size={18}/> Nome de Exibição</label>
                    <input id="displayName" name="displayName" type="text" value={formData.displayName} onChange={handleInputChange} className="w-full p-3 bg-white border-2 rounded-lg" />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><Building size={18}/>Instituto</label>
                  <select name="instituto" value={formData.instituto} onChange={handleInputChange} className="w-full p-3 bg-white border-2 rounded-lg">
                    {selectableInstitutes.map(i => <option key={i} value={i}>{INSTITUTOS_CONFIG[i]?.fullName || i}</option>)}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">A mudança de instituto requer aprovação e pode levar até 24h.</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><Briefcase size={18}/>Profissão</label>
                  <select name="profession" value={formData.profession} onChange={handleInputChange} className="w-full p-3 bg-white border-2 rounded-lg">
                     {PROFESSIONS_ARRAY.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                 <div>
                    <label htmlFor="bio" className="font-semibold text-gray-700 mb-2 flex items-center gap-2">Quem sou (Bio)</label>
                    <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="w-full p-3 bg-white border-2 rounded-lg h-24" maxLength={150}></textarea>
                </div>
                <div>
                    <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">Personalização</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <select name="colorTheme" value={formData.colorTheme} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                            {COLOR_THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <select name="statusEmoji" value={formData.statusEmoji} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                            {STATUS_EMOJIS.map(e => <option key={e.id} value={e.id}>{e.emoji} {e.name}</option>)}
                        </select>
                        <select name="customTitle" value={formData.customTitle} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                            {CUSTOM_TITLES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
                        </select>
                    </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-4">Pré-visualização</h4>
                <ProfilePreviewCard user={tempUserForPreview as User} />
              </div>
            </div>
            {changeRequested && (
                <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg flex items-center gap-2"><Clock size={16}/>Sua solicitação de mudança de instituto está pendente de aprovação.</div>
            )}
            <div className="flex justify-end gap-4 mt-8">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={isSaving}>
                  {isSaving ? <LoadingSpinner /> : <Save size={18} />}
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;