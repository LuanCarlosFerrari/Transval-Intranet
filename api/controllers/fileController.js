const fs = require('fs');
const path = require('path');

// Raiz do projeto - ajustar conforme necessário
const ROOT_DIR = path.join(__dirname, '../..');

// Função para listar arquivos em uma categoria
exports.listCategoryFiles = (req, res, category) => {
  const dirPath = path.join(ROOT_DIR, 'src', 'downloads', category);

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Erro ao listar diretório ${dirPath}:`, err);

      if (err.code === 'ENOENT') {
        // Se o diretório não existe, retornar lista vazia
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ files: [] }));
        return;
      }

      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao listar arquivos' }));
      return;
    }

    const fileList = files.map(filename => ({
      name: filename,
      path: `src/downloads/${category}/${filename}`
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ files: fileList }));
    console.log(`Listados ${fileList.length} arquivos em ${category}`);
  });
};

// Função para listar todos os arquivos de todas as categorias
exports.listAllFiles = (req, res) => {
  // Use existente função listAllFiles de server-simple.js
  // ...código da função...
};

// Função para upload de arquivos
exports.handleSimplifiedUpload = (req, res) => {
  // Use existente função handleSimplifiedUpload de server-simple.js
  // ...código da função...
};
