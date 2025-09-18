// seed-firestore.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { modulesData } from './src/data/modules-js.js';

// __dirname e __filename não existem em ESM, recriamos assim:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Iniciando script de migração...');

if (!Array.isArray(modulesData)) {
  console.error('❌ modulesData não é um array.');
  process.exit(1);
}
console.log('📦 Dados importados com sucesso:', modulesData.length, 'módulos encontrados');

// Caminho padrão do service account
const saPath = path.join(__dirname, 'vital-novo-2-firebase-adminsdk-fbsvc-ddd9a057c1.json');
let creds;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!fs.existsSync(envPath)) throw new Error(`Arquivo não encontrado: ${envPath}`);
    console.log('🔑 Usando GOOGLE_APPLICATION_CREDENTIALS');
    creds = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
  } else {
    if (!fs.existsSync(saPath)) throw new Error(`Arquivo local não encontrado: ${saPath}`);
    console.warn('⚠️ Usando credencial local (considere usar GOOGLE_APPLICATION_CREDENTIALS).');
    creds = JSON.parse(fs.readFileSync(saPath, 'utf-8'));
  }

  admin.initializeApp({
    credential: admin.credential.cert(creds),
    projectId: creds.project_id || 'vital-novo-2',
  });
  console.log('🚀 Firebase Admin inicializado');
} catch (e) {
  console.error('❌ Erro ao inicializar Firebase Admin:', e.message);
  process.exit(1);
}

const db = admin.firestore();

async function seedModules() {
  console.log('\n📝 Iniciando a migração dos módulos para o Firestore...\n');
  const col = db.collection('modules');
  let ok = 0, fail = 0;

  for (const [i, m] of modulesData.entries()) {
    const { id, createdAt, updatedAt, ...rest } = m;
    if (!id) {
      console.error(`[${i + 1}/${modulesData.length}] ❌ Módulo sem "id", pulando...`);
      fail++;
      continue;
    }

    const cAt = createdAt instanceof Date ? createdAt : new Date(createdAt || Date.now());
    const uAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt || Date.now());

    const data = {
      ...rest,
      createdAt: admin.firestore.Timestamp.fromDate(cAt),
      updatedAt: admin.firestore.Timestamp.fromDate(uAt),
    };

    try {
      await col.doc(String(id)).set(data, { merge: true });
      console.log(`[${i + 1}/${modulesData.length}] ✅ "${m.title}" salvo (id: ${id})`);
      ok++;
    } catch (e) {
      console.error(`[${i + 1}/${modulesData.length}] ❌ Erro ao salvar "${m.title}" (id: ${id}): ${e.message}`);
      fail++;
    }
  }

  console.log('\n🎉 MIGRAÇÃO CONCLUÍDA!');
  console.log(`✅ Sucessos: ${ok}`);
  console.log(`❌ Erros: ${fail}`);
  console.log(`📊 Total: ${modulesData.length} módulos`);
  process.exit(fail ? 1 : 0);
}

seedModules().catch((err) => {
  console.error('💥 ERRO CRÍTICO durante a migração:', err);
  process.exit(1);
});
