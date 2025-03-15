const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const apiRouter = require('./api/router');  // New API router module

const PORT = 3000;

// Criar servidor HTTP básico
const server = http.createServer((req, res) => {
  // Configurar CORS para permitir acesso de qualquer origem
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Tratar requisições OPTIONS (pre-flight) para CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`${req.method} ${pathname}`);

  // API requests - delegate to the API router
  if (pathname.startsWith('/api/')) {
    apiRouter.handleRequest(req, res);
    return;
  }

  // Servir página inicial
  if (req.method === 'GET' && pathname === '/') {
    serveFile(res, 'index.html', 'text/html');
  }
  // Servir arquivos estáticos
  else if (req.method === 'GET' && (pathname.startsWith('/src/') || pathname === '/favicon.ico')) {
    serveFile(res, pathname.substring(1), getContentType(pathname));
  }
  // Verificar se arquivo existe (HEAD request)
  else if (req.method === 'HEAD' && pathname.startsWith('/src/downloads/')) {
    checkFileExists(res, pathname.substring(1));
  }
  else {
    // Página não encontrada
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
  }
});

// Função para servir arquivos estáticos
function serveFile(res, filePath, contentType) {
  const fullPath = path.join(__dirname, filePath);

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
}

// Verificar se arquivo existe (HEAD request)
function checkFileExists(res, filePath) {
  const fullPath = path.join(__dirname, filePath);
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
}

// Determinar Content-Type com base na extensão do arquivo
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.mp4': 'video/mp4',
    '.zip': 'application/zip',
    '.ico': 'image/x-icon'
  };

  return types[ext] || 'application/octet-stream';
}

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`\n=======================================`);
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
  console.log(`Diretório de trabalho: ${__dirname}`);
  console.log(`=======================================\n`);
});
