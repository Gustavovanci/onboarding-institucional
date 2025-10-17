import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartProps {
  data?: { [key: string]: number };
}

const CompletionTimeHistogram = ({ data }: ChartProps) => {
    if (!data) return <div className="h-72 flex items-center justify-center text-gray-400">Carregando dados...</div>;

    const chartData = Object.entries(data).map(([name, value]) => ({ name, "Nº de Usuários": value }));

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false}/>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#9ca3af" />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255,255,255,0.2)' }} />
                    <Bar dataKey="Nº de Usuários" fill="rgba(16, 185, 129, 0.7)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CompletionTimeHistogram;
