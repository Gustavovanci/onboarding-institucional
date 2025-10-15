// seed-firestore.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

// --- VERSÃO DO SCRIPT: v5.1 (Refatoração Boas-Vindas) ---
console.log('--- EXECUTANDO SCRIPT DE SEED v7.0 ---');

const modulesData = [
  // MÓDULO 1: Nossa História
  {
    id: 'nossa-historia',
    data: {
      title: 'Módulo 1: Nossa História',
      description: 'Navegue pelos marcos que moldaram o ensino, a pesquisa e a assistência no país.',
      category: 'Cultura e Pessoas',
      estimatedMinutes: 10,
      points: 100,
      order: 1, // Ordem correta
      isRequired: true,
      imageUrl: '/images/modules/modulo-historia.jpg'
    },
    content: [], // Conteúdo visual agora está na página HistoryPage.tsx
    quiz: [
        { order: 1, question: 'Qual foi o marco inicial da história da Faculdade de Medicina da USP?', options: ['Criação da Fundação Rockefeller em 1915', 'Criação da Faculdade de Medicina e Cirurgia de São Paulo em 1912', 'Fundação da Universidade de São Paulo (USP) em 1934', 'Inauguração do Hospital das Clínicas em 1944'], correct: 1, explanation: 'A história começa em 1912, quando foi criada a Faculdade de Medicina e Cirurgia de São Paulo, sob a direção de Arnaldo Vieira de Carvalho. Esse foi o embrião que, anos depois, se tornaria parte da USP e daria origem ao Complexo Hospital das Clínicas.' },
        { order: 2, question: 'Em que ano foi inaugurado o Instituto do Coração (InCor)?', options: ['1976', '1977', '1978', '1982'], correct: 1, explanation: 'O InCor (Instituto do Coração) foi inaugurado em 1977, marcando um avanço importante na cardiologia e cirurgia cardíaca no Brasil. Logo em seguida, em 1978, foi criada a Fundação Zerbini (FZ), que deu suporte técnico e científico ao instituto.' },
        { order: 3, question: 'O que aconteceu com o Hospital Auxiliar de Suzano (HAS) em 2023?', options: ['Foi reinaugurado com o nome de Instituto Perdizes', 'Passou a ser administrado pela Secretaria Estadual de Saúde de São Paulo', 'Foi incorporado ao Instituto do Câncer do Estado de São Paulo (ICESP)', 'Encerrado definitivamente e demolido'], correct: 1, explanation: 'Após 63 anos de história dentro do Complexo HCFMUSP, o Hospital Auxiliar de Suzano (HAS) deixou de ser gerido pela Faculdade de Medicina/HC e passou para a Secretaria Estadual de Saúde de São Paulo, marcando uma mudança administrativa importante.' },
    ]
  },
  // MÓDULO 2: Crachá de Identificação
  {
    id: 'cracha-identificacao',
    data: {
      title: 'Módulo 2: Crachá de Identificação',
      description: 'Entenda a importância e as regras de uso do seu crachá profissional.',
      category: 'Normas Institucionais',
      estimatedMinutes: 5,
      points: 100,
      order: 2, // Ordem ajustada
      isRequired: true,
      imageUrl: '/images/modules/modulo-01.jpg'
    },
    content: [
      { id: 'texto-1', order: 1, title: 'Seu Crachá de Identificação', type: 'text', content: 'Você receberá um crachá de identificação profissional. Este crachá é liberado para acessar as portarias principais dos Institutos. Mantenha-o sempre visível aos pacientes, porteiros e seguranças que zelam pela nossa segurança de uma forma geral.' },
      { id: 'texto-2', order: 2, title: 'Diretrizes Institucionais', type: 'text', content: '• O uso do crachá é obrigatório, pessoal e intransferível durante a permanência na Instituição. Deve ser fixado na altura do peito, em local visível a todos.\n• É proibido o empréstimo e a troca de crachá para qualquer finalidade.\n• O crachá será entregue mediante assinatura do Termo de Recebimento. Nos casos de entrega de um novo crachá, o anterior deve ser recolhido e desprezado.\n• Nos casos de desligamento, os crachás devem ser entregues aos Centros de Gestão de Pessoas do Instituto.' }
    ],
    quiz: [
      { order: 1, question: 'O crachá de identificação profissional deve ser usado:', options: ['Guardado no bolso para evitar perda', 'Entregue à recepção ao final do expediente', 'Na altura do peito, visível a todos', 'Somente durante reuniões'], correct: 2, explanation: 'O crachá deve estar sempre visível na altura do peito para identificação por pacientes, porteiros e seguranças.' },
      { order: 2, question: 'É permitido emprestar ou trocar o crachá com outro colaborador?', options: ['Sim, em casos emergenciais', 'Sim, se for do mesmo setor.', 'Não, o crachá é pessoal e intransferível.', 'Apenas com autorização verbal do gestor.'], correct: 2, explanation: 'O crachá é de uso exclusivo do titular. É proibido o empréstimo ou troca em qualquer circunstância, pois ele é um documento de identificação institucional e de controle de acesso.'},
      { order: 3, question: 'O que deve ser feito com o crachá em caso de desligamento ou fim de contrato?', options: ['Guardá-lo como lembrança.','Entregá-lo ao Centro de Gestão de Pessoas do Instituto.' , ' Jogá-lo fora após sair.'], correct: 1, explanation: 'Em casos de desligamento ou rompimento de contrato, o crachá deve ser recolhido pelo Centro de Gestão de Pessoas.' },
    ]
  },
  // MÓDULO 3: Uso de Sistemas Corporativos
  {
    id: 'sistemas-corporativos',
    data: {
      title: 'Módulo 3: Uso de Sistemas Corporativos',
      description: 'Regras para acesso e uso dos sistemas internos do HCFMUSP.',
      category: 'Tecnologia',
      estimatedMinutes: 7,
      points: 100,
      order: 3, // Ordem ajustada
      isRequired: true,
      imageUrl: '/images/modules/modulo-02.jpg'
    },
    content: [
        { id: 'texto-1', order: 1, title: 'Acesso aos Sistemas', type: 'text', content: 'A liberação e o acesso aos sistemas corporativos estão condicionados ao seu cadastro como colaborador, e-mail corporativo e senha (que se tornará o seu login) e às atividades que você irá exercer.' },
        { id: 'texto-2', order: 2, title: 'Responsabilidade Pessoal', type: 'text', content: 'Os acessos se dão por meio da formalização do seu responsável técnico, mediante o seu vínculo com a Instituição, empresa contratante, ou Centro de Gestão de Pessoas do Instituto em que você irá atuar.'},
        { id: 'texto-3', order: 3, title: 'Lembre-se', type: 'text', content: 'seu login e senha é de uso pessoal e intransferível. A responsabilidade dos acessos e manuseio das informações devem reservar-se exclusivamente à sua atividade no HCFMUSP, conforme orientação do seu responsável técnico.' },
    ],
    quiz: [
        { order: 1, question: 'O acesso aos sistemas corporativos depende de:', options: ['Solicitação verbal ao técnico responsável', 'Cadastro como colaborador, e-mail corporativo e senha', 'Qualquer login válido do HCFMUSP', 'Permissão do porteiro ou segurança'], correct: 1, explanation: 'O acesso só é liberado após cadastro formal, criação de e-mail e senha pessoal vinculada à sua função.' },
        { order: 2, question: 'O que fazer em caso de dúvidas sobre acesso aos sistemas corporativos?', options: ['Procurar ajuda de outro colaborador.', 'Tentar acessar com outro login.', 'Entrar em contato com o Centro de Gestão de Pessoas do Instituto.', 'Criar uma nova conta pessoal para uso temporário.'], correct: 2, explanation: 'Em caso de dúvidas ou problemas de acesso, o colaborador deve procurar o Centro de Gestão de Pessoas do Instituto onde atua, responsável por orientar e regularizar os cadastros institucionais.'},
        { order: 3, question: 'O login e a senha corporativos podem ser compartilhados com colegas da equipe?', options: ['Sim, se for para agilizar o trabalho.', 'Apenas em casos emergenciais.', 'Não, são de uso pessoal e intransferível.', 'Somente com autorização verbal do gestor.'], correct: 2, explanation: 'O login e a senha são de uso pessoal e intransferível. Cada colaborador é responsável pelos acessos e manuseio das informações sob sua conta, garantindo segurança e rastreabilidade no sistema.'},

    ]
  },
  // MÓDULO 4: Política de Segurança da Informação
  {
    id: 'seguranca-informacao',
    data: {
      title: 'Módulo 4: Política de Segurança da Informação',
      description: 'Diretrizes essenciais sobre a LGPD e o tratamento de dados na instituição.',
      category: 'Segurança',
      estimatedMinutes: 10,
      points: 100,
      order: 4, // Ordem ajustada
      isRequired: true,
      imageUrl: '/images/modules/modulo-03.jpg'
    },
    content: [
      { id: 'texto-1', order: 1, title: 'Sua Responsabilidade com os Dados (LGPD)', type: 'text', content: 'Ajude-nos a manter a excelência na preservação de informações, de acordo com a Lei Geral de Proteção de Dados (LGPD). As informações e os ambientes tecnológicos são de exclusiva propriedade do HCFMUSP e devem ser tratadas de forma ética e sigilosa.' },
      { id: 'texto-2', order: 2, title: 'Diretrizes Institucionais', type: 'text', content: 'Aplica-se a todos os colaboradores: concursados, estagiários, residentes, voluntários e prestadores de serviços.\n• Somente usuários autorizados devem possuir acesso às informações do HCFMUSP e de seus pacientes;\n• As informações, em formato físico ou lógico, e os ambientes tecnológicos utilizados pelos usuários são de exclusiva propriedade do HCFMUSP, não podendo ser interpretadas como de uso pessoal;\n• As informações de pacientes devem ser tratadas de forma ética e sigilosa, de acordo com as diretrizes estabelecidas pela Lei Geral de Proteção de Dados (Lei 13.709, de 14/08/2018);\n• Todos os usuários devem ter ciência de que o uso das informações e dos sistemas de informação podem ser monitorados, sem aviso prévio, e que os registros assim obtidos podem servir de evidência para a aplicação de medidas disciplinares;\n• Todos os usuários devem possuir uma identificação única, pessoal e intransferível, que seja capaz de qualificá-lo como responsável por suas ações;\n• Os acessos devem sempre obedecer ao critério de menor privilégio, no qual os usuários devem possuir somente as permissões necessárias para a execução de suas atividades;\n• Informações confidenciais, como senhas e/ou qualquer informação à qual o usuário possua acesso durante o exercício do seu cargo, devem sempre ser mantidas de forma secreta, sendo terminantemente proibido seu compartilhamento;\n• A informação deve ser utilizada de forma transparente e apenas para a finalidade para a qual foi coletada e/ou para uso estatístico, sem expor os pacientes de forma identificável, conforme a LGPD (Lei Geral de Proteção de Dados);\n• Toda informação produzida ou recebida pelos usuários como resultado da atividade profissional contratada pelo HCFMUSP pertence à referida instituição. As exceções devem ser explícitas e formalizadas em contrato entre as partes;\n• Esta Política de Segurança da Informação é obrigatória para todos os usuários, independentemente do nível hierárquico ou função no Complexo, bem como de vínculo empregatício ou prestação de serviço;\n• O não cumprimento dos requisitos previstos nesta Política de Segurança da Informação e das Normas de Segurança da Informação acarretará violação às regras internas da instituição e sujeitará o usuário às medidas administrativas e legais cabíveis.' }
    ],
    quiz: [
      { order: 1, question: 'Segundo a política institucional, quem é o dono das informações e dos sistemas utilizados?', options: ['O colaborador que os criou', 'O paciente titular dos dados', 'O HCFMUSP', 'O responsável técnico do setor'], correct: 2, explanation: 'Todo o conteúdo gerado no exercício profissional pertence ao HCFMUSP, e não ao colaborador.' },
      { order: 2, question: 'Quem deve ter acesso às informações e sistemas do HCFMUSP?', options: ['Apenas usuários autorizados conforme suas funções;', 'Qualquer colaborador que precisar em um momento específico;', 'Somente gestores e responsáveis técnicos;','Todos os profissionais da área da saúde.'], correct: 0, explanation: 'Apenas usuários autorizados devem possuir acesso às informações do HCFMUSP, conforme suas funções e responsabilidades institucionais.'},
      { order: 3, question: 'O compartilhamento de senhas entre colegas é permitido?', options: ['Sim, quando há confiança entre os profissionais;','Não, é terminantemente proibido;','Somente em casos emergenciais;','Apenas se autorizado verbalmente pelo gestor.'],correct: 1, explanation: 'O compartilhamento de senhas é terminantemente proibido. Cada usuário é responsável por suas ações e deve manter suas credenciais em sigilo absoluto.'},
    ]
  },
  // MÓDULO 5: E-mail e Sistemas de Comunicação
  {
    id: 'email-sistemas',
    data: {
      title: 'Módulo 5: E-mail e Sistemas de Comunicação',
      description: 'Aprenda a usar as principais ferramentas de comunicação, como e-mail, Intranet e portais.',
      category: 'Comunicação',
      estimatedMinutes: 15,
      points: 200,
      order: 5, // Ordem ajustada
      isRequired: true,
      imageUrl: '/images/modules/modulo-05.jpg'
    },
    content: [
      { id: 'texto-1', order: 1, title: 'E-mail Institucional', type: 'text', content: 'Seu e-mail @hc.fm.usp.br é a principal ferramenta de comunicação. É uma conta corporativa que pode ser monitorada e deve ser usada apenas para atividades profissionais. Sua senha é pessoal e intransferível.' },
      { id: 'texto-2', order: 2, title: 'Diretrizes Institucionais para o bom uso do e-mail', type: 'text', content: 'A conta deste e-mail é corporativa e poderá ser monitorada a qualquer momento.\n• Use-a apenas para atividades relacionadas com a sua atividade no HC.\n• A sua senha é pessoal, intransferível e de sua total responsabilidade.\n• Para alterações e atualizações no seu e-mail, consulte o Centro de Gestão de Pessoas do seu Instituto de atuação sobre o fluxo pertinente.'},
      { id: 'texto-3', order: 3, title: 'A Intranet, você acessa somente quando estiver no HCFMUSP', type: 'text', content: 'A Intranet do HCFMUSP contém informações sobre a estrutura organizacional, processos e a publicação de documentos oficiais que regulamentam os serviços.' },
      { id: 'texto-4', order: 4, title: 'Portal do Colaborador, Gestor e Operador', type: 'text', content: 'Por meio deste portal, você, seu gestor e o Centros de Gestão de Pessoas do seu Instituto de atuação tem acesso às suas informações profissionais. Ainda estamos em implantação, porém alguns processos dos colaboradores HC já estão sendo realizados por meio dele. É muito importante que você esteja atento(a) às comunicações via e-mail para acompanhar as fases de implantação.' },
      { id: 'texto-5', order: 5, title: 'GLPI - Sistema de Chamados Internos (TI - Corporativo )', type: 'text', content: 'Por meio deste sistema, você poderá requisitar ao Núcleo de Tecnologia e Informação (NETi) a liberação de acessos, manutenção e soluções de problemas com sistemas e equipamentos.'},
      { id: 'texto-6', order: 6, title: 'GLPI - Sistema de Chamados Internos (Fale com o RH - Corporativo )', type: 'text', content: 'Por meio deste sistema, você poderá registrar dúvidas, elogios, reclamações e sugestões para o seu RH local. A gestão estratégica deste canal é realizada pelo Núcleo de Gestão de Pessoas, para garantir a atualização das informações e oportunidades de melhorias nos processos relacionados à Pessoas.'},
    ],
    quiz: [
      { order: 1, question: 'A Intranet do HCFMUSP pode ser acessada:', options: ['De qualquer local, sem restrições', 'Apenas quando o colaborador estiver no HCFMUSP', 'Somente por gestores', 'Apenas pelo celular'], correct: 1, explanation: 'A Intranet é um sistema interno, acessível somente dentro da rede do HCFMUSP.' },
      { order: 2, question: 'O e-mail institucional do HCFMUSP deve ser usado para:', options:['Qualquer tipo de comunicação pessoal ou profissional' , 'Apenas atividades relacionadas às suas funções no HC' , 'Compartilhar informações externas e pessoais' , 'Divulgar eventos não institucionais'], correct: 2, explanation: 'O e-mail institucional é corporativo e pode ser monitorado. Deve ser usado exclusivamente para fins profissionais e relacionados às atividades do HC.'},
      { order: 3, question: 'Onde você pode encontrar informações sobre estrutura organizacional, processos e documentos oficiais do HCFMUSP?', options:['No Portal do Colaborador', 'No GLPI/RH', 'Na Intranet', 'No e-mail institucional'], correct: 2, explanation: 'A Intranet é o espaço para acessar informações institucionais e documentos oficiais, disponível apenas dentro do HCFMUSP.'},
      { order: 4, question: 'Qual sistema deve ser utilizado para solicitar suporte de tecnologia, como manutenção e acessos?', options: [ 'Portal do Colaborador', 'GLPI/TI (Corporativo)' , 'GLPI/RH (Corporativo)' , 'E-mail institucional'], correct: 1, explanation: 'O GLPI/TI é o sistema usado para abrir chamados técnicos relacionados a tecnologia, sistemas e equipamentos.'},
      { order: 5, question: 'O Portal do Colaborador serve para:', options:[ 'Solicitar suporte técnico',  'Acompanhar informações profissionais e processos de RH' , 'Publicar documentos oficiais', 'Atualizar informações da Intranet'], correct: 1, explanation: 'O Portal do Colaborador, Gestor e Operador permite que você e o setor de gestão de pessoas acompanhem dados profissionais e processos de RH, que estão sendo implantados gradualmente.'},
    ]
  },
  // MÓDULO 6: Serviço Voluntário
  {
    id: 'servico-voluntario',
    data: {
      title: 'Módulo 6: Serviço Voluntário',
      description: 'Entenda as regras e diretrizes para a atuação como voluntário no HCFMUSP.',
      category: 'Normas Institucionais',
      estimatedMinutes: 10,
      points: 50,
      order: 6, // Ordem ajustada
      isRequired: true,
      imageUrl: '/images/modules/modulo-04.jpg'
    },
    content: [
      { id: 'texto-1', order: 1, title: 'O Que É o Serviço Voluntário?', type: 'text', content: 'Considera-se o serviço voluntário a atividade espontânea não remunerada prestada ao HCFMUSP por pessoa física, maior e capaz, não gerando vínculo empregatício, nem obrigação de natureza trabalhista, previdenciária ou a fim.' },
      { id: 'texto-2', orde: 2, title: 'O voluntário pode ser classificado:', type: 'text', content: '• Profissional da área da saúde;\n• Profissional da área não assistencial;\n• Profissional vinculado à Projeto de Pesquisa;\n• Profissionais de práticas integrativas e complementares em saúde.\n• Ações Ecumênicas - CARE.\n• Ações Socais - AVOHC. '},   
      { id: 'texto-3', order: 3, title: 'Diretrizes Institucionais', type: 'text', content: '• O período mínimo de atuação é maior que 30 dias.\n• O VOLUNTÁRIO poderá atuar no âmbito do HCFMUSP, em atividades de assistência, de apoio (não assistencial), de pesquisa, praticas integrativas e complementares em saúde, ecumênicas (religiosas) ou sociais.\n •O VOLUNTÁRIO de assistência ou de pesquisa deverá ter a anuência do Responsável Técnico por sua categoria profissional e do dirigente da unidade/pesquisador responsável do local onde pretende atuar.\n•O VOLUNTÁRIO de pesquisa deverá ser regulados pela ordem de serviço, ainda que sejam pesquisadores bolsistas por Instituição de Fomento.\n•O serviço voluntário não equivale e nem substitui os estágios de graduação ou pós-graduação lato sensu, stricto sensu ou cursos de extensão universitária, sendo vedada a emissão de atestados, certificados ou declarações a esse título.\n• \n•É vedado ao voluntário substituir profissionais efetivos ou exercer cargos de liderança.\n• Profissionais com vínculo celetista (HC ou Fundações) não podem exercer serviço voluntário.\n• O voluntário recebe um crachá corporativo após a celebração do Termo de Adesão.' },
      { id: 'texto-4', order: 4, title: 'Cabe aos Voluntários', type: 'text', content: '• O cumprimento dos compromissos assumidos como VOLUNTÁRIO com a área, sendo assíduo e pontual nos dias definidos para o serviço voluntário.\n Justificar ausências.\n Manter atualizado endereço, e-mail e telefone de contato.\n Comunicar à área com antecedência em casos de afastamento ou desligamento para  fins de bloqueio de acessos.\n Entregar semestralmente relatório de atividades para o Responsável Técnico da categoria profissional e para o Dirigente/Pesquisador Responsável da área de atuação.'},
      { id: 'texto-5', order: 5, title: 'Cabe ao Responsável Técnico da categoria profissional do voluntário e ao Dirigente da Unidade onde o voluntário realizará suas atividades:', type: 'text', content: 'Estabelecer o Plano de Trabalho das atividades que serão exercidas.\n Definir carga horária, jornada semanal e período da atividade do VOLUNTÁRIO.\n Especificar a área em que o profissional irá atuar, para fins de classificação de centro de custo.\n Informar a especialização do profissional assistencial para fins de identificação de CBO.\n Manifestar-se anualmente quanto à permanência do VOLUNTÁRIO, no caso de prorrogação do período de sua atividade por mais um ano.\n Comunicar imediatamente o fim do serviço antes do encerramento do Termo de adesão e recolhimento do crachá corporativo.\n Acompanhar as atividades realizadas pelo voluntário por meio de relatório de acompanhamento trimestral.\n Responsabilizar-se pelas atividades e ações do Voluntário.'},

    ],
    quiz: [
        { order: 1, question: 'O serviço voluntário no HCFMUSP é:', options: ['Uma forma de estágio remunerado', 'Uma atividade espontânea e não remunerada', 'Um contrato de trabalho temporário', 'Uma bolsa de pesquisa obrigatória'], correct: 1, explanation: 'O voluntariado não gera vínculo trabalhista nem remuneração.' },
    ]
  },
  // CARD BÔNUS HCX (NO FINAL)
  {
    id: 'hcx-plataforma',
    data: {
      title: 'HCX - Cursos Obrigatórios',
      description: 'Acesse a plataforma de cursos e desenvolvimento do HCFMUSP para seus treinamentos obrigatórios.',
      category: 'Desenvolvimento',
      estimatedMinutes: 2,
      points: 0,
      order: 7, // Ordem ajustada
      isRequired: false,
      imageUrl: '/images/modules/modulo-hcx.jpg',
      url: 'https://hcx.fm.usp.br/login'
    },
    content: [],
    quiz: []
  },
];

