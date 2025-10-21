// src/pages/BenefitsPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircle, PlayCircle, ChevronDown, ExternalLink, Gift } from 'lucide-react';

// --- DADOS DOS CARDS ---

const ceacServices = [
  { 
    title: "Serviço de Pronto Atendimento (durante a jornada de trabalho)", 
    content: "O Serviço de Pronto Atendimento oferece atendimento aos colaboradores que apresentem sintomas de doenças que necessitem de atendimento imediato durante sua jornada de trabalho. Em situações de doenças crônicas ou sintomas antigos, o Pronto Atendimento encaminhará o colaborador para atendimento em uma Unidade Básica de Saúde.\n\nEm situações de urgência e emergência de alta complexidade, os colaboradores serão encaminhados para atendimento de emergência nos Pronto Socorros do HCFMUSP.\n\nPara melhor atender os colaboradores, o serviço utiliza o Sistema de Classificação Manchester, que avalia a gravidade dos sintomas e prioriza os atendimentos.\nRecomendamos aos colaboradores que procurem o Pronto Atendimento sempre que apresentarem sintomas agudos e que dificultem suas atividades profissionais.\n\n<strong>Em que situações devo procurar o Pronto Atendimento?</strong>\n• Sintomas respiratórios;\n• Dores incapacitantes (cabeça, articulares ou musculares)\n• Ferimentos superficiais ou sangramentos ativos;\n• Dores torácicas ou abdominais;\n• Conjuntivite;\n• Diarreia e vômitos;\n• Sintomas agudos que prejudiquem a realização do seu trabalho;\n• Em caso de acidente de trabalho sem atendimento médico prévio;\n\n<strong>O que esse serviço não atende?</strong>\n• Troca de atestado;\n• Troca ou solicitação de receitas;\n• Emissão de laudo para o INSS;\n• Avaliação de retorno ao trabalho;\n• Em busca de encaminhamento ambulatorial;\n• Controle de diabetes e hipertensão;\n• Solicitação de exames ou check up;\n• Aplicação de vacinas;\n• Teste de gravidez ou pré-natal;\n• Paciente com diagnóstico confirmado COVID.\n\n<p class='mt-2'>A procura do Pronto Atendimento de forma correta garante um atendimento rápido e eficiente, diminuindo o tempo de espera.</p>\n\n<strong>Horário de funcionamento:</strong> 07h às 19h - (As senhas são distribuídas até as 18h).\n<strong>Telefones:</strong> 2661-2226 ou 2661-6893" 
  },
  { 
    title: "Atendimento Ambulatorial", 
    content: "Serviço disponível para situações específicas e de forma referenciada pela Medicina do Trabalho. O objetivo do atendimento é garantir o rastreamento e monitoramento de algumas doenças identificadas no perfil epidemiológico dos colaboradores de acordo com algumas linhas de cuidados e programas de saúde, são eles:\n\n• Rastreamento e Prevenção ao Câncer de Colo Retal;\n• Rastreamento e Prevenção ao Câncer de Mama;\n• Rastreamento e Prevenção ao Câncer de Colo de Útero;\n• Linha de Cuidado do Diabetes Mellitus;\n• Linha de Cuidado da Hipertensão Arterial;\n• Promoção à Saúde Mental.\n\nPara participar, o colaborador deverá realizar o seu exame periódico, quando for convocado de acordo com o cronograma para cada Instituto, pois nesse momento será convidado aos programas, conforme critérios da linha de cuidados.\nO serviço de Ambulatório do CeAC se destina-se ao atendimento dos pacientes cadastrados nos Programas de Saúde Corporativos.\n\nPara as necessidades de atendimento ambulatorial que não estiverem no escopo de atuação do ambulatório do CeAC descrito acima, o serviço conta com uma equipe de assistentes sociais que estarão à disposição para auxiliar no encaminhamento aos serviços do Centro de Referência de Saúde do seu bairro, ou atendimento no Centro de Saúde Escola Geraldo de Paula Souza, localizado na Av. Dr. Arnaldo, 925 – Sumaré - SP.\n\n<strong>Horário de funcionamento do ambulatório:</strong> de segunda a sexta, das 07h às 19h (Importante chegar com 30 minutos de antecedência).\nTodas as consultas são agendadas, faltas não comunicadas previamente poderão causar a exclusão do colaborador no programa de saúde ou linhas de cuidado.\n<strong>Telefones:</strong> 2661-2236 ou 2661-7586." 
  },
  { 
    title: "Serviço de Medicina do Trabalho", 
    content: "Serviço que consolida as relações entre a saúde dos colaboradores e o seu trabalho, visando a prevenção das doenças e dos acidentes e a promoção da saúde e da qualidade de vida.\n\n<strong>Como funciona?</strong>\nSeguindo as práticas determinadas pelo Programa de Controle Médico de Saúde Ocupacional (PCMSO), que representa a Norma Regulamentadora Nº 07 (NR 7) do Ministério do Trabalho e Emprego (MTE). O serviço atente:\n\n• Exame admissional;\n• Exame demissional;\n• Exame de retorno ao trabalho;\n• Exame de mudança de risco ocupacional;\n• Exame periódico;\n• Acompanhamento do programa de imunização;\n• Acompanhamento de licenças médicas recorrentes e afastamentos para o INSS;\n• Avaliação e acompanhamento dos acidentes de trabalho;\n• Avaliação para recomendação de trabalho compatível;\n• Programa de PCDs.\n\n<div class='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>\n  <h4 class='font-bold'>Você sabe o que é um exame periódico?</h4>\n  <p>Para seu atendimento, será necessário apresentar seu crachá institucional. Caso não esteja com ele, a recepção confirmará no sistema seu vínculo funcional garantindo assim seu atendimento.</p>\n  <p class='mt-2'><strong>Recomendações:</strong> sempre esteja com seu cartão SUS e se necessário, procure o Centro de Referência de Saúde do seu bairro, ou atendimento no Centro de Saúde Escola Geraldo de Paula Souza.</p>\n</div>"
  }
];

