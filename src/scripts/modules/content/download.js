const downloadsData = [
    {
        title: "Apostilas",
        downloads: [
            {
                name: "Apostila Gerencial",
                icon: "fa-file-pdf",
                info: "Manual de procedimentos gerenciais",
                path: "src/downloads/Apostila Gerencial - Capa Nova.pdf"
            }
            // Add more apostilas as needed
        ]
    },
    {
        title: "Políticas",
        downloads: [
            // Add policy documents here
        ]
    }
];

export function initDownloadsSection() {
    if (!sessionStorage.getItem('isLoggedIn')) {
        return `
            <div class="downloads-container">
                <h2>Acesso Restrito</h2>
                    <h2>Acesso Restrito</h2>
                </div>
                <p>Por favor, faça login para acessar os arquivos.</p>
            </div>
        `;
    }

    return `
        <div class="downloads-container">
            <div class="titulo-container">
                <h2>Arquivos para Download</h2>
            </div>
            ${downloadsData.map(category => `
                <div class="department-group">
                    <h3 class="department-title">${category.title}</h3>
                    <div class="downloads-grid">
                        ${category.downloads.map(file => `
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
        });
    }
}