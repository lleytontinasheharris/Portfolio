/* ================================================================
   LLEYTON TINASHE HARRIS — PORTFOLIO v4
   script.js — Complete Navigation & Interactions
================================================================ */

// ================================================================
// CONFIGURATION
// ================================================================

const CONFIG = {
  pages: {
    about:          'pages/about.html',
    skills:         'pages/skills.html',
    projects:       'pages/projects.html',
    certifications: 'pages/certifications.html',
    contact:        'pages/contact.html'
  },
  transitionDuration: 400
};

// ================================================================
// STATE
// ================================================================

const state = {
  currentPage: null,
  isTransitioning: false
};

// ================================================================
// DOM REFERENCES
// ================================================================

const DOM = {
  landing:       document.getElementById('landing'),
  pageContainer: document.getElementById('page-container'),
  loader:        document.getElementById('page-loader'),
  navbar:        document.getElementById('navbar'),
  homeBtn:       document.getElementById('home-btn'),
  hamburger:     document.getElementById('hamburger'),
  mobileMenu:    document.getElementById('mobile-menu'),
  navBtns:       document.querySelectorAll('.nav-btn'),
  mobileNavBtns: document.querySelectorAll('.mobile-nav-btn')
};

// ================================================================
// INITIALIZE
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
  initNavigation();
  initHomeButton();
  initHamburger();
  initLandingButtons();
  initScrollEffect();
});

// ================================================================
// NAVIGATION — Desktop navbar buttons
// ================================================================

function initNavigation() {
  DOM.navBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const pageName = this.getAttribute('data-page');
      if (pageName && !state.isTransitioning) {
        navigateTo(pageName);
        closeMobileMenu();
      }
    });
  });

  // Mobile nav buttons
  DOM.mobileNavBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const pageName = this.getAttribute('data-page');
      if (pageName && !state.isTransitioning) {
        navigateTo(pageName);
        closeMobileMenu();
      }
    });
  });
}

// ================================================================
// HOME BUTTON — Logo click returns to landing
// ================================================================

function initHomeButton() {
  if (DOM.homeBtn) {
    DOM.homeBtn.addEventListener('click', function () {
      if (!state.isTransitioning) {
        goHome();
      }
    });
  }
}

// ================================================================
// LANDING PAGE BUTTONS
// "View My Work" and "Get In Touch"
// ================================================================

function initLandingButtons() {
  const landingBtns = document.querySelectorAll('.btn[data-page]');

  landingBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const pageName = this.getAttribute('data-page');
      if (pageName && !state.isTransitioning) {
        navigateTo(pageName);
      }
    });
  });
}

// ================================================================
// HAMBURGER — Mobile menu toggle
// ================================================================

function initHamburger() {
  if (DOM.hamburger) {
    DOM.hamburger.addEventListener('click', function () {
      toggleMobileMenu();
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (
      DOM.mobileMenu.classList.contains('is-open') &&
      !DOM.mobileMenu.contains(e.target) &&
      !DOM.hamburger.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });
}

function toggleMobileMenu() {
  DOM.hamburger.classList.toggle('is-open');
  DOM.mobileMenu.classList.toggle('is-open');
}

function closeMobileMenu() {
  DOM.hamburger.classList.remove('is-open');
  DOM.mobileMenu.classList.remove('is-open');
}

// ================================================================
// SCROLL EFFECT — Navbar background on scroll
// ================================================================

function initScrollEffect() {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      DOM.navbar.style.background = 'rgba(10, 14, 39, 0.95)';
    } else {
      DOM.navbar.style.background = 'rgba(10, 14, 39, 0.7)';
    }
  });
}

// ================================================================
// NAVIGATE TO PAGE
// Core function — loads a page with transitions
// ================================================================