const otherBenefits = [
  { title: "Weelhub - Gympass", image: "/hc/wellhub.png", content: "Colaboradores que possuem o cartão Vale Alimentação Alelo e seus dependentes têm acesso ao plano corporativo (FFM) a uma extensa rede com mais de 30 mil academias e estúdios em todo o país, além de aulas ao vivo e on-line em mais de 700 modalidades esportivas, sessões com personal trainers e aplicativos completos de bem-estar com descontos exclusivos. O cadastro é feito no próprio site com o número do seu CPF. Clique na imagem para ser direcionado(a) à página.", link: "https://sites.google.com/hc.fm.usp.br/onboarding/benef%C3%ADcios-ao-colaborador?authuser=0#h.bz7ttlirtl5i" },
  { title: "Programa Ser Integral", image: "/hc/serintegral.png", content: "O Programa é uma jornada de autocuidado, de um novo e integrado olhar para a saúde e desenvolvimento humano dos colaboradores. O acesso aos conteúdos são realizados por meio de solicitação ao Centros de Gestão de Pessoas do seu Instituto, a partir da divulgação das novas turmas. Fique atento às comunicações das próximas turmas no seu e-mail: @hc.fm.usp.br." },
  { title: "Programa de Orientação às Gestantes", image: "/hc/gestantes.png", content: "O curso de orientação a gestante para funcionárias, extensivo a esposas de funcionários, ocorre duas vezes por ano visando acolher e orientar as futuras mamães por meio de vivências e troca de experiências. Com profissionais qualificados, as colaboradoras participam de aulas programadas e tiram suas dúvidas sobre o seu momento, resultando na melhoria da sua qualidade de vida e no acolhimento das gestantes durante este momento único de sua vida." },
  { title: "Programa Você Dialogando com o HC", image: "/hc/dialogando.png", content: "O programa tem por finalidade fortalecer as relações por meio da escuta qualificada e do diálogo. O acesso é por meio de um formulário, disponível na intranet, onde todos os colaboradores podem comunicar e serem acolhidos em possíveis situações de conflito no ambiente de trabalho. A partir da comunicação e da escuta qualificada, são adotadas corporativamente ações e condutas de melhorias. Para acessar a página da Intranet, você precisa estar logado com o e-mail @hc.fm.usp.br e em um computador com o domínio do HC.", link: "https://docs.google.com/forms/d/e/1FAIpQLSc5X7l4izp40oyFOwcdz7eKAY1qN-6jTnThf0lggs9S0KeBmw/viewform" },
  { title: "Centro de Desenvolvimento e Educação Infantil - CEDEI", image: "/hc/cedei.png", content: "O Centro de Desenvolvimento e Educação Infantil - CEDEI é uma creche exclusiva para os filhos(as) de funcionárias. Localizada no Prédio dos Ambulatórios, atende crianças de 3 a 36 meses, das empresas HC, FFM e FZ, extensivo também para alunas da FMUSP do 1° ano. O benefício propicia que as mamães e famílias tenham apoio no cuidado dos seus filhos, acompanhem de perto o desenvolvimento de seus pequenos, e local para o aleitamento materno das crianças até os 6 (seis) meses de idade. Na Intranet do Núcleo de Gestão de Pessoas (NGP) você terá detalhes sobre os passos para acionar o benefício." }
];

