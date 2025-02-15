import { initCarousel } from '../carousel/carousel.js';
import { initAutoSlide } from '../carousel/autoSlide.js';
import { initVideoPlayer } from '../carousel/videoPlayer.js';

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

    loginBtn.addEventListener('click', function () {
        if (this.textContent === 'Logout') {
            sessionStorage.removeItem('isLoggedIn');
            this.textContent = 'Login';
            buttonContainer.classList.remove('logged-in');

            // Add this code to redirect to initial view
            const contentArea = document.querySelector('.content-area');
            contentArea.innerHTML = `
                <div class="carousel">
                    <div class="carousel-container">
                        <img src="./src/Assets/wp3704699-logistics-wallpapers.jpg" class="carousel-slide" alt="Slide 1">
                        <div class="carousel-slide video-slide">
                            <iframe id="youtubeVideo" width="100%" height="100%"
                                src="https://www.youtube.com/embed/AFGSYgrNYQ8?enablejsapi=1&showinfo=0" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>
                        <img src="./src/Assets/wp7708047-logistic-wallpapers.jpg" class="carousel-slide" alt="Slide 3">
                        <img src="./src/Assets/wp7708138-logistic-wallpapers.jpg" class="carousel-slide" alt="Slide 4">
                    </div>
                    <div class="carousel-navigation">
                        <button class="carousel-button prev" aria-label="Previous slide">&#10094;</button>
                        <button class="carousel-button next" aria-label="Next slide">&#10095;</button>
                    </div>
                </div>
                <div class="news-navigation">
                    <span class="current-news">1</span> / <span class="total-news">4</span>
                </div>
                <p class="news-content">WL Scania: Excelência em Transporte - Parceria Transval</p>
            `;

            // Reinitialize carousel
            initCarousel();
            initAutoSlide();
            initVideoPlayer();
        } else {
            modal.style.display = 'block';
        }
    });

    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    submitLoginBtn.addEventListener('click', function () {
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
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default action
            postLoginContents.forEach(content => content.classList.remove('active'));
            postLoginContents[index].classList.add('active');
            postLoginBoxes.forEach(box => box.classList.remove('active'));
            postLoginBoxes[index].classList.add('active');
        });
    });
}
