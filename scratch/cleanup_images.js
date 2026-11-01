const fs = require('fs');
const path = require('path');

const storiesDir = path.join(process.cwd(), 'public', 'stories');
let deletedCount = 0;

if (fs.existsSync(storiesDir)) {
  fs.rmSync(storiesDir, { recursive: true, force: true });
  console.log('Pasta public/stories/ e todas as suas imagens foram deletadas!');
  fs.mkdirSync(storiesDir, { recursive: true });
}

// Remover também arquivos de teste temporários gerados em public/
const testFiles = [
  'public/test_worker_sample.jpg',
  'public/test_pollinations_sample.jpg',
  'public/v1_pixar_disney_clean.jpg',
  'public/v2_modern_storybook_defined.jpg',
  'public/sample_cf_worker.jpg',
  'public/sample_pollinations_flux.jpg'
];

testFiles.forEach(f => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    deletedCount++;
    console.log('Deletado:', f);
  }
});

console.log(`Limpeza concluída! ${deletedCount} arquivos de teste removidos e pasta public/stories limpa.`);
