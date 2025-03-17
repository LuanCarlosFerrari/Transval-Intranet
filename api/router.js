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

    // Listar todas as pastas disponíveis (rota protegida)
    if (req.method === 'GET' && pathname === '/api/list-folders') {
        // You can add authentication check here if needed
        fileController.listAllFolders(req, res);
        return;
    }

    // Upload de arquivos (rota protegida)
    if (req.method === 'POST' && pathname === '/api/upload') {
        // You can add authentication check here if needed
        fileController.handleSimplifiedUpload(req, res);
        return;
    }

    // Deletar arquivo (rota protegida)
    if (req.method === 'DELETE' && pathname === '/api/delete-file') {
        // Aqui você poderia adicionar autenticação se necessário
        try {
            const bodyStr = await readBody(req);
            req.body = JSON.parse(bodyStr);
            fileController.deleteFile(req, res);
        } catch (error) {
            console.error('Erro ao processar requisição de deleção:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Requisição inválida', details: error.message }));
        }
        return;
    }

    // Adicionar um novo endpoint para renomear arquivos
    if (req.method === 'POST' && pathname === '/api/rename-file') {
        try {
            const bodyStr = await readBody(req);
            req.body = JSON.parse(bodyStr);
            const { oldPath, newName, category } = req.body;

            if (!oldPath || !newName || !category) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Parâmetros incompletos para renomear o arquivo' }));
                return;
            }

            // Extrair o diretório e o nome do arquivo atual
            const fs = require('fs').promises;
            const path = require('path');

            // Caminho base para a pasta de downloads
            const baseDownloadsPath = path.join(__dirname, '..', 'src', 'downloads');

            // Caminho completo do arquivo atual
            const oldFilePath = path.join(baseDownloadsPath, category, path.basename(oldPath));

            // Caminho novo para o arquivo
            const newFilePath = path.join(baseDownloadsPath, category, newName);

            // Verificar se o arquivo existe
            try {
                await fs.access(oldFilePath);
            } catch (error) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Arquivo não encontrado' }));
                return;
            }

            // Verificar se já existe um arquivo com o novo nome
            try {
                await fs.access(newFilePath);
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Já existe um arquivo com este nome' }));
                return;
            } catch (error) {
                // Arquivo não existe, podemos prosseguir com a renomeação
            }

            // Renomear o arquivo
            await fs.rename(oldFilePath, newFilePath);

            // Retornar o caminho atualizado do arquivo
            const newRelativePath = `src/downloads/${category}/${newName}`;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Arquivo renomeado com sucesso',
                oldPath: oldPath,
                newPath: newRelativePath,
                fileName: newName
            }));
        } catch (error) {
            console.error('Erro ao renomear arquivo:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Erro ao renomear arquivo' }));
        }
        return;
    }

    // API endpoint não encontrado
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint não encontrado' }));
};
