// seed-firestore.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

// --- CONTEÚDO COMPLETO E FINAL DO ONBOARDING INSTITUCIONAL ---
const modulesData = [
  {
    id: 'cracha-identificacao',
    data: {
      title: 'Módulo 1: Crachá de Identificação',
      description: 'Entenda a importância e as regras de uso do seu crachá profissional.',
      category: 'Normas Institucionais',
      estimatedMinutes: 5,
      points: 50,
      order: 1,
      isRequired: true,
      imageUrl: '/images/modules/modulo-01.jpg' // Caminho local
    },
    content: [
      { id: 'texto-1', order: 1, title: 'Seu Crachá de Identificação', type: 'text', content: 'Você receberá um crachá de identificação profissional. Este crachá é liberado para acessar as portarias principais dos Institutos. Mantenha-o sempre visível aos pacientes, porteiros e seguranças que zelam pela nossa segurança de uma forma geral.' },
      { id: 'texto-2', order: 2, title: 'Diretrizes Institucionais', type: 'text', content: '• O uso do crachá é obrigatório, pessoal e intransferível durante a permanência na Instituição. Deve ser fixado na altura do peito, em local visível a todos.\n• É proibido o empréstimo e a troca de crachá para qualquer finalidade.\n• O crachá será entregue mediante assinatura do Termo de Recebimento. Nos casos de entrega de um novo crachá, o anterior deve ser recolhido e desprezado.\n• Nos casos de desligamento, os crachás devem ser entregues aos Centros de Gestão de Pessoas do Instituto.' }
    ],
    quiz: [
      { id: 'q1', order: 1, question: 'O crachá de identificação profissional deve ser usado:', options: ['Guardado no bolso para evitar perda', 'Entregue à recepção ao final do expediente', 'Na altura do peito, visível a todos', 'Somente durante reuniões'], correct: 2, explanation: 'O crachá deve estar sempre visível na altura do peito para identificação por pacientes, porteiros e seguranças.' },
      { id: 'q2', order: 2, question: 'O que deve ser feito quando um novo crachá é entregue?', options: ['Guardar o antigo como lembrança', 'Entregar o crachá anterior para ser recolhido e desprezado', 'Usar os dois crachás até o novo ser validado', 'Devolver o antigo apenas se solicitado'], correct: 1, explanation: 'O crachá antigo deve ser devolvido e descartado ao receber um novo, evitando uso indevido.' },
      { id: 'q3', order: 3, question: 'É permitido emprestar o crachá a outro colaborador?', options: ['Sim, se for da mesma área', 'Sim, apenas em caso de urgência', 'Não, o crachá é pessoal e intransferível', 'Sim, com autorização do gestor'], correct: 2, explanation: 'O crachá é individual e não pode ser emprestado ou trocado, pois garante a segurança da Instituição.' }
    ]
  },
  {
    id: 'sistemas-corporativos',
    data: {
      title: 'Módulo 2: Uso de Sistemas Corporativos',
      description: 'Regras para acesso e uso dos sistemas internos do HCFMUSP.',
      category: 'Tecnologia',
      estimatedMinutes: 7,
      points: 75,
      order: 2,
      isRequired: true,
      imageUrl: '/images/modules/modulo-02.jpg' // Caminho local
    },
    content: [
        { id: 'texto-1', order: 1, title: 'Acesso aos Sistemas', type: 'text', content: 'A liberação e o acesso aos sistemas corporativos estão condicionados ao seu cadastro como colaborador, e-mail corporativo e senha. O acesso é formalizado pelo seu responsável técnico ou Centro de Gestão de Pessoas.' },
        { id: 'texto-2', order: 2, title: 'Responsabilidade Pessoal', type: 'text', content: 'Lembre-se: seu login e senha é de uso pessoal e intransferível. A responsabilidade dos acessos e manuseio das informações devem reservar-se exclusivamente à sua atividade no HCFMUSP, conforme orientação do seu responsável técnico.' }
    ],
    quiz: [
        { id: 'q1', order: 1, question: 'O acesso aos sistemas corporativos depende de:', options: ['Solicitação verbal ao técnico responsável', 'Cadastro como colaborador, e-mail corporativo e senha', 'Qualquer login válido do HCFMUSP', 'Permissão do porteiro ou segurança'], correct: 1, explanation: 'O acesso só é liberado após cadastro formal, criação de e-mail e senha pessoal vinculada à sua função.' },
        { id: 'q2', order: 2, question: 'Quem deve ser contatado em caso de dúvidas sobre o acesso aos sistemas?', options: ['O setor de manutenção', 'O porteiro do Instituto', 'O Centro de Gestão de Pessoas', 'Outro colaborador com acesso'], correct: 2, explanation: 'As dúvidas sobre sistemas devem ser tratadas com o Centro de Gestão de Pessoas do Instituto.' },
        { id: 'q3', order: 3, question: 'O login e a senha corporativa são:', options: ['De uso compartilhado entre colegas da mesma área', 'De uso pessoal e intransferível', 'De responsabilidade do setor de informática', 'De uso opcional, dependendo da função'], correct: 1, explanation: 'O login e a senha são pessoais e intransferíveis, e o titular responde por todo acesso realizado.' }
    ]
  },
  {
    id: 'seguranca-informacao',
    data: {
      title: 'Módulo 3: Política de Segurança da Informação',
      description: 'Diretrizes essenciais sobre a LGPD e o tratamento de dados na instituição.',
      category: 'Segurança',
      estimatedMinutes: 10,
      points: 100,
      order: 3,
      isRequired: true,
      imageUrl: '/images/modules/modulo-03.jpg' // Caminho local
    },
    content: [
      { id: 'texto-1', order: 1, title: 'Sua Responsabilidade com os Dados (LGPD)', type: 'text', content: 'Ajude-nos a manter a excelência na preservação de informações, de acordo com a Lei Geral de Proteção de Dados (LGPD). As informações e os ambientes tecnológicos são de exclusiva propriedade do HCFMUSP e devem ser tratadas de forma ética e sigilosa.' },
      { id: 'texto-2', order: 2, title: 'Diretrizes Essenciais', type: 'text', content: '• Somente usuários autorizados devem possuir acesso.\n• O uso dos sistemas pode ser monitorado sem aviso prévio.\n• Os acessos obedecem ao critério de menor privilégio (acessar apenas o necessário).\n• O compartilhamento de senhas é terminantemente proibido.\n• Toda informação produzida no exercício profissional pertence ao HCFMUSP.' }
    ],
    quiz: [
      { id: 'q1', order: 1, question: 'Segundo a política institucional, quem é o dono das informações e dos sistemas utilizados?', options: ['O colaborador que os criou', 'O paciente titular dos dados', 'O HCFMUSP', 'O responsável técnico do setor'], correct: 2, explanation: 'Todo o conteúdo gerado no exercício profissional pertence ao HCFMUSP, e não ao colaborador.' },
      { id: 'q2', order: 2, question: 'O acesso aos sistemas deve seguir o critério de “maior privilégio”, para facilitar o trabalho do colaborador.', options: ['Verdadeiro', 'Falso'], correct: 1, explanation: 'Falso. O princípio correto é o do menor privilégio — cada usuário acessa somente o necessário para sua função.' },
      { id: 'q3', order: 3, question: 'Os acessos e o uso das informações podem ser monitorados sem aviso prévio.', options: ['Sim', 'Não', 'Apenas se o colaborador for suspeito', 'Apenas com ordem judicial'], correct: 0, explanation: 'Sim. A política prevê que todo uso pode ser monitorado, sem aviso prévio, para garantir segurança e rastreabilidade.' }
    ]
  },
  {
    id: 'servico-voluntario',
    data: {
      title: 'Módulo 4: Serviço Voluntário',
      description: 'Entenda as regras e diretrizes para a atuação como voluntário no HCFMUSP.',
      category: 'Normas Institucionais',
      estimatedMinutes: 8,
      points: 50,
      order: 4,
      isRequired: false,
      imageUrl: '/images/modules/modulo-04.jpg' // Caminho local
    },
    content: [
      { id: 'texto-1', order: 1, title: 'O Que É o Serviço Voluntário?', type: 'text', content: 'É uma atividade espontânea e não remunerada, que não gera vínculo empregatício. O voluntário pode atuar em áreas de assistência, apoio, pesquisa, práticas integrativas, ações ecumênicas (CARE) ou sociais (AVOHC).' },
      { id: 'texto-2', order: 2, title: 'Principais Diretrizes', type: 'text', content: '• O período mínimo de atuação é maior que 30 dias.\n• É vedado ao voluntário substituir profissionais efetivos ou exercer cargos de liderança.\n• Profissionais com vínculo celetista (HC ou Fundações) não podem exercer serviço voluntário.\n• O voluntário recebe um crachá corporativo após a celebração do Termo de Adesão.' }
    ],
    quiz: [
        { id: 'q1', order: 1, question: 'O serviço voluntário no HCFMUSP é:', options: ['Uma forma de estágio remunerado', 'Uma atividade espontânea e não remunerada', 'Um contrato de trabalho temporário', 'Uma bolsa de pesquisa obrigatória'], correct: 1, explanation: 'O voluntariado não gera vínculo trabalhista nem remuneração.' },
        { id: 'q2', order: 2, question: 'Quem pode atuar como voluntário?', options: ['Qualquer pessoa física, maior e capaz', 'Apenas profissionais da área da saúde', 'Apenas servidores públicos', 'Apenas alunos de pós-graduação'], correct: 0, explanation: 'O voluntariado é aberto a todos os perfis profissionais, desde que cumpram os requisitos da Instituição.' },
        { id: 'q3', order: 3, question: 'O voluntário pode substituir profissionais efetivos em caso de ausência?', options: ['Sim, se for capacitado', 'Sim, se o gestor permitir', 'Não, é expressamente proibido', 'Apenas em emergências'], correct: 2, explanation: 'O voluntário não pode substituir profissionais nem ocupar funções de chefia, supervisão ou coordenação.' }
    ]
  },
  {
    id: 'email-sistemas',
    data: {
      title: 'Módulo 5: E-mail e Sistemas de Comunicação',
      description: 'Aprenda a usar as principais ferramentas de comunicação, como e-mail, Intranet e portais.',
      category: 'Comunicação',
      estimatedMinutes: 10,
      points: 80,
      order: 5,
      isRequired: true,
      imageUrl: '/images/modules/modulo-05.jpg' // Caminho local
    },
    content: [
      { id: 'texto-1', order: 1, title: 'E-mail Institucional', type: 'text', content: 'Seu e-mail @hc.fm.usp.br é a principal ferramenta de comunicação. É uma conta corporativa que pode ser monitorada e deve ser usada apenas para atividades profissionais. Sua senha é pessoal e intransferível.' },
      { id: 'texto-2', order: 2, title: 'Intranet e Portal do Colaborador', type: 'text', content: 'A **Intranet** contém documentos e informações oficiais, com acesso restrito à rede do HCFMUSP. O **Portal do Colaborador** é onde você acessa suas informações profissionais.' },
      { id: 'texto-3', order: 3, title: 'GLPI: Sistema de Chamados Internos', type: 'text', content: '• **GLPI (TI):** Use para requisitar ao NETi a liberação de acessos, manutenção de equipamentos e solução de problemas técnicos.\n• **GLPI (Fale com o RH):** Use para registrar dúvidas, elogios, reclamações e sugestões para o seu RH local.' }
    ],
    quiz: [
      { id: 'q1', order: 1, question: 'A Intranet do HCFMUSP pode ser acessada:', options: ['De qualquer local, sem restrições', 'Apenas quando o colaborador estiver no HCFMUSP', 'Somente por gestores', 'Apenas pelo celular'], correct: 1, explanation: 'A Intranet é um sistema interno, acessível somente dentro da rede do HCFMUSP.' },
      { id: 'q2', order: 2, question: 'Qual sistema é usado para registrar uma sugestão de melhoria para o RH?', options: ['Portal do Colaborador', 'GLPI - Fale com o RH', 'GLPI - TI', 'Intranet'], correct: 1, explanation: 'O GLPI – Fale com o RH é o canal direto para comunicação e feedback com o RH corporativo.' }
    ]
  },
  {
    id: 'dialogando-rh',
    data: {
      title: 'Módulo 6: Programa Você Dialogando com o HC',
      description: 'Conheça o canal para fortalecimento de relações e mediação de conflitos.',
      category: 'Cultura e Pessoas',
      estimatedMinutes: 5,
      points: 40,
      order: 6,
      isRequired: false,
      imageUrl: '/images/modules/modulo-06.jpg' // Caminho local
    },
    content: [
      { id: 'texto-1', order: 1, title: 'Fortalecendo Relações', type: 'text', content: 'Este programa corporativo tem por objetivo fortalecer as relações por meio da escuta qualificada e do diálogo. Todos os colaboradores podem comunicar possíveis situações de conflito no ambiente de trabalho para que sejam adotadas ações de melhorias.' },
      { id: 'texto-2', order: 2, title: 'Como Funciona?', type: 'text', content: 'As informações registradas no canal "Fale com o RH" são analisadas pelo Núcleo de Gestão de Pessoas (NGP), que acolhe as manifestações e atua na mitigação dos conflitos com os envolvidos e mediadores qualificados. O sistema pode ser acessado de qualquer local com internet.' }
    ],
    quiz: [
      { id: 'q1', order: 1, question: 'O objetivo principal do programa "Você Dialogando com o HC" é:', options: ['Realizar pesquisas de satisfação', 'Fortalecer o diálogo e tratar conflitos de trabalho', 'Substituir o RH corporativo', 'Monitorar comportamento dos colaboradores'], correct: 1, explanation: 'O programa promove escuta qualificada e soluções para conflitos, visando a melhoria do clima organizacional.' }
    ]
  },
  {
    id: 'beneficios-colaborador',
    data: {
        title: 'Módulo 7: Benefícios ao Colaborador',
        description: 'Conheça em detalhes os serviços do CeAC, programas de bem-estar e outras vantagens.',
        category: 'Benefícios',
        estimatedMinutes: 15,
        points: 150,
        order: 7,
        isRequired: true,
        imageUrl: '/images/modules/modulo-07.jpg' // Caminho local
    },
    content: [
        { id: 'texto-1', order: 1, title: 'Centro de Atenção ao Colaborador (CeAC)', type: 'text', content: 'O CeAC é responsável pelas ações de Medicina e Segurança do Trabalho. Oferece um Pronto Atendimento para sintomas agudos durante a jornada de trabalho e um Ambulatório referenciado para garantir a saúde dos colaboradores.' },
        { id: 'texto-2', order: 2, title: 'Serviços do CeAC', type: 'text', content: '• **Pronto Atendimento:** Para sintomas agudos como dores incapacitantes, ferimentos, diarreia, etc. Não atende troca de atestados ou solicitação de receitas.\n• **Ambulatório:** Para rastreamento e monitoramento de doenças (Câncer, Diabetes, Hipertensão, Saúde Mental), com encaminhamento da Medicina do Trabalho.\n• **Segurança do Trabalho:** Gerencia riscos (PGR), investiga acidentes e inspeciona ambientes.\n• **Medicina do Trabalho:** Realiza exames ocupacionais (admissional, periódico, demissional, etc.).' },
        { id: 'texto-3', order: 3, title: 'Programas e Vantagens', type: 'text', content: '• **Wellhub (Gympass):** Descontos em academias e apps de bem-estar.\n• **HCX:** Cursos e treinamentos gratuitos na plataforma interna e descontos em cursos externos.\n• **ASHC:** Associação dos Servidores com clube de descontos, assistência médica, jurídica e mais.\n• **CEDEI:** Creche para filhos(as) de funcionárias de 3 a 36 meses.' }
    ],
    quiz: [
        { id: 'q1', order: 1, question: 'Qual serviço devo procurar se tiver uma dor de cabeça incapacitante durante o trabalho?', options: ['O ambulatório do meu bairro', 'O Pronto Atendimento do CeAC', 'O RH do meu instituto', 'A farmácia mais próxima'], correct: 1, explanation: 'O Pronto Atendimento do CeAC é destinado a sintomas agudos que ocorrem durante a jornada de trabalho.' },
        { id: 'q2', order: 2, question: 'Qual serviço realiza o exame demissional?', options: ['O Pronto Atendimento', 'A Segurança do Trabalho', 'A Medicina do Trabalho', 'O Ambulatório Referenciado'], correct: 2, explanation: 'A Medicina do Trabalho é responsável por todos os exames ocupacionais, incluindo o demissional.' },
        { id: 'q3', order: 3, question: 'O acesso aos treinamentos obrigatórios na plataforma HCX é:', options: ['Pago, mas com desconto', 'Gratuito para todos os colaboradores', 'Exclusivo para gestores', 'Disponível apenas presencialmente'], correct: 1, explanation: 'Os treinamentos obrigatórios e de desenvolvimento na plataforma são gratuitos para os colaboradores.' }
    ]
  }
];

