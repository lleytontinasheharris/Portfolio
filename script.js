/* ================================================================
   LLEYTON TINASHE HARRIS — PORTFOLIO v5
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
  transitionDuration: 300
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
  sidebar:       document.getElementById('sidebar'),
  homeBtn:       document.getElementById('home-btn'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
  navLinks:      document.querySelectorAll('.nav-link'),
  landingBtns:   document.querySelectorAll('.btn[data-page]')
};

// ================================================================
// INITIALIZE
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
  initNavigation();
  initHomeButton();
  initSidebarToggle();
  initLandingButtons();
  initKeyboardShortcuts();
});

// ================================================================
// SIDEBAR NAVIGATION
// ================================================================

function initNavigation() {
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', function () {
      const pageName = this.getAttribute('data-page');
      if (pageName && !state.isTransitioning) {
        navigateTo(pageName);
        closeSidebar();
      }
    });
  });
}

// ================================================================
// HOME BUTTON
// ================================================================

function initHomeButton() {
  if (DOM.homeBtn) {
    DOM.homeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!state.isTransitioning) {
        goHome();
        closeSidebar();
      }
    });
  }
}

// ================================================================
// SIDEBAR TOGGLE (Mobile)
// ================================================================

function initSidebarToggle() {
  if (DOM.sidebarToggle) {
    DOM.sidebarToggle.addEventListener('click', function () {
      toggleSidebar();
    });
  }

  // Close sidebar when clicking outside
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      if (
        DOM.sidebar.classList.contains('is-open') &&
        !DOM.sidebar.contains(e.target) &&
        !DOM.sidebarToggle.contains(e.target)
      ) {
        closeSidebar();
      }
    }
  });
}

function toggleSidebar() {
  DOM.sidebarToggle.classList.toggle('is-open');
  DOM.sidebar.classList.toggle('is-open');
}

function closeSidebar() {
  DOM.sidebarToggle.classList.remove('is-open');
  DOM.sidebar.classList.remove('is-open');
}

// ================================================================
// LANDING PAGE BUTTONS
// ================================================================

function initLandingButtons() {
  DOM.landingBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const pageName = this.getAttribute('data-page');
      if (pageName && !state.isTransitioning) {
        navigateTo(pageName);
        closeSidebar();
      }
    });
  });
}

// ================================================================
// NAVIGATE TO PAGE
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

  // Delay before allowing next navigation
  setTimeout(() => {
    state.isTransitioning = false;
  }, CONFIG.transitionDuration);
}

// ================================================================
// GO HOME
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
// ================================================================

function fadeOut() {
  return new Promise(resolve => {
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
// ================================================================

function setActiveNavLink(pageName) {
  clearActiveNavLinks();

  const activeLink = document.querySelector(
    `.nav-link[data-page="${pageName}"]`
  );

  if (activeLink) {
    activeLink.classList.add('nav-link--active');
  }
}

function clearActiveNavLinks() {
  DOM.navLinks.forEach(link => {
    link.classList.remove('nav-link--active');
  });
}

// ================================================================
// LOADER
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
          <h1 class="page-header__title">Failed to Load</h1>
        </div>
      </div>
      <div class="card">
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">
          There was an error loading this page.
        </p>
        <p style="color: var(--text-muted); font-size: 0.9rem;">
          ${message}
        </p>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem;">
          Make sure you're running this on a local server.
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
// ================================================================

function triggerContentAnimations() {
  const cards = DOM.pageContainer.querySelectorAll('.card');

  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'none';

    setTimeout(() => {
      card.style.transition = `
        opacity 0.4s ease,
        transform 0.4s ease
      `;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 80 + index * 60);
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
    'h': () => { goHome(); closeSidebar(); },
    'H': () => { goHome(); closeSidebar(); },
    '1': () => { navigateTo('about'); closeSidebar(); },
    '2': () => { navigateTo('skills'); closeSidebar(); },
    '3': () => { navigateTo('projects'); closeSidebar(); },
    '4': () => { navigateTo('certifications'); closeSidebar(); },
    '5': () => { navigateTo('contact'); closeSidebar(); },
    'Escape': () => { goHome(); closeSidebar(); }
  };

  if (shortcuts[e.key]) {
    shortcuts[e.key]();

    // Sync active nav link
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