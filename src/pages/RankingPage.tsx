// src/pages/RankingPage.tsx

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import useGamificationStore from '@/stores/gamificationStore';
import { motion } from 'framer-motion';
import {
  Award, Trophy, ChevronDown, Globe, TrendingUp, TrendingDown,
  Crown, Medal, Building, Minus
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// ==================================================================
// == CORREÇÃO AQUI: Use "type" para importar um tipo TypeScript ==
// ==================================================================
import { INSTITUTOS_ARRAY, INSTITUTOS_CONFIG, type Instituto } from '@/types';

const RankingPage = () => {
  const { user } = useAuthStore();
  const { leaderboard, isLoading, fetchLeaderboard } = useGamificationStore();
  const [filter, setFilter] = useState<'general' | Instituto>('general');

  useEffect(() => {
    fetchLeaderboard(filter === 'general' ? undefined : filter);
  }, [fetchLeaderboard, filter]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  const getTrendIcon = (currentRank: number, previousRank: number) => {
    if (!previousRank || currentRank === previousRank) {
      return <Minus className="w-4 h-4 text-gray-400" title="Posição estável" />;
    }
    if (currentRank < previousRank) {
      return <TrendingUp className="w-4 h-4 text-green-500" title="Subiu no ranking" />;
    }
    return <TrendingDown className="w-4 h-4 text-red-500" title="Desceu no ranking" />;
  };

  const currentUserInList = leaderboard.find(u => u.uid === user?.uid);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-0">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="bg-gradient-to-r from-brand-azure via-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg">
          <Trophy className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-4xl font-bold mb-2">Ranking de Colaboradores</h1>
          <p className="text-lg opacity-90">
            Veja sua posição e a dos seus colegas na jornada de integração.
          </p>
        </div>
      </motion.div>

      {currentUserInList && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${getRankBadge(currentUserInList.rank)}`}>
                {getRankIcon(currentUserInList.rank) || `#${currentUserInList.rank}`}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Sua Posição Atual</h3>
                <p className="text-gray-600">
                  {filter === 'general' ? 'Ranking Geral' : `No instituto ${INSTITUTOS_CONFIG[filter]?.name || filter}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">#{currentUserInList.rank}</div>
              <div className="text-blue-600 font-medium">{currentUserInList.points} pontos</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 flex-wrap justify-center">
          <button onClick={() => setFilter('general')} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-white border border-gray-300 hover:bg-gray-100 text-gray-800">
            <Globe className="w-5 h-5" />
            Ranking Geral
          </button>
          {user?.instituto && (
            <button onClick={() => setFilter(user.instituto)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-white border border-gray-300 hover:bg-gray-100 text-gray-800">
              <Building className="w-5 h-5" />
              Meu Instituto
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold">Nenhum resultado</h3>
            <p>Não há jogadores neste ranking ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Instituto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pontos</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Tendência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((player, index) => (
                  <motion.tr
                    key={player.uid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`transition-colors ${player.uid === user?.uid ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadge(player.rank)}`}>
                        {getRankIcon(player.rank) || `#${player.rank}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <img src={player.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.displayName)}`} alt={player.displayName || ''} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-gray-900">{player.displayName}</div>
                          <div className="text-sm text-gray-500">{player.profession || 'Não informado'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell"><span className="text-sm text-gray-700 font-medium">{INSTITUTOS_CONFIG[player.instituto]?.name || player.instituto}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-bold text-lg text-brand-azure">{player.points}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell"><div className="flex justify-center">{getTrendIcon(player.currentRank, player.previousRank)}</div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPage;