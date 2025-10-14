// src/types/index.ts

export type Instituto =
  | "ICHC" | "InCor" | "IOT" | "IPQ" | "InRad" | "ICr"
  | "ICESP" | "IMREA" | "LIMs" | "IPer" | "IGS"
  | "Outros";

export type Role = "employee" | "coordinator" | "admin";

export interface UserPersonalizations {
  colorTheme?: string;
  statusEmoji?: string;
  customTitle?: string;
}

export interface QuizAttempt {
  moduleId: string;
  attempts: number;
  passed: boolean;
  score: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  instituto: Instituto;
  role: Role;
  profession: string;
  bio: string;
  points: number;
  badges: string[];
  completedModules: string[];
  quizAttempts: Record<string, QuizAttempt>;
  createdAt: number;
  lastAccess: number | any;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  currentRank: number;
  instituteRank: number;
  welcomeModalSeen: boolean;
  tourSeen: boolean;
  personalizations: UserPersonalizations;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  points: number;
  category: string;
  estimatedMinutes: number;
  imageUrl?: string;
  isRequired: boolean;
  url?: string; // Campo para links externos
}

export interface Notification {
  id: string;
  userId: string;
  type: 'module_completion' | 'badge_earned' | 'feedback_received' | 'admin_message';
  message: string;
  read: boolean;
  createdAt: number;
  link?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  moduleId: string;
  moduleTitle: string;
  completionDate: number;
  certificateNumber: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'completion' | 'engagement' | 'special';
  points: number;
}

export interface InstitutoConfig {
  name: Instituto;
  fullName: string;
  logo: string;
  color: string;
}

export const INSTITUTOS_ARRAY: Instituto[] = [
  "ICHC", "InCor", "IOT", "IPQ", "InRad", "ICr",
  "ICESP", "IMREA", "LIMs", "IPer", "IGS", "Outros"
];

export const PROFESSIONS_ARRAY: string[] = [
  "Médico(a)", "Enfermeiro(a)", "Fisioterapeuta", "Psicólogo(a)", "Nutricionista",
  "Farmacêutico(a)", "Biomédico(a)", "Técnico(a) de Enfermagem", "Técnico(a) de Laboratório",
  "Técnico(a) de Radiologia", "Assistente Social", "Fonoaudiólogo(a)", "Terapeuta Ocupacional",
  "Administrativo", "Pesquisador(a)", "Outro"
];

export const INSTITUTOS_CONFIG: Record<Instituto, InstitutoConfig> = {
  "ICHC": { name: "ICHC", fullName: "Instituto Central", logo: "/hc/ICHC.png", color: "bg-blue-500" },
  "InCor": { name: "InCor", fullName: "Instituto do Coração", logo: "/hc/InCor.png", color: "bg-red-500" },
  "IOT": { name: "IOT", fullName: "Inst. de Ortopedia e Traumatologia", logo: "/hc/IOT.png", color: "bg-green-500" },
  "IPQ": { name: "IPQ", fullName: "Instituto de Psiquiatria", logo: "/hc/IPQ.png", color: "bg-purple-500" },
  "InRad": { name: "InRad", fullName: "Instituto de Radiologia", logo: "/hc/InRad.png", color: "bg-yellow-500" },
  "ICr": { name: "ICr", fullName: "Inst. da Criança e do Adolescente", logo: "/hc/ICr.png", color: "bg-pink-500" },
  "ICESP": { name: "ICESP", fullName: "Instituto do Câncer de SP", logo: "/hc/ICESP.png", color: "bg-indigo-500" },
  "IMREA": { name: "IMREA", fullName: "Inst. de Medicina Física e Reabilitação", logo: "/hc/IMREA.png", color: "bg-teal-500" },
  "LIMs": { name: "LIMs", fullName: "Labs. de Investigação Médica", logo: "/hc/LIMs.png", color: "bg-gray-500" },
  "IPer": { name: "IPer", fullName: "Instituto Perdizes", logo: "/hc/IPer.png", color: "bg-orange-500" },
  "IGS": { name: "IGS", fullName: "Instituto de Gestão e Saúde", logo: "/hc/IGS.png", color: "bg-cyan-500" },
  "Outros": { name: "Outros", fullName: "Outro Instituto", logo: "/hc/ICHC.png", color: "bg-slate-500" },
};