import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import './App.css'

export const PortfolioContext = createContext(null);
import GestureDetector from "./GestureDetector";

function Home() {
  const { isMusicPlaying, setIsMusicPlaying } = useContext(PortfolioContext);

  // Role Typewriter Loop
  const roles = ["B.Tech CSE(AI) Student", "Creative Developer", "AI Specialist", "Interaction Artist"];
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

  // Terminal simulated typing
  const [termText, setTermText] = useState("");
  useEffect(() => {
    const fullCmd = "cat srishti.json";
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullCmd.length) {
        setTermText(prev => prev + fullCmd.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 120);
    return () => clearInterval(interval);
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
    <div className="relative min-h-screen bg-[#16161a] text-[#9ca3af] font-['Outfit'] overflow-x-hidden selection:bg-orange-500/30 selection:text-white pb-12">
      {/* Background Mesh Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.03)_0%,transparent_70%)]" />
        <div className="absolute top-[35%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.01)_0%,transparent_70%)]" />
        <div className="absolute bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.02)_0%,transparent_70%)]" />
      </div>

      {/* Back to top button */}
      {showScrollBtn && (
        <button onClick={scrollToTop} className="back-to-top flex items-center justify-center text-sm" title="Back to Top">
          <i className="bi bi-chevron-up"></i>
        </button>
      )}

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-40 bg-[#16161a]/70 backdrop-blur-md border-b border-white/[0.06]">
        <div className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-5 flex justify-between items-center">
          <div className="font-mono font-semibold text-xs tracking-[0.15em] text-white uppercase select-none">
            srishti mishra
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#about" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">about</a>
            <a href="#projects" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">projects</a>
            <a href="#toolkit" className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors">toolkit</a>
            <Link to="/creative" className="font-mono text-[10px] tracking-[0.15em] uppercase text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"><i className="bi bi-controller text-[11px]"></i>creative</Link>
            
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
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-emerald-400">available for collaboration</span>
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
              <span className="px-3.5 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-300 transition-all cursor-default select-none">🎨 Artist at Heart</span>
              <span className="px-3.5 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-300 transition-all cursor-default select-none">🤖 AI Enthusiast</span>
              <span className="px-3.5 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-300 transition-all cursor-default select-none">⚡ Creative Coder</span>
              <span className="px-3.5 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-300 transition-all cursor-default select-none">🎬 Cinephile</span>
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

          {/* Right Column: Floating Handcrafted Setup (No rigid container box) */}
          <div className="lg:col-span-5 flex flex-col gap-6 items-center lg:items-end relative w-full max-w-[400px] lg:max-w-none mx-auto lg:mx-0 pt-16">
            
            {/* Handcrafted translucent glass sticky note */}
            <div className="hc-sticky-note absolute top-[-90px] right-[12%] lg:right-[16%] pointer-events-auto">
              <div className="sticky-tape" />
              <p className="sticky-title">NOTE TO SELF</p>
              <p className="sticky-text">
                keep coding, keep dreaming. don't forget to drink water.<br/><br/>
                lofi beats looping.<br/>
                rain is falling.
              </p>
            </div>

            {/* Top Section: Portrait Initials with pulsing rings */}
            <div className="relative w-32 h-32 rounded-full bg-orange-950/10 border border-orange-400/10 flex items-center justify-center select-none shadow-[0_0_30px_rgba(251,146,60,0.03)] backdrop-blur-sm mb-2">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.06)_0%,transparent_70%)] animate-pulse" />
              <span className="font-['Space_Grotesk'] text-3xl font-light text-orange-300">SM</span>
              
              {/* Multiple animated pulsing borders */}
              <div className="absolute w-[108%] h-[108%] rounded-full border border-orange-400/08 pulsing-ring-1" />
              <div className="absolute w-[124%] h-[124%] rounded-full border border-orange-400/04 pulsing-ring-2" />
            </div>

            {/* Bottom Section: simulated code terminal */}
            <div className="w-full max-w-[340px] bg-black/45 backdrop-blur-md border border-white/[0.05] rounded-2xl p-4 font-mono text-left select-none relative shadow-xl hover:border-orange-400/20 transition-all duration-300">
              <div className="flex gap-1.5 mb-2.5 pb-2 border-b border-white/[0.06]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                <span className="text-[10px] text-gray-500 ml-2">srishti.json</span>
              </div>
              <div className="text-[11px] leading-relaxed text-orange-300 flex flex-col gap-1">
                <p className="text-gray-400">
                  <span className="text-emerald-400">$</span> {termText}
                  <span className="w-1.5 h-3.5 bg-orange-400 inline-block ml-1 animate-pulse align-middle" />
                </p>
                <p className="text-gray-500">// books, cinema &amp; late-night playlists</p>
                <p className="text-gray-500">// quietly building cool things</p>
                <p className="text-gray-500">// INTP · artist at heart</p>
              </div>
            </div>

            {/* Floating Stat Chips */}
            <div className="absolute top-[8%] left-[0px] px-3 py-1.5 bg-[#16161a]/95 border border-white/[0.06] rounded-full font-mono text-[9px] tracking-wider uppercase text-orange-300/90 shadow-lg select-none hover:border-orange-400/30 hover:scale-105 transition-all duration-300">
              6+ projects
            </div>
            <div className="absolute bottom-[35%] left-[-15px] px-3 py-1.5 bg-[#16161a]/95 border border-white/[0.06] rounded-full font-mono text-[9px] tracking-wider uppercase text-orange-300/90 shadow-lg select-none hover:border-orange-400/30 hover:scale-105 transition-all duration-300 z-10">
              UI/UX · AI · NLP
            </div>
            <div className="absolute bottom-[4%] right-[-10px] px-3 py-1.5 bg-[#16161a]/95 border border-white/[0.06] rounded-full font-mono text-[9px] tracking-wider uppercase text-orange-300/90 shadow-lg select-none hover:border-orange-400/30 hover:scale-105 transition-all duration-300">
              creative dev
            </div>
          </div>

        </div>
      </section>

      {/* About Section - Editorial Layout */}
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-16 md:py-24 border-t border-white/[0.06] relative z-10" id="about">
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
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">persona</span>
                  <span className="text-white text-sm font-medium">INTP / Artist at Heart</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">education</span>
                  <span className="text-white text-sm font-medium">B.Tech @ University of Lucknow</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">inspirations</span>
                  <span className="text-white text-sm font-medium">Cinema, Late-night playlists, Visual design</span>
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
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-16 md:py-24 border-t border-white/[0.06] relative z-10" id="projects">
        <div className="flex flex-col gap-8 text-left w-full">
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
              <a href="https://whatsinurchat.streamlit.app/" target="_blank" rel="noreferrer" className="w-fit px-5 py-1.5 border border-orange-400/30 hover:border-orange-400 text-orange-400 hover:bg-orange-400/10 transition-all font-mono text-[9px] tracking-widest uppercase rounded-full">
                View Project
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
              <a href="https://missbhawna.streamlit.app/" target="_blank" rel="noreferrer" className="w-fit px-5 py-1.5 border border-orange-400/30 hover:border-orange-400 text-orange-400 hover:bg-orange-400/10 transition-all font-mono text-[9px] tracking-widest uppercase rounded-full">
                View Project
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
              <a href="#" className="w-fit px-5 py-1.5 border border-orange-400/30 hover:border-orange-400 text-orange-400 hover:bg-orange-400/10 transition-all font-mono text-[9px] tracking-widest uppercase rounded-full">
                View Project
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
              <a href="#" className="w-fit px-5 py-1.5 border border-orange-400/30 hover:border-orange-400 text-orange-400 hover:bg-orange-400/10 transition-all font-mono text-[9px] tracking-widest uppercase rounded-full">
                View Project
              </a>
            </article>

          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-16 md:py-24 border-t border-white/[0.06] relative z-10" id="toolkit">
        <div className="flex flex-col gap-8 text-left w-full">
          <div className="font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase">03 — toolkit</div>
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

      {/* Creative Corner */}
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-16 md:py-24 border-t border-white/[0.06] relative z-10" id="creative">
        <div className="flex flex-col gap-8 text-left w-full">
          <div className="font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase">04 — creative corner</div>
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-normal leading-[1.15] tracking-tight text-white mb-4">
            experiments &amp; aesthetics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            
            <div className="glass-card md:col-span-2 overflow-hidden flex flex-col justify-between h-[320px] relative group">
              <div className="w-full h-1/2 bg-[linear-gradient(45deg,#1c1917,#431407,#1c1917)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay group-hover:scale-105 transition-all duration-700" />
                <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase border border-orange-400/30 px-3 py-1 rounded bg-black/40 z-10 select-none">visual concepts</span>
              </div>
              <div className="p-6 text-left">
                <h3 className="font-['Playfair_Display'] text-2xl font-normal text-white">Cinematic Inspirations</h3>
                <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">Visual concepts and atmospheric frames that shape the deep soul of my digital drafts.</p>
              </div>
            </div>

            <div className="glass-card overflow-hidden flex flex-col justify-between h-[320px] relative group">
              <div className="w-full h-1/2 bg-[linear-gradient(135deg,#78350f,#2d1b10)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,146,60,0.1)_0%,transparent_70%)] animate-pulse z-10 pointer-events-none" />
                <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase border border-orange-400/30 px-3 py-1 rounded bg-black/40 z-10 select-none">generative art</span>
              </div>
              <div className="p-6 text-left">
                <h3 className="font-['Playfair_Display'] text-2xl font-normal text-white">Aesthetic Ideas</h3>
                <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">Coding ambient generative shapes and researching smooth web physics.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 py-16 md:py-24 border-t border-white/[0.06] relative z-10" id="vision">
        <div className="flex flex-col gap-8 text-left w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase">05 — future vision</div>
              <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-normal leading-[1.2] tracking-tight text-white">
                I want to build things that <span className="italic font-light text-orange-400">feel human<span className="text-white">.</span></span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-[620px]">
                I want to create digital experiences that feel artistic, immersive, and emotionally memorable — blending technology, design, AI, interaction, and visual creativity into something meaningful and human.
              </p>
            </div>

            <div className="lg:col-span-4 glass-card p-8 flex flex-col gap-6 text-center lg:text-left relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,146,60,0.06)_0%,transparent_70%)] pointer-events-none" />
              <h3 className="font-['Playfair_Display'] text-2xl font-normal text-white">let's connect</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Whether it’s technology, design, films, music, creativity, or interesting ideas — I’m always open to meaningful conversations.
              </p>
              <a href="mailto:srishti@email.com" className="w-full py-3 bg-orange-400 text-[#121216] font-semibold text-center rounded-full hover:bg-orange-300 hover:shadow-[0_0_20px_rgba(251,146,60,0.25)] transition-all text-xs tracking-wider uppercase">
                let's talk →
              </a>
              <div className="flex justify-center lg:justify-between items-center gap-4 font-mono text-[10px] uppercase text-gray-500 tracking-widest mt-2">
                <a href="#" className="hover:text-orange-400 transition-colors">github</a>
                <a href="#" className="hover:text-orange-400 transition-colors">linkedin</a>
                <a href="#" className="hover:text-orange-400 transition-colors">instagram</a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-[1100px] mx-auto px-2 md:px-3 lg:px-4 pt-16 border-t border-white/[0.06] relative z-10 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex flex-col gap-1 text-left">
          <span className="font-mono font-semibold text-xs tracking-widest text-orange-300 uppercase">srishti mishra</span>
          <span className="text-gray-500 text-[11px] font-mono italic">lovingly crafted with code, cold coffee &amp; late-night lofi playlists.</span>
        </div>
        <div className="flex flex-col gap-1 text-left md:text-right">
          <span className="text-gray-500 text-[11px]">late-night ideas, soft music &amp; visual creativity.</span>
          <span className="font-mono text-xs text-orange-400/90 font-medium tracking-widest">{timeStr}</span>
        </div>
      </footer>

    </div>
  );
}

