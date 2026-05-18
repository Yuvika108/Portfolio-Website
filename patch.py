import os
import re

filepath = '/Users/skmishra19/Desktop/PROJECTS/Portfolio-website/script.js'
with open(filepath, 'r') as f:
    content = f.read()

smooth_scroll_replacement = """// ─── Smooth Scroll Engine (Lenis + GSAP) ───────────────────────────────────────────────────
function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  window.lenis = lenis;

  if (window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  let _scrollActive = true;
  Object.defineProperty(window, '_smoothScrollActive', {
    get: () => _scrollActive,
    set: (val) => {
      _scrollActive = val;
      if (val) lenis.start();
      else lenis.stop();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: 0, duration: 1.5 });
      }
    });
  });
}"""

content = re.sub(r'// ─── Smooth Scroll Engine ───────────────────────────────────────────────────\nfunction initSmoothScroll\(\) \{.*?\n\}\n', smooth_scroll_replacement + '\n', content, flags=re.DOTALL)

scroll_effects_replacement = """// Scroll Effects (Progress, Back to Top, Reveal via GSAP)
function initScrollEffects() {
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  if (progressBar && window.gsap && window.ScrollTrigger) {
    gsap.to(progressBar, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        scrub: 0.3
      }
    });
  }

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.lenis ? window.lenis.scrollTo(0, { duration: 1.5 }) : window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    // Add load animation to hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-name-block, .hero-role-line, .hero-sub, .hero-actions');
    gsap.fromTo(heroElements, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
    
    // Smooth reveal for sections and cards
    const revealElements = document.querySelectorAll('section:not(.hero), .bento-item, .creative-card, .project-row, .tk-category, .ae-card');
    revealElements.forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0, y: 80 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }
}"""

content = re.sub(r'// Scroll Effects \(Progress, Back to Top, Reveal\)\nfunction initScrollEffects\(\) \{.*?\n\}\n', scroll_effects_replacement + '\n', content, flags=re.DOTALL)

with open(filepath, 'w') as f:
    f.write(content)
