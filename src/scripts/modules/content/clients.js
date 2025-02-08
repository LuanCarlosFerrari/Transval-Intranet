export function initClientsSection() {
    return `
        <div class="titulo-container">
            <h2>Nossos Parceiros</h2>
            <div class="client-grid">
                <div class="client-box" onclick="window.open('https://rumolog.com/', '_blank')">
                    <img src="src/Assets/clients/Rumo-logistica-logo-clipart.png" alt="Rumo Logistica" loading="lazy">
                    <h3>Rumo Logística</h3>
                </div>
                <div class="client-box" onclick="window.open('https://www.ldc.com/br/pt/', '_blank')">
                    <img src="src/Assets/clients/LDC.png" alt="LDC">
                    <h3>LDC</h3>
                </div>
                <div class="client-box" onclick="window.open('https://www.viterra.us/', '_blank')">
                    <img src="src/Assets/clients/viterra.png" alt="Viterra">
                    <h3>Viterra</h3>
                </div>
                <div class="client-box" onclick="window.open('https://caramuru.com/', '_blank')">
                    <img src="src/Assets/clients/caramuru.png" alt="Caramuru">
                    <h3>Caramuru</h3>
                </div>
                <div class="client-box" onclick="window.open('https://br.cofcointernational.com/', '_blank')">
                    <img src="src/Assets/clients/cofco.png" alt="Cofco Agri">
                    <h3>Cofco Agri</h3>
                </div>
                <div class="client-box" onclick="window.open('https://www.raizen.com.br/', '_blank')">
                    <img src="src/Assets/clients/raizen.png" alt="Biosev">
                    <h3>Biosev</h3>
                </div>
                <div class="client-box" onclick="window.open('https://fertipar.com.br/', '_blank')">
                    <img src="src/Assets/clients/fertipar.png" alt="Fertipar">
                    <h3>Fertipar</h3>
                </div>
                <div class="client-box" onclick="window.open('https://www.yarabrasil.com.br/', '_blank')">
                    <img src="src/Assets/clients/yara.png" alt="Yara">
                    <h3>Yara</h3>
                </div>
                <div class="client-box" onclick="window.open('https://www.copersucar.com.br/', '_blank')">
                    <img src="src/Assets/clients/copersucar.png" alt="Copersucar">
                    <h3>Copersucar</h3>
                </div>
                <div class="client-box" onclick="window.open('https://www.heringer.com.br/', '_blank')">
                    <img src="src/Assets/clients/heringer.png" alt="Heringer">
                    <h3>Heringer</h3>
                </div>
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