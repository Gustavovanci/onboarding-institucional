// seed-firestore.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

// --- VERSÃO DO SCRIPT: v5.0 ---
console.log('--- EXECUTANDO SCRIPT DE SEED v5.0 ---');

const modulesData = [
  {
    id: 'boas-vindas',
    data: {
      title: 'Boas-Vindas e Nosso Papel',
      description: 'Um alinhamento de expectativas, nossa cultura e como nos conectamos ao SUS.',
      category: 'Cultura e Pessoas',
      estimatedMinutes: 15,
      points: 100,
      order: 1,
      isRequired: true,
      imageUrl: '/images/modules/boas-vindas.jpg' // Crie ou use uma imagem apropriada
    },
    content: [
      { id: 'bv-1', order: 1, title: 'Alinhamento de Expectativas', type: 'text', content: `
        <details class="group mb-4"><summary class="font-semibold cursor-pointer group-hover:text-brand-azure">Aqui respeitamos o próximo e as diferenças</summary><div class="p-4 bg-gray-50 rounded-lg mt-2"><p>Somos mais de 23.000 colaboradores e falar sobre diversidade é falar de todos nós, pois é exatamente disso que somos feitos, das nossas diferenças. O respeito é a chave para experimentarmos a diversidade no nosso dia a dia. Por isso, não toleramos nenhum tipo de discriminação.</p><p>O nosso slogan representa a nossa Diversidade: "Orgulho de fazer o melhor para as pessoas, com as pessoas".</p><p>Desejamos que você some com a sua singularidade e tenha muito orgulho da sua trajetória aqui!</p></div></details>
        <details class="group mb-4"><summary class="font-semibold cursor-pointer group-hover:text-brand-azure">Aqui colaboramos uns com os outros</summary><div class="p-4 bg-gray-50 rounded-lg mt-2"><p><strong>Juntos somos melhores, juntos somos +HCFMUSP.</strong> Esse é o nosso lema. Ele reforça o espírito de equipe que valorizamos em nossos profissionais. Juntos, não medimos esforços para fazer o melhor para os nossos pacientes.</p></div></details>
        <details class="group mb-4"><summary class="font-semibold cursor-pointer group-hover:text-brand-azure">Aqui compartilhamos conhecimentos</summary><div class="p-4 bg-gray-50 rounded-lg mt-2"><p>Aprendemos uns com os outros e temos espaço para compartilhar novas ideias. Somos um hospital escola, e portanto reconhecidos como referência para outras instituições de saúde. Aqui você pode contribuir e terá acesso a aprendizados com profissionais muito experientes. Junte-se a nós na promoção dos conhecimentos!</p></div></details>
        <details class="group mb-4"><summary class="font-semibold cursor-pointer group-hover:text-brand-azure">Aqui celebramos as conquistas</summary><div class="p-4 bg-gray-50 rounded-lg mt-2"><p>Junte-se a nós no propósito de disseminar as boas práticas e suas conquistas! Fique sempre atento(a) às informações que chegam no seu e-mail: @hc.fm.usp.br, e ao jornal eletrônico semanal Conecta FMUSP-HC, que publiciza semanalmente os nossos resultados e conquistas. Se quiser compartilhar, entre em contato com o Centro de Comunicação Institucional do seu Instituto e informe-se.</p></div></details>
      `},
      { id: 'bv-video-1', order: 2, title: 'O que dizem os nossos Gestores?', type: 'video', content: 'https://www.youtube.com/watch?v=SErc_d_tB2I' }, // Substituir pela URL correta
      { id: 'bv-video-2', order: 3, title: 'O que dizem os colaboradores?', type: 'video', content: 'https://www.youtube.com/watch?v=SErc_d_tB2I' }, // Substituir pela URL correta
      { id: 'sus-video', order: 4, title: 'Nosso papel e o Sistema Único de Saúde (SUS)', type: 'video', content: 'https://www.youtube.com/watch?v=SErc_d_tB2I' }, // Substituir pela URL do SUS
    ],
    quiz: [
      { order: 1, question: 'Os pacientes SUS atendidos no HC são:', options: ['Agendados no próprio HC', 'Referenciados de outras instituições de saúde, considerando a sua complexidade', 'Familiares de colaboradores'], correct: 1, explanation: 'O Hospital das Clínicas (HC) é um hospital de alta complexidade que recebe pacientes referenciados de outras unidades de saúde. Ou seja, os atendimentos não são feitos por demanda espontânea ou agendamento direto, mas por encaminhamentos realizados através da rede pública de saúde, conforme a gravidade e especialidade necessária.' },
      { order: 2, question: 'O nosso Slogan "Orgulho de fazer o melhor para as pessoas com as pessoas" reforça:', options: ['a importância das pessoas em todo o processo', 'o nosso orgulho em fazer parte', 'o respeito a todas as pessoas e à diversidade', 'todas as alternativas estão corretas'], correct: 3, explanation: 'O slogan representa os valores humanos, o trabalho em equipe e o compromisso com o cuidado. Ele expressa tanto o orgulho de pertencer ao HC quanto o respeito e a valorização das pessoas — pacientes, profissionais e a comunidade — que fazem parte dessa missão.' },
    ]
  },
  {
    id: 'nossa-historia',
    data: {
      title: 'Módulo 2: Nossa História',
      description: 'Navegue pelos marcos que moldaram o ensino, a pesquisa e a assistência no país.',
      category: 'Cultura e Pessoas',
      estimatedMinutes: 10,
      points: 100,
      order: 2,
      isRequired: true,
      imageUrl: '/images/modules/modulo-historia.jpg'
    },
    // O conteúdo da timeline agora vive na página `HistoryPage`, o quiz fica aqui.
    content: [],
    quiz: [
        { order: 1, question: 'Qual foi o marco inicial da história da Faculdade de Medicina da USP?', options: ['Criação da Fundação Rockefeller em 1915', 'Criação da Faculdade de Medicina e Cirurgia de São Paulo em 1912', 'Fundação da Universidade de São Paulo (USP) em 1934', 'Inauguração do Hospital das Clínicas em 1944'], correct: 1, explanation: 'A história começa em 1912, quando foi criada a Faculdade de Medicina e Cirurgia de São Paulo, sob a direção de Arnaldo Vieira de Carvalho. Esse foi o embrião que, anos depois, se tornaria parte da USP e daria origem ao Complexo Hospital das Clínicas.' },
        { order: 2, question: 'Em que ano foi inaugurado o Instituto do Coração (InCor)?', options: ['1976', '1977', '1978', '1982'], correct: 1, explanation: 'O InCor (Instituto do Coração) foi inaugurado em 1977, marcando um avanço importante na cardiologia e cirurgia cardíaca no Brasil. Logo em seguida, em 1978, foi criada a Fundação Zerbini (FZ), que deu suporte técnico e científico ao instituto.' },
        { order: 3, question: 'O que aconteceu com o Hospital Auxiliar de Suzano (HAS) em 2023?', options: ['Foi reinaugurado com o nome de Instituto Perdizes', 'Passou a ser administrado pela Secretaria Estadual de Saúde de São Paulo', 'Foi incorporado ao Instituto do Câncer do Estado de São Paulo (ICESP)', 'Encerrado definitivamente e demolido'], correct: 1, explanation: 'Após 63 anos de história dentro do Complexo HCFMUSP, o Hospital Auxiliar de Suzano (HAS) deixou de ser gerido pela Faculdade de Medicina/HC e passou para a Secretaria Estadual de Saúde de São Paulo, marcando uma mudança administrativa importante.' },
    ]
  },
  {
    id: 'cracha-identificacao',
    data: {
      title: 'Módulo 3: Crachá de Identificação',
      description: 'Entenda a importância e as regras de uso do seu crachá profissional.',
      category: 'Normas Institucionais',
      estimatedMinutes: 5,
      points: 100,
      order: 3,
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
      title: 'Módulo 4: Uso de Sistemas Corporativos',
      description: 'Regras para acesso e uso dos sistemas internos do HCFMUSP.',
      category: 'Tecnologia',
      estimatedMinutes: 7,
      points: 100,
      order: 4,
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
      title: 'Módulo 5: Política de Segurança da Informação',
      description: 'Diretrizes essenciais sobre a LGPD e o tratamento de dados na instituição.',
      category: 'Segurança',
      estimatedMinutes: 10,
      points: 100,
      order: 5,
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
      title: 'Módulo 6: E-mail e Sistemas de Comunicação',
      description: 'Aprenda a usar as principais ferramentas de comunicação, como e-mail, Intranet e portais.',
      category: 'Comunicação',
      estimatedMinutes: 10,
      points: 100,
      order: 6,
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
      title: 'Módulo 7: Serviço Voluntário',
      description: 'Entenda as regras e diretrizes para a atuação como voluntário no HCFMUSP.',
      category: 'Normas Institucionais',
      estimatedMinutes: 8,
      points: 100,
      order: 7,
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
      title: 'Módulo 8: HCX - Cursos Obrigatórios',
      description: 'Acesse a plataforma de cursos e desenvolvimento do HCFMUSP para seus treinamentos obrigatórios.',
      category: 'Desenvolvimento',
      estimatedMinutes: 5,
      points: 50,
      order: 8,
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
      quiz.forEach(item => {
        const docRef = moduleRef.collection('quiz').doc(); // Auto-generate ID
        batch.set(docRef, item);
      });
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