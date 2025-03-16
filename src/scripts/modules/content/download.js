let currentPath = [];

const downloadsDataTemplate = [
    {
        title: "Agenciamento",
        downloads: []
    },
    {
        title: "Aplicativos",
        downloads: []
    },
    {
        title: "Controladoria",
        downloads: []
    },
    {
        title: "Faturamento",
        downloads: []
    },
    {
        title: "Motoristas Frota",
        downloads: []
    },
    {
        title: "R.H",
        downloads: []
    }
];

// Create a working copy that we'll modify
let downloadsData = JSON.parse(JSON.stringify(downloadsDataTemplate));

// Helper function to get file extensions
function getFileExtension(filePath) {
    const parts = filePath.split('.');
    return parts[parts.length - 1].toLowerCase();
}

// Modify the initDownloadsSection function to add preview buttons
export function initDownloadsSection(selectedCategory = null) {
    if (!sessionStorage.getItem('isLoggedIn')) {
        return `
            <div class="downloads-container">
                <h2>Acesso Restrito</h2>
                <p>Por favor, faça login para acessar os arquivos.</p>
            </div>
        `;
    }

    // If a category is selected, show its contents
    if (selectedCategory) {
        const files = selectedCategory.downloads;
        const rows = [];

        // Create rows with 2 columns
        for (let i = 0; i < files.length; i += 2) {
            const file1 = files[i];
            const file2 = files[i + 1];

            rows.push(`
                <tr>
                    <td>
                        <div class="download-item">
                            <i class="fas ${file1.icon}"></i>
                            <h3>${file1.name}</h3>
                            ${file1.info ? `<p>${file1.info}</p>` : ''}
                            <div class="download-actions">
                                <a href="javascript:void(0)" 
                                   class="preview-button"
                                   data-filepath="${file1.path}"
                                   data-filetype="${getFileExtension(file1.path)}">
                                   <i class="fas fa-eye"></i> Visualizar
                                </a>
                                <a href="${file1.path}" 
                                   download 
                                   class="download-button"
                                   data-filetype="${getFileExtension(file1.path)}">
                                   <i class="fas fa-download"></i> Baixar
                                </a>
                            </div>
                        </div>
                    </td>
                    ${file2 ? `
                    <td>
                        <div class="download-item">
                            <i class="fas ${file2.icon}"></i>
                            <h3>${file2.name}</h3>
                            ${file2.info ? `<p>${file2.info}</p>` : ''}
                            <div class="download-actions">
                                <a href="javascript:void(0)" 
                                   class="preview-button"
                                   data-filepath="${file2.path}"
                                   data-filetype="${getFileExtension(file2.path)}">
                                   <i class="fas fa-eye"></i> Visualizar
                                </a>
                                <a href="${file2.path}" 
                                   download 
                                   class="download-button"
                                   data-filetype="${getFileExtension(file2.path)}">
                                   <i class="fas fa-download"></i> Baixar
                                </a>
                            </div>
                        </div>
                    </td>
                    ` : '<td></td>'}
                </tr>
            `);
        }

        // Rest of the function remains the same
        return `
            <div class="downloads-container">
                <div class="titulo-container">
                    <button class="back-button">
                        <i class="fas fa-arrow-left"></i> Voltar
                    </button>
                    <h2>${selectedCategory.title}</h2>
                </div>
                <table class="downloads-table" width="100%">
                    <tbody>
                        ${rows.join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // The rest of this function remains unchanged
    // Show main view with all categories in pairs
    const rows = [];
    for (let i = 0; i < downloadsData.length; i += 2) {
        const category1 = downloadsData[i];
        const category2 = downloadsData[i + 1];

        rows.push(`
            <tr>
                <td>
                    <div class="department-group">
                        <h3 class="department-title">${category1.title}</h3>
                        <div class="download-item folder">
                            <i class="fas fa-folder"></i>
                            <h3>${category1.title}</h3>
                            <button class="folder-button" data-category="${category1.title}">Abrir Pasta</button>
                            <button class="upload-button" data-category="${category1.title}">Upload Arquivo</button>
                        </div>
                    </div>
                </td>
                ${category2 ? `
                <td>
                    <div class="department-group">
                        <h3 class="department-title">${category2.title}</h3>
                        <div class="download-item folder">
                            <i class="fas fa-folder"></i>
                            <h3>${category2.title}</h3>
                            <button class="folder-button" data-category="${category2.title}">Abrir Pasta</button>
                            <button class="upload-button" data-category="${category2.title}">Upload Arquivo</button>
                        </div>
                    </div>
                </td>
                ` : '<td></td>'}
            </tr>
        `);
    }

    return `
        <div class="titulo-container">
            <div class="titulo-container">
                <h2>Treinamentos e políticas</h2>
            </div>
            <table class="downloads-table" width="100%">
                <tbody>
                    ${rows.join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Adicionar esta função para sincronizar os folderContents com o servidor
async function syncFolderContentsWithServer() {
    console.log('Sincronizando folderContents com o servidor...');

    // Para cada categoria em downloadsDataTemplate
    for (const category of downloadsDataTemplate) {
        const categoryTitle = category.title;

        // Determinar a URL base
        let baseUrl = '';
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            baseUrl = `http://localhost:3000`;
        }

        try {
            // Buscar os arquivos dessa categoria do servidor
            const response = await fetch(`${baseUrl}/api/list/${categoryTitle}`);

            if (response.ok) {
                const data = await response.json();
                console.log(`Arquivos encontrados para ${categoryTitle}:`, data.files);

                if (data.files && data.files.length > 0) {
                    // Atualizar folderContents com os arquivos do servidor
                    folderContents[categoryTitle] = data.files.map(file => ({
                        name: file.name,
                        path: file.path,
                        icon: getFileIcon(file.path),
                        info: `Arquivo da categoria ${categoryTitle}`
                    }));
                }
            } else {
                console.error(`Erro ao buscar arquivos da categoria ${categoryTitle}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Erro ao sincronizar categoria ${categoryTitle}:`, error);
        }
    }

    console.log('Sincronização completa, folderContents atualizado:', folderContents);
}

// Modificar a função initDownloadsEvents para incluir sincronização
export function initDownloadsEvents() {
    const downloadsBtn = document.getElementById('downloadsBtn');
    if (downloadsBtn) {
        downloadsBtn.addEventListener('click', async () => {
            const contentArea = document.querySelector('.content-area');

            // Sincronizar com o servidor antes de mostrar os downloads
            await syncFolderContentsWithServer();

            contentArea.innerHTML = initDownloadsSection();
            addEventListeners();
        });
    }
}

// Create a static mapping of folder contents
const folderContents = {
    "Agenciamento": [
        // Currently empty folder
    ],
    "Aplicativos": [
        {
            name: "Renomeador de Arquivos",
            icon: "fa-file-code",
            info: "Aplicativo criado para o contas a pagar de Rinópolis que renomeia arquivos de acordo com o fornecedor",
            path: "src/downloads/Aplicativos/PDF_RENAME.exe"
        }
    ],
    "Controladoria": [
        {
            name: "Apresentação Geral Controladoria",
            icon: "fa-file-powerpoint",
            info: "Apresentação geral do setor de controladoria",
            path: "src/downloads/Controladoria/Transval_Apresentação Geral Controladoria.pptx"
        }
    ],
    "Faturamento": [
        {
            name: "Manual Faturamento",
            icon: "fa-file-word",
            info: "Manual de procedimentos de faturamento",
            path: "src/downloads/Faturamento/Transval_Manual Faturamento.docx"
        }
    ],
    "Motoristas Frota": [
        {
            name: "Integração de Segurança",
            icon: "fa-file-powerpoint",
            info: "Apresentação de integração de segurança para motoristas",
            path: "src/downloads/Motoristas Frota/Transval_INTEGRAÇÃO SEGURANÇA TRANSVAL - Motoristas.pptx"
        },
        {
            name: "Treinamento: Distrações no Trânsito",
            icon: "fa-file-powerpoint",
            info: "Treinamento sobre distrações no trânsito para motoristas",
            path: "src/downloads/Motoristas Frota/Transval_TREINAMENTO DISTRAÇÕES NO TRANSITO.pptx"
        },
        {
            name: "Treinamento: Limite de Velocidade",
            icon: "fa-file-powerpoint",
            info: "Treinamento sobre limites de velocidade para motoristas",
            path: "src/downloads/Motoristas Frota/Transval_TREINAMENTO LIMITE DE VELOCIDADE.pptx"
        }
    ],
    "R.H": [
        {
            name: "Apostila Gerencial",
            icon: "fa-file-pdf",
            info: "Manual de procedimentos gerenciais",
            path: "src/downloads/R.H/Apostila Gerencial - Capa Nova.pdf"
        },
        {
            name: "Apostila PDV",
            icon: "fa-file-pdf",
            info: "Manual PDV",
            path: "src/downloads/R.H/Apostila PDV - Capa Nova.pdf"
        }
    ]
};

async function loadFolderContents(folderPath) {
    try {
        // Se não temos os dados localmente ou queremos dados frescos, sincronize
        if (!folderContents[folderPath] || folderContents[folderPath].length === 0) {
            // Determinar a URL base
            let baseUrl = '';
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                baseUrl = `http://localhost:3000`;
            }

            try {
                // Buscar os arquivos dessa categoria diretamente do servidor
                const response = await fetch(`${baseUrl}/api/list/${folderPath}`);

                if (response.ok) {
                    const data = await response.json();
                    console.log(`Arquivos encontrados para ${folderPath}:`, data.files);

                    if (data.files && data.files.length > 0) {
                        // Atualizar folderContents com os arquivos do servidor
                        folderContents[folderPath] = data.files.map(file => ({
                            name: file.name,
                            path: file.path,
                            icon: getFileIcon(file.path),
                            info: `Arquivo da categoria ${folderPath}`
                        }));
                    }
                }
            } catch (serverError) {
                console.error(`Erro ao buscar do servidor para ${folderPath}:`, serverError);
            }
        }

        // Agora use os dados de folderContents (que podem ter sido atualizados)
        const files = folderContents[folderPath] || [];
        return files.map(file => ({
            name: file.name,
            icon: getFileIcon(file.path),
            info: file.info || '',
            path: file.path
        }));
    } catch (error) {
        console.error('Error loading folder contents:', error);
        return [];
    }
}

// Helper function to determine file icon based on extension
function getFileIcon(filePath) {
    if (filePath.toLowerCase().endsWith('.pdf')) return 'fa-file-pdf';
    if (filePath.toLowerCase().endsWith('.docx') || filePath.toLowerCase().endsWith('.doc')) return 'fa-file-word';
    if (filePath.toLowerCase().endsWith('.pptx') || filePath.toLowerCase().endsWith('.ppt')) return 'fa-file-powerpoint';
    if (filePath.toLowerCase().endsWith('.xlsx') || filePath.toLowerCase().endsWith('.xls')) return 'fa-file-excel';
    if (filePath.toLowerCase().endsWith('.exe')) return 'fa-file-code';
    return 'fa-file';
}

// Add the createPreviewModal function
function createPreviewModal() {
    // Check if modal already exists
    if (document.getElementById('filePreviewModal')) {
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'filePreviewModal';
    modal.className = 'modal file-preview-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="previewFileName">Preview</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body" id="previewContent">
                <div class="preview-loading">Carregando...</div>
            </div>
            <div class="modal-footer">
                <a href="#" id="previewDownloadBtn" class="download-button" download>
                    <i class="fas fa-download"></i> Baixar Arquivo
                </a>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add close functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        // Clear the preview content when closing
        document.getElementById('previewContent').innerHTML = '<div class="preview-loading">Carregando...</div>';
    });

    // Close when clicking outside of modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.getElementById('previewContent').innerHTML = '<div class="preview-loading">Carregando...</div>';
        }
    });
}

