import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function GestureDetector() {
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const navigate = useNavigate();

    // States
    const [gesture, setGesture] = useState("");
    const [particlesInit, setParticlesInit] = useState(false);
    const [userStarted, setUserStarted] = useState(false);

    // Internal state refs
    const cooldownRef = useRef(false);
    const waveHistoryRef = useRef([]);
    const lastScrollYRef = useRef(null);
    const lastPinchTimeRef = useRef(0);
    const isPinchingRef = useRef(false);

    // Setup MediaPipe Camera and Hand Tracking & Particles Engine
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setParticlesInit(true);
        });

        const initMediaPipe = () => {
            if (!window.Hands || !window.Camera) {
                setTimeout(initMediaPipe, 100);
                return;
            }

            const hands = new window.Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
            });

            hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.7,
            });

            hands.onResults(onResults);

            if (videoRef.current) {
                const camera = new window.Camera(videoRef.current, {
                    onFrame: async () => {
                        await hands.send({ image: videoRef.current });
                    },
                    width: 640,
                    height: 480,
                });
                camera.start();
            }
        };

        initMediaPipe();

        function onResults(results) {
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
                    // Two Fingers -> Scroll
                    else if (indexTip.y < landmarks[6].y && middleTip.y < landmarks[10].y && ringTip.y > landmarks[14].y && pinkyTip.y > landmarks[18].y) {
                        g = "scroll";
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
    }, []);

    // Effect: Handle Global Actions
    useEffect(() => {
        if (!gesture || cooldownRef.current) return;

        if (gesture === "thumbs_up") {
            audioRef.current?.play().catch(() => { });
            cooldownRef.current = true;
            setTimeout(() => { cooldownRef.current = false; }, 1500);
        } else if (gesture === "rock_on") {
            audioRef.current?.pause();
            cooldownRef.current = true;
            setTimeout(() => { cooldownRef.current = false; }, 1500);
        } else if (gesture === "bye_bye") {
            setUserStarted(false);
        }
    }, [gesture]);

    return (
        <>
            {!userStarted && (
                <div onClick={() => setUserStarted(true)} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer text-white">
                    <h1 className="text-4xl font-bold mb-4 animate-pulse">✨ Meet Aanya — Click to Start</h1>
                    <p className="text-gray-400">Controls: 👍 Play, 🤘 Stop, ✌️ Scroll, 👌 Click, 👉 Point</p>
                </div>
            )}

            <div className="fixed bottom-4 right-4 z-50 w-64 h-48 bg-black border-2 border-purple-500 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20">
                <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" autoPlay playsInline muted />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] text-purple-300 font-mono">
                    AANYA: {gesture ? gesture.replace('_', ' ').toUpperCase() : "LISTENING"}
                </div>
            </div>

            <audio loop ref={audioRef} className="hidden">
                <source src="/music/lofi.mp3" />
            </audio>

            {(gesture === "open_palm" || gesture === "thumbs_up") && particlesInit && (
                <Particles id="tsparticles" className="fixed inset-0 pointer-events-none z-0" options={{
                    fullScreen: { enable: true, zIndex: 0 },
                    particles: {
                        number: { value: 80, density: { enable: true, area: 800 } },
                        color: { value: ["#aa3bff", "#ff3b9a", "#ffffff"] },
                        shape: { type: "circle" },
                        opacity: { value: 0.8, random: true },
                        size: { value: 4, random: true },
                        move: { enable: true, speed: 3, direction: "none", random: true, straight: false, outModes: { default: "out" } }
                    }
                }} />
            )}
        </>
    );
}
