import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'green' | 'purple';
}

const colorMap = {
  blue: 'kpi-color-blue',
  yellow: 'kpi-color-yellow',
  green: 'kpi-color-green',
  purple: 'kpi-color-purple',
};

const KpiCard = ({ title, value, icon: Icon, color }: KpiCardProps) => {
  const colorClass = colorMap[color];

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.02 }} 
      className="glass-card kpi-card p-6 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <p className="font-semibold text-white/90">{title}</p>
        <div className={`kpi-icon-container ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="kpi-value mt-4">{value}</p>
      </div>
    </motion.div>
  );
};

export default KpiCard;