// Add the loadFilePreview function
function loadFilePreview(filePath, fileType) {
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = '<div class="preview-loading">Carregando...</div>';

    // Determinar a URL base
    let baseUrl = '';
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        baseUrl = `http://localhost:3000/`;
    }

    const fullPath = `${baseUrl}${filePath}`;
    console.log(`Tentando acessar: ${fullPath}`);

    // Check if file exists before trying to display
    fetch(fullPath, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                console.error(`Arquivo não encontrado: ${fullPath}, status: ${response.status}`);
                previewContent.innerHTML = `
                    <div class="preview-not-available">
                        <i class="fas fa-exclamation-triangle fa-4x"></i>
                        <p>Arquivo não encontrado.</p>
                        <p>Caminho: ${filePath}</p>
                    </div>
                `;
                return;
            }

            console.log(`Arquivo encontrado: ${fullPath}`);
            // File exists, display based on type
            switch (fileType) {
                case 'pdf':
                    // For PDF files, use iframe to display
                    previewContent.innerHTML = `
                        <iframe src="${fullPath}" width="100%" height="500px" frameborder="0"></iframe>
                    `;
                    break;

                case 'docx':
                case 'doc':
                    // For Word documents, show a message
                    previewContent.innerHTML = `
                        <div class="preview-not-available">
                            <i class="fas fa-file-word fa-4x"></i>
                            <p>Visualização do documento Word não disponível no navegador.</p>
                            <p>Por favor, baixe o arquivo para visualizá-lo.</p>
                        </div>
                    `;
                    break;

                case 'pptx':
                case 'ppt':
                    // For PowerPoint presentations, show a message
                    previewContent.innerHTML = `
                        <div class="preview-not-available">
                            <i class="fas fa-file-powerpoint fa-4x"></i>
                            <p>Visualização de apresentação PowerPoint não disponível no navegador.</p>
                            <p>Por favor, baixe o arquivo para visualizá-lo.</p>
                        </div>
                    `;
                    break;

                case 'xlsx':
                case 'xls':
                    // For Excel spreadsheets, show a message
                    previewContent.innerHTML = `
                        <div class="preview-not-available">
                            <i class="fas fa-file-excel fa-4x"></i>
                            <p>Visualização de planilha Excel não disponível no navegador.</p>
                            <p>Por favor, baixe o arquivo para visualizá-lo.</p>
                        </div>
                    `;
                    break;

                case 'exe':
                    // For executables, show a message
                    previewContent.innerHTML = `
                        <div class="preview-not-available">
                            <i class="fas fa-file-code fa-4x"></i>
                            <p>Arquivos executáveis não podem ser visualizados no navegador.</p>
                            <p>Por favor, baixe o arquivo para utilizá-lo.</p>
                        </div>
                    `;
                    break;

                default:
                    // For other file types
                    previewContent.innerHTML = `
                        <div class="preview-not-available">
                            <i class="fas fa-file fa-4x"></i>
                            <p>Visualização deste tipo de arquivo não disponível no navegador.</p>
                            <p>Por favor, baixe o arquivo para visualizá-lo.</p>
                        </div>
                    `;
            }
        })
        .catch((error) => {
            console.error(`Erro ao verificar arquivo: ${error}`);
            previewContent.innerHTML = `
                <div class="preview-not-available">
                    <i class="fas fa-exclamation-triangle fa-4x"></i>
                    <p>Erro ao acessar o arquivo.</p>
                    <p>Detalhes: ${error.message}</p>
                </div>
            `;
        });
}

