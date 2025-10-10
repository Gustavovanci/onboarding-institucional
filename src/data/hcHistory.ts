export type HistoryItem = {
  year: number | string;
  title: string;
  description: string;
  image?: string;
  url?: string;           // link opcional
  side: "left" | "right";  // força o zigue-zague no layout
};

const hcHistoryData: HistoryItem[] = [
  { year: 1912, title: "Criação da Faculdade de Medicina", description: "Fundada sob a direção de Arnaldo Vieira de Carvalho.", image: "../hc/1912.png", side: "left" },
  { year: 1915, title: "Convênio com a Fundação Rockefeller", description: "Parceria entre o Governo do Estado de SP e a Fundação Rockefeller.", image: "../hc/1915.png", side: "right" },
  { year: 1934, title: "USP e Vinculação da Faculdade", description: "Fundação da USP e vinculação da Faculdade de Medicina.", image: "../hc/1934.jpg", side: "left" },
  { year: 1944, title: "Inauguração do Hospital das Clínicas (ICHC)", description: "Início das atividades do Instituto Central.", image: "/assets/hc/1944.jpg", side: "right" },
  { year: 1952, title: "IPq", description: "Inauguração do Instituto de Psiquiatria.", image: "/assets/hc/1952.jpg", side: "left" },
  { year: 1953, title: "IOT", description: "Inauguração do Instituto de Ortopedia e Traumatologia.", image: "/assets/hc/1953.jpg", side: "right" },
  { year: 1960, title: "HAS", description: "Inauguração do Hospital Auxiliar de Suzano.", image: "/assets/hc/1960.jpg", side: "left" },
  { year: 1972, title: "PA", description: "Inauguração do Prédio da Administração.", image: "/assets/hc/1972.jpg", side: "right" },
  { year: 1975, title: "IMREA", description: "Inauguração do Instituto de Medicina Física e Reabilitação.", image: "/assets/hc/1975.jpg", side: "left" },
  { year: 1976, title: "ICr", description: "Inauguração do Instituto da Criança e do Adolescente.", image: "/assets/hc/1976.jpg", side: "right" },
  { year: 1977, title: "InCor", description: "Inauguração do Instituto do Coração.", image: "/assets/hc/1977.jpg", side: "left", url: "https://www.incor.usp.br/" },
  { year: 1978, title: "Fundação Zerbini", description: "Criação da Fundação Zerbini (FZ).", image: "/assets/hc/1978.jpg", side: "right" },
  { year: 1982, title: "CCR", description: "Inauguração do Centro de Convenções Rebouças.", image: "/assets/hc/1982.jpg", side: "left" },
  { year: 1986, title: "FFM", description: "Criação da Fundação Faculdade de Medicina.", image: "/assets/hc/1986.jpg", side: "right" },
  { year: 1994, title: "InRad", description: "Inauguração do Instituto de Radiologia.", image: "/assets/hc/1994.jpg", side: "left" },
  { year: 2008, title: "ICESP", description: "Inauguração do Instituto do Câncer do Estado de São Paulo.", image: "/assets/hc/2008.jpg", side: "right" },
  { year: 2009, title: "EEP", description: "Abertura da Escola de Educação Permanente.", image: "/assets/hc/2009.jpg", side: "left" },
  { year: 2015, title: "inovaHC | iCT", description: "Criação do Centro de Inovação.", image: "/assets/hc/2015.jpg", side: "right" },
  { year: 2017, title: "CEAC", description: "Criação do Centro de Atendimento ao Colaborador.", image: "/assets/hc/2017.jpg", side: "left" },
  { year: 2021, title: "LEPIC", description: "Inauguração do Laboratório de Ensino, Pesquisa e Inovação em Cirurgia.", image: "/assets/hc/2021.jpg", side: "right" },
  { year: 2022, title: "IPer", description: "Inauguração do Instituto Perdizes.", image: "/assets/hc/2022.jpg", side: "left" },
  { year: 2023, title: "HAS (gestão)", description: "HAS passou a ser gerido pela Secretaria Estadual de Saúde (SP).", image: "/assets/hc/2023.jpg", side: "right" },
  { year: 2024, title: "Pesquisa Clínica e Instituto Dr. Ovídio Pires de Campos", description: "Novos marcos para o complexo HCFMUSP.", image: "/assets/hc/2024.jpg", side: "left" }, // <-- CORREÇÃO: Vírgula adicionada aqui
  { year: 2025, title: "Instituto de Gestão e Saúde", description: "Mais do que um marco institucional, representa a importância de integrar assistência e gestão.", image: "/assets/hc/2024.jpg", side: "right" } // <-- CORREÇÃO: Ponto movido para dentro das aspas.
];

export default hcHistoryData;

export { hcHistoryData as HC_HISTORY };