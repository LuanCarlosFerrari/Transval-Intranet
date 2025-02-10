let currentPath = [];

const downloadsDataTemplate = [
    {
        title: "Apostilas",
        downloads: []
    },
    {
        title: "R.H",
        downloads: []
    },
    {
        title: "Políticas",
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
                               data-filetype="pdf">Baixar PDF</a>
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
                               data-filetype="pdf">Baixar PDF</a>
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