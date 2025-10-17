import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartProps {
  data?: { [key: string]: number };
}

const UserAcquisitionChart = ({ data }: ChartProps) => {
    if (!data) return <div className="h-72 flex items-center justify-center text-gray-400">Carregando dados...</div>;
    
    const chartData = Object.entries(data)
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .map(([date, value]) => ({ 
            date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 
            "Novos Usuários": value 
        }));

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} stroke="#9ca3af" />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255,255,255,0.2)' }} />
                    <Line type="monotone" dataKey="Novos Usuários" stroke="#a78bfa" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserAcquisitionChart;
