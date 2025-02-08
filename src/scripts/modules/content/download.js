let currentPath = [];

const downloadsData = [
    {
        title: "Apostilas",
        downloads: [

        ]
    },
    {
        title: "R.H",
        downloads: [
  
        ]
    },
    {
        title: "Políticas",
        downloads: [
            // Add policy documents here
        ]
    }
];

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
        return `
            <div class="downloads-container">
                <div class="titulo-container">
                    <button class="back-button">
                        <i class="fas fa-arrow-left"></i> Voltar
                    </button>
                    <h2>${selectedCategory.title}</h2>
                </div>
                <div class="downloads-grid">
                    ${selectedCategory.downloads.map(file => `
                        <div class="download-item">
                            <i class="fas ${file.icon}"></i>
                            <h3>${file.name}</h3>
                            ${file.info ? `<p>${file.info}</p>` : ''}
                            <a href="${file.path}" 
                               download 
                               class="download-button"
                               data-filetype="pdf">Baixar PDF</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Show main view with all categories
    return `
        <div class="downloads-container">
            <div class="titulo-container">
                <h2>Arquivos para Download</h2>
            </div>
            ${downloadsData.map(category => `
                <div class="department-group">
                    <h3 class="department-title">${category.title}</h3>
                    <div class="downloads-grid">
                        ${category.downloads.length > 0 ?
            category.downloads.map(file => `
                                <div class="download-item">
                                    <i class="fas ${file.icon}"></i>
                                    <h3>${file.name}</h3>
                                    ${file.info ? `<p>${file.info}</p>` : ''}
                                    <a href="${file.path}" 
                                       download 
                                       class="download-button"
                                       data-filetype="pdf">Baixar PDF</a>
                                </div>
                            `).join('') :
            `<div class="download-item folder">
                                <i class="fas fa-folder"></i>
                                <h3>${category.title}</h3>
                                <button class="folder-button" data-category="${category.title}">Abrir Pasta</button>
                            </div>`
        }
                    </div>
                </div>
            `).join('')}
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
        ,
        // ... other files
    ]
};

async function loadFolderContents(folderPath) {
    try {
        // Use the static mapping instead of fetch
        const files = folderContents[folderPath] || [];
        return files.map(file => ({
            name: file.name,
            icon: file.name.toLowerCase().endsWith('.pdf') ? 'fa-file-pdf' : 'fa-file',
            info: '',
            path: file.path
        }));
    } catch (error) {
        console.error('Error loading folder contents:', error);
        return [];
    }
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

    // Add back button listener
    const backBtn = document.querySelector('.back-button');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
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