import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ChartProps {
    score: number;
    distribution: { promoters: number; passives: number; detractors: number };
}

const NpsGaugeChart = ({ score, distribution }: ChartProps) => {
    const data = [{ name: 'NPS', value: score }];
    const totalResponses = distribution.promoters + distribution.passives + distribution.detractors;
    
    return (
        <div className="w-full h-72">
            <ResponsiveContainer>
                <RadialBarChart 
                    innerRadius="80%" 
                    outerRadius="100%" 
                    barSize={20} 
                    data={data} 
                    startAngle={180} 
                    endAngle={0}
                >
                    <PolarAngleAxis type="number" domain={[-100, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background clockWise dataKey="value" cornerRadius={10} fill="#818cf8" />
                    <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-5xl font-bold">{score}</text>
                    <text x="50%" y="75%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-sm">Baseado em {totalResponses} respostas</text>
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs mt-2">
                <span className="text-green-400">● {distribution.promoters} Promotores</span>
                <span className="text-yellow-400">● {distribution.passives} Passivos</span>
                <span className="text-red-400">● {distribution.detractors} Detratores</span>
            </div>
        </div>
    );
};

export default NpsGaugeChart;
