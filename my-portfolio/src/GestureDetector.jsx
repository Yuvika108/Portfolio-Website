import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { PortfolioContext } from "./App";

export default function GestureDetector() {
    const { 
      isMusicPlaying, 
      setIsMusicPlaying, 
      isAgentActive, 
      setIsAgentActive,
      isRainActive,
      setIsRainActive,
      gesture,
      setGesture
    } = useContext(PortfolioContext);

    const videoRef = useRef(null);
    const cameraRef = useRef(null);
    const handsRef = useRef(null);
    const navigate = useNavigate();

    // Local state
    const [particlesInit, setParticlesInit] = useState(false);

    // Refs for gesture historical tracking
    const cooldownRef = useRef(false);
    const waveHistoryRef = useRef([]);
    const lastScrollYRef = useRef(null);
    const lastPinchTimeRef = useRef(0);
    const isPinchingRef = useRef(false);

    // Setup Particles Engine on mount
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setParticlesInit(true);
        });
    }, []);

    // Setup MediaPipe Camera and Hand Tracking dynamically
    useEffect(() => {
        if (!isAgentActive) {
            // Turn off camera stream completely to stop green light and save CPU cycles
            if (cameraRef.current) {
                try {
                    cameraRef.current.stop();
                } catch(e) {
                    console.log("Error turning off camera tracks:", e);
                }
                cameraRef.current = null;
            }
            setGesture("");
            return;
        }

        let active = true;

        const initMediaPipe = () => {
            if (!window.Hands || !window.Camera) {
                setTimeout(initMediaPipe, 100);
                return;
            }

            if (!active) return;

            // Instantiate Hands model if not already done
            if (!handsRef.current) {
                const hands = new window.Hands({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`,
                });

                hands.setOptions({
                    maxNumHands: 2,
                    modelComplexity: 1,
                    minDetectionConfidence: 0.7,
                    minTrackingConfidence: 0.7,
                });

                hands.onResults(onResults);
                handsRef.current = hands;
            }

            if (videoRef.current && !cameraRef.current) {
                const camera = new window.Camera(videoRef.current, {
                    onFrame: async () => {
                        if (active && handsRef.current) {
                            await handsRef.current.send({ image: videoRef.current });
                        }
                    },
                    width: 640,
                    height: 480,
                });
                camera.start();
                cameraRef.current = camera;
            }
        };

        initMediaPipe();

        return () => {
            active = false;
            if (cameraRef.current) {
                try {
                    cameraRef.current.stop();
                } catch(e) {
                    console.log("Error turning off camera tracks:", e);
                }
                cameraRef.current = null;
            }
        };

        function onResults(results) {
            if (!active) return;

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                let currentGestures = [];

                results.multiHandLandmarks.forEach((landmarks, index) => {
                    const thumbTip = landmarks[4];
                    const indexTip = landmarks[8];
                    const middleTip = landmarks[12];
                    const ringTip = landmarks[16];
                    const pinkyTip = landmarks[20];

                    let g = "";

                    // Thumbs Up
                    if (thumbTip.y < indexTip.y && thumbTip.y < landmarks[3].y && indexTip.y > landmarks[5].y) {
                        g = "thumbs_up";
                    }
                    // Thumbs Down
                    else if (thumbTip.y > indexTip.y && thumbTip.y > landmarks[3].y && indexTip.y > landmarks[5].y) {
                        g = "thumbs_down";
                    }
                    // Open Palm OR Waving
                    else if (indexTip.y < landmarks[6].y && middleTip.y < landmarks[10].y && ringTip.y < landmarks[14].y && pinkyTip.y < landmarks[18].y) {
                        if (index === 0) {
                            waveHistoryRef.current.push(indexTip.x);
                            if (waveHistoryRef.current.length > 45) waveHistoryRef.current.shift();
                            let changes = 0;
                            let movement = 0;
                            for (let i = 2; i < waveHistoryRef.current.length; i++) {
                                movement += Math.abs(waveHistoryRef.current[i] - waveHistoryRef.current[i - 1]);
                                if ((waveHistoryRef.current[i - 1] - waveHistoryRef.current[i - 2]) * (waveHistoryRef.current[i] - waveHistoryRef.current[i - 1]) < 0 && Math.abs(waveHistoryRef.current[i] - waveHistoryRef.current[i - 1]) > 0.005) changes++;
                            }
                            g = (changes >= 2 && movement > 0.2) ? "bye_bye" : "open_palm";
                        } else {
                            g = "open_palm";
                        }
                    }
                    // Two Fingers -> Scroll or Peace Sign
                    else if (indexTip.y < landmarks[6].y && middleTip.y < landmarks[10].y && ringTip.y > landmarks[14].y && pinkyTip.y > landmarks[18].y) {
                        const spread = Math.abs(indexTip.x - middleTip.x);
                        g = spread > 0.06 ? "peace" : "scroll";
                    }
                    // Rock On -> Spider Stop
                    else if (indexTip.y < landmarks[6].y && middleTip.y > landmarks[10].y && ringTip.y > landmarks[14].y && pinkyTip.y < landmarks[18].y) {
                        g = "rock_on";
                    }
                    // Point
                    else if (indexTip.y < landmarks[6].y && middleTip.y > landmarks[10].y && ringTip.y > landmarks[14].y && pinkyTip.y > landmarks[18].y) {
                        g = "point";
                    }

                    // Pinch
                    const dist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
                    if (dist < 0.06) g = "pinch";

                    currentGestures.push({ type: g, landmarks, indexTip });
                });

                const main = currentGestures[0];
                let final = currentGestures.some(x => x.type === "rock_on") ? "rock_on" : main.type;

                if (final !== "open_palm" && final !== "bye_bye") waveHistoryRef.current = [];

                setGesture(final);

                // Handle Actions
                if (final === "point" || final === "pinch") {
                    const x = (1 - main.indexTip.x) * window.innerWidth;
                    const y = main.indexTip.y * window.innerHeight;
                    lastScrollYRef.current = null;

                    // Update custom cursor positioning if custom cursor elements are loaded
                    const cursor = document.getElementById('cursor');
                    const cursorTrail = document.getElementById('cursorTrail');
                    if (cursor) cursor.style.transform = `translate(${x}px, ${y}px)`;
                    if (cursorTrail) {
                        setTimeout(() => {
                            cursorTrail.style.transform = `translate(${x - 16}px, ${y - 16}px)`;
                        }, 50);
                    }

                    if (final === "pinch") {
                        if (!isPinchingRef.current) {
                            isPinchingRef.current = true;
                            const now = Date.now();
                            const el = document.elementFromPoint(x, y);
                            if (now - lastPinchTimeRef.current < 500) {
                                if (el) {
                                    el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window }));
                                    el.click();
                                }
                                lastPinchTimeRef.current = 0;
                            } else {
                                if (el) el.click();
                                lastPinchTimeRef.current = now;
                            }
                        }
                    } else {
                        isPinchingRef.current = false;
                    }
                } else if (final === "scroll") {
                    document.documentElement.style.scrollBehavior = 'auto';
                    const ty = main.landmarks[9].y;
                    if (lastScrollYRef.current != null) {
                        const dy = ty - lastScrollYRef.current;
                        if (Math.abs(dy) > 0.005) {
                            window.scrollBy(0, -(dy * 3000));
                            lastScrollYRef.current = ty;
                        }
                    } else {
                        lastScrollYRef.current = ty;
                    }
                } else {
                    document.documentElement.style.scrollBehavior = '';
                    lastScrollYRef.current = null;
                    isPinchingRef.current = false;
                }
            } else {
                setGesture("");
                lastScrollYRef.current = null;
                isPinchingRef.current = false;
            }
        }
    }, [isAgentActive]);

    // Handle Gesture Global State Actions
    useEffect(() => {
        if (!gesture || cooldownRef.current) return;

        if (gesture === "thumbs_up") {
            setIsMusicPlaying(true);
            setIsRainActive(true);
            cooldownRef.current = true;
            setTimeout(() => { cooldownRef.current = false; }, 1500);
        } else if (gesture === "rock_on") {
            setIsMusicPlaying(false);
            cooldownRef.current = true;
            setTimeout(() => { cooldownRef.current = false; }, 1500);
        } else if (gesture === "open_palm") {
            // Rain is permanently active, no deactivation timer needed
        } else if (gesture === "bye_bye") {
            // Turn off Aanya and stream
            setIsAgentActive(false);
        } else if (gesture === "peace") {
            if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
                navigate("/creative");
            }
            cooldownRef.current = true;
            setTimeout(() => { cooldownRef.current = false; }, 1500);
        }
    }, [gesture, isMusicPlaying, navigate]);

    return (
        <>
            {/* Floating Enable Button */}
            {!isAgentActive && (
                <button 
                    onClick={() => setIsAgentActive(true)}
                    className="fixed bottom-6 right-6 z-50 px-5 py-2.5 bg-orange-400/10 border border-orange-400/30 hover:border-orange-400 hover:bg-orange-400/25 text-orange-300 font-mono text-[9px] tracking-[0.15em] uppercase rounded-full shadow-[0_0_20px_rgba(224,122,95,0.15)] hover:shadow-[0_0_30px_rgba(224,122,95,0.35)] hover:-translate-y-0.5 backdrop-blur-md transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                    title="Enable Aanya AI Gesture Agent"
                >
                    <i className="bi bi-stars text-xs text-orange-300"></i>
                    Aanya Agent
                </button>
            )}

            {/* Glassmorphic Video Widget Panel */}
            <AnimatePresence>
                {isAgentActive && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-6 right-6 z-50 w-64 h-48 bg-[#120917]/85 border border-orange-400/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col justify-between"
                    >
                        {/* Header controls bar */}
                        <div className="flex justify-between items-center px-4 py-2 border-b border-white/[0.06] bg-black/40 font-mono text-[9px] text-gray-400 select-none">
                            <span>Aanya — Live Feed</span>
                            <button 
                                onClick={() => setIsAgentActive(false)}
                                className="text-gray-500 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                                title="Disable Aanya"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Live stream view */}
                        <div className="relative w-full h-[calc(100%-28px)] bg-black/20">
                            <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" autoPlay playsInline muted />
                            
                            {/* Live Indicator */}
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded-full">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                                <span className="font-mono text-[8px] uppercase text-red-400 tracking-wider font-semibold">live</span>
                            </div>

                            {/* Recognized Gesture Overlay Tag */}
                            <div className="absolute bottom-2.5 left-2.5 px-2 py-1 bg-black/70 border border-orange-400/20 rounded font-mono text-[9px] text-orange-300">
                                {gesture ? gesture.replace('_', ' ').toUpperCase() : "AWAITING GESTURE"}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gesture Particles Spill Effect */}
            {(gesture === "open_palm" || gesture === "thumbs_up") && particlesInit && (
                <Particles id="tsparticles" className="fixed inset-0 pointer-events-none z-0" options={{
                    fullScreen: { enable: true, zIndex: 0 },
                    particles: {
                        number: { value: 50, density: { enable: true, area: 800 } },
                        color: { value: ["#a78bfa", "#f43f5e", "#ffffff"] },
                        shape: { type: "circle" },
                        opacity: { value: 0.6, random: true },
                        size: { value: 3.5, random: true },
                        move: { enable: true, speed: 2.5, direction: "none", random: true, straight: false, outModes: { default: "out" } }
                    }
                }} />
            )}
        </>
    );
}
