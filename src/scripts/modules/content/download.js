export function initDownloadsSection() {
    // Only show content if user is authenticated
    if (!sessionStorage.getItem('isLoggedIn')) {
        return `
            <div class="downloads-container">
                <h2>Acesso Restrito</h2>
                <p>Por favor, faça login para acessar os arquivos.</p>
            </div>
        `;
    }

    return `
        <div class="downloads-container">
            <h2>Arquivos para Download</h2>
            <div class="downloads-grid">
                <div class="download-item">
                    <i class="fas fa-file-pdf"></i>
                    <h3>Apostila Gerencial</h3>
                    <a href="src/downloads/Apostila Gerencial - Capa Nova.pdf" 
                       download 
                       class="download-button"
                       data-filetype="pdf">Baixar PDF</a>
                </div>
            </div>
        </div>
    `;
}