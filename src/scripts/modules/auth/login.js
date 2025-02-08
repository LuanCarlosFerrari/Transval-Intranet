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
        } else {
            alert('Usuário ou senha incorretos.');
        }
    });

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
