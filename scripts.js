// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navigation = document.getElementById('navigation');

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close mobile menu when clicking on links and wait for close animation before scrolling
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();

                    // close menu first so layout reflows
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');

                    // wait for the menu close transition to finish (match CSS ~360ms)
                    const wait = 420;
                    setTimeout(() => {
                        scrollToSection(href.substring(1));
                    }, wait);
                }
            });
        });
    }

    // Navigation background on scroll
    if (navigation) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navigation.style.background = 'rgba(255, 255, 255, 0.95)';
                navigation.style.backdropFilter = 'blur(20px)';
            } else {
                navigation.style.background = 'rgba(255, 255, 255, 0.9)';
                navigation.style.backdropFilter = 'blur(16px)';
            }
        });
    }
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
    // Only handle actual anchor links (we handle mobile links separately above)
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // If it's an in-page anchor and not a mobile link (mobile handled above)
            if (targetId && targetId.startsWith('#') && !this.classList.contains('mobile-nav-link')) {
                e.preventDefault();
                scrollToSection(targetId.substring(1));
            }
        });
    });
}

// Scroll to section function (more precise and accounts for fixed nav + small gap)
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const nav = document.getElementById('navigation');
    const navHeight = nav ? nav.offsetHeight : 0;

    // Compute exact document position of the element
    const elementTop = element.getBoundingClientRect().top + window.scrollY;

    // Extra spacing so section isn't glued to the nav
    const extraSpacing = 0;

    const targetPosition = Math.max(elementTop - navHeight - extraSpacing, 0);

    // focus for accessibility
    element.setAttribute('tabindex', '-1');
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    element.focus({ preventScroll: true });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.feature-card, .value-card, .team-card, .ods-card, .target-card, .card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link, .mobile-nav-link');

    window.addEventListener('scroll', function () {
        let current = '';
        const navHeight = document.getElementById('navigation').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Card hover effects
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.feature-card, .team-card, .ods-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Button click handlers
document.addEventListener('DOMContentLoaded', function () {
    // Apply buttons
    const applyButtons = document.querySelectorAll('.apply-button');
    applyButtons.forEach(btn => {
        if (!btn.hasAttribute('onclick')) {
            btn.addEventListener('click', () => {
                window.location.href = 'https://www.instagram.com/via_incubadora/';
            });
        }
    });

    // Learn more buttons
    const learnMoreButtons = document.querySelectorAll('.btn-contact-secondary, .btn-hero-secondary');
    learnMoreButtons.forEach(btn => {
        if (!btn.hasAttribute('onclick')) {
            btn.addEventListener('click', () => {
                const section = document.getElementById('sobre-nosotros');
                section.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for scroll events
const debouncedScrollHandler = debounce(function () {
    // Handle scroll-based animations or effects here if needed
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add CSS for active nav links
const style = document.createElement('style');
style.textContent = `
    .nav-link.active,
    .mobile-nav-link.active {
        color: var(--primary) !important;
        font-weight: 600;
    }
    
    .nav-link.active::after,
    .mobile-nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--primary);
        border-radius: 1px;
    }
    
    .nav-link {
        position: relative;
    }
`;
document.head.appendChild(style);