/**
 * Função unificada para upload de arquivo
 * @param {File} file - O arquivo a ser enviado
 * @param {string} categoryName - A categoria para onde o arquivo será enviado
 * @param {boolean} useSimulation - Se deve simular o upload (true) ou usar o servidor real (false)
 * @returns {Promise} - Promise com os dados do arquivo enviado
 */
function uploadFile(file, categoryName, useSimulation = false) {
    return new Promise((resolve, reject) => {
        // Criar FormData para enviar ao servidor
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', categoryName);

        // Determinar a URL base para upload
        let apiUrl = '/api/upload';
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            apiUrl = `http://localhost:3000/api/upload`;
        }

        console.log(`Enviando arquivo para: ${apiUrl}${useSimulation ? ' (modo simulação)' : ''}`);

        // Se estamos em modo de simulação, simular um atraso de rede
        if (useSimulation) {
            // Criar caminho fictício para o arquivo
            const serverPath = `src/downloads/${categoryName}/${file.name}`;

            setTimeout(() => {
                // Executar upload real em segundo plano para persistir o arquivo
                fetch(apiUrl, {
                    method: 'POST',
                    body: formData
                }).catch(err => console.error('Erro na persistência em segundo plano:', err));

                // Retornar resultado simulado
                resolve({
                    name: file.name,
                    path: serverPath,
                    icon: getFileIcon(file.name),
                    info: `Arquivo enviado em ${new Date().toLocaleDateString()}`
                });
            }, 1500);
            return;
        }

        // Upload real para o servidor
        fetch(apiUrl, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao fazer upload do arquivo (${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Upload bem-sucedido:', data);
                resolve({
                    name: data.fileName,
                    path: data.filePath,
                    icon: getFileIcon(data.fileName),
                    info: `Arquivo enviado em ${new Date().toLocaleDateString()}`
                });
            })
            .catch(error => {
                console.error('Erro no upload:', error);
                reject(error);
            });
    });
}

