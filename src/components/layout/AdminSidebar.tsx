// src/components/layout/AdminSidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { BarChart2, Users, PieChart, Settings, LogOut, ArrowLeftRight } from 'lucide-react';
import { INSTITUTOS_CONFIG } from '@/types';

// ✅ FUNÇÃO ADICIONADA
const cleanPhotoURL = (url: string | null | undefined): string | null => {
    if (!url) return null;
    return url.split('=')[0]; // Remove parâmetros
};

const AdminSidebar = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();

    const adminNav = [
        { name: 'Dashboard Geral', icon: BarChart2, href: '/admin/dashboard' },
        { name: 'Gestão de Acessos', icon: Users, href: '/admin/users' },
        { name: 'Relatórios', icon: PieChart, href: '#' }, // Link futuro
    ];

    // ✅ USA A FUNÇÃO E DEFINE FALLBACK
    const userPhotoURL = cleanPhotoURL(user?.photoURL);
    const fallbackURL = user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random` : '/hc/ICHC.png'; // Fallback genérico se user for null

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/70 backdrop-blur-xl border-r border-white/10 p-6 flex-col hidden lg:flex justify-between">
            <div>
                <div className="flex items-center gap-4 mb-10">
                    <img
                        // ✅ APLICA A URL LIMPA E FALLBACK
                        src={userPhotoURL || fallbackURL}
                        alt={user?.displayName || "Admin"}
                        className="w-10 h-10 rounded-full object-cover"
                        referrerPolicy="no-referrer" // Adicionado
                        onError={(e) => { e.currentTarget.src = fallbackURL; }} // Adicionado
                    />
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