export function initQuickContactsSection() {
    // Only show content if user is authenticated
    if (!sessionStorage.getItem('isLoggedIn')) {
        return `
            <div class="contacts-container">
                <h2>Acesso Restrito</h2>
                <p>Por favor, faça login para acessar os contatos.</p>
            </div>
        `;
    }

    return `
        <div class="contacts-container">
            <h2>Contatos Importantes</h2>
            <div class="contacts-grid">
                <div class="contact-item">
                    <i class="fas fa-headset"></i>
                    <h3>contato</h3>
                    <p>Tel: </p>
                    <p>Email: </p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-headset"></i>
                    <h3>contato</h3>
                    <p>Tel: </p>
                    <p>Email: </p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-headset"></i>
                    <h3>contato</h3>
                    <p>Tel: </p>
                    <p>Email: </p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-headset"></i>
                    <h3>contato</h3>
                    <p>Tel: </p>
                    <p>Email: </p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-headset"></i>
                    <h3>contato</h3>
                    <p>Tel: </p>
                    <p>Email: </p>
                </div>
                <div class="contact-item">
                    <i class="fas fa-headset"></i>
                    <h3>contato</h3>
                    <p>Tel: </p>
                    <p>Email: </p>
                </div>
            </div>
        </div>
    `;
}