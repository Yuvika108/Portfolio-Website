document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initRain();
  initTerminal();
  initMusic();
  initScrollEffects();
  initWave();
  updateTime();
  initAgent();
});

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

// Rain Animation
function initRain() {
  const canvas = document.getElementById('rainCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, drops = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 150; i++) {
    drops.push({
      x: Math.random() * w,
      y: Math.random() * h,
      length: Math.random() * 30 + 20,
      speed: Math.random() * 15 + 20,
      opacity: Math.random() * 0.3 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';

    drops.forEach(d => {
      ctx.strokeStyle = `rgba(167, 139, 250, ${d.opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + 1, d.y + d.length);
      ctx.stroke();

      d.y += d.speed;
      d.x += 1;

      if (d.y > h) {
        d.y = -d.length;
        d.x = Math.random() * w;
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// Terminal Typing
function initTerminal() {
  const text = "init creative_process.sh";
  const typedSpan = document.querySelector('.typed-text');
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

// Music Player Logic
function initMusic() {
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('ambientAudio');
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

// Scroll Effects (Progress, Back to Top, Reveal)
function initScrollEffects() {
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    // Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";

    // Back to Top Button
    if (winScroll > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Reveal Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section, .bento-item, .project-card, .creative-card').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
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
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
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

  // Make rain invisible by default, only visible on Open Palm
  rainCanvas.style.opacity = '0';
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
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
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
        // Two Fingers -> Scroll
        else if (
          indexTip.y < landmarks[6].y &&
          middleTip.y < landmarks[10].y &&
          ringTip.y > landmarks[14].y &&
          pinkyTip.y > landmarks[18].y
        ) {
          gesture = "scroll";
        }
        else if (
          indexTip.y < landmarks[6].y &&
          middleTip.y > landmarks[10].y &&
          ringTip.y > landmarks[14].y &&
          pinkyTip.y < landmarks[18].y
        ) {
          gesture = "rock_on";
        }
        // Point -> Move Cursor
        else if (
          indexTip.y < landmarks[6].y &&
          middleTip.y > landmarks[10].y &&
          ringTip.y > landmarks[14].y &&
          pinkyTip.y > landmarks[18].y
        ) {
          gesture = "point";
        }
        
        // Pinch (Select/Click)
        const distance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
        if (distance < 0.05) {
          gesture = "pinch";
          pinchPoint = { x: indexTip.x, y: indexTip.y };
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

      if (finalGesture === "point" || finalGesture === "pinch") {
        const indexTip = mainGesture.indexTip;
        const x = (1 - indexTip.x) * window.innerWidth;
        const y = indexTip.y * window.innerHeight;

        cursor.style.transform = `translate(${x}px, ${y}px)`;
        cursor.classList.add('active');
        setTimeout(() => {
          cursorTrail.style.transform = `translate(${x - 16}px, ${y - 16}px)`;
        }, 50);

        statusElement.textContent = finalGesture === "pinch" ? 'PINCHING' : 'POINT (CURSOR MOVED)';
        window.lastScrollY = null;

        // Click Logic
        if (finalGesture === "pinch") {
          if (!isPinching) {
            isPinching = true;
            const now = Date.now();
            const el = document.elementFromPoint(x, y);
            
            if (now - lastPinchTime < 500) {
              statusElement.textContent = 'DOUBLE CLICK!';
              if (el) {
                el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window }));
                el.click(); // Standard click for safety
              }
              lastPinchTime = 0; // Reset
            } else {
              statusElement.textContent = 'CLICK!';
              if (el) el.click();
              lastPinchTime = now;
            }
          }
        } else {
          isPinching = false;
        }

      } else if (finalGesture === "scroll") {
        document.documentElement.style.scrollBehavior = 'auto'; // Disable CSS smooth scroll to prevent lag
        const trackY = mainGesture.indexTip.y;
        
        if (window.lastScrollY != null) {
          const deltaY = trackY - window.lastScrollY;
          if (Math.abs(deltaY) > 0.005) {
            // Negative multiplier so pulling hand down pulls content down (scrolling page UP)
            window.scrollBy(0, -(deltaY * 3000));
            // ONLY update lastScrollY when we actually move the page (prevents slow movement from being ignored)
            window.lastScrollY = trackY; 
          }
        } else {
          window.lastScrollY = trackY; // Initial grab point
        }
        
        statusElement.textContent = '✌️ TWO-FINGER SCROLL';
        cursor.classList.add('active');
        cursor.style.background = '#ff3b9a'; // Visual cue for scrolling
      } else {
        document.documentElement.style.scrollBehavior = ''; // Restore CSS smooth scroll
        cursor.classList.remove('active');
        cursor.style.background = '';
        window.lastScrollY = null;

        if (finalGesture && finalGesture !== "point" && finalGesture !== "pinch" && finalGesture !== "scroll") {
          statusElement.textContent = finalGesture.replace('_', ' ').toUpperCase();

          if (!cooldown || finalGesture === "bye_bye") {
            if (finalGesture === "thumbs_up") {
              audio.play().catch(() => { });
              musicToggle.classList.add('playing');
              musicToggle.querySelector('.music-label').textContent = 'playing';
              rainCanvas.style.opacity = '1';
            } else if (finalGesture === "rock_on") {
              audio.pause();
              musicToggle.classList.remove('playing');
              musicToggle.querySelector('.music-label').textContent = 'music player';
              rainCanvas.style.opacity = '0';
            } else if (finalGesture === "bye_bye") {
              statusElement.textContent = '👋 BYE BYE!';
              setTimeout(() => { closeBtn.click(); }, 800);
            } else if (finalGesture === "open_palm") {
              rainCanvas.style.opacity = '1';
              setTimeout(() => { if (audio.paused) rainCanvas.style.opacity = '0'; }, 5000);
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