function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [isRainActive, setIsRainActive] = useState(false);
  const [gesture, setGesture] = useState("");

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch((err) => console.log("Audio play failed:", err));
        setIsRainActive(true);
      } else {
        audioRef.current.pause();
        setIsRainActive(false);
      }
    }
  }, [isMusicPlaying]);

  // Immersive rain canvas animation
  useEffect(() => {
    const canvas = document.getElementById('rainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    let animationFrameId;
    let drops = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Create drops
    for (let i = 0; i < 120; i++) {
      drops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        length: Math.random() * 25 + 15,
        speed: Math.random() * 10 + 15,
        opacity: Math.random() * 0.15 + 0.05
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';

      drops.forEach(d => {
        ctx.strokeStyle = `rgba(224, 122, 95, ${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 0.5, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x += 0.5;

        if (d.y > h) {
          d.y = -d.length;
          d.x = Math.random() * w;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', resize);
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
          <Route path="/creative" element={
            <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#121216] relative overflow-hidden">
              {/* Background mesh */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.05)_0%,transparent_70%)]" />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-6 p-8">
                <h1 className="font-['Playfair_Display'] text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-white text-center">
                  Creative <span className="italic text-orange-400 font-light">Dimension<span className="text-white">.</span></span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide max-w-[500px]">
                  You successfully navigated here using the <span className="text-orange-400 font-medium">Peace sign ✌️</span> gesture!
                </p>
                <Link to="/" className="mt-8 px-8 py-3.5 bg-orange-400 text-[#121216] font-semibold rounded-full hover:bg-orange-300 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)] transition-all text-sm tracking-wide">
                  ← return to reality
                </Link>
              </div>
            </div>
          } />
        </Routes>

        <audio loop ref={audioRef} className="hidden" src="/music/lofi.mp3" />
      </div>
    </PortfolioContext.Provider>
  );
}

export default App;
