// DEFINIÇÃO DO TIPO
export type Instituto =
  | "ICHC" | "InCor" | "IOT" | "IPQ" | "InRad" | "ICr"
  | "ICESP" | "IMREA" | "LIMs" | "IPer" | "IGS"
  // CORREÇÃO CRÍTICA: "Outros" foi adicionado de volta. É ESSENCIAL para que
  // o cadastro de novos usuários funcione, pois o sistema atribui "Outros"
  // como valor padrão antes do usuário escolher seu instituto real.
  // Sem isso, o objeto de usuário é criado com erro, quebrando todo o resto.
  | "Outros";

export type Role = "employee" | "coordinator" | "admin";

export interface UserPersonalizations {
  colorTheme: string;
  statusEmoji: string;
  customTitle: string;
  favoriteQuote?: string;
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
  certificates: string[];
  createdAt: number;
  lastAccess: number;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  currentRank: number;
  previousRank?: number;
  instituteRank: number;
  welcomeModalSeen: boolean;
  personalizations: UserPersonalizations;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  points: number;
  content: Array<{ id: string; title: string; content: string; type: 'text' | 'video' }>;
}

export interface Certificate {
  id: string;
  userId: string;
  moduleId: string;
  completionDate: number;
  certificateNumber: string;
  score?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'completion' | 'engagement' | 'special';
  points: number;
  requirements: {
    modulesCompleted?: number;
    pointsReached?: number;
    profileCustomized?: boolean;
  };
}

export interface InstitutoConfig {
  name: Instituto;
  fullName: string;
  logo: string;
  color: string;
}

// ==================================================================
// == CONSTANTES (valores usados no código JavaScript) ==
// ==================================================================

export const INSTITUTOS_ARRAY: Instituto[] = [
  "ICHC", "InCor", "IOT", "IPQ", "InRad", "ICr",
  "ICESP", "IMREA", "LIMs", "IPer", "IGS", "Outros" // "Outros" adicionado aqui também
];

export const PROFESSIONS_ARRAY: string[] = [
  "Médico(a)", "Enfermeiro(a)", "Fisioterapeuta", "Psicólogo(a)", "Nutricionista",
  "Farmacêutico(a)", "Biomédico(a)", "Técnico(a) de Enfermagem", "Técnico(a) de Laboratório",
  "Técnico(a) de Radiologia", "Assistente Social", "Fonoaudiólogo(a)", "Terapeuta Ocupacional",
  "Administrativo", "Pesquisador(a)", "Outro"
];

export const INSTITUTOS_CONFIG: Record<Instituto, InstitutoConfig> = {
  "ICHC": { name: "ICHC", fullName: "Instituto Central", logo: "..\hc\ICHC.png", color: "bg-blue-500" },
  "InCor": { name: "InCor", fullName: "Instituto do Coração", logo: "/logos/incor.png", color: "bg-red-500" },
  "IOT": { name: "IOT", fullName: "Inst. de Ortopedia e Traumatologia", logo: "/logos/iot.png", color: "bg-green-500" },
  "IPQ": { name: "IPQ", fullName: "Instituto de Psiquiatria", logo: "/logos/ipq.png", color: "bg-purple-500" },
  "InRad": { name: "InRad", fullName: "Instituto de Radiologia", logo: "/logos/inrad.png", color: "bg-yellow-500" },
  "ICr": { name: "ICr", fullName: "Inst. da Criança e do Adolescente", logo: "/logos/icr.png", color: "bg-pink-500" },
  "ICESP": { name: "ICESP", fullName: "Instituto do Câncer de SP", logo: "/logos/icesp.png", color: "bg-indigo-500" },
  "IMREA": { name: "IMREA", fullName: "Inst. de Medicina Física e Reabilitação", logo: "/logos/imrea.png", color: "bg-teal-500" },
  "LIMs": { name: "LIMs", fullName: "Labs. de Investigação Médica", logo: "/logos/lims.png", color: "bg-gray-500" },
  "IPer": { name: "IPer", fullName: "Instituto Perdizes", logo: "/logos/iper.png", color: "bg-orange-500" },
  "IGS": { name: "IGS", fullName: "Instituto de Gestão e Saúde", logo: "/logos/pa.png", color: "bg-cyan-500" },
  // "Outros" adicionado para corresponder ao tipo e garantir consistência
  "Outros": { name: "Outros", fullName: "Outro Instituto", logo: "/logos/default.png", color: "bg-slate-500" },
};