const devBenefits = [
    { title: "HCX - Experiência e Ensino", image: "/hc/hcx2.png", content: "Todos os colaboradores acessam os conteúdos de treinamentos obrigatórios e de desenvolvimento de hard e sofits skills para o seu aperfeiçoamento profissional de forma gratuita, por meio da Plataforma de Treinamento, disponível na Intranet. Clique na imagem para acessar. Além disso, a escola tem diversos cursos oferecidos também ao público externo, em que o colaborador tem descontos especiais.", link: "https://eep.hc.fm.usp.br/treinamentos/aia/" },
    { title: "Abrangência de Descontos HCX", content: "<strong>Alunos, ex-alunos do HCX; Alunos da Faculdade de Medicina da USP (FMUSP)/ Escola de Enfermagem da USP (EEUSP)/Faculdade de Saúde Pública (FSPUSP) - Graduandos Residentes e Pós Graduandos; Colaboradores do Complexo HCFMUSP/ Fundação Faculdade de Medicina (FFM)/ Fundação Zerbini (FZ)/ Secretaria Estadual da Saúde (SES). com oportunidade para filhos e cônjuges.</strong>\n\n<strong>Cursos à distância (EAD) de Atualização:</strong>\n• Alunos da FMUSP/EEUSP/FSPUSP e colaboradores do Complexo HCFMUP/FFM/FZ/SES, com oportunidade para filhos e cônjuges tem 50% de desconto;\n• Alunos e ex-alunos do HCX tem 25% de desconto.\n\n<strong>Especialização/MBA:</strong>\n• Alunos da FMUSP/EEUSP/FSPUSP - Graduandos Residentes e Pós Graduandos, colaboradores do Complexo HCFMUP/FFM/FZ/SES, com oportunidade para filhos e cônjuges, alunos e ex-alunos do HCX tem 15% de desconto.\n\n<strong>Cursos presenciais de Atualização:</strong>\n• Alunos da FMUSP/EEUSP/FSPUSP - Graduandos Residentes e Pós Graduandos, colaboradores do Complexo HCFMUP/FFM/FZ/SES, com oportunidade para filhos e cônjuges, alunos e ex-alunos do HCX tem 10% de desconto.\n\n<strong>Como solicitar o desconto?</strong>\nOs descontos deverão ser solicitados por e-mail: relacionamento.hcx@hc.fm.usp.br, ou telefone (11) 2661-3940." },
];

const partners = [
    { title: "Associação dos Servidores do Hospital das Clínicas", image: "/hc/ashc.png", content: "Disponível aos colaboradores HC, FFM e FZ, a Associação dos Servidores do HCFMUSP (ASHC) oferece uma gama de benefícios aos seus associados, incluindo clube de descontos especiais em produtos e serviços em empresas parceiras, acesso à programas de saúde e qualidade de vida, assistência médica e odontológica, colônia de férias, consultoria jurídica, entre outros. Você pode se associar presencialmente na Unidade, localizada ao lado do restaurante Flyght, ou nos postos de atendimento localizado nos Institutos. Clique na imagem para conhecer o site da Associação e mais detalhes sobre os benefícios.", link: "https://ashc.com.br/" },
    { title: "Produtos e Serviços", image: "/hc/ProdutoseServiços.png", content: "Na página da Intranet do HCFMUSP, você terá acesso a uma lista atualizada de todos os parceiros que oferecem descontos para os colaboradores HC, FFM e FZ em restaurantes, produtos e serviços, educação, qualidade de vida, turismo e entretenimento. Para acessar a página da Intranet, você precisa estar logado em um computador do complexo, na rede (internet) do HC." }
];

