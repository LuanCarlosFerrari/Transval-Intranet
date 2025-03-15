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
                            <a href="${file1.path}" 
                               download 
                               class="download-button"
                               data-filetype="pdf">Baixar</a>
                        </div>
                    </td>
                    ${file2 ? `
                    <td>
                        <div class="download-item">
                            <i class="fas ${file2.icon}"></i>
                            <h3>${file2.name}</h3>
                            ${file2.info ? `<p>${file2.info}</p>` : ''}
                            <a href="${file2.path}" 
                               download 
                               class="download-button"
                               data-filetype="pdf">Baixar</a>
                        </div>
                    </td>
                    ` : '<td></td>'}
                </tr>
            `);
        }

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

export function initDownloadsEvents() {
    const downloadsBtn = document.getElementById('downloadsBtn');
    if (downloadsBtn) {
        downloadsBtn.addEventListener('click', () => {
            const contentArea = document.querySelector('.content-area');
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
        // Use the static mapping instead of fetch
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

// Modify the event listener for folder buttons
function addEventListeners() {
    const contentArea = document.querySelector('.content-area');

    // Add folder button listeners
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

    // Modified back button listener
    const backBtn = document.querySelector('.back-button');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Reset the downloadsData to its original state
            downloadsData = JSON.parse(JSON.stringify(downloadsDataTemplate));
            contentArea.innerHTML = initDownloadsSection();
            addEventListeners(); // Reattach events after DOM update
        });
    }

    // Add file validation
    document.querySelectorAll('.download-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const file = e.target.getAttribute('href');
            fetch(file, { method: 'HEAD' })
                .then(response => {
                    if (!response.ok) {
                        e.preventDefault();
                        alert('Arquivo não encontrado');
                    }
                })
                .catch(() => {
                    e.preventDefault();
                    alert('Erro ao acessar arquivo');
                });
        });
    });
}