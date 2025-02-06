export function initClientsSection() {
    return `
        <h2 class="company-title">Nossos Clientes</h2>
        <div class="client-grid">
            <div class="client-box" role="article" aria-label="Client Information" onclick="window.open('https://rumolog.com/', '_blank')">
                <img src="src/Assests/clients/Rumo-logistica-logo-clipart.png" alt="Rumo Logistica" class="client-logo" loading="lazy">
                <h3>Rumo Logística</h3>
            </div>
            <div class="client-box" role="article" aria-label="Client Information" onclick="window.open('https://www.ldc.com/br/pt/', '_blank')">
                <img src="src/Assests/clients/LDC.png" alt="LDC" class="client-logo">
                <h3>LDC</h3>
            </div>
            <div class="client-box" role="article" aria-label="Client Information" onclick="window.open('https://www.viterra.us/', '_blank')">
                <img src="src/Assests/clients/viterra.png" alt="Viterra" class="client-logo">
                <h3>Viterra</h3>
            </div>
            <div class="client-box" role="article" aria-label="Client Information" onclick="window.open('https://caramuru.com/', '_blank')">
                <img src="src/Assests/clients/caramuru.png" alt="Caramuru" class="client-logo">
                <h3>Caramuru</h3>
            </div>
            <div class="client-box" role="article" aria-label="Client Information" onclick="window.open('https://br.cofcointernational.com/', '_blank')">
                <img src="src/Assests/clients/cofco.png" alt="Cofco Agri" class="client-logo">
                <h3>Cofco Agri</h3>
            </div>
            <div class="client-box" role="article" aria-label="Client Information" onclick="window.open('https://www.raizen.com.br/', '_blank')">
                <img src="src/Assests/clients/raizen.png" alt="Biosev" class="client-logo">
                <h3>Biosev</h3>
            </div>
            <div class="client-box" role="article" aria-label="Client Information" onclick="window.open('https://fertipar.com.br/', '_blank')">
                <img src="src/Assests/clients/fertipar.png" alt="Fertipar" class="client-logo">
                <h3>Fertipar</h3>
            </div>
            <div class="client-box" role="article" aria-label="Client Information" onclick="window.open('https://www.yarabrasil.com.br/', '_blank')">
                <img src="src/Assests/clients/yara.png" alt="Yara" class="client-logo">
                <h3>Yara</h3>
            </div>
            <div class="client-box" role="article" aria-label="Client Information" onclick="window.open('https://www.copersucar.com.br/', '_blank')">
                <img src="src/Assests/clients/copersucar.png" alt="Copersucar" class="client-logo">
                <h3>Copersucar</h3>
            </div>
            <div class="client-box" role="article" aria-label="Client Information" onclick="window.open('https://www.heringer.com.br/', '_blank')">
                <img src="src/Assests/clients/heringer.png" alt="Heringer" class="client-logo">
                <h3>Heringer</h3>
            </div>
        </div>
    `;
}

// Add event listeners if needed
export function initClientsEvents() {
    const clientBoxes = document.querySelectorAll('.client-box');
    clientBoxes.forEach(box => {
        box.addEventListener('click', handleClientBoxClick);
    });
}

function handleClientBoxClick() {
    const url = this.getAttribute('onclick').match(/window\.open\('([^']+)'/)[1];
    window.open(url, '_blank');
}