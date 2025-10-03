// src/pages/ProfileSetupPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { type UserProfile } from '../stores/authStore'; // Importando o tipo
import { motion } from 'framer-motion';
import { UserCheck, Briefcase, Building } from 'lucide-react';
// --- CORREÇÃO 1: Importar as listas centralizadas ---
import { INSTITUTOS_ARRAY, PROFESSIONS_ARRAY } from '../types';

// --- CORREÇÃO 2: Remover as listas antigas e desatualizadas ---
// const institutes = ["ICHC", "INRAD", "INCOR", "IOT", "IMREA", "ICESP", "ICr", "IPq", "IPer", "PA", "LIMs"]; <-- REMOVIDO
// const professions = ["Médico(a)", ...]; <-- REMOVIDO

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuthStore();
  const [institute, setInstitute] = useState('');
  const [profession, setProfession] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!institute || !profession) {
      setError('Por favor, selecione seu instituto e sua profissão.');
      return;
    }
    
    setIsSaving(true);
    setError('');

    const profileData: Partial<UserProfile> = {
      instituto: institute, // <-- Corrigido para 'instituto'
      profession,
      profileCompleted: true,
    };

    try {
      await updateUserProfile(profileData);
      navigate('/dashboard');
    } catch (e) {
      console.error("Erro ao salvar perfil:", e); // Adicionado log de erro
      setError('Ocorreu um erro ao salvar seu perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtramos "Outros" da lista de seleção inicial
  const selectableInstitutes = INSTITUTOS_ARRAY.filter(i => i !== 'Outros');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-lg"
      >
        <div className="card-elevated text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quase lá, {user?.displayName?.split(' ')[0]}!</h1>
          <p className="text-gray-600 mb-8">Para personalizar sua experiência, precisamos de mais algumas informações.</p>

          <div className="space-y-6 text-left">
            <div>
              <label className="font-semibold text-gray-700 mb-2 flex items-center"><Building className="w-5 h-5 mr-2 text-blue-500"/>Seu Instituto</label>
              <select 
                value={institute} 
                onChange={(e) => setInstitute(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition"
              >
                <option value="" disabled>Selecione...</option>
                {/* --- CORREÇÃO 3: Usar a lista importada e correta --- */}
                {selectableInstitutes.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-2 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-green-500"/>Sua Profissão</label>
              <select 
                value={profession} 
                onChange={(e) => setProfession(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition"
              >
                <option value="" disabled>Selecione...</option>
                 {/* --- MELHORIA: Usar a lista centralizada de profissões também --- */}
                {PROFESSIONS_ARRAY.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

          <button onClick={handleSave} disabled={isSaving} className="btn-primary w-full mt-10 disabled:opacity-70">
            {isSaving ? 'Salvando...' : 'Salvar e Continuar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetupPage;