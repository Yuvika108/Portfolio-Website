document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initCursor();
  initRain();
  initTerminal();
  initRoleTypewriter();
  initMusic();
  initScrollEffects();
  initWave();
  updateTime();
  initAgent();
  initTextScrollAnimation();
  initTelemetrySimulation();
});

function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (typeof Lenis === 'undefined') {
    console.warn('Lenis library not loaded. Falling back to native scrolling.');
    let _scrollActive = true;
    Object.defineProperty(window, '_smoothScrollActive', {
      get: () => _scrollActive,
      set: (val) => { _scrollActive = val; }
    });
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#') return;
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    return;
  }

  const lenis = new Lenis({
    duration: 0.6,
    easing: (t) => 1 - Math.pow(1 - t, 4), /* Snappier cubic out curve */
    smoothWheel: true,
    wheelMultiplier: 1.2, /* Slightly faster wheel response */
    touchMultiplier: 2,
    infinite: false,
  });

  window.lenis = lenis;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
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
}

// Custom Cursor
function initCursor() {

  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');

  window.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    setTimeout(() => {
      trail.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
    }, 50);
  });
}

// Starfield Background
function initStars() {
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, stars = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5,
      opacity: Math.random(),
      speed: 0.05 + Math.random() * 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      ctx.fillStyle = `rgba(229, 231, 235, ${s.opacity})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();

      s.opacity += s.speed * 0.01;
      if (s.opacity > 1 || s.opacity < 0) s.speed = -s.speed;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// Generative Art Background (Interactive Neural Network / AI connection design)
function initRain() {
  const canvas = document.getElementById('rainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Spawn neural nodes
  const numNodes = 75;
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.5 + 1.2,
      pulseSpeed: Math.random() * 0.05 + 0.02,
      pulseAngle: Math.random() * Math.PI,
      baseOpacity: Math.random() * 0.35 + 0.25
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      let n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      n.pulseAngle += n.pulseSpeed;

      // Bounce boundaries
      if (n.x < 0 || n.x > w) n.vx = -n.vx;
      if (n.y < 0 || n.y > h) n.vy = -n.vy;

      // Draw node dot
      const opacity = n.baseOpacity + Math.sin(n.pulseAngle) * 0.15;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196, 181, 253, ${opacity})`; // Soft violet nodes
      ctx.fill();

      // Node subtle glow
      if (n.radius > 2) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 181, 253, ${opacity * 0.15})`;
        ctx.fill();
      }
    }

    // Draw synapse lines (connections)
    for (let i = 0; i < nodes.length; i++) {
      let nA = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        let nB = nodes[j];
        let dx = nA.x - nB.x;
        let dy = nA.y - nB.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          let alpha = (1 - dist / 110) * 0.12;
          ctx.beginPath();
          ctx.moveTo(nA.x, nA.y);
          ctx.lineTo(nB.x, nB.y);
          ctx.strokeStyle = `rgba(224, 122, 95, ${alpha})`; // sunset orange connections
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }

      // Draw mouse connection
      if (mouse.x !== null && mouse.y !== null) {
        let dx = nA.x - mouse.x;
        let dy = nA.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          let alpha = (1 - dist / 140) * 0.28;
          ctx.beginPath();
          ctx.moveTo(nA.x, nA.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(196, 181, 253, ${alpha})`; // violet mouse connection
          ctx.lineWidth = 0.8;
          ctx.stroke();
          
          // Gentle attraction force to mouse
          nA.x -= dx * 0.005;
          nA.y -= dy * 0.005;
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// Terminal Typing
function initTerminal() {
  const text = "init creative_process.sh";
  const typedSpan = document.querySelector('.typed-text');
  if (!typedSpan) return;
  let i = 0;

  function type() {
    if (i < text.length) {
      typedSpan.textContent += text.charAt(i);
      i++;
      setTimeout(type, 100);
    } else {
      setTimeout(() => {
        document.querySelectorAll('.t-output').forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 500);
        });
      }, 1000);
    }
  }
  setTimeout(type, 1500);
}

