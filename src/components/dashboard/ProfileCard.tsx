import { motion } from "framer-motion";
import type { User, InstitutoConfig } from "../../types";

interface ProfileCardProps {
  user: User;
  institutConfig: InstitutoConfig | null;
  completedModulesCount: number;
  totalModules: number;
}

export default function ProfileCard({
  user,
  institutConfig,
  completedModulesCount,
  totalModules,
}: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-card overflow-hidden border border-gray-200/50"
    >
      <div className="h-48 bg-gradient-to-r from-brand-azure to-brand-teal relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 left-6 flex items-end gap-6">
          <div className="relative">
            {institutConfig?.logo ? (
              // MELHORIA: Adicionado flexbox para garantir o preenchimento da imagem
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                <img
                  src={institutConfig.logo}
                  alt={institutConfig.name}
                  className="w-full h-full object-cover" // object-cover para preencher, object-contain se quiser mostrar tudo
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-azure">
                  {/* CORREÇÃO: Adicionado fallback para evitar erro em novos usuários */}
                  {(user.instituto || 'HC').slice(0, 2)}
                </span>
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center border-4 border-white shadow-md">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="pb-4 text-white">
            <h1 className="text-3xl font-bold mb-1 drop-shadow">
              {user.displayName}
            </h1>
            <p className="text-white/90">
              {user.profession} • {institutConfig?.fullName}
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50/50">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-azure">
              {user.points || 0}
            </div>
            <div className="text-xs text-gray-500">Pontos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-teal">
              #{user.currentRank || "N/A"}
            </div>
            <div className="text-xs text-gray-500">Ranking Geral</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              #{user.instituteRank || "N/A"}
            </div>
            <div className="text-xs text-gray-500">No Instituto</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {user.badges?.length || 0}
            </div>
            <div className="text-xs text-gray-500">Badges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-red">
              {completedModulesCount}/{totalModules}
            </div>
            <div className="text-xs text-gray-500">Módulos</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


