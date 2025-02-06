export function initLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const modal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const submitLoginBtn = document.getElementById('submitLoginBtn');
    const buttonContainer = document.querySelector('.button-container');
    
    // Show/hide button container based on login status
    if (sessionStorage.getItem('isLoggedIn')) {
        buttonContainer.classList.add('logged-in');
        loginBtn.textContent = 'Logout';
    }

    loginBtn.addEventListener('click', function() {
        if (this.textContent === 'Logout') {
            sessionStorage.removeItem('isLoggedIn');
            this.textContent = 'Login';
            buttonContainer.classList.remove('logged-in');
        } else {
            modal.style.display = 'block';
        }
    });

    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    submitLoginBtn.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Usuário e senha são obrigatórios.');
            return;
        }

        if (username === 'admin' && password === 'admin123') {
            buttonContainer.classList.add('logged-in');
            loginBtn.textContent = 'Logout';
            sessionStorage.setItem('isLoggedIn', 'true');
            modal.style.display = 'none';
            
            // Initialize downloads button functionality after login
            initDownloadsButton();
        } else {
            alert('Usuário ou senha incorretos.');
        }
    });

    // Initialize downloads button if user is already logged in
    if (sessionStorage.getItem('isLoggedIn')) {
        initDownloadsButton();
    }

    const postLoginButtons = document.querySelectorAll('.button-container button');
    const postLoginContents = document.querySelectorAll('.post-login-content');
    const postLoginBoxes = document.querySelectorAll('.post-login-box');

    postLoginButtons.forEach((button, index) => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default action
            postLoginContents.forEach(content => content.classList.remove('active'));
            postLoginContents[index].classList.add('active');
            postLoginBoxes.forEach(box => box.classList.remove('active'));
            postLoginBoxes[index].classList.add('active');
        });
    });
}

function initDownloadsButton() {
    const downloadsBtn = document.getElementById('downloadsBtn');
    if (downloadsBtn) {
        downloadsBtn.addEventListener('click', () => {
            const contentArea = document.querySelector('.content-area');
            contentArea.innerHTML = `
                <div class="downloads-container">
                    <h2>Arquivos para Download</h2>
                    <div class="downloads-grid">
                        <div class="download-item">
                            <i class="fas fa-file-pdf"></i>
                            <h3>Apostila Gerencial - Módulo 1</h3>
                            <a href="src/downloads/apostila_gerencial_modulo1.pdf" 
                               download 
                               class="download-button"
                               data-filetype="pdf">Baixar PDF</a>
                        </div>
                        <div class="download-item">
                            <i class="fas fa-file-pdf"></i>
                            <h3>Apostila Gerencial - Módulo 2</h3>
                            <a href="src/downloads/apostila_gerencial_modulo2.pdf" 
                               download 
                               class="download-button"
                               data-filetype="pdf">Baixar PDF</a>
                        </div>
                        <!-- Existing downloads -->
                        <div class="download-item">
                            <i class="fas fa-file-pdf"></i>
                            <h3>RH Recrutamento</h3>
                            <a href="src/downloads/MANUAL - RH RECRUTAMENTO.pdf" 
                               download 
                               class="download-button"
                               data-filetype="pdf">Baixar PDF</a>
                        </div>
                        <div class="download-item">
                            <i class="fas fa-file-pdf"></i>
                            <h3>Relatório de Gestão - A Faturar</h3>
                            <a href="src/downloads/MANUAL - Relatório de gestão - A faturar.pdf" 
                               download 
                               class="download-button"
                               data-filetype="pdf">Baixar PDF</a>
                        </div>
                    </div>
                </div>
            `;

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