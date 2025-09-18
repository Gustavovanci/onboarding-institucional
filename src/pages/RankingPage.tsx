import { useEffect, useState } from 'react';
import useGamificationStore from '../stores/gamificationStore';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';
import {
  Award,
  Trophy,
  ChevronDown,
  Globe,
  TrendingUp,
  TrendingDown,
  Crown,
  Medal,
} from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { type Instituto, INSTITUTOS_CONFIG } from '../types';

const institutos: Instituto[] = Object.keys(INSTITUTOS_CONFIG) as Instituto[];

const RankingPage = () => {
  const { user } = useAuthStore();
  const { leaderboard, isLoading, fetchLeaderboard } = useGamificationStore();
  const [filter, setFilter] = useState<'general' | Instituto>('general');

  useEffect(() => {
    fetchLeaderboard(filter === 'general' ? undefined : filter);
  }, [fetchLeaderboard, filter]);

  // LÓGICA DE UI MOVIDA PARA O COMPONENTE
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
    return <span className="text-gray-600 font-bold">#{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  const currentUserInList = leaderboard.find(u => u.uid === user?.uid);

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 text-white mb-8">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Ranking de Colaboradores</h1>
          <p className="text-lg opacity-90">
            Veja sua posição e a dos seus colegas na jornada de integração
          </p>
        </div>
      </motion.div>

      {/* User's Current Position */}
      {currentUserInList && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getRankBadge(currentUserInList.rank)}`}>
                {getRankIcon(currentUserInList.rank)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Sua Posição Atual</h3>
                <p className="text-gray-600">
                  {filter === 'general' ? 'Ranking Geral' : `Instituto ${filter}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                #{currentUserInList.rank}
              </div>
              <div className="text-blue-600 font-medium">
                {currentUserInList.points} pontos
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('general')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'general'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span>Ranking Geral</span>
          </button>

          <div className="relative">
            <select
              value={filter === 'general' ? '' : filter}
              onChange={(e) => setFilter((e.target.value as Instituto) || 'general')}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-6 py-3 pr-10 font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Filtrar por Instituto</option>
              {institutos.map(inst => {
                const config = INSTITUTOS_CONFIG[inst];
                return (
                  <option key={inst} value={inst}>
                    {config.fullName} ({config.name})
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {filter === 'general'
            ? 'Mostrando todos os institutos'
            : `Filtrado por ${INSTITUTOS_CONFIG[filter as Instituto]?.fullName}`
          }
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8">
                <div className="flex items-end justify-center space-x-8">

                  {/* 2nd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="w-24 h-32 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg flex items-center justify-center text-white font-bold text-xl mb-4">
                      2º
                    </div>
                    <img
                      src={leaderboard[1].photoURL || `https://ui-avatars.com/api/?name=${leaderboard[1].displayName}`}
                      alt={leaderboard[1].displayName || ''}
                      className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-gray-300"
                    />
                    <h3 className="font-bold text-gray-900">{leaderboard[1].displayName}</h3>
                    <p className="text-sm text-gray-600">{leaderboard[1].points} pts</p>
                  </motion.div>

                  {/* 1st Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <div className="w-24 h-40 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg flex items-center justify-center text-white font-bold text-xl mb-4 relative">
                      <Crown className="absolute -top-3 w-8 h-8 text-yellow-300" />
                      1º
                    </div>
                    <img
                      src={leaderboard[0].photoURL || `https://ui-avatars.com/api/?name=${leaderboard[0].displayName}`}
                      alt={leaderboard[0].displayName || ''}
                      className="w-20 h-20 rounded-full mx-auto mb-2 border-4 border-yellow-400"
                    />
                    <h3 className="font-bold text-gray-900">{leaderboard[0].displayName}</h3>
                    <p className="text-sm text-gray-600">{leaderboard[0].points} pts</p>
                  </motion.div>

                  {/* 3rd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg flex items-center justify-center text-white font-bold text-xl mb-4">
                      3º
                    </div>
                    <img
                      src={leaderboard[2].photoURL || `https://ui-avatars.com/api/?name=${leaderboard[2].displayName}`}
                      alt={leaderboard[2].displayName || ''}
                      className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-orange-400"
                    />
                    <h3 className="font-bold text-gray-900">{leaderboard[2].displayName}</h3>
                    <p className="text-sm text-gray-600">{leaderboard[2].points} pts</p>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Full Leaderboard Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Posição</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Colaborador</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Instituto</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Pontos</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Tendência</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboard.map((player, index) => {
                    const isCurrentUser = player.uid === user?.uid;
                    const institutConfig = player.instituto ? INSTITUTOS_CONFIG[player.instituto] : null;

                    return (
                      <motion.tr
                        key={player.uid}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`hover:bg-gray-50 transition-colors ${
                          isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        {/* Posição */}
                        <td className="px-6 py-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankBadge(player.rank)}`}>
                            {player.rank <= 3 ? (
                              getRankIcon(player.rank)
                            ) : (
                              <span className="text-sm">#{player.rank}</span>
                            )}
                          </div>
                        </td>

                        {/* Colaborador */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={player.photoURL || `https://ui-avatars.com/api/?name=${player.displayName}`}
                                alt={player.displayName || ''}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                              />
                              {isCurrentUser && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">•</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 flex items-center space-x-2">
                                <span>{player.displayName}</span>
                                {isCurrentUser && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Você
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{player.profession}</div>
                            </div>
                          </div>
                        </td>

                        {/* Instituto */}
                        <td className="px-6 py-4 hidden sm:table-cell">
                          {institutConfig && (
                            <div className="flex items-center space-x-2">
                              <div className={`w-6 h-6 ${institutConfig.color} rounded flex items-center justify-center`}>
                                <span className="text-white text-xs font-bold">
                                  {institutConfig.name.slice(0, 1)}
                                </span>
                              </div>
                              <span className="text-sm text-gray-900">{player.instituto}</span>
                            </div>
                          )}
                        </td>

                        {/* Pontos */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold text-gray-900">{player.points}</span>
                          </div>
                        </td>

                        {/* Tendência */}
                        <td className="px-6 py-4 text-center hidden md:table-cell">
                          <div className="inline-flex items-center space-x-1">
                            {Math.random() > 0.5 ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 text-center">
              <p className="text-sm text-gray-600">
                Atualizado a cada 5 minutos •
                Total de {leaderboard.length} colaboradores
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RankingPage;