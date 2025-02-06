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
                    <h3>Manual do Motorista</h3>
                    <a href="src/downloads/manual_motorista.pdf" download class="download-button">Baixar PDF</a>
                </div>
                <div class="download-item">
                    <i class="fas fa-file-excel"></i>
                    <h3>Planilha de Rotas</h3>
                    <a href="src/downloads/rotas.xlsx" download class="download-button">Baixar Excel</a>
                </div>
                <!-- Add more download items as needed -->
            </div>
        </div>
    `;
}