const AccordionItem = ({ title, content }: { title: string; content: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b last:border-b-0">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4 px-1">
                <span className="font-semibold text-lg text-gray-800">{title}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown className="text-brand-azure"/></motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pb-4 px-1 text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: content.replace(/•/g, "<br/>•") }} />
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default function BenefitsPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const moduleId = 'beneficios';
    const isCompleted = user?.completedModules?.includes(moduleId);

    return (
        <div className="max-w-5xl mx-auto space-y-16">
            <header className="text-center">
                 <Gift className="w-16 h-16 mx-auto text-brand-azure mb-4" />
                <h1 className="text-4xl font-extrabold text-gray-900">Benefícios ao Colaborador</h1>
                <p className="mt-2 text-lg text-gray-600">Conheça os programas e serviços pensados para você.</p>
            </header>

            <section className="grid md:grid-cols-2 gap-8 items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="text-2xl font-bold text-brand-dark mb-2">Centro de Atenção ao Colaborador (CeAC)</h2>
                    <p className="text-gray-700">O CeAC, localizado ao lado da quadra do Instituto de Psiquiatria (IPq), é responsável pelas ações de Medicina do Trabalho e Engenharia de Segurança - SESMT e pelos cuidados de saúde em doenças que dificultem ou inviabilizem a execução das atividades de trabalho. Oferece um serviço de Pronto atendimento para casos de sintomas agudos durante a jornada de trabalho e um Ambulatório referenciado pela Medicina do Trabalho, para garantir a saúde e segurança dos colaboradores na execução de suas funções.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <img src="/hc/ceac.png" alt="Centro de Atenção ao Colaborador" className="rounded-2xl shadow-lg w-full h-auto object-cover"/>
                </motion.div>
            </section>

            <section>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Confira os serviços do CeAC e como acessá-los:</h3>
                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    {ceacServices.map(item => <AccordionItem key={item.title} {...item} />)}
                </div>
            </section>

            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {otherBenefits.map((item, i) => (
                    <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-2xl shadow-lg border flex flex-col">
                        {item.link ? (
                            <a href={item.link} target="_blank" rel="noopener noreferrer"><img src={item.image} alt={item.title} className="rounded-lg h-32 w-full object-cover mb-4"/></a>
                        ) : (
                            <img src={item.image} alt={item.title} className="rounded-lg h-32 w-full object-cover mb-4"/>
                        )}
                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-2 flex-grow">{item.content}</p>
                        {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm mt-4 text-center">Acessar <ExternalLink className="inline w-4 h-4"/></a>}
                    </motion.div>
                 ))}
            </section>

            <section>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Desenvolvimento Técnico e Profissional</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    {devBenefits.map((item, i) => (
                        <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-2xl shadow-lg border">
                           {item.image && <a href={item.link} target="_blank" rel="noopener noreferrer"><img src={item.image} alt={item.title} className="rounded-lg h-32 w-full object-cover mb-4"/></a>}
                           <h4 className="font-bold text-gray-800">{item.title}</h4>
                           <div className="text-sm text-gray-600 mt-2 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: item.content.replace(/•/g, "<br/>•") }} />
                           {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm mt-4 text-center inline-block">Saiba Mais</a>}
                        </motion.div>
                    ))}
                 </div>
            </section>
            
            <section>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Parceiros</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    {partners.map((item, i) => (
                        <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-2xl shadow-lg border flex flex-col">
                           <a href={item.link} target="_blank" rel="noopener noreferrer">
                                <img src={item.image} alt={item.title} className="rounded-lg h-32 w-full object-cover mb-4"/>
                           </a>
                           <h4 className="font-bold text-gray-800">{item.title}</h4>
                           <p className="text-sm text-gray-600 mt-2 flex-grow">{item.content}</p>
                           {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm mt-4 text-center">Acessar <ExternalLink className="inline w-4 h-4"/></a>}
                        </motion.div>
                    ))}
                 </div>
            </section>

            <div className="text-center pt-8">
                {isCompleted ? (
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl">
                        <CheckCircle className="w-6 h-6" />
                        <span>Módulo Concluído!</span>
                    </div>
                ) : (
                    <button onClick={() => navigate('/benefits/quiz')} className="btn-primary text-lg px-10 py-4 flex items-center gap-2 mx-auto">
                        <PlayCircle className="w-5 h-5" />
                        Realizar Quiz para Concluir
                    </button>
                )}
            </div>
        </div>
    );
}