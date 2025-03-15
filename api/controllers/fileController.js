const fs = require('fs');
const path = require('path');
const fileUtils = require('../utils/fileUtils');

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
  const baseDir = path.join(ROOT_DIR, 'src', 'downloads');
  try {
    // Verificar se o diretório base existe
    if (!fs.existsSync(baseDir)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ categories: [] }));
      return;
    }

    // Listar todas as categorias (diretórios)
    const categories = fs.readdirSync(baseDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Para cada categoria, listar seus arquivos
    const result = {};
    categories.forEach(category => {
      const categoryPath = path.join(baseDir, category);

      try {
        const files = fs.readdirSync(categoryPath).map(filename => ({
          name: filename,
          path: `src/downloads/${category}/${filename}`
        }));

        result[category] = files;
      } catch (err) {
        console.error(`Erro ao ler categoria ${category}:`, err);
        result[category] = [];
      }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ categories: result }));
    console.log('Lista completa de arquivos enviada');
  } catch (error) {
    console.error('Erro ao listar todos os arquivos:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro ao listar arquivos' }));
  }
};

// Função para upload de arquivos
exports.handleSimplifiedUpload = (req, res) => {
  console.log('Iniciando upload simplificado...');

  let body = [];
  let size = 0;

  req.on('data', (chunk) => {
    body.push(chunk);
    size += chunk.length;
    console.log(`Recebido chunk de ${chunk.length} bytes. Total: ${size} bytes`);
  });

  req.on('end', () => {
    console.log(`Upload completo. Tamanho total: ${size} bytes`);

    try {
      // Extrair informações básicas
      const buffer = Buffer.concat(body);
      const contentType = req.headers['content-type'] || '';
      const boundary = contentType.split('boundary=')[1];

      if (!boundary) {
        console.error('Boundary não encontrado no Content-Type');
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Formato inválido' }));
        return;
      }

      // Converter para string para facilitar o parsing
      const bodyStr = buffer.toString();

      // Extrair categoria
      console.log('Extraindo categoria...');
      let category = 'Outros';
      const categoryMatch = bodyStr.match(/name="category"[\s\S]*?\r\n\r\n([\s\S]*?)\r\n/);
      if (categoryMatch && categoryMatch[1]) {
        category = categoryMatch[1].trim();
        console.log(`Categoria encontrada: ${category}`);
      } else {
        console.log('Categoria não encontrada, usando padrão: Outros');
      }

      // Extrair nome do arquivo
      console.log('Extraindo nome do arquivo...');
      const filenameMatch = bodyStr.match(/filename="([^"]*?)"/);
      if (!filenameMatch || !filenameMatch[1]) {
        console.error('Nome do arquivo não encontrado');
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Nome do arquivo não encontrado' }));
        return;
      }

      const filename = decodeURIComponent(filenameMatch[1]);  // Decodifica caracteres especiais como espaços
      console.log(`Nome do arquivo encontrado: ${filename}`);

      // Criar diretório se não existir
      const dirPath = path.join(ROOT_DIR, 'src', 'downloads', category);
      if (!fs.existsSync(dirPath)) {
        console.log(`Criando diretório: ${dirPath}`);
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Arquivo de saída
      const outputPath = path.join(dirPath, filename);
      console.log(`Caminho do arquivo a ser salvo: ${outputPath}`);

      // Primeiro verifique se o diretório realmente existe
      if (!fs.existsSync(dirPath)) {
        console.log(`Diretório não existe, criando: ${dirPath}`);
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Localizar início dos dados do arquivo manualmente
      let startPos = bodyStr.indexOf('\r\n\r\n', bodyStr.indexOf(`filename="${filenameMatch[1]}"`));
      if (startPos !== -1) {
        startPos += 4; // Avança o \r\n\r\n

        // Encontrar fim dos dados (boundary)
        const boundaryEnd = `--${boundary}--`;
        const boundaryNext = `--${boundary}`;
        let endPos = bodyStr.indexOf(boundaryEnd, startPos);
        if (endPos === -1) {
          endPos = bodyStr.indexOf(boundaryNext, startPos);
        }

        if (endPos !== -1) {
          endPos -= 2; // Retrocede o \r\n antes do boundary

          // Extrair dados do arquivo
          const fileData = buffer.slice(startPos, endPos);
          console.log(`Dados extraídos: ${fileData.length} bytes`);

          // Salvar arquivo diretamente
          try {
            fs.writeFileSync(outputPath, fileData);
            console.log(`Arquivo salvo com sucesso em: ${outputPath}`);

            // Construir o caminho como deve ser retornado ao cliente
            const clientPath = `src/downloads/${category}/${filename}`;

            // Responder com sucesso
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              fileName: filename,
              filePath: clientPath,
              fileSize: size,
              message: 'Upload realizado com sucesso'
            }));

            // Atualizar a lista de arquivos no objeto folderContents
            console.log(`Arquivo ${filename} salvo com sucesso em ${category}`);

          } catch (fsErr) {
            console.error(`Erro ao salvar arquivo: ${fsErr}`);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              error: 'Erro ao salvar arquivo',
              details: fsErr.message
            }));
          }
        } else {
          console.error('Não foi possível encontrar o fim dos dados do arquivo');
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Erro ao processar dados do arquivo' }));
        }
      } else {
        console.error('Não foi possível encontrar o início dos dados do arquivo');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao processar dados do arquivo' }));
      }
    } catch (error) {
      console.error(`Erro ao processar upload: ${error}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Erro ao processar upload',
        details: error.message
      }));
    }
  });

  req.on('error', (err) => {
    console.error(`Erro na requisição: ${err}`);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro na requisição' }));
  });
};

// Helper functions for file operations
exports.checkFileExists = (res, filePath) => {
  const fullPath = path.join(ROOT_DIR, filePath);
  console.log(`Verificando existência: ${fullPath}`);

  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Arquivo não existe: ${fullPath}`);
      res.writeHead(404);
      res.end();
    } else {
      console.log(`Arquivo existe: ${fullPath}`);
      res.writeHead(200);
      res.end();
    }
  });
};

// Função para servir arquivos estáticos
exports.serveFile = (res, filePath, contentType) => {
  const fullPath = path.join(ROOT_DIR, filePath);

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error(`Arquivo não encontrado: ${fullPath}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Arquivo não encontrado');
      } else {
        console.error(`Erro ao ler arquivo: ${err}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno do servidor');
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    console.log(`Arquivo servido: ${fullPath}`);
  });
};