// CONTEÚDO PARA PÁGINAS ESTÁTICAS (agora preenchido)
const contentPagesData = [
  {
      id: 'quem-somos',
      data: {
          title: 'Quem Somos',
          content: `
            <div class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg"><h3>Missão/Causa</h3><p class="mt-2 text-gray-700">Fazer o melhor para as pessoas, com as pessoas!</p></div>
              <div class="bg-green-50 border border-green-200 p-4 rounded-lg"><h3>Visão</h3><p class="mt-2 text-gray-700">Ser uma Instituição de excelência, reconhecida nacional e internacionalmente em Ensino, Pesquisa, Assistência e Inovação.</p></div>
              <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg"><h3>Valores</h3><ul class="list-disc list-inside mt-2 text-gray-700"><li>Ética</li><li>Humanismo</li><li>Responsabilidade Social</li><li>Pluralismo</li><li>Pioneirismo</li><li>Compromisso Institucional</li></ul></div>
            </div>
          `
      }
  },
  {
      id: 'beneficios',
      data: {
          title: 'Benefícios ao Colaborador',
          content: `
            <div class="prose max-w-none">
              <h2>Centro de Atenção ao Colaborador (CeAC)</h2>
              <p>O CeAC, localizado ao lado da quadra do Instituto de Psiquiatria (IPq), é responsável pelas ações de Medicina do Trabalho e Engenharia de Segurança - SESMT e pelos cuidados de saúde em doenças que dificultem ou inviabilizem a execução das atividades de trabalho.</p>
              
              <h3>Serviço de Pronto Atendimento (durante a jornada de trabalho)</h3>
              <p>Oferece atendimento aos colaboradores que apresentem sintomas de doenças que necessitem de atendimento imediato durante sua jornada de trabalho. Em situações de doenças crônicas ou sintomas antigos, o Pronto Atendimento encaminhará o colaborador para atendimento em uma Unidade Básica de Saúde.</p>
              <p><strong>Horário de funcionamento:</strong> 07h às 19h - (As senhas são distribuídas até as 18h).</p>
              <p><strong>Telefones:</strong> 2661-2226 ou 2661-6893</p>

              <hr/>
              <h2>DESENVOLVIMENTO TÉCNICO E PROFISSIONAL</h2>
              <h3>HCX - Experiência e Ensino</h3>
              <p>Todos os colaboradores acessam os conteúdos de treinamentos obrigatórios e de desenvolvimento de hard e sofits skills para o seu aperfeiçoamento profissional de forma gratuita, por meio da Plataforma de Treinamento, disponível na Intranet.</p>
              <a href="https://hcx.fm.usp.br" target="_blank">Clique na imagem para acessar.</a>

              <hr/>
              <h2>PARCEIROS</h2>
              <h3>Associação dos Servidores do Hospital das Clínicas</h3>
              <a href="https://ashc.com.br/" target="_blank" rel="noopener noreferrer">
                <p>Disponível aos colaboradores HC, FFM e FZ, a Associação dos Servidores do HCFMUSP (ASHC) oferece uma gama de benefícios aos seus associados...</p>
              </a>
            </div>
          `
      }
  },
  {
      id: 'comunicacao',
      data: {
          title: 'Canais de Comunicação',
          content: `
            <div class="prose max-w-none">
              <a href="https://servicosngp.hc.fm.usp.br/" target="_blank" rel="noopener noreferrer"><h2>Fale com o RH Corporativo</h2></a>
              <p>Você e o seu Responsável Técnico (Gestor/Liderança) podem entrar em contato a qualquer momento para esclarecimentos de dúvidas, sugestões e elogios pelo Canal corporativo Fale com o RH.</p>
              
              <h2>Centros de Gestão de Pessoas</h2>
              <p>Em cada Instituto, atua um Centro de Gestão de Pessoas (CGP) que faz o atendimento dos seus respectivos colaboradores.</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="bg-gray-100 p-4 rounded-lg"><strong>Instituto do Câncer (ICESP):</strong> 6º andar, 07h às 17h</div>
                <div class="bg-gray-100 p-4 rounded-lg"><strong>Instituto Central (ICHC):</strong> 8º andar, 07h às 16h</div>
                <div class="bg-gray-100 p-4 rounded-lg"><strong>Instituto da Criança (ICr):</strong> Portaria 2, 2º andar, 07h às 16h</div>
                <div class="bg-gray-100 p-4 rounded-lg"><strong>Instituto do Coração (InCor):</strong> Bloco I, 2º andar, 07h às 16h</div>
                <div class="bg-gray-100 p-4 rounded-lg"><strong>Instituto de Ortopedia e Traumatologia (IOT):</strong> Térreo, sala 209, 07h às 16h</div>
                <div class="bg-gray-100 p-4 rounded-lg"><strong>Instituto de Psiquiatria (IPq):</strong> 1° andar- Ala Sul, sala 81, 07h às 16h</div>
              </div>
            </div>
          `
      }
  },
  {
      id: 'inovahc',
      data: {
          title: 'InovaHC',
          content: `
            <div class="prose max-w-none text-center">
                <h2>O InovaHC é o Núcleo de Inovação Tecnológica do Hospital das Clínicas da FMUSP</h2>
                <p>Desde 2015, somos agentes de transformação, conectando pesquisadores, empreendedores, colaboradores e parceiros para criar soluções que geram impacto real na saúde do Brasil. Nosso propósito é transformar conhecimento em inovação aplicada, contribuindo para a melhoria da qualidade de vida das pessoas e para a sustentabilidade do sistema de saúde.</p>
                <h3>O que fazemos:</h3>
                <ul class="list-disc list-inside inline-block text-left">
                    <li>Viabilizamos soluções e negócios inovadores para o HCFMUSP e para o sistema de saúde.</li>
                    <li>Promovemos a cultura de inovação e o empreendedorismo científico.</li>
                    <li>Mapeamos desafios reais do setor de saúde.</li>
                    <li>Codesenvolvemos e validamos tecnologias em ambiente de referência.</li>
                    <li>Conectamos o ecossistema de inovação em saúde no Brasil e no mundo.</li>
                </ul>
                <div class="aspect-video my-8"><iframe class="w-full h-full" src="https://www.youtube.com/embed/H8nIFk_bLbc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                <a href="https://inovahc.com.br/" target="_blank" rel="noopener noreferrer" class="inline-block mt-4">
                    <img src="/images/inovahc-logo.png" alt="Logo InovaHC" class="mx-auto h-24">
                </a>
            </div>
          `
      }
  }
];

