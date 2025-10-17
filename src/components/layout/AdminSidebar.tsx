import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { BarChart2, Users, PieChart, Settings, LogOut, ArrowLeftRight } from 'lucide-react';
import { INSTITUTOS_CONFIG } from '@/types';

const AdminSidebar = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();

    const adminNav = [
        { name: 'Dashboard Geral', icon: BarChart2, href: '/admin/dashboard' },
        { name: 'Gestão de Acessos', icon: Users, href: '/admin/users' },
        { name: 'Relatórios', icon: PieChart, href: '#' }, // Link futuro
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/70 backdrop-blur-xl border-r border-white/10 p-6 flex-col hidden lg:flex justify-between">
            <div>
                <div className="flex items-center gap-4 mb-10">
                    <img src={INSTITUTOS_CONFIG[user?.instituto || "ICHC"]?.logo || '/hc/ICHC.png'} alt="Logo" className="w-10 h-10"/>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">{user?.displayName}</h1>
                        <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                    </div>
                </div>
                
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Analytics</h2>
                <nav className="flex flex-col gap-2">
                    {adminNav.map(item => (
                        <Link 
                            key={item.name} 
                            to={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors ${location.pathname === item.href ? 'bg-white/10 text-white font-semibold' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className='flex flex-col gap-2'>
                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors text-sm">
                    <ArrowLeftRight size={16} />
                    <span>Voltar ao Onboarding</span>
                </Link>
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm">
                    <LogOut size={16} />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
