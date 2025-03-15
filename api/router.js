const url = require('url');
const querystring = require('querystring');
const fileController = require('./controllers/fileController');
const authController = require('./controllers/authController');
const authMiddleware = require('./middleware/authMiddleware');

// Helper to read request body (for POST requests)
const readBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = [];
        req.on('data', chunk => {
            body.push(chunk);
        });
        req.on('end', () => {
            try {
                const buffer = Buffer.concat(body);
                resolve(buffer.toString());
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', (err) => {
            reject(err);
        });
    });
};

exports.handleRequest = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Apply CORS headers for API requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Authentication endpoints
    if (req.method === 'POST' && pathname === '/api/auth/login') {
        console.log('Processing login request');
        try {
            req.body = await readBody(req);
            console.log('Request body read complete, length:', req.body.length);
            authController.login(req, res);
        } catch (error) {
            console.error('Erro ao processar login:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Erro interno do servidor', details: error.message }));
        }
        return;
    }

    // Endpoint de diagnóstico
    if (req.method === 'GET' && pathname === '/api/test') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'API funcionando', timestamp: new Date().toISOString() }));
        return;
    }

    // Verificação de sessão (rota protegida)
    if (req.method === 'GET' && pathname === '/api/auth/verify') {
        try {
            // Apply auth middleware manually
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Não autorizado' }));
                return;
            }

            try {
                req.user = authMiddleware.verifyTokenDirect(token);
                authController.verifySession(req, res);
            } catch (error) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Token inválido' }));
            }
        } catch (error) {
            console.error('Error in verify session:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Erro ao verificar sessão' }));
        }
        return;
    }

    // Listar arquivos em uma categoria (rota protegida)
    if (req.method === 'GET' && pathname.startsWith('/api/list/')) {
        // You can add authentication check here if needed
        const category = pathname.replace('/api/list/', '');
        fileController.listCategoryFiles(req, res, category);
        return;
    }

    // Listar todos os arquivos (rota protegida)
    if (req.method === 'GET' && pathname === '/api/list-all') {
        // You can add authentication check here if needed
        fileController.listAllFiles(req, res);
        return;
    }

    // Upload de arquivos (rota protegida)
    if (req.method === 'POST' && pathname === '/api/upload') {
        // You can add authentication check here if needed
        fileController.handleSimplifiedUpload(req, res);
        return;
    }

    // API endpoint não encontrado
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint não encontrado' }));
};
