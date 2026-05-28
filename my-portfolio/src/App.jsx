import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import './App.css'
import GestureDetector from "./GestureDetector";

export const PortfolioContext = createContext(null);

function TelemetryPanel() {
  const [epoch, setEpoch] = useState(1);
  const [loss, setLoss] = useState(0.654);
  const [accuracy, setAccuracy] = useState(72.4);
  const [learningRate, setLearningRate] = useState(1e-4);
  const [progressPercent, setProgressPercent] = useState(0);
  const [chartPoints, setChartPoints] = useState([{ x: 0, y: 55 }]);
  const [terminalLogs, setTerminalLogs] = useState([
    { text: "[SYSTEM] Initializing training pipeline...", type: "system-line" },
    { text: "[SYSTEM] Loaded dataset shape: [60000, 28, 28]", type: "system-line" },
    { text: "[SYSTEM] Model compilation successful.", type: "system-line" }
  ]);

  const terminalEndRef = useRef(null);

  const stateRef = useRef({
    epoch: 1,
    loss: 0.654,
    accuracy: 72.4,
    learningRate: 1e-4,
    progressPercent: 0,
    chartPoints: [{ x: 0, y: 55 }]
  });

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const state = stateRef.current;
      
      // 1. Advance progress
      let nextProgress = state.progressPercent + Math.floor(Math.random() * 5) + 3;
      
      if (nextProgress >= 100) {
        state.progressPercent = 0;
        state.epoch += 1;
        if (state.epoch > 100) {
          state.epoch = 1;
          state.loss = 0.654;
          state.accuracy = 72.4;
          state.learningRate = 1e-4;
          state.chartPoints = [{ x: 0, y: 55 }];
        } else {
          state.loss = Math.max(0.012, state.loss - (state.loss * 0.08) - (Math.random() * 0.005));
          state.accuracy = Math.min(99.8, state.accuracy + ((100 - state.accuracy) * 0.06) + (Math.random() * 0.1));
          
          if (state.epoch === 30) state.learningRate = 5e-5;
          else if (state.epoch === 60) state.learningRate = 1e-5;
          else if (state.epoch === 85) state.learningRate = 1e-6;
        }
        
        // Calculate new chart point
        const x = (state.epoch / 100) * 200;
        const y = 55 - ((0.654 - state.loss) / 0.654) * 48;
        state.chartPoints.push({ x, y });
        
        // Push terminal log
        const val_loss = (state.loss * 1.05 + Math.random() * 0.002).toFixed(4);
        setTerminalLogs(prevLogs => {
          const newLog = {
            text: `[METRIC] Epoch ${state.epoch}/100 finished. Loss: ${state.loss.toFixed(4)} | Acc: ${state.accuracy.toFixed(1)}% | Val Loss: ${val_loss}`,
            type: "metric-line"
          };
          return [...prevLogs, newLog].slice(-15);
        });
        
        // Update React states
        setEpoch(state.epoch);
        setLoss(state.loss);
        setAccuracy(state.accuracy);
        setLearningRate(state.learningRate);
        setChartPoints([...state.chartPoints]);
      } else {
        state.progressPercent = nextProgress;
      }
      
      setProgressPercent(state.progressPercent);
      
      // Random batch logs
      if (Math.random() < 0.25) {
        const batch = Math.floor(Math.random() * 468) + 1;
        const batchLoss = (state.loss + (Math.random() * 0.04 - 0.02)).toFixed(4);
        setTerminalLogs(prevLogs => {
          const newLog = {
            text: `[TRAIN] Batch ${batch}/468 - loss: ${batchLoss}`,
            type: "system-line"
          };
          return [...prevLogs, newLog].slice(-15);
        });
      }
    }, 450);
    
    return () => clearInterval(interval);
  }, []);

  const getPathD = () => {
    if (chartPoints.length === 0) return "M 0,55 L 0,55";
    let d = `M ${chartPoints[0].x},${chartPoints[0].y}`;
    for (let i = 1; i < chartPoints.length; i++) {
      d += ` L ${chartPoints[i].x},${chartPoints[i].y}`;
    }
    return d;
  };

  const getAreaD = () => {
    const pathD = getPathD();
    if (chartPoints.length === 0) return "M 0,55 L 0,55 L 0,58 L 0,58 Z";
    const lastPoint = chartPoints[chartPoints.length - 1];
    return `${pathD} L ${lastPoint.x},58 L 0,58 Z`;
  };

  return (
    <div className="telemetry-panel">
      {/* Telemetry Header (Operator Info) */}
      <div className="telemetry-header">
        <div className="hc-portrait animate-pulse" style={{ width: "75px", height: "75px", margin: "0", flexShrink: "0" }}>
          <div className="portrait-glow"></div>
          <div className="portrait-inner">
            <div className="portrait-initials" style={{ fontSize: "1.1rem", lineHeight: "75px", color: "var(--accent-soft)" }}>SM</div>
            <div className="portrait-ring ring-1"></div>
            <div className="portrait-ring ring-2"></div>
          </div>
        </div>
        
        <div className="telemetry-operator-info">
          <p className="operator-title">OPERATOR ID</p>
          <p className="operator-name">SRISHTI_MISHRA.EXE</p>
          <p className="operator-status"><span className="status-bulb blinking-green"></span> SYSTEM ONLINE</p>
        </div>
      </div>

      {/* Telemetry Hardware Diagnostics Bar */}
      <div className="telemetry-hw-bar">
        <div className="hw-item">
          <span className="hw-dot"></span>
          <span>CUDA: <span className="hw-val">ACTIVE</span></span>
        </div>
        <div className="hw-item">
          <span className="hw-dot"></span>
          <span>GPU TEMP: <span className="hw-val">68°C</span></span>
        </div>
        <div className="hw-item">
          <span className="hw-dot"></span>
          <span>OPT: <span className="hw-val">ADAMW</span></span>
        </div>
      </div>
      
      {/* Telemetry Stats Grid */}
      <div className="telemetry-stats">
        <div className="t-stat">
          <span className="t-stat-label">EPOCH</span>
          <span className="t-stat-value">{epoch}/100</span>
        </div>
        <div className="t-stat">
          <span className="t-stat-label">LOSS</span>
          <span className="t-stat-value">{loss.toFixed(4)}</span>
        </div>
        <div className="t-stat">
          <span className="t-stat-label">ACCURACY</span>
          <span className="t-stat-value">{accuracy.toFixed(1)}%</span>
        </div>
        <div className="t-stat">
          <span className="t-stat-label">LEARNING RATE</span>
          <span className="t-stat-value">{learningRate.toExponential(0)}</span>
        </div>
      </div>

      {/* Loss Convergence Chart */}
      <div className="telemetry-chart">
        <div className="chart-header">
          <span>LOSS CONVERGENCE</span>
          <span className="chart-val">{loss.toFixed(4)}</span>
        </div>
        <svg className="chart-svg" viewBox="0 0 200 60">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-soft)" stopOpacity="0.25"></stop>
              <stop offset="100%" stopColor="var(--accent-soft)" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          <path className="chart-area" d={getAreaD()} fill="url(#chartGrad)"></path>
          <path className="chart-path" d={getPathD()} stroke="var(--accent-soft)" strokeWidth="1.5" fill="none" strokeLinecap="round"></path>
        </svg>
      </div>
      
      {/* Telemetry Progress Bar */}
      <div className="telemetry-progress-container">
        <div className="t-progress-labels">
          <span>Training Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="telemetry-progress-bar-wrap">
          <div className="telemetry-progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
      
      {/* Live Terminal Output */}
      <div className="telemetry-terminal">
        <div className="terminal-header">
          <span className="term-dot dot-red"></span>
          <span className="term-dot dot-yellow"></span>
          <span className="term-dot dot-green"></span>
          <span className="term-title">training_session.sh</span>
        </div>
        <div className="terminal-body font-mono text-[9px] h-[95px] overflow-y-auto">
          {terminalLogs.map((log, idx) => (
            <p key={idx} className={`term-line ${log.type}`}>{log.text}</p>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}

function CreativeCorner() {
  const { isMusicPlaying, setIsMusicPlaying } = useContext(PortfolioContext);
  const [isExpanded, setIsExpanded] = useState(false);

  // Footer active time (IST)
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      const formatter = new Intl.DateTimeFormat([], options);
      setTimeStr(formatter.format(new Date()) + " IST");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const artworks = [
    { id: 1, src: "/uploads/art-1779448140274.png", label: "Flute with Mandala" },
    { id: 2, src: "/uploads/art-1779448217961.png", label: "Random Thoughts" },
    { id: 3, src: "/uploads/art-1779448366112.png", label: "Capturing Moments" },
    { id: 4, src: "/uploads/art-1779448386801.png", label: "Cherry Cherry Lady" },
    { id: 5, src: "/uploads/art-1779448497928.png", label: "Petals of joy" },
    { id: 6, src: "/uploads/art-1779448532515.png", label: "Eyes & Ink" },
    { id: 7, src: "/uploads/art-1779448556843.png", label: "Colourful Chess" },
    { id: 8, src: "/uploads/art-1779448583814.png", label: "Just a sketch" },
    { id: 9, src: "/uploads/art-1779448615894.png", label: "Flowers & Butterfly" },
    { id: 10, src: "/uploads/art-1779448632865.png", label: "Oil Pastel Art" },
    { id: 11, src: "/uploads/art-1779448653396.png", label: "Pal Pal Pal Har Pal !!!" },
    { id: 12, src: "/uploads/art-1779448689803.png", label: "Arrows & Art" },
    { id: 13, src: "/uploads/art-1779448719679.png", label: "Just Me" },
    { id: 14, src: "/uploads/art-1779448753463.png", label: "A Colourful Fly" },
    { id: 15, src: "/uploads/art-1779448775013.png", label: "Time & Art" },
    { id: 16, src: "/uploads/art-1779448811710.png", label: "A Whole New World" }
  ];

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[#9ca3af] font-['Outfit'] overflow-x-hidden pb-12">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-40 bg-[var(--bg)]/70 backdrop-blur-md border-b border-orange-400/10">
        <div className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-5 flex justify-between items-center">
          <div className="nav-logo select-none">
            srishti <span className="nav-logo-bold">mishra</span><span className="logo-dot">.</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <Link to="/#about" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">about</Link>
            <Link to="/#projects" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">projects</Link>
            <Link to="/#toolkit" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">toolkit</Link>
            <Link to="/creative" className="font-mono text-[10px] tracking-[0.15em] uppercase text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">creative</Link>
            
            {/* Ambient Music Toggle with Eq Visualizer */}
            <button 
              onClick={() => setIsMusicPlaying(!isMusicPlaying)} 
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-full font-mono text-[9px] tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer ${
                isMusicPlaying 
                  ? 'border-orange-400/40 bg-orange-400/10 text-white shadow-[0_0_15px_rgba(251,146,60,0.15)]' 
                  : 'border-white/[0.08] bg-white/[0.02] text-gray-400 hover:text-white hover:border-orange-400/30 hover:bg-orange-400/5'
              }`}
              title="Toggle Ambient Soundtrack"
            >
              <i className="bi bi-music-note-beamed text-[10px]"></i>
              <span>{isMusicPlaying ? 'playing' : 'ambient music'}</span>
              
              <div className="flex items-end gap-[1.5px] h-[9px] w-[13px] mb-[1px]">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <span 
                    key={bar}
                    className={`w-[1.5px] rounded-[0.5px] bg-orange-400 transition-all duration-150 ${isMusicPlaying ? 'animate-[barPulse_0.6s_infinite_ease-in-out]' : 'h-[2px]'}`}
                    style={{ 
                      animationDelay: `${bar * 0.1}s`,
                      height: isMusicPlaying ? undefined : '2px'
                    }} 
                  />
                ))}
              </div>
            </button>

            <a href="mailto:srishti@email.com" className="px-4 py-2 border border-orange-400/30 rounded-full font-mono text-[10px] tracking-[0.15em] uppercase text-orange-400 hover:bg-orange-400/10 transition-all">contact</a>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-16 md:py-24 relative z-10 creative-section" id="creative">
        <div className="flex flex-col gap-8 text-left w-full">
          <div className="font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase">05 — creative corner</div>
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-normal leading-[1.15] tracking-tight text-white mb-4">
            experiments &amp; aesthetics
          </h2>

          <div className={`art-wall-container ${isExpanded ? "expanded" : ""}`}>
            <div className="art-wall">


              {artworks.map((art) => (
                <div key={art.id} className="polaroid-card">
                  <div className="polaroid-img-wrap">
                    <img src={art.src} alt={art.label} className="polaroid-img" loading="lazy" />
                  </div>
                  <p className="polaroid-label">{art.label}</p>
                </div>
              ))}
            </div>
            <div className="art-wall-fade" />
          </div>

          <div className="view-more-container">
            <button onClick={() => setIsExpanded(!isExpanded)} className="btn-view-more">
              <span className="btn-text">{isExpanded ? "View Less" : "View More"}</span>
              <i className={isExpanded ? "bi bi-chevron-up btn-icon" : "bi bi-chevron-down btn-icon"}></i>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <hr className="section-divider" />
      <footer className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 pt-16 relative z-10 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex flex-col gap-1 text-left">
          <span className="footer-name">srishti <span className="nav-logo-bold">mishra</span><span className="logo-dot">.</span></span>
          <span className="text-gray-500 text-[11px] font-mono italic">lovingly crafted with code, math &amp; neural network training loops.</span>
        </div>
        <div className="flex flex-col gap-1 text-left md:text-right">
          <span className="text-gray-500 text-[11px]">continuous training, model optimization &amp; predictive insights.</span>
          <span className="font-mono text-xs text-orange-400/90 font-medium tracking-widest">{timeStr}</span>
        </div>
      </footer>
    </div>
  );
}

function Home() {
  const { isMusicPlaying, setIsMusicPlaying } = useContext(PortfolioContext);

  // Role Typewriter Loop
  const roles = [
    "develop machine learning models",
    "fine-tune neural networks",
    "design intelligent systems",
    "visualize complex data",
    "architect deep learning pipelines"
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleText, setRoleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentFull = roles[roleIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setRoleText(prev => prev.slice(0, -1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setRoleText(currentFull.slice(0, roleText.length + 1));
      }, 100);
    }
    
    if (!isDeleting && roleText === currentFull) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && roleText === "") {
      setIsDeleting(false);
      setRoleIndex(prev => (prev + 1) % roles.length);
    }
    
    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIndex]);

  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  // Footer active time (IST)
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      const formatter = new Intl.DateTimeFormat([], options);
      setTimeStr(formatter.format(new Date()) + " IST");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Back to Top visibility
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[#9ca3af] font-['Outfit'] overflow-x-hidden selection:bg-orange-500/30 selection:text-white pb-12">
      {/* Background Mesh Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(224,122,95,0.04)_0%,transparent_70%)]" />
        <div className="absolute top-[35%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(224,122,95,0.02)_0%,transparent_70%)]" />
        <div className="absolute bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(224,122,95,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Back to top button */}
      {showScrollBtn && (
        <button onClick={scrollToTop} className="back-to-top flex items-center justify-center text-sm" title="Back to Top">
          <i className="bi bi-chevron-up"></i>
        </button>
      )}

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-40 bg-[var(--bg)]/70 backdrop-blur-md border-b border-orange-400/10">
        <div className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-5 flex justify-between items-center">
          <div className="nav-logo select-none">
            srishti <span className="nav-logo-bold">mishra</span><span className="logo-dot">.</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#about" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">about</a>
            <a href="#projects" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">projects</a>
            <a href="#experience" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">experience</a>
            <a href="#toolkit" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">toolkit</a>
            <Link to="/creative" className="font-mono text-[10px] tracking-[0.15em] uppercase text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">creative</Link>
            
            {/* Ambient Music Toggle with Eq Visualizer */}
            <button 
              onClick={() => setIsMusicPlaying(!isMusicPlaying)} 
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-full font-mono text-[9px] tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer ${
                isMusicPlaying 
                  ? 'border-orange-400/40 bg-orange-400/10 text-white shadow-[0_0_15px_rgba(251,146,60,0.15)]' 
                  : 'border-white/[0.08] bg-white/[0.02] text-gray-400 hover:text-white hover:border-orange-400/30 hover:bg-orange-400/5'
              }`}
              title="Toggle Ambient Soundtrack"
            >
              <i className="bi bi-music-note-beamed text-[10px]"></i>
              <span>{isMusicPlaying ? 'playing' : 'ambient music'}</span>
              
              <div className="flex items-end gap-[1.5px] h-[9px] w-[13px] mb-[1px]">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <span 
                    key={bar}
                    className={`w-[1.5px] rounded-[0.5px] bg-orange-400 transition-all duration-150 ${isMusicPlaying ? 'animate-[barPulse_0.6s_infinite_ease-in-out]' : 'h-[2px]'}`}
                    style={{ 
                      animationDelay: `${bar * 0.1}s`,
                      height: isMusicPlaying ? undefined : '2px'
                    }} 
                  />
                ))}
              </div>
            </button>

            <a href="mailto:srishti@email.com" className="px-4 py-2 border border-orange-400/30 rounded-full font-mono text-[10px] tracking-[0.15em] uppercase text-orange-400 hover:bg-orange-400/10 transition-all">contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 min-h-screen pt-24 flex items-center relative z-10" id="hero">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full py-12">
          
          {/* Left Column: Text & Actions */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left relative">
            
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-orange-400/[0.04] border border-orange-400/20 rounded-full w-fit">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-emerald-400">ml pipelines active</span>
            </div>

            {/* Greeting & Name */}
            <div className="flex flex-col gap-1">
              <p className="font-mono text-sm tracking-[0.04em] text-orange-400/80">hey there, I'm</p>
              <h1 className="font-['Playfair_Display'] text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-white">
                Srishti <br className="hidden md:inline" />
                <span className="italic text-orange-400 font-light">Mishra<span className="text-white">.</span></span>
              </h1>
            </div>

            {/* Typewriter Subheading */}
            <div className="flex items-center gap-1.5 font-['Playfair_Display'] text-xl md:text-2xl text-gray-300 min-h-[2.5rem]">
              <span>I'm a </span>
              <span className="text-orange-400 font-semibold">{roleText}</span>
              <span className="text-orange-400 font-light animate-pulse">|</span>
            </div>

            {/* Subtext description */}
            <p className="text-gray-300 text-sm leading-relaxed max-w-[500px] bg-white/[0.01] border-l-2 border-orange-400/40 px-6 py-4 rounded-r-2xl border-y border-r border-white/[0.02]">
              A B.Tech CSE(AI) student at University of Lucknow — building immersive digital experiences at the intersection of code, design &amp; art.
            </p>

            {/* Interest Pills */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3.5 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-300 transition-all cursor-default select-none">PyTorch</span>
              <span className="px-3.5 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-300 transition-all cursor-default select-none">TensorFlow</span>
              <span className="px-3.5 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-300 transition-all cursor-default select-none">Transformers &amp; LLMs</span>
              <span className="px-3.5 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-300 transition-all cursor-default select-none">Computer Vision</span>
              <span className="px-3.5 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-300 transition-all cursor-default select-none">MLOps</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 items-center mt-2 flex-wrap">
              <a href="#projects" className="px-8 py-3.5 bg-orange-400 text-[#121216] font-semibold rounded-full hover:bg-orange-300 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)] hover:-translate-y-0.5 transition-all text-sm tracking-wide">view my work</a>
              <a href="#about" className="px-8 py-3.5 bg-white/[0.02] border border-white/[0.08] hover:border-orange-400/40 text-white font-medium rounded-full hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all text-sm tracking-wide">about me ↓</a>
            </div>

            {/* Tech Social Links */}
            <div className="flex items-center gap-4 mt-4 font-mono text-[11px] tracking-widest text-gray-500 uppercase">
              <a href="#" className="hover:text-orange-400 transition-colors">gh</a>
              <span className="w-1.5 h-1.5 rounded-full bg-white/[0.1]" />
              <a href="#" className="hover:text-orange-400 transition-colors">in</a>
              <span className="w-1.5 h-1.5 rounded-full bg-white/[0.1]" />
              <a href="mailto:srishti@email.com" className="hover:text-orange-400 transition-colors">✉ mail</a>
            </div>

          </div>

          {/* Right Column: Telemetry Panel */}
          <div className="lg:col-span-5 flex justify-center items-center relative w-full max-w-[440px] lg:max-w-none mx-auto lg:mx-0 pt-16">
            <TelemetryPanel />
          </div>
        </div>
      </section>

      {/* About Section - Editorial Layout */}
      <hr className="section-divider" />
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-16 md:py-24 relative z-10" id="about">
        <div className="flex flex-col gap-8 text-left w-full">
          <div className="font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase">01 — about me</div>
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-normal leading-[1.15] tracking-tight text-white mb-4">
            technology as a form of creativity
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mt-4">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <p className="font-['Playfair_Display'] text-2xl text-gray-200 leading-relaxed font-light">
                I’m a B.Tech CSE(AI) student who sees technology as more than just code — for me, it’s also a form of creativity and expression.
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                I enjoy building visually immersive interfaces, experimenting with digital aesthetics, and creating projects that combine clean functionality with artistic atmosphere.
              </p>

              {/* Editorial details list */}
              <div className="flex flex-col gap-4 mt-6 border-t border-white/[0.06] pt-6">
                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">focus</span>
                  <span className="text-white text-sm font-medium">AI / Machine Learning / NLP</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">education</span>
                  <span className="text-white text-sm font-medium">B.Tech @ University of Lucknow</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">interests</span>
                  <span className="text-white text-sm font-medium">Neural Nets, Computer Vision, Math &amp; Algorithms</span>
                </div>
              </div>
            </div>

            {/* Right side connection widgets */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="glass-card aspect-square flex flex-col justify-center items-center p-4 hover:scale-[1.03] transition-all duration-300">
                <i className="bi bi-cpu text-2xl text-orange-300"></i>
                <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 mt-2">Systems</span>
              </div>
              <div className="glass-card aspect-square flex flex-col justify-center items-center p-4 hover:scale-[1.03] transition-all duration-300">
                <span className="font-mono text-xl text-orange-300">{"{}"}</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 mt-2">Code</span>
              </div>
              <div className="glass-card aspect-square flex flex-col justify-center items-center p-4 hover:scale-[1.03] transition-all duration-300">
                <i className="bi bi-palette text-2xl text-orange-300"></i>
                <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 mt-2">Design</span>
              </div>
              <div className="glass-card aspect-square flex flex-col justify-center items-center p-4 hover:scale-[1.03] transition-all duration-300">
                <i className="bi bi-compass text-2xl text-orange-300"></i>
                <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 mt-2">Explore</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Projects Section */}
      <hr className="section-divider" />
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-16 md:py-24 relative z-10" id="projects">
        <div className="flex flex-col gap-8 text-left w-full relative" style={{ position: 'relative' }}>
          {/* Handcrafted lofi sticky note */}
          <div className="hc-sticky-note" style={{ top: '-100px', right: '-20px', maxWidth: '200px', transform: 'rotate(-3deg)' }}>
            <div className="sticky-tape"></div>
            <p className="sticky-title">TRAINING LOG</p>
            <p className="sticky-text">
              train models, optimize parameters. don't forget to check learning rate.<br/><br/>
              epochs running...<br/>
              loss converges.
            </p>
          </div>

          <div className="font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase">02 — projects</div>
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-normal leading-[1.15] tracking-tight text-white mb-4">
            <span className="font-mono text-3xl font-light text-orange-400/80 mr-2">{"{}"}</span> selected works &amp; experiments
          </h2>

          <div className="cards-deck-container">
            
            {/* Project 1 */}
            <article className="glass-card playing-card playing-card-1 p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-orange-400/60 font-semibold">01</span>
                  <span className="font-mono text-[9px] tracking-wider uppercase bg-orange-400/10 border border-orange-400/20 text-orange-300 px-3 py-1 rounded-full">Python / NLP</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl font-normal text-white">WhatsApp Chat Analyser</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Transforms raw chat exports into beautiful, artistic visualizations. Features activity heatmaps, word clouds, and emoji tracking.
                </p>
                {/* Behind the code segment */}
                <div className="bg-white/[0.01] border-l-2 border-orange-400/30 pl-3 py-1.5 mt-1">
                  <span className="font-mono text-[8px] tracking-widest text-orange-400 uppercase block mb-0.5">behind the code</span>
                  <p className="text-gray-400 text-[10px] italic leading-snug">
                    "I wanted to see if our digital conversations had a visible rhythm. The challenge was mapping human chat data into art."
                  </p>
                </div>
              </div>
              <a href="https://whatsinurchat.streamlit.app/" target="_blank" rel="noreferrer" className="btn-project">
                View Project <i className="bi bi-arrow-up-right"></i>
              </a>
            </article>

            {/* Project 2 */}
            <article className="glass-card playing-card playing-card-2 p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-orange-400/60 font-semibold">02</span>
                  <span className="font-mono text-[9px] tracking-wider uppercase bg-orange-400/10 border border-orange-400/20 text-orange-300 px-3 py-1 rounded-full">Machine Learning</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl font-normal text-white">Sentiment Analysis</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  An NLP-based system identifying emotions and semantic intents from textual datasets using optimized machine learning techniques.
                </p>
                {/* Behind the code segment */}
                <div className="bg-white/[0.01] border-l-2 border-orange-400/30 pl-3 py-1.5 mt-1">
                  <span className="font-mono text-[8px] tracking-widest text-orange-400 uppercase block mb-0.5">behind the code</span>
                  <p className="text-gray-400 text-[10px] italic leading-snug">
                    "Behind the neural network is a desire to decode human sentiment. I built this to explore the subtlety of language and emotion."
                  </p>
                </div>
              </div>
              <a href="https://missbhawna.streamlit.app/" target="_blank" rel="noreferrer" className="btn-project">
                View Project <i className="bi bi-arrow-up-right"></i>
              </a>
            </article>

            {/* Project 3 */}
            <article className="glass-card playing-card playing-card-3 p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-orange-400/60 font-semibold">03</span>
                  <span className="font-mono text-[9px] tracking-wider uppercase bg-orange-400/10 border border-orange-400/20 text-orange-300 px-3 py-1 rounded-full">Python</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl font-normal text-white">Movie Recommendations</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  A cinemaphile's companion tool that maps and suggests films based on content similarity vectors and explicit user preferences.
                </p>
                {/* Behind the code segment */}
                <div className="bg-white/[0.01] border-l-2 border-orange-400/30 pl-3 py-1.5 mt-1">
                  <span className="font-mono text-[8px] tracking-widest text-orange-400 uppercase block mb-0.5">behind the code</span>
                  <p className="text-gray-400 text-[10px] italic leading-snug">
                    "Every movie recommend is a vector match in a high-dimensional space. I wanted to build a portal that maps a cinephile's soul."
                  </p>
                </div>
              </div>
              <a href="https://cinematix.streamlit.app/" target="_blank" rel="noreferrer" className="btn-project">
                View Project <i className="bi bi-arrow-up-right"></i>
              </a>
            </article>

            {/* Project 4 */}
            <article className="glass-card playing-card playing-card-4 p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-orange-400/60 font-semibold">04</span>
                  <span className="font-mono text-[9px] tracking-wider uppercase bg-orange-400/10 border border-orange-400/20 text-orange-300 px-3 py-1 rounded-full">Data Science</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl font-normal text-white">House Data Cleaning</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Rigorous data wrangling, outlier detection, and processing of Bangalore housing data to establish clean analytical frames.
                </p>
                {/* Behind the code segment */}
                <div className="bg-white/[0.01] border-l-2 border-orange-400/30 pl-3 py-1.5 mt-1">
                  <span className="font-mono text-[8px] tracking-widest text-orange-400 uppercase block mb-0.5">behind the code</span>
                  <p className="text-gray-400 text-[10px] italic leading-snug">
                    "Data is chaotic before cleaning. I designed this to reveal the clean, underlying geometry of real-estate pricing dynamics."
                  </p>
                </div>
              </div>
              <a href="https://bangalorehousedata.streamlit.app/" target="_blank" rel="noreferrer" className="btn-project">
                View Project <i className="bi bi-arrow-up-right"></i>
              </a>
            </article>

            {/* Project 5 */}
            <article className="glass-card playing-card playing-card-5 p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-orange-400/60 font-semibold">05</span>
                  <span className="font-mono text-[9px] tracking-wider uppercase bg-orange-400/10 border border-orange-400/20 text-orange-300 px-3 py-1 rounded-full">Machine Learning</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl font-normal text-white">Car Price Prediction</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Machine learning model predicting car prices based on brand, model, and fuel type.
                </p>
                {/* Behind the code segment */}
                <div className="bg-white/[0.01] border-l-2 border-orange-400/30 pl-3 py-1.5 mt-1">
                  <span className="font-mono text-[8px] tracking-widest text-orange-400 uppercase block mb-0.5">behind the code</span>
                  <p className="text-gray-400 text-[10px] italic leading-snug">
                    "Pricing is a complex function of history, utility, and market sentiment. The challenge was finding order inside thousands of disparate listings."
                  </p>
                </div>
              </div>
              <a href="https://yuvika108-car-price-prediction-streamlit-app-y4jdhf.streamlit.app/" target="_blank" rel="noreferrer" className="btn-project">
                View Project <i className="bi bi-arrow-up-right"></i>
              </a>
            </article>

            {/* Project 6 */}
            <article className="glass-card playing-card playing-card-6 p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-orange-400/60 font-semibold">06</span>
                  <span className="font-mono text-[9px] tracking-wider uppercase bg-orange-400/10 border border-orange-400/20 text-orange-300 px-3 py-1 rounded-full">Frontend</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl font-normal text-white">Rock-Paper-Scissor</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Interactive game focused on frontend interaction and smooth user experience.
                </p>
                {/* Behind the code segment */}
                <div className="bg-white/[0.01] border-l-2 border-orange-400/30 pl-3 py-1.5 mt-1">
                  <span className="font-mono text-[8px] tracking-widest text-orange-400 uppercase block mb-0.5">behind the code</span>
                  <p className="text-gray-400 text-[10px] italic leading-snug">
                    "A simple childhood game rebuilt to focus on tactile feedback and fluid motion. The magic is making the mundane feel extremely responsive."
                  </p>
                </div>
              </div>
              <a href="https://silver-manatee-592868.netlify.app/" target="_blank" rel="noreferrer" className="btn-project">
                Play Game <i className="bi bi-arrow-up-right"></i>
              </a>
            </article>

          </div>
        </div>
      </section>

      {/* Experience Section */}
      <hr className="section-divider" />
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-16 md:py-24 relative z-10 experience-section" id="experience">
        <div className="section-inner relative" style={{ position: 'relative' }}>
          {/* Handcrafted lofi sticky note */}
          <div className="hc-sticky-note" style={{ top: '20px', right: '-60px', maxWidth: '170px', transform: 'rotate(5deg)' }}>
            <div className="sticky-tape"></div>
            <p className="sticky-title">NOTE TO SELF</p>
            <p className="sticky-text">
              keep coding, keep dreaming. don't forget to look up at the stars.
            </p>
          </div>

          <div className="font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase">03 — Experience</div>
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-normal leading-[1.15] tracking-tight text-white mb-4">My Project Journey</h2>

          <div className="timeline">
            {/* Phase 3 */}
            <div className="tl-phase-header">
              <h3 className="tl-title">Phase 3: Interactive Dashboards &amp; Frontend Integration</h3>
              <p className="tl-desc">Bridging algorithmic backend data models with responsive user-facing interfaces to build rich visual applications:</p>
            </div>

            <div className="tl-item tl-left">
              <div className="tl-marker">
                <div className="tl-dot tl-dot--active"></div>
              </div>
              <div className="tl-content">
                <div className="tl-project-card">
                  <h4>Portfolio-Website</h4>
                  <div className="tl-tech"><i className="bi bi-code-slash"></i> JavaScript, HTML, CSS</div>
                  <p className="tl-desc">Your central front-end portal built to showcase your technical resume, host your interactive web projects, and track your software development timeline.</p>
                </div>
              </div>
            </div>

            <div className="tl-item tl-right">
              <div className="tl-marker">
                <div className="tl-dot"></div>
              </div>
              <div className="tl-content">
                <div className="tl-project-card">
                  <h4>gdp-dashboard</h4>
                  <div className="tl-tech"><i className="bi bi-bar-chart-line"></i> Python, Plotly / Dash or Streamlit</div>
                  <p className="tl-desc">An analytics application designed to visualize global macroeconomic metrics, trends, and GDP distributions through dynamic data dashboards.</p>
                </div>
              </div>
            </div>

            <div className="tl-item tl-left">
              <div className="tl-marker">
                <div className="tl-dot"></div>
              </div>
              <div className="tl-content">
                <div className="tl-project-card">
                  <h4>mediguard</h4>
                  <div className="tl-tech"><i className="bi bi-heart-pulse"></i> JavaScript, HTML5, CSS3</div>
                  <p className="tl-desc">A newly initiated web-based application combining client-side web architecture with a medical/healthcare tracker utility.</p>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="tl-phase-header">
              <h3 className="tl-title">Phase 2: Data Engineering &amp; Cleaning</h3>
              <p className="tl-desc">This phase highlights your shift toward ensuring data quality and preparation before feeding data into models.</p>
            </div>

            <div className="tl-item tl-right">
              <div className="tl-marker">
                <div className="tl-dot"></div>
              </div>
              <div className="tl-content">
                <div className="tl-project-card">
                  <h4>Cleaned_Bangalore_House_Data</h4>
                  <div className="tl-tech"><i className="bi bi-database-check"></i> Python, Pandas, NumPy, Data Imputation</div>
                  <p className="tl-desc">A comprehensive data-preprocessing pipeline focusing on data hygiene. It handles outlier removal, feature engineering, and missing value management on real estate datasets to ready them for regression models.</p>
                </div>
              </div>
            </div>

            {/* Phase 1 */}
            <div className="tl-phase-header">
              <h3 className="tl-title">Phase 1: Machine Learning &amp; NLP Core</h3>
              <p className="tl-desc">During this phase, you focused heavily on foundational AI modeling, handling data structures for prediction, and text processing.</p>
            </div>

            <div className="tl-item tl-left">
              <div className="tl-marker">
                <div className="tl-dot"></div>
              </div>
              <div className="tl-content">
                <div className="tl-project-card">
                  <h4>Cancer-Detection-Using-Deep-Learning</h4>
                  <div className="tl-tech"><i className="bi bi-cpu"></i> Python, TensorFlow/Keras</div>
                  <p className="tl-desc">A high-impact computer vision project utilizing deep learning architectures to process medical imagery for identifying and classifying malignant cellular patterns.</p>
                </div>
              </div>
            </div>

            <div className="tl-item tl-right">
              <div className="tl-marker">
                <div className="tl-dot"></div>
              </div>
              <div className="tl-content">
                <div className="tl-project-card">
                  <h4>Placement_Prediction_using_Logistic_Regression</h4>
                  <div className="tl-tech"><i className="bi bi-graph-up-arrow"></i> Python, Scikit-Learn, Pandas, NumPy</div>
                  <p className="tl-desc">A predictive classification application that processes student academic metrics, historical placement data, and skill sets to forecast campus recruitment outcomes.</p>
                </div>
              </div>
            </div>

            <div className="tl-item tl-left">
              <div className="tl-marker">
                <div className="tl-dot"></div>
              </div>
              <div className="tl-content">
                <div className="tl-project-card">
                  <h4>MoviesRecommendationSystem</h4>
                  <div className="tl-tech"><i className="bi bi-film"></i> Jupyter, Python, Pandas, Content-Based Filtering</div>
                  <p className="tl-desc">An unsupervised learning project implementing recommendation system pipelines to calculate textual and metadata similarities, delivering tailored movie suggestions to users.</p>
                </div>
              </div>
            </div>

            <div className="tl-item tl-right">
              <div className="tl-marker">
                <div className="tl-dot"></div>
              </div>
              <div className="tl-content">
                <div className="tl-project-card">
                  <h4>Sentiment_Analysis</h4>
                  <div className="tl-tech"><i className="bi bi-chat-left-text"></i> Python, NLTK / TextBlob, Scikit-Learn</div>
                  <p className="tl-desc">A Natural Language Processing (NLP) application engineered to clean textual corpora, parse linguistic features, and predict underlying emotional polarities or intent.</p>
                </div>
              </div>
            </div>

            <div className="tl-item tl-left">
              <div className="tl-marker">
                <div className="tl-dot"></div>
              </div>
              <div className="tl-content">
                <div className="tl-project-card">
                  <h4>WhatsApp_Chat_Analyser <span className="tl-status">Refined May 2026</span></h4>
                  <div className="tl-tech"><i className="bi bi-whatsapp"></i> Python, Regex, Matplotlib, Seaborn, Streamlit</div>
                  <p className="tl-desc">A data analytics utility that transforms raw, unstructured WhatsApp chat logs into interactive visual reports, showing active heatmaps, message distributions, and word frequency graphs.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Skills Section */}
      <hr className="section-divider" />
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-16 md:py-24 relative z-10" id="toolkit">
        <div className="flex flex-col gap-8 text-left w-full">
          <div className="font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase">04 — toolkit</div>
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-normal leading-[1.15] tracking-tight text-white mb-4">
            the craft &amp; the tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            
            <div className="glass-card p-8 flex flex-col gap-6">
              <h3 className="font-['Playfair_Display'] text-2xl font-normal text-orange-300">Core Languages</h3>
              <ul className="flex flex-col gap-2 font-mono text-xs text-gray-400 uppercase tracking-wider">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> Python</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> JavaScript</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> C++</li>
              </ul>
            </div>

            <div className="glass-card p-8 flex flex-col gap-6">
              <h3 className="font-['Playfair_Display'] text-2xl font-normal text-orange-300">Frameworks &amp; Tools</h3>
              <ul className="flex flex-col gap-2 font-mono text-xs text-gray-400 uppercase tracking-wider">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> React</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> Tailwind CSS</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> Figma</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> Git / GitHub</li>
              </ul>
            </div>

            <div className="glass-card p-8 flex flex-col gap-6">
              <h3 className="font-['Playfair_Display'] text-2xl font-normal text-orange-300">Specializations</h3>
              <ul className="flex flex-col gap-2 font-mono text-xs text-gray-400 uppercase tracking-wider">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> Machine Learning</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> Data Structures (DSA)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> NLP</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400/40 inline-block"></span> UI/UX Design</li>
              </ul>
            </div>

          </div>
        </div>
      </section>



      {/* Future Vision */}
      <hr className="section-divider" />
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-20 md:py-28 relative z-10" id="vision">
        <div className="flex flex-col gap-12 text-left w-full">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2 mx-auto w-full max-w-[850px]">
            <div className="font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase">05 — future vision</div>
            <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-normal leading-[1.1] tracking-tight text-white">
              I want to build things that <span className="italic font-light text-orange-400">feel human<span className="text-white">.</span></span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-[700px] mt-2">
              I believe software should be more than just utility. It should be an experience — blending visual aesthetics, intuitive machine intelligence, and atmospheric design to create a deeper digital connection.
            </p>
          </div>

          {/* Grid Layout: Pillars on Left, Contact Widget on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: 3 Vision Pillars */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pillar 1: Immersive Interaction */}
              <div className="glass-card p-6 flex flex-col justify-between gap-6 hover:border-orange-400/35 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-400/10 flex items-center justify-center text-orange-400 border border-orange-400/20 group-hover:scale-110 transition-transform">
                    <i className="bi bi-hand-index-thumb text-base"></i>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl font-normal text-white">Immersive Interaction</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Pioneering touchless web controls using real-time hand-gesture tracking (Google MediaPipe), shifting interfaces from rigid clicks to spatial human movements.
                  </p>
                </div>
                <span className="font-mono text-[9px] text-orange-400/50 uppercase tracking-widest">01 / spatial</span>
              </div>

              {/* Pillar 2: Creative AI */}
              <div className="glass-card p-6 flex flex-col justify-between gap-6 hover:border-orange-400/35 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-400/10 flex items-center justify-center text-orange-400 border border-orange-400/20 group-hover:scale-110 transition-transform">
                    <i className="bi bi-cpu text-base"></i>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl font-normal text-white">Creative AI</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Integrating intelligence directly into layouts. Moving beyond simple text prompts to design layouts that actively respond, learn, and co-create with users.
                  </p>
                </div>
                <span className="font-mono text-[9px] text-orange-400/50 uppercase tracking-widest">02 / intelligence</span>
              </div>

              {/* Pillar 3: Cinematic Feel */}
              <div className="glass-card p-6 flex flex-col justify-between gap-6 hover:border-orange-400/35 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-400/10 flex items-center justify-center text-orange-400 border border-orange-400/20 group-hover:scale-110 transition-transform">
                    <i className="bi bi-palette text-base"></i>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl font-normal text-white">Cinematic Feel</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Infusing analog atmosphere—ambient lofi sounds, particle weather systems, custom cursors, and glass panels—to make digital canvases feel tactile and alive.
                  </p>
                </div>
                <span className="font-mono text-[9px] text-orange-400/50 uppercase tracking-widest">03 / atmosphere</span>
              </div>

            </div>

            {/* Right: Refined Contact Card */}
            <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between gap-6 relative overflow-hidden group hover:border-orange-400/40">
              {/* Inner ambient glow */}
              <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-orange-400/5 filter blur-3xl pointer-events-none group-hover:bg-orange-400/10 transition-colors" />
              
              <div className="flex flex-col gap-4">
                <div className="font-mono text-[9px] tracking-widest text-orange-400/70 uppercase">available for projects</div>
                <h3 className="font-['Playfair_Display'] text-3xl font-normal text-white leading-none">let's talk</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Whether it’s custom web design, AI integration, design concepts, or simply sharing cinema playlists and interesting ideas—my inbox is always open.
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <a 
                  href="mailto:srishti@email.com" 
                  className="w-full py-3.5 bg-orange-400 text-[#121216] font-semibold text-center rounded-full hover:bg-orange-300 hover:shadow-[0_0_25px_rgba(224,122,95,0.35)] transition-all text-xs tracking-wider uppercase"
                >
                  let's connect →
                </a>
                
                <div className="flex justify-between items-center px-2 font-mono text-[9px] uppercase text-gray-500 tracking-widest">
                  <a href="#" className="hover:text-orange-400 transition-colors">github</a>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <a href="#" className="hover:text-orange-400 transition-colors">linkedin</a>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <a href="#" className="hover:text-orange-400 transition-colors">instagram</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <hr className="section-divider" />
      <footer className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 pt-16 relative z-10 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex flex-col gap-1 text-left">
          <span className="footer-name">srishti <span className="nav-logo-bold">mishra</span><span className="logo-dot">.</span></span>
          <span className="text-gray-500 text-[11px] font-mono italic">lovingly crafted with code, math &amp; neural network training loops.</span>
        </div>
        <div className="flex flex-col gap-1 text-left md:text-right">
          <span className="text-gray-500 text-[11px]">continuous training, model optimization &amp; predictive insights.</span>
          <span className="font-mono text-xs text-orange-400/90 font-medium tracking-widest">{timeStr}</span>
        </div>
      </footer>

    </div>
  );
}

