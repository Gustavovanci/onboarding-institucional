export type Instituto =
  | "ICHC" | "InCor" | "IOT" | "IPQ" | "InRad" | "ICr"
  | "ICESP" | "IMREA" | "LIMs" | "IPer" | "PA" | "Outros";

export type Role = "employee" | "coordinator" | "admin";

export interface UserPersonalizations {
  colorTheme: string;
  statusEmoji: string;
  customTitle: string;
  favoriteQuote: string;
}

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
  certificates: string[];
  createdAt: number;
  lastAccess: number;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  currentRank: number;
  previousRank: number;
  instituteRank: number;
  welcomeModalSeen: boolean;
  personalizations?: UserPersonalizations;
}

// ADICIONADO: Export do array de institutos
export const INSTITUTOS_ARRAY: Instituto[] = [
  "ICHC", "InCor", "IOT", "IPQ", "InRad", "ICr", 
  "ICESP", "IMREA", "LIMs", "IPer", "PA", "Outros"
];

// ADICIONADO: Export da configuração dos institutos
export const INSTITUTOS_CONFIG: Record<Instituto, { name: string; fullName: string; logo: string }> = {
  ICHC: { name: "ICHC", fullName: "Instituto de Câncer de Hospital das Clínicas", logo: "logo-ichc.png" },
  InCor: { name: "InCor", fullName: "Instituto do Coração", logo: "logo-incor.png" },
  IOT: { name: "IOT", fullName: "Instituto de Ortopedia e Traumatologia", logo: "logo-iot.png" },
  IPQ: { name: "IPQ", fullName: "Instituto de Psiquiatria", logo: "logo-ipq.png" },
  InRad: { name: "InRad", fullName: "Instituto de Radiologia", logo: "logo-inrad.png" },
  ICr: { name: "ICr", fullName: "Instituto de Cardiologia", logo: "logo-icr.png" },
  ICESP: { name: "ICESP", fullName: "Instituto do Câncer do Estado de São Paulo", logo: "logo-icesp.png" },
  IMREA: { name: "IMREA", fullName: "Instituto de Medicina Reprodutiva", logo: "logo-imrea.png" },
  LIMs: { name: "LIMs", fullName: "Laboratório de Investigação Médica", logo: "logo-lims.png" },
  IPer: { name: "IPer", fullName: "Instituto de Pesquisa", logo: "logo-iper.png" },
  PA: { name: "PA", fullName: "Pediatria e Adolescentes", logo: "logo-pa.png" },
  Outros: { name: "Outros", fullName: "Outros Institutos", logo: "logo-outros.png" }
};