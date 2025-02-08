import { updateActiveState } from '../utils/domUtils.js';

export const aboutContent = {
    history: `
        <div class="history-content">
            <img src="src/Assets/LOGO-APP.png" alt="Logo Transval" class="history-logo">
            <button class="back-button tab-button">Voltar</button>
            
            <p class="company-history"><strong>Nossa História:</strong></p>
            <p class="company-history">Somos uma empresa com raízes familiares, fundada em 1987 por Onevaldo e Valmir. Desde o início, nossa trajetória tem sido marcada pelo compromisso com a qualidade e a eficiência.</p>
            <p class="company-history">Nossa sede administrativa está localizada em Rinópolis, no interior de São Paulo, onde tudo começou. É daqui que coordenamos nossas operações e mantemos vivos os valores que nos trouxeram até aqui.</p>
            <p class="company-history">Com o passar do tempo e visando ampliar nossa atuação, estabelecemos pontos estratégicos em Rondonópolis, MT, e Sumaré, SP. Esses locais contam com escritório e estrutura dedicada à frota, fortalecendo nossa presença e eficiência operacional.</p>
            <p class="company-history"><strong>Operamos com uma infraestrutura que garante excelência no atendimento:</strong></p>
            <ul class="company-history">
                <li>Frota própria, proporcionando agilidade, controle e maior eficiência no transporte de cargas.</li>
                <li>Agenciamento de cargas, conectando soluções logísticas e facilitando operações em todo o território brasileiro.</li>
            </ul>
            <p class="company-history">Além disso, contamos com unidades de embarque estrategicamente localizadas em várias regiões do Brasil, o que amplia nosso alcance e nossa capacidade de atender às mais diversas necessidades de nossos clientes.</p>
            <p class="company-history">Estamos felizes por você fazer parte do nosso time e contribuir para o nosso crescimento!</p>
        </div>
    `,
    mission: `
        <div class="mission-content">
            <img src="src/Assets/LOGO-APP.png" alt="Logo Transval" class="mission-logo">
            <button class="back-button tab-button">Voltar</button>
            
            <p class="company-history"><strong>Nosso Propósito:</strong></p>
            <p class="company-history">Ser um parceiro estratégico dos nossos clientes e transformar a logística nacional com soluções eficientes, transparentes e seguras. Nosso compromisso é entregar qualidade, pontualidade e inovação, atender às necessidades específicas de cada cliente e promover a sustentabilidade, contribuindo ativamente para o avanço do agronegócio e da indústria.</p>
            
            <p class="company-history"><strong>Nossos Princípios:</strong></p>
            <ul class="company-history">
                <li><strong>Foco no Cliente e nos Resultados</strong>
                    Priorizar as necessidades dos clientes, buscando sempre entregar soluções ágeis, eficazes e com resultados positivos.</li>
                
                <li><strong>Agilidade e Rapidez</strong>
                    Responder de forma célere e eficiente, reconhecendo a importância do tempo na construção de relações de sucesso.</li>
                
                <li><strong>Qualidade e Excelência</strong>
                    Garantir processos e entregas de alta qualidade, desenvolvendo com precisão o que foi proposto.</li>
                
                <li><strong>Responsabilidade e Compromisso</strong>
                    Assumir responsabilidades, agir com ética, transparência e dedicação em todas as ações e decisões.</li>
                
                <li><strong>Comunicação e Colaboração</strong>
                    Promover integração entre as áreas, garantindo uma comunicação clara e eficaz para alcançar objetivos comuns.</li>
                
                <li><strong>Segurança e Confiabilidade</strong>
                    Assegurar a execução segura de todas as atividades, conectando pessoas e negócios com confiança.</li>
                
                <li><strong>Trabalho em Equipe e Integração</strong>
                    Valorizar o espírito colaborativo, unindo esforços para superar desafios e alcançar metas com eficiência.</li>
            </ul>
        </div>
    `
};

export function initAboutSection() {
    const content = `
        <div class="initial-view">
            <img src="src/Assets/LOGO-APP.png" alt="Logo Transval" class="company-logo">
            <div class="button-group">
                <button class="tab-button" data-tab="history">História da Empresa</button>
                <button class="tab-button" data-tab="mission">Missão e Valores</button>
            </div>
        </div>
        <div id="history" class="tab-content">${aboutContent.history}</div>
        <div id="mission" class="tab-content">${aboutContent.mission}</div>
    `;

    // Return content first
    setTimeout(() => initAboutEvents(), 0);
    return content;
}

function initAboutEvents() {
    const buttons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const initialView = document.querySelector('.initial-view');

    buttons.forEach(button => {
        button.addEventListener('click', () => handleTabButtonClick(button, initialView, tabContents));
    });

    // Add specific handler for back buttons
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', () => handleBackButtonClick(initialView, tabContents));
    });
}

function handleTabButtonClick(button, initialView, tabContents) {
    if (button.classList.contains('back-button')) {
        // Show initial view, hide tab contents
        initialView.style.display = 'flex';
        tabContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
    } else {
        // Hide initial view, show selected content
        initialView.style.display = 'none';
        const tabId = button.dataset.tab;

        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.style.display = 'block';
                content.classList.add('active');
            } else {
                content.style.display = 'none';
                content.classList.remove('active');
            }
        });

        // Update active state of buttons
        updateActiveState(button, '.tab-button');
    }
}

function handleBackButtonClick(initialView, tabContents) {
    initialView.style.display = 'flex';
    tabContents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });
}