// src/pages/ProfilePage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Building, Briefcase, Edit, User as UserIcon, Clock, Award, TrendingUp, Mail } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { INSTITUTOS_CONFIG } from "@/types";
import { COLOR_THEMES, STATUS_EMOJIS, CUSTOM_TITLES } from "@/config/personalization";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }

  const institutConfig = INSTITUTOS_CONFIG[user.instituto];
  const theme = COLOR_THEMES.find(t => t.id === (user.personalizations?.colorTheme || 'classic')) || COLOR_THEMES[0];
  const emoji = STATUS_EMOJIS.find(e => e.id === (user.personalizations?.statusEmoji || 'happy')) || STATUS_EMOJIS[0];
  const title = CUSTOM_TITLES.find(t => t.id === (user.personalizations?.customTitle || 'explorer')) || CUSTOM_TITLES[0];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
      <div className="card-elevated p-0 overflow-hidden">
        {/* Header do Perfil */}
        <div className={`h-40 bg-gradient-to-r ${theme.primary} relative p-6 flex justify-end items-start`}>
            <Link to="/settings" className="btn-secondary !rounded-full !px-4 !py-2 bg-white/20 text-white hover:bg-white/30 border-white/50 border">
              <Edit size={16} className="mr-2" /> Editar Perfil
            </Link>
        </div>
        
        {/* Conteúdo do Perfil */}
        <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-24 relative">
                <div className="relative">
                    <img
                        crossOrigin="anonymous"
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                        alt={user.displayName}
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-3 -right-3 text-4xl bg-white rounded-full p-1 shadow-md">{emoji.emoji}</div>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 text-center sm:text-left">{user.displayName}</h1>
                    <p className="text-gray-500 text-center sm:text-left">{title.icon} {title.title}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8 text-center">
                 <div className="bg-gray-50 p-4 rounded-xl">
                    <Award className="mx-auto text-yellow-500 mb-1" />
                    <p className="text-2xl font-bold">{user.points}</p>
                    <p className="text-sm text-gray-500">Pontos</p>
                </div>
                 <div className="bg-gray-50 p-4 rounded-xl">
                    <TrendingUp className="mx-auto text-blue-500 mb-1" />
                    <p className="text-2xl font-bold">#{user.currentRank || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Ranking Geral</p>
                </div>
                 <div className="bg-gray-50 p-4 rounded-xl">
                    <TrendingUp className="mx-auto text-purple-500 mb-1" />
                    <p className="text-2xl font-bold">#{user.instituteRank || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Ranking do Instituto</p>
                </div>
            </div>

            <div className="mt-8 space-y-6">
                <div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">Quem sou</h3>
                    <p className="text-gray-600 italic">{user.bio || "Nenhuma bio informada."}</p>
                </div>
                <hr/>
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">Detalhes</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3"><Mail size={18} className="text-gray-400"/><span className="text-gray-700">{user.email}</span></div>
                            <div className="flex items-center gap-3"><Briefcase size={18} className="text-gray-400"/><span className="text-gray-700">{user.profession}</span></div>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">Instituto</h3>
                        <div className="flex items-center gap-3">
                            <img src={institutConfig.logo} alt={institutConfig.name} className="w-10 h-10 object-contain"/>
                            <span className="text-gray-700 font-medium">{institutConfig.fullName}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;