// Função simplificada para gerenciar o upload de arquivo
function handleFileUpload(file, categoryName) {
    // Em ambiente de desenvolvimento, use simulação
    const useSimulation = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    console.log(`Iniciando upload ${useSimulation ? 'simulado' : 'real'} para: ${file.name} na categoria: ${categoryName}`);

    // Verificar se o arquivo já existe na lista local
    const existingFiles = folderContents[categoryName] || [];
    const alreadyExists = existingFiles.some(f => f.name === file.name);

    if (alreadyExists) {
        console.log(`Arquivo ${file.name} já existe na categoria ${categoryName}`);
    }

    return uploadFile(file, categoryName, useSimulation);
}

// Modify the addEventListeners function
function addEventListeners() {
    const contentArea = document.querySelector('.content-area');

    // Create the preview modal
    createPreviewModal();

    // Add folder button listeners (keeping existing code)
    document.querySelectorAll('.folder-button').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const categoryTitle = e.target.dataset.category;
            const category = downloadsData.find(cat => cat.title === categoryTitle);
            if (category) {
                // Load folder contents when folder is clicked
                if (category.downloads.length === 0) {
                    category.downloads = await loadFolderContents(categoryTitle);
                }
                contentArea.innerHTML = initDownloadsSection(category);
                addEventListeners();
            }
        });
    });

    // Modified back button listener (keep existing code)
    const backBtn = document.querySelector('.back-button');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Reset the downloadsData to its original state
            downloadsData = JSON.parse(JSON.stringify(downloadsDataTemplate));
            contentArea.innerHTML = initDownloadsSection();
            addEventListeners();
        });
    }

    // Add preview button listeners
    document.querySelectorAll('.preview-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let element = e.target;

            // If we clicked on the icon inside the button, get the parent element
            if (element.tagName === 'I') {
                element = element.parentElement;
            }

            const filePath = element.dataset.filepath;
            const fileType = element.dataset.filetype;

            // Get file name from path
            const fileName = filePath.split('/').pop();

            // Update modal title with file name
            document.getElementById('previewFileName').textContent = fileName;

            // Set download link
            const downloadBtn = document.getElementById('previewDownloadBtn');
            downloadBtn.href = filePath;
            downloadBtn.setAttribute('download', fileName);

            // Display the modal
            const modal = document.getElementById('filePreviewModal');
            modal.style.display = 'block';

            // Load preview content based on file type
            loadFilePreview(filePath, fileType);
        });
    });

    // Add upload button listeners
    document.querySelectorAll('.upload-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const categoryTitle = e.target.dataset.category;

            // Criar um input de arquivo melhor
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '*/*';
            fileInput.onchange = async () => {
                const file = fileInput.files[0];
                if (file) {
                    // Mostrar alguma indicação de carregamento
                    alert(`Iniciando upload do arquivo "${file.name}" para a pasta: ${categoryTitle}...`);

                    try {
                        // Usar a função de upload adequada
                        const uploadedFile = await handleFileUpload(file, categoryTitle);

                        // Adicionar o arquivo carregado ao folderContents - Importante!
                        if (!folderContents[categoryTitle]) {
                            folderContents[categoryTitle] = [];
                        }

                        // Verificar se o arquivo já existe para evitar duplicatas
                        const existingIndex = folderContents[categoryTitle].findIndex(
                            f => f.name === uploadedFile.name
                        );

                        if (existingIndex >= 0) {
                            // Substituir o arquivo existente
                            folderContents[categoryTitle][existingIndex] = uploadedFile;
                        } else {
                            // Adicionar novo arquivo
                            folderContents[categoryTitle].push(uploadedFile);
                        }

                        // Atualizar os downloads da categoria correspondente
                        const category = downloadsData.find(cat => cat.title === categoryTitle);
                        if (category) {
                            category.downloads = await loadFolderContents(categoryTitle);
                        }

                        // Notificar o usuário
                        alert(`Arquivo "${file.name}" enviado com sucesso para a pasta: ${categoryTitle}.`);

                        // Navegar para a pasta para mostrar o novo arquivo
                        contentArea.innerHTML = initDownloadsSection(category);
                        addEventListeners();
                    } catch (error) {
                        console.error('Erro ao fazer upload:', error);
                        alert('Erro ao fazer upload do arquivo. Por favor, tente novamente.');
                    }
                }
            };
            fileInput.click();
        });
    });

    // Keep the existing download button code
    document.querySelectorAll('.download-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let element = e.target;

            // Se clicou no ícone dentro do botão
            if (element.tagName === 'I') {
                element = element.parentElement;
            }

            const file = element.getAttribute('href');

            // Determinar a URL base
            let baseUrl = '';
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                baseUrl = `http://localhost:3000/`;

                // Se já contém a URL completa, não adicionar a base
                if (file.startsWith('http')) {
                    baseUrl = '';
                }
            }

            const fullPath = `${baseUrl}${file}`;

            fetch(fullPath, { method: 'HEAD' })
                .then(response => {
                    if (!response.ok) {
                        e.preventDefault();
                        console.error(`Arquivo não encontrado: ${fullPath}`);
                        alert(`Arquivo não encontrado: ${file}`);
                    }
                })
                .catch((error) => {
                    e.preventDefault();
                    console.error(`Erro ao acessar: ${error}`);
                    alert(`Erro ao acessar arquivo: ${error.message}`);
                });
        });
    });
}