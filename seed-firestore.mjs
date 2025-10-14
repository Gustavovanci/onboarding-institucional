// seed-firestore.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

// --- VERSÃO DO SCRIPT: v3.0 ---
// Se esta mensagem não aparecer no terminal, o arquivo não foi salvo corretamente.
console.log('--- EXECUTANDO SCRIPT DE SEED v3.0 ---');

const modulesData = [
  {
    id: 'nossa-historia',
    data: {
      title: 'Módulo 1: Nossa História',
      description: 'Navegue pelos marcos que moldaram o ensino, a pesquisa e a assistência no país e assista nosso vídeo institucional.',
      category: 'Cultura e Pessoas',
      estimatedMinutes: 10,
      points: 50,
      order: 1,
      isRequired: true,
      imageUrl: '/images/modules/modulo-historia.jpg'
    },
    content: [],
    quiz: []
  },
  {
    id: 'cracha-identificacao',
    data: {
      title: 'Módulo 2: Crachá de Identificação',
      description: 'Entenda a importância e as regras de uso do seu crachá profissional.',
      category: 'Normas Institucionais',
      estimatedMinutes: 5,
      points: 50,
      order: 2,
      isRequired: true,
      imageUrl: '/images/modules/modulo-01.jpg'
    },
    content: [
      { id: 'texto-1', order: 1, title: 'Seu Crachá de Identificação', type: 'text', content: 'Você receberá um crachá de identificação profissional. Este crachá é liberado para acessar as portarias principais dos Institutos. Mantenha-o sempre visível aos pacientes, porteiros e seguranças que zelam pela nossa segurança de uma forma geral.' },
      { id: 'texto-2', order: 2, title: 'Diretrizes Institucionais', type: 'text', content: '• O uso do crachá é obrigatório, pessoal e intransferível durante a permanência na Instituição. Deve ser fixado na altura do peito, em local visível a todos.\n• É proibido o empréstimo e a troca de crachá para qualquer finalidade.\n• O crachá será entregue mediante assinatura do Termo de Recebimento. Nos casos de entrega de um novo crachá, o anterior deve ser recolhido e desprezado.\n• Nos casos de desligamento, os crachás devem ser entregues aos Centros de Gestão de Pessoas do Instituto.' }
    ],
    quiz: [
      { order: 1, question: 'O crachá de identificação profissional deve ser usado:', options: ['Guardado no bolso para evitar perda', 'Entregue à recepção ao final do expediente', 'Na altura do peito, visível a todos', 'Somente durante reuniões'], correct: 2, explanation: 'O crachá deve estar sempre visível na altura do peito para identificação por pacientes, porteiros e seguranças.' },
    ]
  },
  {
    id: 'sistemas-corporativos',
    data: {
      title: 'Módulo 3: Uso de Sistemas Corporativos',
      description: 'Regras para acesso e uso dos sistemas internos do HCFMUSP.',
      category: 'Tecnologia',
      estimatedMinutes: 7,
      points: 75,
      order: 3,
      isRequired: true,
      imageUrl: '/images/modules/modulo-02.jpg'
    },
    content: [
        { id: 'texto-1', order: 1, title: 'Acesso aos Sistemas', type: 'text', content: 'A liberação e o acesso aos sistemas corporativos estão condicionados ao seu cadastro como colaborador, e-mail corporativo e senha. O acesso é formalizado pelo seu responsável técnico ou Centro de Gestão de Pessoas.' },
        { id: 'texto-2', order: 2, title: 'Responsabilidade Pessoal', type: 'text', content: 'Lembre-se: seu login e senha é de uso pessoal e intransferível. A responsabilidade dos acessos e manuseio das informações devem reservar-se exclusivamente à sua atividade no HCFMUSP, conforme orientação do seu responsável técnico.' }
    ],
    quiz: [
        { order: 1, question: 'O acesso aos sistemas corporativos depende de:', options: ['Solicitação verbal ao técnico responsável', 'Cadastro como colaborador, e-mail corporativo e senha', 'Qualquer login válido do HCFMUSP', 'Permissão do porteiro ou segurança'], correct: 1, explanation: 'O acesso só é liberado após cadastro formal, criação de e-mail e senha pessoal vinculada à sua função.' },
    ]
  },
  {
    id: 'seguranca-informacao',
    data: {
      title: 'Módulo 4: Política de Segurança da Informação',
      description: 'Diretrizes essenciais sobre a LGPD e o tratamento de dados na instituição.',
      category: 'Segurança',
      estimatedMinutes: 10,
      points: 100,
      order: 4,
      isRequired: true,
      imageUrl: '/images/modules/modulo-03.jpg'
    },
    content: [
      { id: 'texto-1', order: 1, title: 'Sua Responsabilidade com os Dados (LGPD)', type: 'text', content: 'Ajude-nos a manter a excelência na preservação de informações, de acordo com a Lei Geral de Proteção de Dados (LGPD). As informações e os ambientes tecnológicos são de exclusiva propriedade do HCFMUSP e devem ser tratadas de forma ética e sigilosa.' },
      { id: 'texto-2', order: 2, title: 'Diretrizes Essenciais', type: 'text', content: '• Somente usuários autorizados devem possuir acesso.\n• O uso dos sistemas pode ser monitorado sem aviso prévio.\n• Os acessos obedecem ao critério de menor privilégio (acessar apenas o necessário).\n• O compartilhamento de senhas é terminantemente proibido.\n• Toda informação produzida no exercício profissional pertence ao HCFMUSP.' }
    ],
    quiz: [
      { order: 1, question: 'Segundo a política institucional, quem é o dono das informações e dos sistemas utilizados?', options: ['O colaborador que os criou', 'O paciente titular dos dados', 'O HCFMUSP', 'O responsável técnico do setor'], correct: 2, explanation: 'Todo o conteúdo gerado no exercício profissional pertence ao HCFMUSP, e não ao colaborador.' },
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
      imageUrl: '/images/modules/modulo-05.jpg'
    },
    content: [
      { id: 'texto-1', order: 1, title: 'E-mail Institucional', type: 'text', content: 'Seu e-mail @hc.fm.usp.br é a principal ferramenta de comunicação. É uma conta corporativa que pode ser monitorada e deve ser usada apenas para atividades profissionais. Sua senha é pessoal e intransferível.' },
      { id: 'texto-2', order: 2, title: 'Intranet e Portal do Colaborador', type: 'text', content: 'A **Intranet** contém documentos e informações oficiais, com acesso restrito à rede do HCFMUSP. O **Portal do Colaborador** é onde você acessa suas informações profissionais.' },
    ],
    quiz: [
      { order: 1, question: 'A Intranet do HCFMUSP pode ser acessada:', options: ['De qualquer local, sem restrições', 'Apenas quando o colaborador estiver no HCFMUSP', 'Somente por gestores', 'Apenas pelo celular'], correct: 1, explanation: 'A Intranet é um sistema interno, acessível somente dentro da rede do HCFMUSP.' },
    ]
  },
    {
    id: 'servico-voluntario',
    data: {
      title: 'Módulo 6: Serviço Voluntário',
      description: 'Entenda as regras e diretrizes para a atuação como voluntário no HCFMUSP.',
      category: 'Normas Institucionais',
      estimatedMinutes: 8,
      points: 50,
      order: 6,
      isRequired: true,
      imageUrl: '/images/modules/modulo-04.jpg'
    },
    content: [
      { id: 'texto-1', order: 1, title: 'O Que É o Serviço Voluntário?', type: 'text', content: 'É uma atividade espontânea e não remunerada, que não gera vínculo empregatício. O voluntário pode atuar em áreas de assistência, apoio, pesquisa, práticas integrativas, ações ecumênicas (CARE) ou sociais (AVOHC).' },
      { id: 'texto-2', order: 2, title: 'Principais Diretrizes', type: 'text', content: '• O período mínimo de atuação é maior que 30 dias.\n• É vedado ao voluntário substituir profissionais efetivos ou exercer cargos de liderança.\n• Profissionais com vínculo celetista (HC ou Fundações) não podem exercer serviço voluntário.\n• O voluntário recebe um crachá corporativo após a celebração do Termo de Adesão.' }
    ],
    quiz: [
        { order: 1, question: 'O serviço voluntário no HCFMUSP é:', options: ['Uma forma de estágio remunerado', 'Uma atividade espontânea e não remunerada', 'Um contrato de trabalho temporário', 'Uma bolsa de pesquisa obrigatória'], correct: 1, explanation: 'O voluntariado não gera vínculo trabalhista nem remuneração.' },
    ]
  },
  {
    id: 'hcx-plataforma',
    data: {
      title: 'Módulo 7: HCX: Plataforma de Cursos',
      description: 'Acesse a plataforma de cursos e desenvolvimento do HCFMUSP.',
      category: 'Desenvolvimento',
      estimatedMinutes: 5,
      points: 20,
      order: 7,
      isRequired: false, // Módulo Opcional
      imageUrl: '/images/modules/modulo-hcx.jpg',
      url: 'https://hcx.fm.usp.br/login' // Link externo
    },
    content: [],
    quiz: []
  },
];

