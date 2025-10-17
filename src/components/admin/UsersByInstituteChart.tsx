// src/components/admin/UsersByInstituteChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data?: { [key: string]: number };
}

const UsersByInstituteChart = ({ data }: ChartProps) => {
  if (!data) return <div className="h-72 flex items-center justify-center text-gray-400">Carregando dados...</div>;

  const chartData = Object.entries(data).map(([name, value]) => ({ name, Usuários: value }));

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip wrapperClassName="!bg-white !border-gray-200 !rounded-lg !shadow-lg" />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="Usuários" fill="#2B97D4" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

// ✅ CORREÇÃO: A linha de exportação que estava faltando.
export default UsersByInstituteChart;