// --- EFECTO DE SCROLL EN EL HEADER ---
const header = document.getElementById('header');
function handleHeaderScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', throttle(handleHeaderScroll, 50));
document.addEventListener('DOMContentLoaded', handleHeaderScroll); // Asegura el estado inicial al cargar


// Utilidades
function throttle(fn, wait) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}

// --- MODO OSCURO ---
function setDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);
    setDarkModeIcon();
}

const darkModeBtn = document.getElementById('darkModeToggle');
const darkModeBtnMobile = document.getElementById('darkModeToggleMobile');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const darkModePref = localStorage.getItem('darkMode');

setDarkMode(darkModePref === 'true' || (!darkModePref && prefersDark));

if (darkModeBtn) darkModeBtn.addEventListener('click', () => setDarkMode(!document.body.classList.contains('dark-mode')));
if (darkModeBtnMobile) darkModeBtnMobile.addEventListener('click', () => setDarkMode(!document.body.classList.contains('dark-mode')));

function setDarkModeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    const sun = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    const moon = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>';
    if (darkModeBtn) darkModeBtn.innerHTML = isDark ? moon : sun;
    if (darkModeBtnMobile) darkModeBtnMobile.innerHTML = isDark ? moon : sun;
}
setDarkModeIcon();






// --- BOTÓN IR ARRIBA ---
const scrollToTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
}, 100));
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- ANIMACIONES DE ENTRADA ---
function revealSectionsOnScroll() {
    document.querySelectorAll('.section-anim').forEach(section => {
        if (section.classList.contains('visible')) return;
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            section.classList.add('visible');
            // Animación escalonada para tarjetas
            const cards = section.querySelectorAll('.card-anim');
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, i * 120);
            });
        }
    });
}
window.addEventListener('scroll', throttle(revealSectionsOnScroll, 100));
window.addEventListener('DOMContentLoaded', revealSectionsOnScroll);

// --- PARALLAX EN EL BANNER ---
const parallaxBanner = document.querySelector('.parallax-banner');
window.addEventListener('scroll', throttle(() => {
    if (parallaxBanner) {
        const offset = window.scrollY * 0.3;
        parallaxBanner.style.transform = `translateY(${offset}px)`;
    }
}, 20));

// --- BANNER DINÁMICO ---
const bannerImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=80"
];
let currentBanner = 0;
const bannerImg = document.getElementById('bannerImage');
const bannerPrev = document.getElementById('bannerPrev');
const bannerNext = document.getElementById('bannerNext');
const bannerDots = document.getElementById('bannerDots');

function updateBanner(index) {
    if (!bannerImg) return;
    bannerImg.classList.add('fade');
    setTimeout(() => {
        bannerImg.src = bannerImages[index];
        bannerImg.classList.remove('fade');
    }, 400);
    // Actualizar dots
    if (bannerDots) {
        bannerDots.querySelectorAll('.banner-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
}

function nextBanner() {
    currentBanner = (currentBanner + 1) % bannerImages.length;
    updateBanner(currentBanner);
}
function prevBanner() {
    currentBanner = (currentBanner - 1 + bannerImages.length) % bannerImages.length;
    updateBanner(currentBanner);
}
if (bannerPrev && bannerNext) {
    bannerPrev.addEventListener('click', () => { prevBanner(); startBannerAutoSlide(); });
    bannerNext.addEventListener('click', () => { nextBanner(); startBannerAutoSlide(); });
}
// Dots
if (bannerDots) {
    bannerDots.innerHTML = bannerImages.map((_, i) => `<span class="banner-dot${i===0?' active':''}" data-index="${i}" tabindex="0" aria-label="Banner ${i+1}" role="button"></span>`).join('');
    bannerDots.addEventListener('click', e => {
        const dot = e.target.closest('.banner-dot');
        if (dot) {
            const idx = parseInt(dot.getAttribute('data-index'));
            currentBanner = idx;
            updateBanner(currentBanner);
            startBannerAutoSlide();
        }
    });
    bannerDots.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('banner-dot')) {
            e.preventDefault();
            e.target.click();
        }
    });
}

