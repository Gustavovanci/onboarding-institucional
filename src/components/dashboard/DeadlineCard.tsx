// src/components/dashboard/DeadlineCard.tsx
import { useAuthStore } from '../../stores/authStore';
import { differenceInDays } from 'date-fns';
import { Clock, AlertTriangle, PartyPopper } from 'lucide-react';

export const DeadlineCard = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const deadlineDays = 30;
  
  // LÓGICA DE EXIBIÇÃO APÓS A CONCLUSÃO
  if (user.onboardingCompleted) {
    // ✅ CORREÇÃO APLICADA: A verificação agora foca apenas na fonte da verdade,
    // que é o `completionDetails`. Isso remove a dependência de o badge já ter sido
    // processado e atualizado no estado local.
    const completedInSprint = user.completionDetails && user.completionDetails.daysToComplete <= 7;

    if (completedInSprint) {
      return (
        <div className="card-elevated h-full bg-green-50 border-green-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <PartyPopper className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Onboarding Concluído!</h3>
              <p className={`text-xs font-semibold text-green-700`}>
                Você completou em tempo recorde!
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            Você ganhou o badge 'Maratonista' por sua agilidade. Continue explorando a plataforma!
          </p>
        </div>
      );
    }
    
    // Cenário padrão para quem concluiu após 7 dias
    return (
        <div className="card-elevated h-full bg-green-50 border-green-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <PartyPopper className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Onboarding Concluído!</h3>
              <p className={`text-xs font-semibold text-green-700`}>
                Parabéns por completar sua jornada!
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            Sua jornada de integração foi finalizada com sucesso. Explore os outros recursos!
          </p>
        </div>
    );
  }
  
  // LÓGICA DE EXIBIÇÃO ANTES DA CONCLUSÃO
  const startDate = new Date(user.createdAt);
  const today = new Date();
  const daysPassed = differenceInDays(today, startDate);
  const daysRemaining = Math.max(0, deadlineDays - daysPassed);
  const isOverdue = daysRemaining === 0 && daysPassed > deadlineDays;

  let daysText = isOverdue 
    ? differenceInDays(today, new Date(startDate.getTime() + deadlineDays * 24 * 60 * 60 * 1000)) 
    : daysRemaining;
  daysText = Math.max(0, daysText);
  
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
        <p className={`text-4xl font-extrabold ${iconColor}`}>{daysText}</p>
        <p className="font-bold text-gray-700">
            {isOverdue ? 'dias de atraso' : (daysText === 1 ? 'dia restante' : 'dias restantes')}
        </p>
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