// --- LÓGICA DO SCRIPT (NÃO PRECISA ALTERAR) ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Iniciando script de migração para o Firestore...');

let creds;
try {
  const saPath = path.join(__dirname, 'vital-novo-2-firebase-adminsdk-fbsvc-ddd9a057c1.json');
  if (fs.existsSync(saPath)) {
    creds = JSON.parse(fs.readFileSync(saPath, 'utf-8'));
  } else {
    throw new Error(`Arquivo de credenciais não encontrado: ${saPath}. Baixe-o do seu projeto Firebase e coloque na pasta raiz.`);
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(creds),
      projectId: creds.project_id,
    });
    console.log('🚀 Firebase Admin inicializado com sucesso.');
  }
} catch (e) {
  console.error('❌ Erro fatal ao inicializar Firebase Admin:', e.message);
  process.exit(1);
}

const db = admin.firestore();
const batchSize = 100;

async function seedDatabase() {
  console.log('\n🧹 Limpando coleções existentes para garantir um novo começo...');
  const modulesCollectionRef = db.collection('modules');
  const snapshot = await modulesCollectionRef.get();
  for (const doc of snapshot.docs) {
    const moduleRef = doc.ref;
    await deleteCollection(db, moduleRef.collection('content'), batchSize);
    await deleteCollection(db, moduleRef.collection('quiz'), batchSize);
    await moduleRef.delete();
    console.log(`  -> Módulo "${doc.id}" e suas subcoleções foram limpos.`);
  }

  console.log('\n📝 Começando a popular a coleção "modules" e suas subcoleções...');
  let modulesCount = 0;
  
  for (const module of modulesData) {
    const { id, data, content, quiz } = module;
    const moduleRef = db.collection('modules').doc(id);

    try {
      await moduleRef.set({ ...data, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      console.log(`[Módulo] ✅ "${data.title}" (ID: ${id}) salvo.`);

      if (content && content.length > 0) {
        const contentBatch = db.batch();
        const contentCollection = moduleRef.collection('content');
        content.forEach(item => {
          const docRef = contentCollection.doc(item.id);
          contentBatch.set(docRef, item);
        });
        await contentBatch.commit();
        console.log(`  -> 📝 Conteúdo teórico salvo para "${data.title}".`);
      }

      if (quiz && quiz.length > 0) {
        const quizBatch = db.batch();
        const quizCollection = moduleRef.collection('quiz');
        quiz.forEach(question => {
          const docRef = quizCollection.doc(); // Gera ID automático para cada questão
          quizBatch.set(docRef, question);
        });
        await quizBatch.commit();
        console.log(`  -> ❓ Quiz salvo para "${data.title}".`);
      }
      
      modulesCount++;
    } catch (e) {
      console.error(`❌ Erro ao salvar o módulo "${data.title}":`, e.message);
    }
  }
  
  console.log(`\n🎉 Migração concluída! ${modulesCount} de ${modulesData.length} módulos foram processados.`);
}

async function deleteCollection(db, collectionRef, batchSize) {
  const query = collectionRef.orderBy('__name__').limit(batchSize);
  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();
  if (snapshot.size === 0) {
    return resolve();
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

seedDatabase().catch((err) => {
  console.error('💥 ERRO CRÍTICO durante a execução do script:', err);
  process.exit(1);
});