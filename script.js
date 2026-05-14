/* ================================================================
   LLEYTON TINASHE HARRIS — FUTURISTIC PORTFOLIO
   Navigation & Page Loading System
================================================================ */

const pageOverlay = document.getElementById('page-overlay');
const pageContent = document.getElementById('page-content');
const closePageBtn = document.getElementById('close-page');
const navCards = document.querySelectorAll('.nav-card[data-navigate]');
const ctaButtons = document.querySelectorAll('[data-navigate]');

let currentPage = null;
let isLoading = false;

// ================================================================
// NAVIGATION HANDLER
// ================================================================

async function navigateTo(pageName) {
    if (isLoading) return;
    if (currentPage === pageName) return;

    isLoading = true;
    currentPage = pageName;

    // Lock ONLY the body scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Show overlay
    pageOverlay.classList.add('active');

    try {
        const response = await fetch(`pages/${pageName}.html`);

        if (!response.ok) {
            throw new Error(`Failed to load ${pageName}.html`);
        }

        const html = await response.text();

        pageContent.innerHTML = html;

        // Reset overlay scroll to top
        pageOverlay.scrollTop = 0;

        // Init expand buttons after content loads
        initExpandButtons();

        setTimeout(() => {
            animatePageContent();
        }, 100);

    } catch (error) {
        console.error('Navigation error:', error);
        pageContent.innerHTML = `
            <div class="error-container">
                <div class="error-card">
                    <h2>Failed to Load Page</h2>
                    <p>Could not load <strong>${pageName}.html</strong></p>
                    <p class="error-hint">Make sure you're running this on a local server.</p>
                    <button class="btn-primary" onclick="closePage()">Go Back</button>
                </div>
            </div>
        `;
    }

    isLoading = false;
}

function closePage() {
    // Unlock body scroll
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    pageOverlay.classList.remove('active');
    currentPage = null;

    setTimeout(() => {
        pageContent.innerHTML = '';
    }, 600);
}

// ================================================================
// EXPAND BUTTONS — init after page loads
// ================================================================

function initExpandButtons() {
    const expandBtns = pageContent.querySelectorAll('.expand-btn');

    expandBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const card = this.closest('.project-card');
            if (!card) return;
            card.classList.toggle('expanded');

            const label = this.querySelector('.expand-label');
            if (label) {
                label.textContent = card.classList.contains('expanded')
                    ? 'Show Less'
                    : 'Read More';
            }

            const icon = this.querySelector('.expand-icon');
            if (icon) {
                icon.style.transform = card.classList.contains('expanded')
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)';
            }
        });
    });
}

// ================================================================
// ANIMATE PAGE CONTENT
// ================================================================

function animatePageContent() {
    const cards = pageContent.querySelectorAll(
        '.content-card, .project-card, .skill-category, .cert-item, .contact-method'
    );

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ================================================================
// EVENT LISTENERS
// ================================================================

navCards.forEach(card => {
    card.addEventListener('click', () => {
        const page = card.getAttribute('data-navigate');
        navigateTo(page);
    });
});

ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.getAttribute('data-navigate');
        navigateTo(page);
    });
});

closePageBtn.addEventListener('click', closePage);

pageOverlay.addEventListener('click', (e) => {
    if (e.target === pageOverlay) {
        closePage();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pageOverlay.classList.contains('active')) {
        closePage();
    }
});

// ================================================================
// SMOOTH SCROLL
// ================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ================================================================
// PARALLAX
// ================================================================

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

function handleScroll() {
    const scrolled = window.pageYOffset;
    const glowOrbs = document.querySelectorAll('.glow-orb');

    glowOrbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.3;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// ================================================================
// GLASSMORPHIC NAV LINK HANDLING
// ================================================================

const navLinks = document.querySelectorAll('.nav-glass__link');
const mobileToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.querySelector('.nav-glass__menu');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const target = this.getAttribute('data-navigate');
        
        if (target && target !== 'home') {
            e.preventDefault();
            navigateTo(target);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove('mobile-open');
            }
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
            }
        } else if (target === 'home') {
            e.preventDefault();
            closePage();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Mobile menu toggle
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('mobile-open');
    });
}

// Action cards navigation
const actionCards = document.querySelectorAll('.action-card[data-navigate]');
actionCards.forEach(card => {
    card.addEventListener('click', () => {
        const page = card.getAttribute('data-navigate');
        navigateTo(page);
    });
});