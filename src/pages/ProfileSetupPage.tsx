// src/pages/ProfileSetupPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORTAR O useNavigate
import { useAuthStore, type UserProfile } from '../stores/authStore';
import { motion } from 'framer-motion';
import { UserCheck, Briefcase, Building } from 'lucide-react';

const institutes = ["ICHC", "INRAD", "INCOR", "IOT", "IMREA", "ICESP", "ICr", "IPq", "IPer", "PA", "LIMs"];
const professions = ["Médico(a)", "Enfermeiro(a)", "Técnico(a) de Enfermagem", "Fisioterapeuta", "Nutricionista", "Psicólogo(a)", "Terapeuta Ocupacional", "Administrativo", "Voluntário(a)", "Técnico(a) em Nutrição"];

const ProfileSetupPage = () => {
  const navigate = useNavigate(); // <-- 2. INICIALIZAR O HOOK
  const { user, updateUserProfile } = useAuthStore();
  const [institute, setInstitute] = useState('');
  const [profession, setProfession] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false); // Adicionado para feedback no botão

  const handleSave = async () => {
    if (!institute || !profession) {
      setError('Por favor, selecione seu instituto e sua profissão.');
      return;
    }
    
    setIsSaving(true);
    setError('');

    const profileData: Partial<UserProfile> = {
      institute,
      profession,
      profileCompleted: true,
    };

    try {
      await updateUserProfile(profileData);
      navigate('/dashboard'); // <-- 3. NAVEGAR PARA A DASHBOARD APÓS SALVAR
    } catch (e) {
      setError('Ocorreu um erro ao salvar seu perfil. Tente novamente.');
      setIsSaving(false);
    }
  };

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
                {institutes.map(i => <option key={i} value={i}>{i}</option>)}
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
                {professions.map(p => <option key={p} value={p}>{p}</option>)}
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