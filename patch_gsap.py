import re

filepath = '/Users/skmishra19/Desktop/PROJECTS/Portfolio-website/script.js'
with open(filepath, 'r') as f:
    content = f.read()

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
    heroElements.forEach(el => el.style.transition = 'none');
    gsap.fromTo(heroElements, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2, 
        onComplete: () => heroElements.forEach(el => { el.style.transition = ''; gsap.set(el, { clearProps: "transform" }); }) 
      }
    );
    
    // Smooth reveal for sections and cards
    const revealElements = document.querySelectorAll('section:not(.hero), .bento-item, .creative-card, .project-row, .tk-category, .ae-card');
    revealElements.forEach(el => {
      // Disable CSS transitions during setup to prevent conflicting with GSAP's initial state
      el.style.transition = 'none';
      
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
          },
          onComplete: () => {
            el.style.transition = '';
            gsap.set(el, { clearProps: "transform" });
          }
        }
      );
    });
  }
}"""

content = re.sub(r'// Scroll Effects \(Progress, Back to Top, Reveal via GSAP\)\nfunction initScrollEffects\(\) \{.*?\n\}\n', scroll_effects_replacement + '\n', content, flags=re.DOTALL)

with open(filepath, 'w') as f:
    f.write(content)