// Role Typewriter for Hero
function initRoleTypewriter() {
  const el = document.getElementById('roleTypewriter');
  if (!el) return;

  const roles = [
    'develop machine learning models',
    'fine-tune neural networks',
    'design intelligent systems',
    'visualize complex data',
    'architect deep learning pipelines'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const typingSpeed = 80;
  const erasingSpeed = 40;
  const pauseAfterType = 1800;
  const pauseAfterErase = 400;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, pauseAfterType);
        return;
      }
      setTimeout(tick, typingSpeed);
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, pauseAfterErase);
        return;
      }
      setTimeout(tick, erasingSpeed);
    }
  }

  setTimeout(tick, 800);
}

// Music Player Logic
function initMusic() {
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('ambientAudio');
  const rainCanvas = document.getElementById('rainCanvas');
  const visualizerBars = document.querySelectorAll('.visualizer span');
  let playing = false;

  btn.addEventListener('click', () => {
    if (!playing) {
      audio.play();
      btn.classList.add('playing');
      btn.querySelector('.music-label').textContent = 'playing';
      animateVisualizer();
    } else {
      audio.pause();
      btn.classList.remove('playing');
      btn.querySelector('.music-label').textContent = 'music player';
    }
    playing = !playing;
  });

  function animateVisualizer() {
    if (!playing) return;
    visualizerBars.forEach(bar => {
      const height = Math.random() * 8 + 4;
      bar.style.height = `${height}px`;
    });
    setTimeout(animateVisualizer, 150);
  }
}

// Scroll Effects (Progress, Back to Top, Reveal via GSAP)
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
    // Add load animation to cinematic hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .btn-glow');
    heroElements.forEach(el => el.style.transition = 'none');
    
    gsap.fromTo(heroElements, 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: "power3.out", delay: 0.3, 
        onComplete: () => heroElements.forEach(el => { el.style.transition = ''; gsap.set(el, { clearProps: "transform" }); }) 
      }
    );
    
    // Animate float cards entering
    const floatCards = document.querySelectorAll('.float-card');
    gsap.fromTo(floatCards,
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 2, stagger: 0.2, ease: "expo.out", delay: 0.6 }
    );
    
    // Continuous subtle floating animation for cards
    floatCards.forEach((card, i) => {
      gsap.to(card, {
        y: (i % 2 === 0) ? -15 : 15,
        rotation: (i % 2 === 0) ? 2 : -2,
        duration: 4 + i,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2
      });
    });

    
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
}

// Wave Animation for Creative Corner
function initWave() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let phase = 0;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(224, 122, 95, 0.3)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * 0.05 + phase) * 15;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    phase += 0.03;
    requestAnimationFrame(draw);
  }
  draw();
}

// Footer Time
function updateTime() {
  const el = document.getElementById('footerTime');
  const update = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' LOCAL TIME';
  };
  setInterval(update, 1000);
  update(); // Call update immediately instead of recursing
}

