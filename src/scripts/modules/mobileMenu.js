export function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuButton.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });

    document.addEventListener('click', function (event) {
        if (!navMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });
}