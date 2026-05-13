/* ================================================================
   LLEYTON TINASHE HARRIS — PORTFOLIO v3
   script.js — Multi-Page Architecture
   
   Handles:
   - Page loading with fade transitions
   - Navbar link highlighting
   - Home navigation
================================================================ */

// ================================================================
// PAGE CONFIGURATION
// Maps page names to their file paths
// ================================================================

const pages = {
  about: 'pages/about.html',
  skills: 'pages/skills.html',
  projects: 'pages/projects.html',
  certifications: 'pages/certifications.html',
  contact: 'pages/contact.html'
};

// DOM elements
const landingPage = document.getElementById('landing-page');
const pageContainer = document.getElementById('page-container');
const navbarLinks = document.querySelectorAll('.navbar__link');
const homeLogo = document.getElementById('home-link');

// ================================================================
// INITIALIZE
// Set up event listeners when page loads
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeHomeLogo();
});

// ================================================================
// INITIALIZE NAVIGATION
// Attach click handlers to all navbar menu links
// ================================================================

function initializeNavigation() {
  navbarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const pageName = this.getAttribute('data-page');
      
      if (pageName) {
        loadPage(pageName);
        setActiveLink(this);
      }
    });
  });
}

// ================================================================
// INITIALIZE HOME LOGO
// Logo click returns to landing page
// ================================================================

function initializeHomeLogo() {
  if (homeLogo) {
    homeLogo.addEventListener('click', function(e) {
      e.preventDefault();
      goHome();
    });
  }
}

// ================================================================
// LOAD PAGE
// Fetches a page from pages/ folder and displays it with fade
// ================================================================

function loadPage(pageName) {
  const filePath = pages[pageName];

  if (!filePath) {
    console.error(`Page "${pageName}" not found in configuration`);
    return;
  }

  // Start fade out
  if (landingPage.classList.contains('page--active')) {
    landingPage.classList.remove('page--active');
  }
  
  if (pageContainer.classList.contains('page--active')) {
    pageContainer.classList.remove('page--active');
  }

  // Wait for fade out to complete before loading new content
  setTimeout(() => {
    // Fetch the page content
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${filePath}: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        // Insert content into page container
        pageContainer.innerHTML = html;

        // Small delay before fading in (smoother transition)
        setTimeout(() => {
          pageContainer.classList.add('page--active');
        }, 50);

        // Scroll to top
        window.scrollTo(0, 0);
      })
      .catch(error => {
        console.error('Error loading page:', error);
        pageContainer.innerHTML = `
          <section class="section section--page">
            <div class="section__header">
              <span class="section__number">ERROR</span>
              <h2 class="section__title">Page Not Found</h2>
            </div>
            <div class="section__body">
              <p>Sorry, the requested page could not be loaded.</p>
              <p>Error: ${error.message}</p>
            </div>
          </section>
        `;
        pageContainer.classList.add('page--active');
      });
  }, 300); // Match CSS transition duration
}

// ================================================================
// GO HOME
// Returns to landing page with fade transition
// ================================================================

function goHome() {
  // Fade out current page
  if (pageContainer.classList.contains('page--active')) {
    pageContainer.classList.remove('page--active');
  }

  // Wait for fade out
  setTimeout(() => {
    // Clear page container
    pageContainer.innerHTML = '';

    // Fade in landing page
    landingPage.classList.add('page--active');

    // Remove active state from all nav links
    navbarLinks.forEach(link => {
      link.classList.remove('navbar__link--active');
    });

    // Scroll to top
    window.scrollTo(0, 0);
  }, 300);
}

// ================================================================
// SET ACTIVE LINK
// Highlights the current navbar link
// ================================================================

function setActiveLink(activeLink) {
  // Remove active class from all links
  navbarLinks.forEach(link => {
    link.classList.remove('navbar__link--active');
  });

  // Add active class to clicked link
  if (activeLink) {
    activeLink.classList.add('navbar__link--active');
  }
}

// ================================================================
// OPTIONAL: Keyboard shortcuts
// Press 'H' to go home from anywhere
// Press '1'-'5' to navigate to sections
// ================================================================

document.addEventListener('keydown', function(e) {
  // H = Home
  if (e.key.toLowerCase() === 'h' && pageContainer.classList.contains('page--active')) {
    goHome();
  }

  // Number shortcuts
  const shortcuts = {
    '1': 'about',
    '2': 'skills',
    '3': 'projects',
    '4': 'certifications',
    '5': 'contact'
  };

  if (shortcuts[e.key]) {
    const pageName = shortcuts[e.key];
    loadPage(pageName);

    // Find and highlight the corresponding nav link
    const targetLink = document.querySelector(`.navbar__link[data-page="${pageName}"]`);
    if (targetLink) {
      setActiveLink(targetLink);
    }
  }
});

// ================================================================
// OPTIONAL: Browser back/forward button support
// (Advanced - can skip for now)
// ================================================================

window.addEventListener('popstate', function(e) {
  if (e.state && e.state.page) {
    loadPage(e.state.page);
  } else {
    goHome();
  }
});

// Update browser history when navigating
// (Uncomment if you want URL changes in browser address bar)
/*
function updateHistory(pageName) {
  const url = pageName ? `#${pageName}` : '/';
  history.pushState({ page: pageName }, '', url);
}
*/