const contentPagesData = [
  {
      id: 'beneficios',
      data: {
          title: 'Benefícios ao Colaborador',
          content: `<h3>Centro de Atenção ao Colaborador (CeAC)</h3>...` // Conteúdo completo aqui
      }
  },
  {
      id: 'comunicacao',
      data: {
          title: 'Canais de Comunicação',
          content: `<h3>Programa Você Dialogando com o HC</h3>...` // Conteúdo completo aqui
      }
  },
  {
      id: 'inovacao',
      data: {
          title: 'Inova HC',
          content: `<h3>Ecossistema de Inovação</h3><p>Esta seção está em desenvolvimento. Em breve, você encontrará aqui informações sobre o ecossistema de inovação do HCFMUSP e como você pode participar.</p>`
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
  const collectionsToClear = ['modules', 'contentPages'];
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
      quiz.forEach(item => batch.set(moduleRef.collection('quiz').doc(), item));
      await batch.commit();
    }
  }
  console.log(` -> ${modulesData.length} módulos populados.`);
  
  console.log('\n📝 Populando coleção "contentPages"...');
  const contentPagesBatch = db.batch();
  for (const page of contentPagesData) {
      const { id, data } = page;
      contentPagesBatch.set(db.collection('contentPages').doc(id), data);
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
      // Recursivamente deleta subcoleções
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