// src/components/admin/TopProfessionsChart.tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data?: { [key: string]: number };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TopProfessionsChart = ({ data }: ChartProps) => {
    if (!data) return <div className="h-72 flex items-center justify-center text-gray-400">Carregando dados...</div>;

    const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        fontSize={12}
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [value, name]}/>
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize: "12px", marginLeft: "10px"}}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// ✅ CORREÇÃO: A linha de exportação que estava faltando.
export default TopProfessionsChart;