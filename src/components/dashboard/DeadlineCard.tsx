// src/components/dashboard/DeadlineCard.tsx
import { useAuthStore } from '../../stores/authStore';
import { differenceInDays } from 'date-fns';
import { Clock } from 'lucide-react';

// Exportação NOMEADA (correta)
export const DeadlineCard = () => {
  const { user } = useAuthStore();

  if (!user || user.onboardingCompleted) return null; // Não mostra o card se o onboarding já foi concluído

  const deadlineDays = 30;
  const startDate = new Date(user.createdAt);
  const today = new Date();
  const daysPassed = differenceInDays(today, startDate);
  const daysRemaining = Math.max(0, deadlineDays - daysPassed);
  const progressPercentage = Math.min(100, (daysPassed / deadlineDays) * 100);

  return (
    <div className="card-elevated h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Prazo do Onboarding</h3>
          <p className="text-xs text-gray-500">Você tem 30 dias para concluir</p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-4xl font-extrabold text-blue-600">{daysRemaining}</p>
        <p className="font-bold text-gray-700">dias restantes</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div 
          className="bg-blue-500 h-2 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};