// AI Agent Implementation
function initAgent() {
  const toggleBtn = document.getElementById('agentToggle');
  const agentUi = document.getElementById('agentUi');
  const closeBtn = document.getElementById('agentClose');
  const videoElement = document.getElementById('agentVideo');
  const statusElement = document.getElementById('agentStatus');
  const audio = document.getElementById('ambientAudio');
  const rainCanvas = document.getElementById('rainCanvas');
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  const musicToggle = document.getElementById('musicToggle');

  // Rain effect is always visible in the background
  rainCanvas.style.opacity = '1';
  rainCanvas.style.transition = 'opacity 1s ease';

  let agentActive = false;
  let hands = null;
  let camera = null;
  let cooldown = false;
  let waveHistory = [];
  let lastPinchTime = 0;
  let isPinching = false;

  toggleBtn.addEventListener('click', () => {
    agentUi.classList.remove('hidden');
    agentActive = true;
    startMediaPipe();
  });

  closeBtn.addEventListener('click', () => {
    agentUi.classList.add('hidden');
    agentActive = false;
    if (camera) camera.stop();
  });

  function startMediaPipe() {
    if (hands) {
      camera.start();
      return;
    }

    statusElement.textContent = 'Loading AI...';

    const checkInterval = setInterval(() => {
      if (window.Hands && window.Camera) {
        clearInterval(checkInterval);
        initialize();
      }
    }, 100);
  }

  function initialize() {
    hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults(onResults);

    camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (agentActive) {
          await hands.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480
    });

    camera.start();
    statusElement.textContent = 'Awaiting Gesture...';
  }

  function onResults(results) {
    if (!agentActive) return;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      let currentGestures = [];
      let pinchPoint = null;

      results.multiHandLandmarks.forEach((landmarks, index) => {
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];

        let gesture = "";

        // Thumbs Up
        if (thumbTip.y < indexTip.y && thumbTip.y < landmarks[3].y && indexTip.y > landmarks[5].y) {
          gesture = "thumbs_up";
        }
        // Thumbs Down
        else if (thumbTip.y > indexTip.y && thumbTip.y > landmarks[3].y && indexTip.y > landmarks[5].y) {
          gesture = "thumbs_down";
        }
        // Open Palm OR Waving (Bye Bye)
        else if (
          indexTip.y < landmarks[6].y &&
          middleTip.y < landmarks[10].y &&
          ringTip.y < landmarks[14].y &&
          pinkyTip.y < landmarks[18].y
        ) {
          // Waving logic (using index 0 for simplicity)
          if (index === 0) {
            waveHistory.push(indexTip.x);
            if (waveHistory.length > 45) waveHistory.shift();
            let directionChanges = 0;
            let totalMovement = 0;
            for (let i = 2; i < waveHistory.length; i++) {
              totalMovement += Math.abs(waveHistory[i] - waveHistory[i-1]);
              const prevDiff = waveHistory[i-1] - waveHistory[i-2];
              const currDiff = waveHistory[i] - waveHistory[i-1];
              if (prevDiff * currDiff < 0 && Math.abs(currDiff) > 0.005) directionChanges++;
            }
            if (directionChanges >= 2 && totalMovement > 0.2) gesture = "bye_bye";
            else gesture = "open_palm";
          } else {
            gesture = "open_palm";
          }
        }
        // Two Fingers -> Peace (Click)
        else if (
          indexTip.y < landmarks[6].y &&
          middleTip.y < landmarks[10].y &&
          ringTip.y > landmarks[14].y &&
          pinkyTip.y > landmarks[18].y
        ) {
          gesture = "peace";
        }
        else if (
          indexTip.y < landmarks[6].y &&
          middleTip.y > landmarks[10].y &&
          ringTip.y > landmarks[14].y &&
          pinkyTip.y < landmarks[18].y
        ) {
          gesture = "rock_on";
        }
        // OK Sign (O symbol)
        else if (
          Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y) < 0.06 &&
          middleTip.y < landmarks[9].y &&
          ringTip.y < landmarks[13].y
        ) {
          gesture = "ok_sign";
        }

        currentGestures.push({ type: gesture, landmarks, indexTip });
      });

      // Handle Logic
      const mainGesture = currentGestures[0];
      let finalGesture = mainGesture.type;
      
      // If any hand shows rock_on, stop everything
      if (currentGestures.some(g => g.type === "rock_on")) finalGesture = "rock_on";

      if (finalGesture !== "open_palm" && finalGesture !== "bye_bye") {
        waveHistory = [];
      }

      // Always update cursor position smoothly
      const indexTip = mainGesture.indexTip;
      const targetX = (1 - indexTip.x) * window.innerWidth;
      const targetY = indexTip.y * window.innerHeight;

      if (!window.cursorX) { window.cursorX = targetX; window.cursorY = targetY; }
      window.cursorX += (targetX - window.cursorX) * 0.3; // Smooth interpolation
      window.cursorY += (targetY - window.cursorY) * 0.3;

      cursor.style.transform = `translate(${window.cursorX}px, ${window.cursorY}px)`;
      cursor.classList.add('active');
      cursorTrail.style.transform = `translate(${window.cursorX - 16}px, ${window.cursorY - 16}px)`;

      // Handle continuous actions (Scrolling)
      if (finalGesture === "thumbs_up") {
        window._smoothScrollActive = false;
        statusElement.textContent = '👍 SCROLL UP';
        window.scrollBy(0, -30);
      } else if (finalGesture === "thumbs_down") {
        window._smoothScrollActive = false;
        statusElement.textContent = '👎 SCROLL DOWN';
        window.scrollBy(0, 30);
      } else {
        window._smoothScrollActive = true; // Restore smooth scroll
      }

      // Handle discrete actions (Clicking)
      if (finalGesture === "peace") {
        statusElement.textContent = '✌️ CLICKING';
        if (!isPinching) {
          isPinching = true; // reusing isPinching flag for click cooldown
          const now = Date.now();
          const el = document.elementFromPoint(window.cursorX, window.cursorY);
          
          if (now - lastPinchTime < 500) {
            statusElement.textContent = 'DOUBLE CLICK!';
            if (el) {
              el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window }));
              el.click();
            }
            lastPinchTime = 0;
          } else {
            if (el) el.click();
            lastPinchTime = now;
          }
        }
      } else {
        isPinching = false;
      }

      // Handle single-fire actions (Thumbs up/down, etc)
      if (finalGesture && !["thumbs_up", "thumbs_down", "peace", "open_palm"].includes(finalGesture)) {
        statusElement.textContent = finalGesture.replace('_', ' ').toUpperCase();

          if (!cooldown || finalGesture === "bye_bye") {
            if (finalGesture === "ok_sign") {
              audio.play().catch(() => { });
              musicToggle.classList.add('playing');
              musicToggle.querySelector('.music-label').textContent = 'playing';
            } else if (finalGesture === "rock_on") {
              audio.pause();
              musicToggle.classList.remove('playing');
              musicToggle.querySelector('.music-label').textContent = 'music player';
            } else if (finalGesture === "bye_bye") {
              statusElement.textContent = 'BYE BYE!';
              setTimeout(() => { closeBtn.click(); }, 800);
            }

            if (finalGesture !== "open_palm") {
              cooldown = true;
              setTimeout(() => { 
                cooldown = false; 
                if (!agentActive) statusElement.textContent = 'READY';
              }, 1500);
            }
          }
        }
    } else {
      if (agentActive) statusElement.textContent = 'AWAITING GESTURE...';
      cursor.classList.remove('active');
      cursor.style.background = '';
      window.lastScrollY = null;
      isPinching = false;
    }
  }
}

