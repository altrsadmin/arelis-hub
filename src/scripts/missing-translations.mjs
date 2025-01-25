import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para encontrar todas as chaves de tradução no código
function findTranslationKeys(dir) {
  const keys = new Set();
  
  function readDir(dir) {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
          readDir(fullPath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const matches = content.match(/t\(['"]([^'"]+)['"]\)/g) || [];
        
        matches.forEach(match => {
          const key = match.match(/t\(['"]([^'"]+)['"]\)/)?.[1];
          if (key) {
            keys.add(key);
          }
        });
      }
    });
  }
  
  readDir(dir);
  return Array.from(keys);
}

// Função para extrair todas as chaves de tradução de um objeto
function extractKeys(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return [...acc, ...extractKeys(value, currentKey)];
    }
    return [...acc, currentKey];
  }, []);
}

// Ler o arquivo de traduções
const translationsPath = path.join(__dirname, '../lib/i18n/translations.ts');
const translationsContent = fs.readFileSync(translationsPath, 'utf-8');
const translationsMatch = translationsContent.match(/export const translations = ({[\s\S]*?});/);

if (!translationsMatch) {
  console.error('Não foi possível encontrar o objeto de traduções');
  process.exit(1);
}

// Avaliar o objeto de traduções (não é a melhor prática, mas serve para nosso propósito)
const translations = eval('(' + translationsMatch[1] + ')');

// Extrair todas as chaves existentes
const existingKeys = {
  pt: new Set(extractKeys(translations.pt)),
  en: new Set(extractKeys(translations.en)),
  es: new Set(extractKeys(translations.es))
};

// Encontrar todas as chaves usadas no código
const sourceDir = path.resolve(__dirname, '..');
const usedKeys = findTranslationKeys(sourceDir);

// Encontrar chaves faltantes
console.log('\nChaves faltantes em português:');
usedKeys.forEach(key => {
  if (!existingKeys.pt.has(key)) {
    console.log(`- ${key}`);
  }
});

console.log('\nChaves faltantes em inglês:');
usedKeys.forEach(key => {
  if (!existingKeys.en.has(key)) {
    console.log(`- ${key}`);
  }
});

console.log('\nChaves faltantes em espanhol:');
usedKeys.forEach(key => {
  if (!existingKeys.es.has(key)) {
    console.log(`- ${key}`);
  }
});