function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [isRainActive, setIsRainActive] = useState(true);
  const [gesture, setGesture] = useState("");

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch((err) => console.log("Audio play failed:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  // Immersive rain canvas animation (Interactive Neural Network Constellation background)
  useEffect(() => {
    const canvas = document.getElementById('rainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    let animationFrameId;
    let nodes = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    let mouse = { x: null, y: null };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseOut);

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
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Custom Cursor Mouse Listener
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    if (!cursor || !trail) return;

    const onMouseMove = (e) => {
      cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      trail.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('a') || 
        target.closest('button') || 
        target.classList.contains('interactive') ||
        target.getAttribute('role') === 'button'
      ) {
        trail.classList.add('cursor-active');
        cursor.classList.add('cursor-active');
      } else {
        trail.classList.remove('cursor-active');
        cursor.classList.remove('cursor-active');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <PortfolioContext.Provider value={{
      isMusicPlaying,
      setIsMusicPlaying,
      isAgentActive,
      setIsAgentActive,
      isRainActive,
      setIsRainActive,
      gesture,
      setGesture
    }}>
      <div className="w-full min-h-screen relative overflow-hidden">
        {/* Custom Cursor Dot Design (Hidden on Mobile) */}
        <div className="cursor hidden md:block" id="cursor" />
        <div className="cursor-trail hidden md:block" id="cursorTrail" />

        {/* Immersive Rain Overlay */}
        <canvas 
          className="rain-canvas pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000" 
          id="rainCanvas" 
          style={{ opacity: isRainActive ? 0.35 : 0 }} 
        />

        {/* The gesture detector runs globally */}
        <GestureDetector />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/creative" element={<CreativeCorner />} />
        </Routes>

        <audio loop ref={audioRef} className="hidden" src="/music/lofi.mp3" />
      </div>
    </PortfolioContext.Provider>
  );
}

export default App;