let bannerInterval = null;
function startBannerAutoSlide() {
    if (bannerInterval) clearInterval(bannerInterval);
    bannerInterval = setInterval(() => {
        nextBanner();
    }, 5000);
}
if (bannerImg) startBannerAutoSlide();

// Pausar auto-slide al pasar el mouse o tocar en dispositivos táctiles
if (bannerImg) {
    const bannerContainer = document.getElementById('dynamicBanner');
    function pauseBannerAutoSlide() {
        if (bannerInterval) clearInterval(bannerInterval);
    }
    function resumeBannerAutoSlide() {
        startBannerAutoSlide();
    }
    if (bannerContainer) {
        bannerContainer.addEventListener('mouseenter', pauseBannerAutoSlide);
        bannerContainer.addEventListener('mouseleave', resumeBannerAutoSlide);
        bannerContainer.addEventListener('touchstart', pauseBannerAutoSlide, {passive:true});
        bannerContainer.addEventListener('touchend', resumeBannerAutoSlide, {passive:true});
    }
}

// --- MENÚ LATERAL MODERNO ---
const menuToggle = document.getElementById('menuToggle');
const menuPanel = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const mainMenuLinks = document.querySelectorAll('.menu-panel .main-menu a');

function openMenu() {
    menuPanel.classList.add('active');
    menuOverlay.classList.add('active');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuPanel.setAttribute('tabindex', '-1');
    menuPanel.setAttribute('aria-modal', 'true');
    menuPanel.setAttribute('role', 'dialog');
    menuPanel.focus();
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    menuPanel.classList.remove('active');
    menuOverlay.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuToggle.focus();
}
if (menuToggle && menuPanel && menuOverlay) {
    menuToggle.addEventListener('click', () => {
        if (menuPanel.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    menuOverlay.addEventListener('click', closeMenu);
    mainMenuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuPanel.classList.contains('active')) {
            closeMenu();
        }
    });
}

// --- AÑO AUTOMÁTICO EN EL FOOTER ---
const footerYear = document.getElementById('footerYear');
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

// --- SCROLL SUAVE PARA ENLACES INTERNOS Y CTA ---
document.body.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) {
            window.scrollTo({
                top: el.getBoundingClientRect().top + window.scrollY - 60,
                behavior: 'smooth'
            });
        }
        if (link.classList.contains('banner-cta') && window.innerWidth <= 600) {
            if (typeof closeMenu === 'function') closeMenu();
        }
    }
});

// --- VALIDACIÓN VISUAL Y ACCESIBILIDAD EN FORMULARIO ---
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;
        contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#e74c3c';
                input.setAttribute('aria-invalid', 'true');
                input.setAttribute('aria-describedby', 'formError');
                valid = false;
            } else {
                input.style.borderColor = '#0e293c';
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
            }
        });
        if (valid) {
            formSuccess.style.display = 'block';
            formSuccess.setAttribute('role', 'status');
            formSuccess.setAttribute('aria-live', 'polite');
            contactForm.reset();
            setTimeout(() => { formSuccess.style.display = 'none'; }, 3500);
        }
    });
    contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#0e293c';
                this.removeAttribute('aria-invalid');
                this.removeAttribute('aria-describedby');
            }
        });
    });
}

// --- INDICADOR DE SECCIÓN ACTIVA EN EL MENÚ ---
function setActiveMenuLink() {
    const sections = ['#articles', '#testimonials', '#contact'];
    let current = '';
    const scrollY = window.scrollY + 80;
    for (const id of sections) {
        const el = document.querySelector(id);
        if (el && el.offsetTop <= scrollY) {
            current = id;
        }
    }
    document.querySelectorAll('.main-menu a').forEach(link => {
        if (link.getAttribute('href') === current) {
            link.classList.add('active-section');
        } else {
            link.classList.remove('active-section');
        }
    });
}
window.addEventListener('scroll', throttle(setActiveMenuLink, 100));
window.addEventListener('DOMContentLoaded', setActiveMenuLink);
// --- FIN ---