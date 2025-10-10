// ARQUIVO: src/pages/RankingPage.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import useGamificationStore from '@/stores/gamificationStore';
import { motion } from 'framer-motion';
import { Crown, Medal, Trophy } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { INSTITUTOS_ARRAY, INSTITUTOS_CONFIG, type Instituto } from '@/types';

const RankingPage = () => {
  const { user } = useAuthStore();
  const { leaderboard, isLoading, fetchLeaderboard } = useGamificationStore();
  const [filter, setFilter] = useState<Instituto | 'Geral'>('Geral');

  useEffect(() => {
    fetchLeaderboard(filter === 'Geral' ? undefined : filter);
  }, [filter, fetchLeaderboard]);

  const getRankIndicator = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Trophy className="w-6 h-6 text-orange-400" />;
    return <span className="font-bold text-gray-500 text-lg">{index + 1}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-0">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Ranking de Colaboradores</h1>
        <p className="mt-2 text-lg text-gray-600">Veja sua posição e a dos seus colegas na jornada de integração.</p>
      </div>

      <div className="flex justify-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Instituto | 'Geral')}
          className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="Geral">Ranking Geral</option>
          {INSTITUTOS_ARRAY.filter(i => i !== 'Outros').map((instituto) => (
            <option key={instituto} value={instituto}>{INSTITUTOS_CONFIG[instituto]?.fullName || instituto}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-lg border">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pos.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instituto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pontos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((player, index) => (
                <motion.tr
                  key={player.uid}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`transition-colors ${player.uid === user?.uid ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIndicator(index)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <img
                        crossOrigin="anonymous"
                        src={player.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.displayName)}&background=random`}
                        alt={player.displayName || ''}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{player.displayName}</div>
                        <div className="text-sm text-gray-500">{player.profession || 'Não informado'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {INSTITUTOS_CONFIG[player.instituto]?.name || player.instituto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-lg text-blue-600">{player.points}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RankingPage;