// Text Scroll Animation (Parallax Variants)
function initTextScrollAnimation() {
  const elements = document.querySelectorAll('.text-scroll-anim');
  if (!elements.length) return;

  elements.forEach(el => {
    let variant = 1;
    if (el.classList.contains('ts-variant-2')) variant = 2;
    if (el.classList.contains('ts-variant-3')) variant = 3;

    function splitTextNodes(node) {
      if (node.nodeType === 3) {
        const text = node.textContent;
        if (!text.trim() && text.length < 2) return; 

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < text.length; i++) {
          const charSpan = document.createElement('span');
          charSpan.textContent = text[i];
          charSpan.className = 'ts-char';
          charSpan.style.display = 'inline-block';
          charSpan.style.willChange = 'transform, opacity, filter';
          if (text[i] === ' ') charSpan.style.whiteSpace = 'pre';
          fragment.appendChild(charSpan);
        }
        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === 1) {
        if (node.classList.contains('ts-icon')) {
          // Add basic styles to icons if not present
          node.style.display = 'inline-block';
          node.style.willChange = 'transform, opacity, filter';
          return;
        }
        if (!node.classList.contains('ts-char')) {
          Array.from(node.childNodes).forEach(child => splitTextNodes(child));
        }
      }
    }
    
    if (!el.querySelector('.ts-char')) {
      Array.from(el.childNodes).forEach(child => splitTextNodes(child));
    }
    
    // We want to animate both characters AND icons
    const animateItems = el.querySelectorAll('.ts-char, .ts-icon');

    const updateAnimation = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      let progress = (windowHeight - rect.top) / (windowHeight / 1.5);
      progress = Math.max(0, Math.min(1, progress));

      animateItems.forEach((item, index) => {
        const isIcon = item.classList.contains('ts-icon');
        const delay = index * 0.015;
        let itemProgress = (progress - delay) * 2;
        itemProgress = Math.max(0, Math.min(1, itemProgress));

        const easeProgress = 1 - Math.pow(1 - itemProgress, 3);
        
        // Multipliers for icons to make them more "dynamic"
        const moveMult = isIcon ? 2 : 1;
        const rotateMult = isIcon ? 2.5 : 1;
        const scaleMult = isIcon ? 1.5 : 1;

        if (variant === 1) {
          const y = 30 * (1 - easeProgress) * moveMult;
          item.style.opacity = easeProgress;
          item.style.transform = `translateY(${y}px)`;
        } else if (variant === 2) {
          const scale = 1 + (0.3 * (1 - easeProgress) * scaleMult);
          const blur = 4 * (1 - easeProgress);
          item.style.opacity = easeProgress;
          item.style.transform = `scale(${scale})`;
          item.style.filter = `blur(${blur}px)`;
        } else if (variant === 3) {
          const rotate = -30 * (1 - easeProgress) * rotateMult;
          const y = 40 * (1 - easeProgress) * moveMult;
          const x = (index % 2 === 0 ? 15 : -15) * (1 - easeProgress) * moveMult;
          item.style.opacity = easeProgress;
          item.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
        }
      });
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateAnimation);
    });
    
    updateAnimation();
  });
}

