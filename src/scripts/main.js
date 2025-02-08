import { initNavigation } from './modules/navigation.js';
import { initCarousel } from './modules/carousel/carousel.js';
import { initAutoSlide } from './modules/carousel/autoSlide.js';
import { initVideoPlayer } from './modules/carousel/videoPlayer.js';
import { initLogin } from './modules/auth/login.js';
import { initDownloadsEvents } from './modules/content/download.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCarousel();
    initAutoSlide();
    initVideoPlayer();
    initLogin();
    initDownloadsEvents();
});