const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para permitir CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Configurar o armazenamento para os uploads com multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const category = req.body.category || 'Outros';
        const dir = path.join(__dirname, 'src', 'downloads', category);

        console.log(`Diretório de destino: ${dir}`);

        // Verificar se o diretório existe, caso contrário, criar
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Criado diretório: ${dir}`);
        }

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Preservar o nome original do arquivo
        console.log(`Recebido arquivo: ${file.originalname}`);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Servir arquivos estáticos da raiz do projeto
app.use(express.static(__dirname));

// Servir downloads explicitamente (importante para garantir acesso)
app.use('/src/downloads', express.static(path.join(__dirname, 'src', 'downloads')));

// Endpoint para verificar arquivos
app.head('/src/downloads/:category/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'src', 'downloads', req.params.category, req.params.filename);
    console.log(`Verificando existência do arquivo: ${filePath}`);

    if (fs.existsSync(filePath)) {
        console.log('Arquivo existe');
        res.status(200).end();
    } else {
        console.log('Arquivo não encontrado');
        res.status(404).end();
    }
});

// Endpoint para listar arquivos em uma categoria
app.get('/api/list/:category', (req, res) => {
    const category = req.params.category;
    const dir = path.join(__dirname, 'src', 'downloads', category);

    try {
        if (!fs.existsSync(dir)) {
            return res.json({ files: [] });
        }

        const files = fs.readdirSync(dir).map(filename => {
            return {
                name: filename,
                path: `src/downloads/${category}/${filename}`
            };
        });

        res.json({ files });
    } catch (error) {
        console.error(`Erro ao listar diretório ${dir}:`, error);
        res.status(500).json({ error: 'Erro ao listar arquivos' });
    }
});

// Endpoint para upload de arquivos
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            console.error('Nenhum arquivo enviado');
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const category = req.body.category || 'Outros';
        const filePath = `src/downloads/${category}/${req.file.originalname}`;

        console.log(`Arquivo salvo em: ${req.file.path}`);
        console.log(`Caminho retornado: ${filePath}`);

        // Retornar os dados do arquivo salvo
        res.json({
            fileName: req.file.originalname,
            filePath: filePath,
            fileSize: req.file.size,
            message: 'Upload realizado com sucesso'
        });
    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({ error: 'Erro ao processar o upload' });
    }
});

// Endpoint para diagnóstico
app.get('/api/test', (req, res) => {
    res.json({ status: 'API funcionando' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Acesse: http://localhost:${port}`);
});
