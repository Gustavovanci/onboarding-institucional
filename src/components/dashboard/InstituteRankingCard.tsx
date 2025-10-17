// src/components/dashboard/InstituteRankingCard.tsx
import { useEffect } from 'react';
import useGamificationStore from '../../stores/gamificationStore';
import { useAuthStore } from '../../stores/authStore';
import { Trophy } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Link } from 'react-router-dom';

export const InstituteRankingCard = () => {
  const { user } = useAuthStore();
  const { instituteLeaderboards, fetchInstituteLeaderboard, isLoading } = useGamificationStore();

  useEffect(() => {
    if (user?.instituto && !instituteLeaderboards[user.instituto]) {
      fetchInstituteLeaderboard(user.instituto);
    }
  }, [user, instituteLeaderboards, fetchInstituteLeaderboard]);

  if (!user?.instituto) return null;

  const leaderboard = instituteLeaderboards[user.instituto] || [];

  return (
    <div className="card-elevated bg-yellow-50 border-yellow-200 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Trophy className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Top 5 - {user.instituto}</h3>
          <p className="text-xs text-gray-500">Ranking do seu instituto</p>
        </div>
      </div>
      {isLoading && leaderboard.length === 0 ? (
        <div className="flex justify-center items-center h-40"><LoadingSpinner /></div>
      ) : (
        <div className="flex flex-col h-full">
          <ul className="space-y-2 flex-grow">
            {leaderboard.length > 0 ? leaderboard.slice(0, 5).map((player, index) => (
              <li key={player.uid} className={`flex items-center justify-between p-2 rounded-lg ${player.uid === user.uid ? 'bg-yellow-200/80' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm w-5 text-center text-yellow-800">{index + 1}</span>
                  <img 
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    src={player.photoURL || `https://ui-avatars.com/api/?name=${player.displayName}`} 
                    alt={player.displayName} className="w-8 h-8 rounded-full" 
                   />
                  <span className="text-sm font-semibold text-gray-700 truncate max-w-[120px] sm:max-w-none">{player.displayName}</span>
                </div>
                <span className="text-sm font-bold text-yellow-800">{player.points} pts</span>
              </li>
            )) : <p className="text-sm text-center text-gray-500 pt-8">Ainda não há ranking para este instituto.</p>}
          </ul>
          <Link to="/ranking" className="block text-center mt-auto pt-4 text-yellow-700 font-semibold hover:underline">Ver ranking completo</Link>
        </div>
      )}
    </div>
  );
};