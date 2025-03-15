const url = require('url');
const fileController = require('./controllers/fileController');

exports.handleRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Endpoint de diagnóstico
  if (req.method === 'GET' && pathname === '/api/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'API funcionando', timestamp: new Date().toISOString() }));
  }
  // Listar arquivos em uma categoria
  else if (req.method === 'GET' && pathname.startsWith('/api/list/')) {
    const category = pathname.replace('/api/list/', '');
    fileController.listCategoryFiles(req, res, category);
  }
  // Listar todos os arquivos
  else if (req.method === 'GET' && pathname === '/api/list-all') {
    fileController.listAllFiles(req, res);
  }
  // Upload de arquivos - versão simplificada e mais robusta
  else if (req.method === 'POST' && pathname === '/api/upload') {
    fileController.handleSimplifiedUpload(req, res);
  }
  else {
    // API endpoint não encontrado
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint não encontrado' }));
  }
};