// Artwork Slider Logic
const artSlider = document.getElementById('artSlider');
const artPrevBtn = document.getElementById('artPrevBtn');
const artNextBtn = document.getElementById('artNextBtn');

async function loadArtworksIntoSlider() {
  if (!artSlider) return;
  
  try {
    const res = await fetch('/api/artworks').catch(() => fetch('assets/artworks.json'));
    if (res.ok) {
      const artworks = await res.json();
      if (artworks && artworks.length > 0) {
        artSlider.innerHTML = ''; // clear static ones
        artworks.forEach((art, index) => {
          const div = document.createElement('div');
          const tiltClass = `pc-${(index % 5) + 1}`;
          div.className = `polaroid-card ${tiltClass}`;
          div.innerHTML = `
            <div class="polaroid-img-wrap">
              <img src="${art.filename}" alt="${art.title}" class="polaroid-img" loading="lazy">
            </div>
            <p class="polaroid-label">${art.title}</p>
          `;
          artSlider.appendChild(div);
        });
      }
    }
  } catch (err) {
    console.error('Failed to load artworks:', err);
  }
}

if (artSlider) {
  // loadArtworksIntoSlider(); // Disabled: Images are now hardcoded in HTML
}

const viewMoreArtBtn = document.getElementById('viewMoreArtBtn');
const artWallContainer = document.getElementById('artWallContainer');

