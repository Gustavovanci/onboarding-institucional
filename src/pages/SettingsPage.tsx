// src/pages/SettingsPage.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building, Briefcase, Save, Clock, User as UserIcon, Palette, Smile, Star, Compass } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { INSTITUTOS_ARRAY, PROFESSIONS_ARRAY, type Instituto, INSTITUTOS_CONFIG } from "@/types";
import { COLOR_THEMES, STATUS_EMOJIS, CUSTOM_TITLES } from "@/config/personalization";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";
import  OnboardingTour  from '../components/ui/OnboardingTour';

const SettingsPage = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [changeRequested, setChangeRequested] = useState(false);
  const [showTour, setShowTour] = useState(false); // ADICIONADO

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
  };

  if (!user) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }
  
  const theme = COLOR_THEMES.find(t => t.id === formData.colorTheme) || COLOR_THEMES[0];
  const emoji = STATUS_EMOJIS.find(e => e.id === formData.statusEmoji) || STATUS_EMOJIS[0];
  const title = CUSTOM_TITLES.find(t => t.id === formData.customTitle) || CUSTOM_TITLES[0];

  const selectableInstitutes = INSTITUTOS_ARRAY.filter((i) => i !== "Outros");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
       <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Configurações do Perfil</h1>
        <p className="mt-2 text-lg text-gray-600">Ajuste suas informações e personalize sua experiência.</p>
      </div>
      <div className="card-elevated max-w-6xl mx-auto p-0 overflow-hidden">
        <div className="p-6 md:p-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Coluna de Edição */}
              <div className="space-y-6">
                 <div>
                    <label htmlFor="displayName" className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><UserIcon size={18}/> Nome de Exibição</label>
                    <input id="displayName" name="displayName" type="text" value={formData.displayName} onChange={handleInputChange} className="w-full p-3 bg-white border-2 rounded-lg" />
                </div>
                 <div>
                    <label htmlFor="bio" className="font-semibold text-gray-700 mb-2 flex items-center gap-2">Quem sou (Bio)</label>
                    <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="w-full p-3 bg-white border-2 rounded-lg h-24" placeholder="Fale um pouco sobre você..." maxLength={150}></textarea>
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
                
                <h3 className="font-semibold text-gray-800 text-lg pt-4 border-t">Personalização</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="colorTheme" className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm"><Palette size={16}/> Tema</label>
                    <select id="colorTheme" name="colorTheme" value={formData.colorTheme} onChange={handleInputChange} className="w-full p-2 border-2 rounded-md">
                        {COLOR_THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="statusEmoji" className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm"><Smile size={16}/> Emoji</label>
                    <select id="statusEmoji" name="statusEmoji" value={formData.statusEmoji} onChange={handleInputChange} className="w-full p-2 border-2 rounded-md">
                        {STATUS_EMOJIS.map(e => <option key={e.id} value={e.id}>{e.emoji} {e.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="customTitle" className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm"><Star size={16}/> Título</label>
                    <select id="customTitle" name="customTitle" value={formData.customTitle} onChange={handleInputChange} className="w-full p-2 border-2 rounded-md">
                        {CUSTOM_TITLES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
                    </select>
                  </div>
                </div>

                {/* Seção Tour Guiado ADICIONADA */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-brand-azure" />
                    Tour da Plataforma
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🧭</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">Tour Guiado Interativo</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Refaça o tour completo da plataforma para relembrar onde estão as principais funcionalidades.
                          Demora apenas 2 minutos!
                        </p>
                        <button
                          onClick={() => setShowTour(true)}
                          className="flex items-center gap-2 bg-brand-azure text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
                        >
                          <Compass className="w-4 h-4" />
                          Iniciar Tour Novamente
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Coluna de Pré-visualização */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-4 text-center">Pré-visualização em Tempo Real</h4>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/50">
                    <div className={`h-32 bg-gradient-to-r ${theme.primary} relative`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute bottom-4 left-4 flex items-end gap-4">
                            <div className="relative">
                                <img
                                crossOrigin="anonymous"
                                src={user.photoURL ? user.photoURL : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.displayName)}&size=128`}
                                alt={formData.displayName}
                                className="w-24 h-24 rounded-xl border-4 border-white shadow-lg object-cover"
                                />
                                <div className="absolute -bottom-2 -right-2 text-3xl">
                                {emoji.emoji}
                                </div>
                            </div>
                            <div className="pb-2 text-white">
                                <div className="flex items-center gap-2 mb-1 drop-shadow">
                                <span className="text-md">{title.icon}</span>
                                <span className="font-semibold opacity-90 text-sm">{title.title}</span>
                                </div>
                                <h1 className="text-2xl font-bold drop-shadow">{formData.displayName}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        {formData.bio ? (
                            <p className="text-center text-sm text-gray-600 italic">"{formData.bio}"</p>
                        ) : (
                            <p className="text-center text-sm text-gray-400">Sua bio aparecerá aqui...</p>
                        )}
                    </div>
                </div>
              </div>
            </div>

            {changeRequested && (
                <div className="mt-8 p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center gap-3"><Clock size={18}/>Sua solicitação de mudança de instituto foi enviada e está pendente de aprovação.</div>
            )}

            <div className="flex justify-end gap-4 mt-8 border-t pt-6">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={isSaving}>
                  {isSaving ? <LoadingSpinner /> : <Save size={18} />}
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>
        </div>
      </div>
      {/* Componente do Tour ADICIONADO */}
      <OnboardingTour
        run={showTour}
        onFinish={() => setShowTour(false)}
      />
    </motion.div>
  );
};

export default SettingsPage;