// --- LÓGICA DO SCRIPT ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let creds;
try {
  const saPath = path.join(__dirname, 'vital-novo-2-firebase-adminsdk-fbsvc-ddd9a057c1.json');
  if (fs.existsSync(saPath)) {
    creds = JSON.parse(fs.readFileSync(saPath, 'utf-8'));
  } else {
    throw new Error(`Arquivo de credenciais não encontrado: ${saPath}.`);
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(creds),
      projectId: creds.project_id,
    });
    console.log(`🚀 Firebase Admin inicializado para o projeto: ${creds.project_id}`);
  }
} catch (e) {
  console.error('❌ Erro fatal ao inicializar Firebase Admin:', e.message);
  process.exit(1);
}

const db = admin.firestore();

async function seedDatabase() {
  console.log('\n🧹 Limpando coleções...');
  const collectionsToClear = ['modules', 'content'];
  for (const coll of collectionsToClear) {
    await deleteCollection(db.collection(coll));
    console.log(` -> Coleção "${coll}" limpa.`);
  }

  console.log('\n📝 Populando coleção "modules"...');
  for (const module of modulesData) {
    const { id, data, content, quiz } = module;
    const moduleRef = db.collection('modules').doc(id);
    await moduleRef.set({ ...data, createdAt: admin.firestore.FieldValue.serverTimestamp() });

    if (content?.length) {
      const batch = db.batch();
      content.forEach(item => batch.set(moduleRef.collection('content').doc(item.id || undefined), item));
      await batch.commit();
    }
    if (quiz?.length) {
      const batch = db.batch();
      quiz.forEach(item => {
        const docRef = moduleRef.collection('quiz').doc();
        batch.set(docRef, item);
      });
      await batch.commit();
    }
  }
  console.log(` -> ${modulesData.length} módulos populados.`);
  
  console.log('\n📝 Populando coleção "content"...');
  const contentPagesBatch = db.batch();
  for (const page of contentPagesData) {
      const { id, data } = page;
      contentPagesBatch.set(db.collection('content').doc(id), data);
  }
  await contentPagesBatch.commit();
  console.log(` -> ${contentPagesData.length} páginas de conteúdo populadas.`);

  console.log(`\n🎉 Migração concluída!`);
}

async function deleteCollection(collectionRef, batchSize = 100) {
    const query = collectionRef.limit(batchSize);
    
    while (true) {
      const snapshot = await query.get();
      if (snapshot.size === 0) {
        break;
      }
  
      const batch = collectionRef.firestore.batch();
      for (const doc of snapshot.docs) {
        const subcollections = await doc.ref.listCollections();
        for (const subcollection of subcollections) {
          await deleteCollection(subcollection, batchSize);
        }
        batch.delete(doc.ref);
      }
      await batch.commit();
    }
  }

seedDatabase().catch((err) => {
  console.error('💥 ERRO CRÍTICO durante a execução do script:', err);
  process.exit(1);
});