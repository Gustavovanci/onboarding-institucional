import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Award, Smile, Download, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import useDashboardStore from '@/stores/dashboardStore';
import KpiCard from '@/components/admin/KpiCard';
import NpsGaugeChart from '@/components/admin/NpsGaugeChart';
import CompletionTimeHistogram from '@/components/admin/CompletionTimeHistogram';
import UserAcquisitionChart from '@/components/admin/UserAcquisitionChart';

// Função para exportar dados para CSV
const exportToCSV = (users: any[], fileName: string) => {
    if (!users || users.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }
    const headers = Object.keys(users[0]).join(',');
    const rows = users.map(user => {
        return Object.values(user).map(value => {
            const strValue = String(value).replace(/"/g, '""');
            return `"${strValue}"`;
        }).join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const { stats, isLoading, calculateDashboardStats, allUsers, fetchAllUsers } = useDashboardStore();

  useEffect(() => {
    if (user) {
        const instituteFilter = user.role === 'coordinator' ? user.instituto : undefined;
        calculateDashboardStats(instituteFilter);
        if(user.role === 'admin') {
            fetchAllUsers();
        }
    }
  }, [user, calculateDashboardStats, fetchAllUsers]);
  
  const handleExport = () => {
      if(user?.role === 'admin') {
        exportToCSV(allUsers, "onboarding_data_completo");
      } else {
        alert("Apenas administradores podem exportar todos os dados.");
      }
  };

  if (isLoading || !stats) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-center">
        <div className="loading-ring"></div>
        <p className="text-white/80 text-lg font-semibold mt-6">Analisando dados, por favor aguarde...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-4xl font-black text-white">Dashboard Executivo</h1>
            <p className="text-white/70 text-lg">{user?.role === 'coordinator' ? `Visão do Instituto: ${user.instituto}`: "Visão geral da plataforma de Onboarding."}</p>
        </div>
        <div className="flex gap-4">
            {user?.role === 'admin' && (
                 <button onClick={handleExport} className="ghost-btn flex items-center gap-2">
                    <Download size={16} />
                    Exportar Dados
                </button>
            )}
            <button onClick={() => calculateDashboardStats(user?.role === 'coordinator' ? user.instituto : undefined)} disabled={isLoading} className="ghost-btn flex items-center gap-2">
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''}/>
                Atualizar
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total de Usuários" value={stats.totalUsers} icon={Users} color="blue" />
        <KpiCard title="Tempo Médio de Conclusão" value={`${stats.averageCompletionTime} dias`} icon={Clock} color="yellow" />
        <KpiCard title="Certificados Emitidos" value={stats.totalCertificates} icon={Award} color="green" />
        <KpiCard title="NPS" value={stats.npsScore} icon={Smile} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h2 className="chart-title"><Smile size={22} /> Net Promoter Score (NPS)</h2>
          <NpsGaugeChart score={stats.npsScore} distribution={stats.npsDistribution} />
        </div>
        <div className="glass-card">
           <h2 className="chart-title"><Clock size={22} /> Distribuição do Tempo de Conclusão</h2>
           <CompletionTimeHistogram data={stats.completionTimeDistribution} />
        </div>
      </div>
       <div className="glass-card">
          <h2 className="chart-title"><Users size={22} /> Aquisição de Novos Usuários (por data de criação)</h2>
          <UserAcquisitionChart data={stats.userAcquisition} />
        </div>
    </motion.div>
  );
};

export default AdminDashboardPage;
