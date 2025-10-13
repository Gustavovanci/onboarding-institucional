// src/components/dashboard/DeadlineCard.tsx
import { useAuthStore } from '../../stores/authStore';
import { differenceInDays, isAfter } from 'date-fns';
import { Clock, Check, AlertTriangle } from 'lucide-react';

export const DeadlineCard = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const deadlineDays = 30;
  const startDate = new Date(user.createdAt);
  const today = new Date();
  const deadlineDate = new Date(startDate.setDate(startDate.getDate() + deadlineDays));
  
  // Recalcula a data de início para não modificar a original
  const startDateForCalc = new Date(user.createdAt);
  const daysPassed = differenceInDays(today, startDateForCalc);
  const daysRemaining = Math.max(0, deadlineDays - daysPassed);
  
  // Verifica se o onboarding foi concluído
  if (user.onboardingCompleted) {
    const completionDate = user.lastAccess ? new Date(user.lastAccess) : new Date(); // Aproximação
    const completedOnTime = !isAfter(completionDate, deadlineDate);

    return (
      <div className="card-elevated h-full bg-green-50 border-green-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Onboarding Concluído!</h3>
            <p className={`text-xs font-semibold ${completedOnTime ? 'text-green-700' : 'text-yellow-700'}`}>
              {completedOnTime ? 'Parabéns por concluir no prazo!' : 'Concluído fora do prazo.'}
            </p>
          </div>
        </div>
        <p className="text-center text-gray-600">Sua jornada de integração foi finalizada com sucesso. Continue explorando a plataforma!</p>
      </div>
    );
  }
  
  // Lógica para onboarding não concluído
  const isOverdue = daysRemaining === 0;
  const progressPercentage = Math.min(100, (daysPassed / deadlineDays) * 100);
  const bgColor = isOverdue ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200';
  const iconColor = isOverdue ? 'text-red-600' : 'text-blue-600';
  const iconBg = isOverdue ? 'bg-red-100' : 'bg-blue-100';
  const Icon = isOverdue ? AlertTriangle : Clock;

  return (
    <div className={`card-elevated h-full ${bgColor}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Prazo do Onboarding</h3>
          <p className="text-xs text-gray-500">{isOverdue ? 'Seu prazo terminou!' : 'Você tem 30 dias para concluir'}</p>
        </div>
      </div>
      <div className="text-center">
        <p className={`text-4xl font-extrabold ${iconColor}`}>{daysRemaining}</p>
        <p className="font-bold text-gray-700">{isOverdue ? 'dias de atraso' : 'dias restantes'}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div 
          className={`${isOverdue ? 'bg-red-500' : 'bg-blue-500'} h-2 rounded-full`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};