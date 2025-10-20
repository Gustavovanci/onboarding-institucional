export type HistoryItem = {
  year: number | string;
  title: string;
  description: string;
  image: string; // Caminho agora é obrigatório
  url?: string;
};

const hcHistoryData: HistoryItem[] = [
  { year: 1912, title: "Criação da Faculdade de Medicina e Cirurgia de São Paulo", description: "Sob a direção de Arnaldo Vieira de Carvalho.", image: "/hc/1912.png" },
{ year: 1915, title: "Convênio com a Fundação Rockefeller", description: "Firmado convênio entre o Governo do Estado de São Paulo e a Fundação Rockefeller.", image: "/hc/1915.png" },
{ year: 1934, title: "Fundação da USP", description: "Fundação da Universidade de São Paulo (USP), com a vinculação da Faculdade de Medicina.", image: "/hc/1934.png" },
{ year: 1944, title: "Inauguração do Hospital das Clínicas | ICHC", description: "Inauguração do Hospital das Clínicas da Faculdade de Medicina da USP | Instituto Central | ICHC.", image: "/hc/1944.png" },
{ year: 1952, title: "Inauguração do Instituto de Psiquiatria | IPq", description: "Inauguração do Instituto de Psiquiatria | IPq.", image: "/hc/1952.png" },
{ year: 1953, title: "Inauguração do IOT", description: "Inauguração do Instituto de Ortopedia e Traumatologia | IOT.", image: "/hc/1953.png" },
{ year: 1960, title: "Inauguração do Hospital Auxiliar de Suzano | HAS", description: "Inauguração do Hospital Auxiliar de Suzano | HAS.", image: "/hc/1960.png" },
{ year: 1972, title: "Inauguração do Prédio da Administração | PA", description: "Inauguração do Prédio da Administração | PA.", image: "/hc/1972.png" },
{ year: 1975, title: "Inauguração do IMREA", description: "Inauguração do Instituto de Medicina Física e Reabilitação | IMREA.", image: "/hc/1975.png" },
{ year: 1976, title: "Inauguração do ICr", description: "Inauguração do Instituto da Criança e do Adolescente | ICr.", image: "/hc/1976.png" },
{ year: 1977, title: "Inauguração do InCor", description: "Inauguração do Instituto do Coração | InCor.", image: "/hc/1977.png", url: "https://www.incor.usp.br/" },
{ year: 1978, title: "Criação da Fundação Zerbini | FZ", description: "Criação da Fundação Zerbini | FZ.", image: "/hc/1978.png" },
{ year: 1982, title: "Inauguração do Centro de Convenções Rebouças | CCR", description: "Inauguração do Centro de Convenções Rebouças | CCR.", image: "/hc/1982.png" },
{ year: 1986, title: "Criação da Fundação Faculdade de Medicina | FFM", description: "Criação da Fundação Faculdade de Medicina | FFM.", image: "/hc/1986.png" },
{ year: 1994, title: "Inauguração do InRad", description: "Inauguração do Instituto de Radiologia | InRad.", image: "/hc/1994.png" },
{ year: 2008, title: "Inauguração do ICESP", description: "Inauguração do Instituto do Câncer do Estado de São Paulo | ICESP.", image: "/hc/2008.png" },
{ year: 2009, title: "Abertura da Escola de Educação Permanente | EEP", description: "Abertura da Escola de Educação Permanente | EEP.", image: "/hc/2009.png" },
{ year: 2015, title: "Criação do Centro de Inovação | ICT", description: "Criação do Centro de Inovação | ICT.", image: "/hc/2015.png" },
{ year: 2017, title: "Criação do Centro de Atendimento ao Colaborador | CEAC", description: "Criação do Centro de Atendimento ao Colaborador | CEAC.", image: "/hc/2017.png" },
{ year: 2021, title: "Inauguração do LEPIC", description: "Inauguração do Laboratório de Ensino, Pesquisa e Inovação em Cirurgia | LEPIC.", image: "/hc/2021.png" },
{ year: 2022, title: "Inauguração do Instituto Perdizes | IPER", description: "Inauguração do Instituto Perdizes | IPER.", image: "/hc/2022.png" },
{ year: 2023, title: "Mudança na gestão do HAS", description: "Após 63 anos, o Hospital Auxiliar de Suzano (HAS) passou a ser gerido pela Secretaria Estadual de Saúde de São Paulo.", image: "/hc/2023.png" },
{ year: 2024,  title: "HCFMUSP faz 80 anos", description: "Referência de ensino, pesquisa, assistência e inovação, o Hospital das Clínicas da Faculdade de Medicina da USP (HCFMUSP) chega aos 80 anos.", image: "/hc/2024.png"},
{ year: 2025, title: "Inauguração do IGS", description: "Inauguração do Instituto de gestão e Saúde | IGS.", image: "/hc/2025.png" },

];

export default hcHistoryData;