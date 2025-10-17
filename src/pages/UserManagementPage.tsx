import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import useDashboardStore from '@/stores/dashboardStore';
import { type User, type Role } from '@/types';
import { ShieldCheck, UserCog } from 'lucide-react';

const UserManagementPage = () => {
    const { allUsers, fetchAllUsers, isLoading } = useDashboardStore();
    const { updateUserRole } = useAuthStore();
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const handleRoleChange = async (user: User, newRole: Role) => {
        if (user.role === newRole) return;
        const success = await updateUserRole(user.uid, newRole);
        if (success) {
            // Atualiza a lista localmente para refletir a mudança instantaneamente
            fetchAllUsers(); 
        } else {
            alert("Falha ao atualizar a permissão. Tente novamente.");
        }
    };

    const filteredUsers = allUsers.filter(u => 
        u.displayName.toLowerCase().includes(filter.toLowerCase()) ||
        u.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-4xl font-black text-white">Gestão de Acessos</h1>
                <p className="text-white/70 text-lg">Atribua permissões de Coordenador ou Admin.</p>
            </div>

            <input 
                type="text"
                placeholder="Filtrar por nome ou e-mail..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="glass-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-white/10">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-400">Usuário</th>
                                <th className="p-4 text-sm font-semibold text-slate-400">Instituto</th>
                                <th className="p-4 text-sm font-semibold text-slate-400">Permissão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={3} className="text-center p-8">Carregando usuários...</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.uid} className="border-b border-white/5 last:border-b-0">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={user.photoURL || ''} alt={user.displayName} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-semibold text-white">{user.displayName}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">{user.instituto}</td>
                                        <td className="p-4">
                                            <select 
                                                value={user.role} 
                                                onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                                                className="bg-slate-700/50 border border-white/10 rounded-md p-2 text-white"
                                            >
                                                <option value="employee">Colaborador</option>
                                                <option value="coordinator">Coordenador</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default UserManagementPage;
