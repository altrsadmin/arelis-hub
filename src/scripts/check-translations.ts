import { translations } from '../lib/i18n/translations';

// Função para extrair todas as chaves de tradução de um objeto
function extractKeys(obj: any, prefix = ''): string[] {
  return Object.entries(obj).reduce((acc: string[], [key, value]) => {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return [...acc, ...extractKeys(value, currentKey)];
    }
    return [...acc, currentKey];
  }, []);
}

// Extrair todas as chaves disponíveis
const availableKeys = {
  pt: new Set(extractKeys(translations.pt)),
  en: new Set(extractKeys(translations.en)),
  es: new Set(extractKeys(translations.es))
};

// Verificar consistência entre idiomas
console.log('\n=== Verificando consistência entre idiomas ===');
const allKeys = new Set([
  ...Array.from(availableKeys.pt),
  ...Array.from(availableKeys.en),
  ...Array.from(availableKeys.es)
]);

allKeys.forEach(key => {
  const missingIn = [];
  if (!availableKeys.pt.has(key)) missingIn.push('pt');
  if (!availableKeys.en.has(key)) missingIn.push('en');
  if (!availableKeys.es.has(key)) missingIn.push('es');
  
  if (missingIn.length > 0) {
    console.log(`Chave "${key}" está faltando em: ${missingIn.join(', ')}`);
  }
});

// Extrair todas as chaves usadas no código
const fs = require('fs');
const path = require('path');

function getAllFiles(dir: string): string[] {
  const files: string[] = [];
  
  fs.readdirSync(dir).forEach((file: string) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        files.push(...getAllFiles(fullPath));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      files.push(fullPath);
    }
  });
  
  return files;
}

console.log('\n=== Verificando chaves usadas mas não definidas ===');
const sourceDir = path.resolve(__dirname, '..');
const files = getAllFiles(sourceDir);
const usedKeys = new Set<string>();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(/t\(['"]([^'"]+)['"]\)/g) || [];
  
  matches.forEach((match: string) => {
    const key = match.match(/t\(['"]([^'"]+)['"]\)/)?.[1];
    if (key) usedKeys.add(key);
  });
});

console.log('\nChaves usadas mas não definidas em nenhum idioma:');
Array.from(usedKeys).forEach(key => {
  if (!availableKeys.pt.has(key) && !availableKeys.en.has(key) && !availableKeys.es.has(key)) {
    console.log(`- ${key}`);
  }
});

console.log('\n=== Verificando chaves definidas mas não usadas ===');
console.log('\nChaves definidas mas não usadas no código:');
Array.from(allKeys).forEach(key => {
  if (!usedKeys.has(key)) {
    console.log(`- ${key}`);
  }
});
