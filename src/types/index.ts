// src/types/index.ts - VERSÃO CORRIGIDA E EXPANDIDA

export type Instituto = 'ICHC' | 'InCor' | 'IOT' | 'IPQ' | 'InRad' | 'ICr' | 'ICESP' | 'IMREA' | 'LIMs' | 'IPer' | 'PA' | 'Outros';
export type Role = 'employee' | 'coordinator' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  instituto: Instituto;
  role: Role;
  profession?: string;
  bio?: string;
  points: number;
  badges: string[];
  completedModules: string[];
  certificates: string[]; // IDs dos certificados obtidos
  createdAt: number;
  lastAccess: number;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  currentRank: number;
  previousRank: number;
  instituteRank: number;
}

export interface Certificate {
  id: string;
  userId: string;
  moduleId: string;
  moduleName: string;
  userName: string;
  userEmail: string;
  instituto: string;
  completionDate: number;
  score?: number;
  certificateNumber: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'badge' | 'ranking' | 'module' | 'certificate' | 'system';
  read: boolean;
  createdAt: number;
  actionUrl?: string;
}

// Instituto configs com logos (placeholder para futuros PNGs)
export interface InstitutoConfig {
  name: Instituto;
  fullName: string;
  color: string;
  logo?: string; // Caminho para o PNG
}

export const INSTITUTOS_CONFIG: Record<Instituto, InstitutoConfig> = {
  'ICHC': { name: 'ICHC', fullName: 'Instituto Central', color: 'bg-brand-accent', logo: '/logos/institutos/ichc.png' },
  'InCor': { name: 'InCor', fullName: 'Instituto do Coração', color: 'bg-brand-secondary', logo: '/logos/institutos/incor.png' },
  'IOT': { name: 'IOT', fullName: 'Instituto de Ortopedia', color: 'bg-brand-primary', logo: '/logos/institutos/iot.png' },
  'IPQ': { name: 'IPQ', fullName: 'Instituto de Psiquiatria', color: 'bg-purple-500', logo: '/logos/institutos/ipq.png' },
  'InRad': { name: 'InRad', fullName: 'Instituto de Radiologia', color: 'bg-yellow-500', logo: '/logos/institutos/inrad.png' },
  'ICr': { name: 'ICr', fullName: 'Instituto da Criança', color: 'bg-orange-500', logo: '/logos/institutos/icr.png' },
  'ICESP': { name: 'ICESP', fullName: 'Instituto do Câncer', color: 'bg-pink-500', logo: '/logos/institutos/icesp.png' },
  'IMREA': { name: 'IMREA', fullName: 'Instituto de Medicina Física e Reabilitação', color: 'bg-gray-500', logo: '/logos/institutos/imrea.png' },
  'LIMs': { name: 'LIMs', fullName: 'Laboratório de Investigações Médicas', color: 'bg-black-500', logo: '/logos/institutos/lims.png' },
  'IPer': { name: 'IPer', fullName: 'Instituto de Perdizes', color: 'bg-gold-500', logo: '/logos/institutos/iper.png' },
  'PA': { name: 'PA', fullName: 'Prédio da Administração', color: 'bg-navyblue-500', logo: '/logos/institutos/pa.png' },
  'Outros': { name: 'Outros', fullName: 'Outros Institutos', color: 'bg-gray-400', logo: null }
};

export interface Module {
  id: string;
  title: string;
  description: string;
  points: number;
  estimatedMinutes: number;
  order: number;
  content: { id: string; title: string; content: string }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  requirements: { modulesCompleted?: number, requiredModulesCompleted?: boolean };
}