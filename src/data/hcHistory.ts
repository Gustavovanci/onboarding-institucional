export type HistoryItem = {
  year: number | string;
  title: string;
  description: string;
  image: string; // Caminho agora é obrigatório
  url?: string;
};

const hcHistoryData: HistoryItem[] = [
  { year: 1912, title: "Criação da Faculdade de Medicina", description: "Fundada sob a direção de Arnaldo Vieira de Carvalho.", image: "/hc/1912.png" },
  { year: 1915, title: "Convênio com a Fundação Rockefeller", description: "Parceria entre o Governo do Estado de SP e a Fundação Rockefeller.", image: "/hc/1915.png" },
  { year: 1934, title: "USP e Vinculação da Faculdade", description: "Fundação da USP e vinculação da Faculdade de Medicina.", image: "/hc/1934.png" },
  { year: 1944, title: "Inauguração do Hospital das Clínicas (ICHC)", description: "Início das atividades do Instituto Central.", image: "/hc/1944.jpg" }, // Assumindo que você tem essa imagem
  // Adicione os outros itens aqui, garantindo que o `image` aponte para um arquivo em `public/`
  // Exemplo:
  { year: 1952, title: "IPq", description: "Inauguração do Instituto de Psiquiatria.", image: "/hc/placeholder.png" },
  { year: 1953, title: "IOT", description: "Inauguração do Instituto de Ortopedia e Traumatologia.", image: "/hc/placeholder.png" },
  { year: 1977, title: "InCor", description: "Inauguração do Instituto do Coração.", image: "/hc/placeholder.png", url: "https://www.incor.usp.br/" },
  { year: 2008, title: "ICESP", description: "Inauguração do Instituto do Câncer do Estado de São Paulo.", image: "/hc/placeholder.png" },
  { year: 2024, title: "Pesquisa Clínica e Instituto Dr. Ovídio Pires de Campos", description: "Novos marcos para o complexo HCFMUSP.", image: "/hc/placeholder.png" },
];

export default hcHistoryData;