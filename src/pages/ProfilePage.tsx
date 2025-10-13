import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building } from "lucide-react";

import { useAuthStore } from "@/stores/authStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProfilePreviewCard from "@/components/profile/ProfilePreviewCard"; // mantém seu componente existente
import BioEditor from "@/components/profile/BioEditor";


import {
  COLOR_THEMES,
  STATUS_EMOJIS,
  CUSTOM_TITLES,
  INSTITUTOS_ARRAY,
  type UserPersonalizations,
  type Instituto,
} from "@/types";

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    instituto: (user?.instituto as Instituto) || "Outros",
    bio: user?.bio || "",
    colorTheme: user?.personalizations?.colorTheme || "classic",
    statusEmoji: user?.personalizations?.statusEmoji || "happy",
    customTitle: user?.personalizations?.customTitle || "explorer",
  });

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        displayName: user.displayName || "",
        instituto: (user.instituto as Instituto) || "Outros",
        bio: user.bio || "",
        colorTheme: user.personalizations?.colorTheme || "classic",
        statusEmoji: user.personalizations?.statusEmoji || "happy",
        customTitle: user.personalizations?.customTitle || "explorer",
      });
    }
  }, [user, isEditing]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePersonalizationChange(field: keyof UserPersonalizations, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName: formData.displayName,
        instituto: formData.instituto as Instituto,
        bio: formData.bio,
        personalizations: {
          colorTheme: formData.colorTheme,
          statusEmoji: formData.statusEmoji,
          customTitle: formData.customTitle,
        },
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  const selectableInstitutes = INSTITUTOS_ARRAY.filter((i) => i !== "Outros");
  const previewUser = {
    ...user,
    ...formData,
    personalizations: {
      colorTheme: formData.colorTheme,
      statusEmoji: formData.statusEmoji,
      customTitle: formData.customTitle,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div id="tour-step-5-profile-page" className="card-elevated max-w-5xl mx-auto p-0 overflow-hidden">
        {/* Cabeçalho / capa */}
        <div className="bg-hc-blue/10 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <img
              src={
                user.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.displayName || "U"
                )}&background=random`
              }
              alt={user.displayName || ""}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
              crossOrigin="anonymous"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{user.displayName}</h1>
              <p className="text-sm text-gray-600">
                {user.email} • {user.instituto || "Instituto não definido"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            {!isEditing ? (
              <button className="btn-primary" onClick={() => setIsEditing(true)}>
                Editar perfil
              </button>
            ) : (
              <>
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
                <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar alterações"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 md:p-8">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-2 gap-8 items-start"
            >
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Building className="w-5 h-5 text-gray-500" /> Instituto
                  </label>
                  <select
                    name="instituto"
                    value={formData.instituto}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition"
                  >
                    {selectableInstitutes.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1 w-full h-28 p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition"
                    maxLength={400}
                    placeholder="Escreva um breve texto sobre você…"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.bio?.length || 0}/400
                  </div>
                </div>

                {/* Personalizações rápidas */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tema</label>
                    <select
                      value={formData.colorTheme}
                      onChange={(e) => handlePersonalizationChange("colorTheme", e.target.value)}
                      className="mt-1 w-full p-2 border rounded-md bg-white"
                    >
                      {Object.keys(COLOR_THEMES).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Emoji</label>
                    <select
                      value={formData.statusEmoji}
                      onChange={(e) => handlePersonalizationChange("statusEmoji", e.target.value)}
                      className="mt-1 w-full p-2 border rounded-md bg-white"
                    >
                      {Object.keys(STATUS_EMOJIS).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Título</label>
                    <select
                      value={formData.customTitle}
                      onChange={(e) => handlePersonalizationChange("customTitle", e.target.value)}
                      className="mt-1 w-full p-2 border rounded-md bg-white"
                    >
                      {Object.keys(CUSTOM_TITLES).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <ProfilePreviewCard user={previewUser as any} className="w-full" />
              </div>
            </motion.div>
          ) : (
            <>
              {/* Visualização atual */}
              <ProfilePreviewCard user={user as any} className="w-full" />

              {/* Editor de Bio (carrega/salva direto no Firestore) */}
              <div className="mt-8">
                <BioEditor userId={user.uid} maxLength={400} />
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage; 