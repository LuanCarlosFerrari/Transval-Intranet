export function initContactSection() {
    return `
        <div class="contact-section">
            <h1 class="contact-title">Entre em Contato</h1>
            <p class="contact-subtitle">Estamos à sua disposição</p>
            
            <div class="contact-info">
                <div class="contact-block">
                    <h3>Telefone</h3>
                    <p>Rinópolis-SP: (18) 3583-1016</p>
                    <p>Rondonópolis-MT: (66) 3424-0027</p>
                    <p>Sumaré-SP: (19) 3112-2078</p>
                </div>
                
                <div class="contact-block">
                    <h3>Email</h3>
                    <a href="mailto:contato@transval.net.br">contato@transval.net.br</a>
                </div>
                
                <div class="contact-block location-block">
                    <h3>Localização</h3>
                    <p>Rinópolis-SP: Via Acesso à Rinópolis-SP, Rod. SP-425, Centro, 17740-000</p>
                    <p>Rondonópolis-MT: Av. dos Transportes, 1609, Distr. Industrial, 78700-970</p>
                    <p>Sumaré-SP: Estrada da Servidão, 1025, JD. Santa Maria 13177-42</p>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners if needed
export function initContactEvents() {
    // Example: Add event listener for email link
    const emailLink = document.querySelector('.contact-block a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', () => {
            console.log('Email link clicked');
        });
    }
}