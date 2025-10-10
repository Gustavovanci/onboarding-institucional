// src/data/modules-js.js
export const modulesData = [
  {
    id: 'institucional',
    title: 'Institucional HC-FMUSP',
    description: 'Conheça nossa missão, visão, valores e diretrizes institucionais para 2030.',
    category: 'institucional',
    estimatedMinutes: 15,
    points: 100,
    order: 1,
    isRequired: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    content: [
      {
        id: 'inst-1',
        type: 'text',
        title: 'Nossa Missão',
        content: 'Fazer o melhor para as pessoas, com as pessoas!',
        order: 1,
      },
      {
        id: 'inst-2',
        type: 'text',
        title: 'Nossa Visão',
        content: 'Ser uma Instituição de excelência, reconhecida nacional e internacionalmente em Ensino, Pesquisa, Assistência e Inovação.',
        order: 2,
      },
      {
        id: 'inst-3',
        type: 'text',
        title: 'Nossos Valores',
        content: '• Ética\n• Humanismo\n• Responsabilidade Social\n• Pluralismo\n• Pioneirismo\n• Compromisso Institucional',
        order: 3,
      },
      {
        id: 'inst-4',
        type: 'text',
        title: 'Diretrizes 2030',
        content: 'De forma integrada, foram estabelecidas 6 diretrizes norteadoras 2030 para o Sistema FMUSP - HC.',
        order: 4,
      },
      {
        id: 'inst-quiz',
        type: 'quiz',
        title: 'Quiz - Conhecimentos Institucionais',
        content: JSON.stringify({
          questions: [
            {
              question: 'Qual é a missão do HC-FMUSP?',
              options: [
                'Ser a melhor instituição do Brasil',
                'Fazer o melhor para as pessoas, com as pessoas!',
                'Atender apenas casos complexos',
                'Formar médicos especialistas'
              ],
              correct: 1,
              explanation: 'Nossa missão é fazer o melhor para as pessoas, com as pessoas!'
            },
            {
              question: 'Quantas diretrizes norteadoras 2030 foram estabelecidas?',
              options: ['4', '5', '6', '7'],
              correct: 2,
              explanation: 'Foram estabelecidas 6 diretrizes norteadoras 2030.'
            }
          ]
        }),
        order: 5,
      },
    ],
  },

  {
    id: 'identificacao',
    title: 'Crachá e Identificação',
    description: 'Diretrizes para uso do crachá corporativo e identificação profissional.',
    category: 'identificacao',
    estimatedMinutes: 10,
    points: 75,
    order: 2,
    isRequired: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    content: [
      {
        id: 'id-1',
        type: 'text',
        title: 'Sobre o Crachá',
        content: 'Você receberá um crachá de identificação profissional. Este crachá é liberado para acessar as portarias principais dos Institutos. Mantenha-o sempre visível aos pacientes, porteiros e seguranças que zelam pela nossa segurança de uma forma geral.',
        order: 1,
      },
      {
        id: 'id-2',
        type: 'text',
        title: 'Diretrizes do Crachá',
        content: '• O uso do crachá é obrigatório, pessoal e intransferível durante a permanência na Instituição\n• Deve ser fixado na altura do peito, em local visível a todos\n• É proibido o empréstimo e a troca de crachá para qualquer finalidade\n• O crachá será entregue mediante assinatura do Termo de Recebimento\n• Em casos de desligamento, os crachás devem ser entregues ao Centro de Gestão de Pessoas',
        order: 2,
      },
      {
        id: 'id-quiz',
        type: 'quiz',
        title: 'Quiz - Identificação',
        content: JSON.stringify({
          questions: [
            {
              question: 'O crachá deve ser usado:',
              options: [
                'Apenas em reuniões importantes',
                'Somente durante o expediente',
                'Sempre que estiver na instituição, em local visível',
                'Apenas quando solicitado'
              ],
              correct: 2,
              explanation: 'O crachá é obrigatório e deve ser mantido sempre visível durante toda a permanência na instituição.'
            }
          ]
        }),
        order: 3,
      },
    ],
  },

  {
    id: 'sistemas',
    title: 'Sistemas e Segurança',
    description: 'Acesso aos sistemas corporativos e políticas de segurança da informação.',
    category: 'sistemas',
    estimatedMinutes: 20,
    points: 125,
    order: 3,
    isRequired: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    content: [
      {
        id: 'sys-1',
        type: 'text',
        title: 'Acesso aos Sistemas',
        content: 'A liberação e o acesso aos sistemas corporativos estão condicionados ao seu cadastro como colaborador, e-mail corporativo e senha (que se tornará o seu login) e às atividades que você irá exercer.',
        order: 1,
      },
      {
        id: 'sys-2',
        type: 'text',
        title: 'Diretrizes de Segurança',
        content: '• Somente usuários autorizados devem possuir acesso às informações do HCFMUSP\n• As informações são de exclusiva propriedade do HCFMUSP\n• Informações de pacientes devem ser tratadas com ética e sigilo (LGPD)\n• Seu login e senha são pessoais e intransferíveis\n• O uso dos sistemas pode ser monitorado sem aviso prévio\n• Acesso deve seguir o critério de menor privilégio',
        order: 2,
      },
    ],
  },

  {
    id: 'voluntariado',
    title: 'Serviço Voluntário',
    description: 'Regulamentação e diretrizes para atividades voluntárias no HC.',
    category: 'voluntariado',
    estimatedMinutes: 15,
    points: 100,
    order: 4,
    isRequired: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    content: [
      {
        id: 'vol-1',
        type: 'text',
        title: 'O que é Serviço Voluntário',
        content: 'Considera-se o serviço voluntário a atividade espontânea não remunerada prestada ao HCFMUSP por pessoa física, maior e capaz, não gerando vínculo empregatício, nem obrigação de natureza trabalhista, previdenciária ou a fim.',
        order: 1,
      },
      {
        id: 'vol-2',
        type: 'text',
        title: 'Tipos de Voluntários',
        content: '• Profissional da área da saúde\n• Profissional da área não assistencial\n• Profissional vinculado à Projeto de Pesquisa\n• Profissionais de práticas integrativas e complementares em saúde\n• Ações Ecumênicas - CARE\n• Ações Sociais - AVOHC',
        order: 2,
      },
    ],
  },

  {
    id: 'comunicacao',
    title: 'Comunicação Institucional',
    description: 'Email corporativo e canais de comunicação oficiais.',
    category: 'comunicacao',
    estimatedMinutes: 12,
    points: 85,
    order: 5,
    isRequired: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    content: [
      {
        id: 'com-1',
        type: 'text',
        title: 'Email Institucional',
        content: 'Esteja sempre atento(a) ao seu e-mail institucional: @hc.fm.usp, ele é o nosso principal meio de comunicação com você!',
        order: 1,
      },
      {
        id: 'com-2',
        type: 'text',
        title: 'Diretrizes do Email',
        content: '• A conta de email é corporativa e pode ser monitorada\n• Use apenas para atividades relacionadas ao HC\n• Sua senha é pessoal e intransferível\n• Para alterações, consulte o Centro de Gestão de Pessoas\n• Em caso de dúvidas, contate o NETi no ramal 6630',
        order: 2,
      },
      {
        id: 'com-3',
        type: 'text',
        title: 'Portais Institucionais',
        content: '• Portal do Colaborador - acesso às informações profissionais\n• Fale Conosco RH - dúvidas, elogios e sugestões\n• Canal Aberto - comunicação de conflitos no ambiente de trabalho',
        order: 3,
      },
    ],
  },

  {
    id: 'relacionamentos',
    title: 'Relacionamentos e Convivência',
    description: 'Políticas de enfrentamento à violência e convivência respeitosa.',
    category: 'relacionamentos',
    estimatedMinutes: 18,
    points: 110,
    order: 6,
    isRequired: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    content: [
      {
        id: 'rel-1',
        type: 'text',
        title: 'Canal Aberto',
        content: 'Este programa corporativo tem por objetivo fortalecer as relações por meio da escuta qualificada e do diálogo. Todos os colaboradores podem comunicar possíveis situações de conflito no ambiente de trabalho.',
        order: 1,
      },
      {
        id: 'rel-2',
        type: 'text',
        title: 'Política de Enfrentamento à Violência',
        content: 'O HC possui uma Política de Enfrentamento da violência contra os colaboradores, promovendo relacionamentos respeitosos, não violentos e eficazes em qualquer situação.',
        order: 2,
      },
      {
        id: 'rel-3',
        type: 'link',
        title: 'Contatos das Fundações',
        content: 'Conheça as fundações que contratam para o Hospital das Clínicas e seus respectivos canais de comunicação.',
        order: 3,
      },
    ],
  },
];