if (viewMoreArtBtn && artWallContainer) {
  viewMoreArtBtn.addEventListener('click', () => {
    artWallContainer.classList.toggle('expanded');
    const btnText = viewMoreArtBtn.querySelector('.btn-text');
    const btnIcon = viewMoreArtBtn.querySelector('.btn-icon');
    
    if (artWallContainer.classList.contains('expanded')) {
      if (btnText) btnText.textContent = 'View Less';
      if (btnIcon) {
        btnIcon.classList.remove('bi-chevron-down');
        btnIcon.classList.add('bi-chevron-up');
      }
    } else {
      if (btnText) btnText.textContent = 'View More';
      if (btnIcon) {
        btnIcon.classList.remove('bi-chevron-up');
        btnIcon.classList.add('bi-chevron-down');
      }
      artWallContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// Telemetry Simulation (AI/ML training session)
function initTelemetrySimulation() {
  const epochEl = document.getElementById('telemetryEpoch');
  const lossEl = document.getElementById('telemetryLoss');
  const accEl = document.getElementById('telemetryAcc');
  const lrEl = document.getElementById('telemetryLR');
  const progressBar = document.getElementById('telemetryProgressBar');
  const percentEl = document.getElementById('telemetryPercent');
  const terminalBody = document.getElementById('telemetryTerminalBody');

  const chartPath = document.getElementById('telemetryChartPath');
  const chartArea = document.getElementById('telemetryChartArea');
  const chartVal = document.getElementById('telemetryChartVal');

  if (!epochEl || !lossEl || !accEl || !lrEl || !progressBar || !terminalBody) return;

  let epoch = 1;
  let loss = 0.654;
  let accuracy = 72.4;
  let learningRate = 1e-4;
  let progressPercent = 0;
  let chartPoints = [];

  function addTerminalLine(text, styleClass = 'system-line') {
    const p = document.createElement('p');
    p.className = `term-line ${styleClass}`;
    p.textContent = text;
    terminalBody.appendChild(p);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    
    // Limit terminal logs to 15 lines to avoid memory creep
    while (terminalBody.childElementCount > 15) {
      terminalBody.removeChild(terminalBody.firstChild);
    }
  }

  function updateChart() {
    if (!chartPath || !chartArea) return;
    
    if (epoch === 1) {
      chartPoints = [{ x: 0, y: 55 }];
    }
    
    const x = (epoch / 100) * 200;
    // Map loss (0.654 -> y=55, 0.012 -> y=7)
    const y = 55 - ((0.654 - loss) / 0.654) * 48;
    chartPoints.push({ x, y });

    let pathD = `M ${chartPoints[0].x},${chartPoints[0].y}`;
    for (let i = 1; i < chartPoints.length; i++) {
      pathD += ` L ${chartPoints[i].x},${chartPoints[i].y}`;
    }
    chartPath.setAttribute('d', pathD);

    const areaD = pathD + ` L ${x},58 L 0,58 Z`;
    chartArea.setAttribute('d', areaD);

    if (chartVal) {
      chartVal.textContent = loss.toFixed(4);
    }
  }

  // Draw initial point
  updateChart();

  // Simulated training timer
  setInterval(() => {
    // 1. Advance training percent
    progressPercent += Math.floor(Math.random() * 5) + 3;
    if (progressPercent >= 100) {
      progressPercent = 0;
      
      // Advance Epoch
      epoch++;
      if (epoch > 100) epoch = 1;
      
      // Converge Loss and improve accuracy
      if (epoch === 1) {
        loss = 0.654;
        accuracy = 72.4;
        learningRate = 1e-4;
      } else {
        loss = Math.max(0.012, loss - (loss * 0.08) - (Math.random() * 0.005));
        accuracy = Math.min(99.8, accuracy + ((100 - accuracy) * 0.06) + (Math.random() * 0.1));
      }
      
      // Decay learning rate
      if (epoch === 30) learningRate = 5e-5;
      if (epoch === 60) learningRate = 1e-5;
      if (epoch === 85) learningRate = 1e-6;

      // Update UI elements
      epochEl.textContent = `${epoch}/100`;
      lossEl.textContent = loss.toFixed(4);
      accEl.textContent = `${accuracy.toFixed(1)}%`;
      lrEl.textContent = learningRate.toExponential(0);

      // Update SVG chart
      updateChart();

      // Terminal print epoch summary
      const val_loss = (loss * 1.05 + Math.random() * 0.002).toFixed(4);
      addTerminalLine(`[METRIC] Epoch ${epoch}/100 finished. Loss: ${loss.toFixed(4)} | Acc: ${accuracy.toFixed(1)}% | Val Loss: ${val_loss}`, 'metric-line');
    }

    progressBar.style.width = `${progressPercent}%`;
    if (percentEl) percentEl.textContent = `${progressPercent}%`;

    // 2. Randomly print intermediate batch training logs
    if (Math.random() < 0.25) {
      const batch = Math.floor(Math.random() * 468) + 1;
      const batchLoss = (loss + (Math.random() * 0.04 - 0.02)).toFixed(4);
      addTerminalLine(`[TRAIN] Batch ${batch}/468 - loss: ${batchLoss}`, 'system-line');
    }
  }, 450);
}