const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const apiRouter = require('./api/router');  // New API router module
const fileController = require('./api/controllers/fileController');
const fileUtils = require('./api/utils/fileUtils');

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
    fileController.serveFile(res, 'index.html', 'text/html');
  }
  // Servir arquivos estáticos
  else if (req.method === 'GET' && (pathname.startsWith('/src/') || pathname === '/favicon.ico')) {
    fileController.serveFile(res, pathname.substring(1), fileUtils.getContentType(pathname));
  }
  // Verificar se arquivo existe (HEAD request)
  else if (req.method === 'HEAD' && pathname.startsWith('/src/downloads/')) {
    fileController.checkFileExists(res, pathname.substring(1));
  }
  else {
    // Página não encontrada
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
  }
});

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`\n=======================================`);
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
  console.log(`Diretório de trabalho: ${__dirname}`);
  console.log(`=======================================\n`);
});
