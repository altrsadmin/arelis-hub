const fs = require('fs');
const path = require('path');

// Função para buscar todas as chaves de tradução no código
function findTranslationKeys(dir) {
  const keys = new Set();
  const files = [];
  
  function readDir(dir) {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
          readDir(fullPath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        files.push(fullPath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const matches = content.match(/t\(['"]([^'"]+)['"]\)/g) || [];
        
        matches.forEach(match => {
          const key = match.match(/t\(['"]([^'"]+)['"]\)/)?.[1];
          if (key) {
            keys.add(key);
            console.log(`${key} (em ${file})`);
          }
        });
      }
    });
  }
  
  readDir(dir);
  return { keys: Array.from(keys), files };
}

const sourceDir = path.resolve(__dirname, 'src');
console.log('\n=== Chaves de tradução encontradas no código ===\n');
const { keys, files } = findTranslationKeys(sourceDir);

console.log(`\nTotal de chaves encontradas: ${keys.length}`);
console.log(`Total de arquivos verificados: ${files.length}`);
