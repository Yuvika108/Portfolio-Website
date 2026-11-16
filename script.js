document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderSkills();
  renderExperience();
  renderAchievements();
  renderCreative();
  renderContact();

  initThemeToggle();
  initMobileNav();
  initSmoothScroll();
  initScrollProgress();
  initBackToTop();
  initFooterTime();
  initActiveNavLink();
});

/* ==========================================================================
   Content Rendering from data.js
   ========================================================================== */

function renderProjects() {
  const container = document.getElementById('projectsGrid');
  if (!container || !window.PORTFOLIO_DATA) return;

  const projects = window.PORTFOLIO_DATA.projects.items;

  container.innerHTML = projects.map((p, i) => `
    <article class="project-card">
      <div class="project-image">
        ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : `<span>◆</span>`}
      </div>
      <div class="project-content">
        <div class="project-meta">
          <span class="project-number">${p.number}</span>
          <span class="project-stack-short">${p.stackShort}</span>
        </div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-description">${p.description}</p>
        <ul class="project-features">
          ${p.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <div class="project-actions">
          ${p.live ? `<a href="${p.live}" class="project-btn project-btn-primary" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
          <a href="${p.github}" class="project-btn project-btn-outline" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </article>
  `).join('');
}

function renderSkills() {
  const container = document.getElementById('skillsGrid');
  if (!container || !window.PORTFOLIO_DATA) return;

  const categories = window.PORTFOLIO_DATA.skills.categories;

  container.innerHTML = categories.map(cat => `
    <div class="skill-category">
      <h3 class="skill-heading">
        <span class="skill-color-dot ${cat.color.toLowerCase()}"></span>
        ${cat.title}
      </h3>
      <div class="skill-items">
        ${cat.items.map(item => `
          <div class="skill-item">
            <span>${item.name}</span>
            <span class="skill-context">${item.context}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  const learningList = document.getElementById('learningList');
  if (learningList) {
    const learning = window.PORTFOLIO_DATA.skills.currentlyLearning;
    learningList.innerHTML = learning.map(item => `<div class="learning-item">${item}</div>`).join('');
  }
}

function renderExperience() {
  const container = document.getElementById('experienceTimeline');
  if (!container || !window.PORTFOLIO_DATA) return;

  const items = window.PORTFOLIO_DATA.experience.items;

  container.innerHTML = items.map((exp, i) => `
    <div class="experience-item">
      <div class="experience-marker">
        <i class="bi bi-star-fill"></i>
      </div>
      <div class="experience-content">
        <span class="experience-type">${exp.type}</span>
        <h4 class="experience-role">${exp.role}</h4>
        <div class="experience-org">${exp.org}</div>
        <span class="experience-dates">${exp.dates}</span>
        <ul class="experience-bullets">
          ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

function renderAchievements() {
  const container = document.getElementById('achievementsGrid');
  if (!container || !window.PORTFOLIO_DATA) return;

  const items = window.PORTFOLIO_DATA.achievements.items;

  container.innerHTML = items.map(item => `
    <div class="achievement-card">
      <div class="achievement-value">${item.value}</div>
      <div class="achievement-label">${item.label}</div>
      <div class="achievement-context">${item.context}</div>
    </div>
  `).join('');

  const exploreList = document.getElementById('exploreList');
  if (exploreList) {
    const exploring = window.PORTFOLIO_DATA.achievements.currentlyExploring;
    exploreList.innerHTML = exploring.map(item => `<div class="explore-item">${item}</div>`).join('');
  }
}

function renderCreative() {
  const container = document.getElementById('creativeGrid');
  if (!container || !window.PORTFOLIO_DATA) return;

  const items = window.PORTFOLIO_DATA.creative.items;

  container.innerHTML = items.map(item => `
    <div class="creative-item">
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </div>
  `).join('');
}

function renderContact() {
  const container = document.getElementById('contactLinks');
  if (!container || !window.PORTFOLIO_DATA) return;

  const items = window.PORTFOLIO_DATA.contact.items;

  container.innerHTML = items.map(item => `
    <a href="${item.url}" class="contact-tile" target="${item.url.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener noreferrer" aria-label="${item.label}">
      <i class="${item.icon}"></i>
      <div class="contact-tile-content">
        <h4>${item.label}</h4>
        <span>${item.text}</span>
      </div>
    </a>
  `).join('');
}

/* ==========================================================================
   Theme Toggle
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector('i');

  function updateToggleUI(theme) {
    const isLight = theme === 'light';
    toggleBtn.setAttribute('aria-pressed', isLight);
    toggleBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    if (icon) {
      icon.className = isLight ? 'bi bi-moon-stars' : 'bi bi-brightness-high';
    }
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateToggleUI(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.warn('Could not save theme preference', e);
    }

    updateToggleUI(newTheme);
  });
}

/* ==========================================================================
   Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      navLinks.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   Smooth Scroll
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ==========================================================================
   Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
  });
}

/* ==========================================================================
   Back to Top
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   Active Nav Link on Scroll
   ========================================================================== */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observerOptions = { threshold: 0.25, rootMargin: '-10% 0% -60% 0%' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   Footer Time
   ========================================================================== */
function initFooterTime() {
  const el = document.getElementById('footerTime');
  if (!el) return;

  const update = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' LOCAL TIME';
  };
  setInterval(update, 1000);
  update();
}
