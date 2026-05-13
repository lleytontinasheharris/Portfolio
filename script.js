/* ================================================================
   LLEYTON TINASHE HARRIS — PORTFOLIO v2
   script.js
   
   Handles:
   - Landing page menu clicks
   - Dynamic page loading
   - Fade transitions between pages
   - Back to home button
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
const backButton = document.getElementById('back-button');
const landingLinks = document.querySelectorAll('.landing__link');

// ================================================================
// INITIALIZE
// Set up event listeners when page loads
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
});

// ================================================================
// INITIALIZE NAVIGATION
// Attach click handlers to all landing menu links
// ================================================================

function initializeNavigation() {
  landingLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageName = this.getAttribute('data-page');
      loadPage(pageName);
    });
  });

  // Back button listener
  backButton.addEventListener('click', function(e) {
    e.preventDefault();
    goHome();
  });
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

  // Fade out landing page
  landingPage.classList.remove('page--active');

  // Fetch the page content
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}`);
      }
      return response.text();
    })
    .then(html => {
      // Insert content into page container
      pageContainer.innerHTML = html;

      // Mark page container as active (triggers fade in)
      pageContainer.classList.add('page--active');

      // Show back button
      backButton.style.display = 'block';

      // Scroll to top
      window.scrollTo(0, 0);
    })
    .catch(error => {
      console.error('Error loading page:', error);
      pageContainer.innerHTML = '<p>Error loading page. Please try again.</p>';
    });
}

// ================================================================
// GO HOME
// Returns to landing page with fade transition
// ================================================================

function goHome() {
  // Fade out current page
  pageContainer.classList.remove('page--active');

  // Clear page container
  setTimeout(() => {
    pageContainer.innerHTML = '';
  }, 300); // Wait for fade to complete

  // Fade in landing page
  landingPage.classList.add('page--active');

  // Hide back button
  backButton.style.display = 'none';

  // Scroll to top
  window.scrollTo(0, 0);
}

// ================================================================
// OPTIONAL: Keyboard navigation
// Press 'H' to go home from anywhere
// ================================================================

document.addEventListener('keydown', function(e) {
  if (e.key.toLowerCase() === 'h' && pageContainer.classList.contains('page--active')) {
    goHome();
  }
});