async function navigateTo(pageName) {
  // Prevent double navigation
  if (state.isTransitioning) return;
  if (state.currentPage === pageName) return;

  state.isTransitioning = true;

  const filePath = CONFIG.pages[pageName];

  if (!filePath) {
    console.error(`Page not found: ${pageName}`);
    state.isTransitioning = false;
    return;
  }

  // Show loader
  showLoader();

  try {
    // Fetch page content
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Could not load ${filePath}`);
    }

    const html = await response.text();

    // Fade out landing or current page
    await fadeOut();

    // Inject new content
    DOM.pageContainer.innerHTML = html;

    // Show page container, hide landing
    DOM.landing.classList.remove('page--visible');
    DOM.landing.classList.add('page--hidden');
    DOM.pageContainer.classList.remove('page--hidden');
    DOM.pageContainer.classList.add('page--visible');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update active nav link
    setActiveNavLink(pageName);

    // Update state
    state.currentPage = pageName;

    // Hide loader
    hideLoader();

    // Trigger animations on newly loaded content
    triggerContentAnimations();

  } catch (error) {
    console.error('Navigation error:', error);
    showErrorPage(error.message);
    hideLoader();
  }

  // Small delay before allowing next navigation
  setTimeout(() => {
    state.isTransitioning = false;
  }, CONFIG.transitionDuration);
}

// ================================================================
// GO HOME
// Return to landing page
// ================================================================

async function goHome() {
  if (state.isTransitioning) return;
  if (state.currentPage === null) return;

  state.isTransitioning = true;

  // Fade out current page
  await fadeOut();

  // Clear page container
  DOM.pageContainer.innerHTML = '';
  DOM.pageContainer.classList.remove('page--visible');
  DOM.pageContainer.classList.add('page--hidden');

  // Show landing
  DOM.landing.classList.remove('page--hidden');
  DOM.landing.classList.add('page--visible');

  // Remove active nav links
  clearActiveNavLinks();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update state
  state.currentPage = null;

  setTimeout(() => {
    state.isTransitioning = false;
  }, CONFIG.transitionDuration);
}

// ================================================================
// FADE OUT
// Returns a promise that resolves after transition
// ================================================================

function fadeOut() {
  return new Promise(resolve => {
    // Fade out whichever is currently visible
    if (DOM.landing.classList.contains('page--visible')) {
      DOM.landing.style.opacity = '0';
      DOM.landing.style.transition = `opacity ${CONFIG.transitionDuration}ms ease`;
    }

    if (DOM.pageContainer.classList.contains('page--visible')) {
      DOM.pageContainer.style.opacity = '0';
      DOM.pageContainer.style.transition = `opacity ${CONFIG.transitionDuration}ms ease`;
    }

    setTimeout(() => {
      DOM.landing.style.opacity = '';
      DOM.landing.style.transition = '';
      DOM.pageContainer.style.opacity = '';
      DOM.pageContainer.style.transition = '';
      resolve();
    }, CONFIG.transitionDuration);
  });
}

// ================================================================
// ACTIVE NAV LINK
// Highlights correct navbar button
// ================================================================

function setActiveNavLink(pageName) {
  clearActiveNavLinks();

  const activeBtn = document.querySelector(
    `.nav-btn[data-page="${pageName}"]`
  );

  if (activeBtn) {
    activeBtn.classList.add('nav-btn--active');
  }
}

function clearActiveNavLinks() {
  DOM.navBtns.forEach(btn => {
    btn.classList.remove('nav-btn--active');
  });
}

// ================================================================
// LOADER
// Show and hide loading spinner
// ================================================================

function showLoader() {
  if (DOM.loader) {
    DOM.loader.classList.add('is-loading');
  }
}

function hideLoader() {
  if (DOM.loader) {
    DOM.loader.classList.remove('is-loading');
  }
}

// ================================================================
// ERROR PAGE
// Show a styled error if page fails to load
// ================================================================

function showErrorPage(message) {
  DOM.landing.classList.add('page--hidden');
  DOM.landing.classList.remove('page--visible');

  DOM.pageContainer.innerHTML = `
    <div class="page-content">
      <div class="page-header">
        <div class="page-header__icon">!</div>
        <div>
          <p class="page-header__number">ERROR</p>
          <h1 class="page-header__title">Page Not Found</h1>
        </div>
      </div>
      <div class="glass-card">
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">
          Something went wrong loading this page.
        </p>
        <p style="color: var(--text-muted); font-size: 0.85rem;">
          ${message}
        </p>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 1rem;">
          If you are running this locally, open it through a local server.<br/>
          Run: <strong style="color: var(--accent-cyan);">python -m http.server 8000</strong>
          then visit <strong style="color: var(--accent-cyan);">localhost:8000</strong>
        </p>
      </div>
    </div>
  `;

  DOM.pageContainer.classList.remove('page--hidden');
  DOM.pageContainer.classList.add('page--visible');
  state.currentPage = 'error';
}

// ================================================================
// CONTENT ANIMATIONS
// Stagger animate cards when page loads
// ================================================================

function triggerContentAnimations() {
  const cards = DOM.pageContainer.querySelectorAll('.glass-card');

  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'none';

    setTimeout(() => {
      card.style.transition = `
        opacity 0.4s ease,
        transform 0.4s ease
      `;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + index * 80);
  });
}

// ================================================================
// KEYBOARD SHORTCUTS
// ================================================================

document.addEventListener('keydown', function (e) {
  // Ignore if typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }

  const shortcuts = {
    'h': () => goHome(),
    'H': () => goHome(),
    '1': () => navigateTo('about'),
    '2': () => navigateTo('skills'),
    '3': () => navigateTo('projects'),
    '4': () => navigateTo('certifications'),
    '5': () => navigateTo('contact'),
    'Escape': () => goHome()
  };

  if (shortcuts[e.key]) {
    shortcuts[e.key]();

    // Sync active nav link for number shortcuts
    const pageMap = {
      '1': 'about',
      '2': 'skills',
      '3': 'projects',
      '4': 'certifications',
      '5': 'contact'
    };

    if (pageMap[e.key]) {
      setActiveNavLink(pageMap[e.key]);
    }
  }
});