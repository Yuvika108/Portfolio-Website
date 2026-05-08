# 🌌 Srishti — Cinematic Portfolio with Aanya AI

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/MediaPipe-00BFFF?style=for-the-badge&logo=google&logoColor=white" />
</div>

---

## 📽️ The Experience
Welcome to my digital space. This isn't just a portfolio; it’s an immersive, cinematic experience designed to reflect the atmosphere of late-night coding sessions, soft lofi music, and visual storytelling.

Built with a focus on **AI-driven interaction**, this project features **Aanya**, a gesture-controlled AI agent that allows you to navigate the site entirely hands-free.

---

## ✨ Meet Aanya — Your AI Guide
At the heart of this website is **Aanya**, a gesture-tracking agent powered by **Google MediaPipe**. She bridges the gap between the physical and digital worlds, allowing you to control the atmosphere and navigation through hand movements.

### ✌️ Gesture Manual
| Gesture | Action | Description |
| :--- | :--- | :--- |
| **👍 Thumbs Up** | `Play Atmosphere` | Starts ambient lofi music & summons the rain 🌧️ |
| **🤘 Spider-Stop** | `Reset Environment` | Instantly stops music and clears the rain 🛑 |
| **✌️ Two Fingers** | `Natural Scroll` | Scroll the page up and down (Drag & Pull) 📜 |
| **👌 Pinch** | `Virtual Click` | Click or select elements under the cursor 🖱️ |
| **👉 Point** | `Navigation` | Move the custom AI-reactive cursor across the screen 📍 |
| **🖐️ Open Palm** | `Rain Toggle` | Trigger the atmospheric canvas-based rain effect |
| **👋 Wave** | `Dismiss Agent` | Close the Aanya AI interface 🚪 |

---

## 🎨 Design Philosophy
This portfolio is built on a **"Late-Night Cinematic"** aesthetic:
- **Atmospheric Visuals**: Subtle film grain, vignettes, and scanlines for a handcrafted, analog feel.
- **Glassmorphism**: Sleek, translucent UI elements with backdrop blurs that feel premium and modern.
- **Interactive Rain**: A custom Canvas API rain effect that responds to the environment.
- **Micro-interactions**: Powered by **Framer Motion**, ensuring every movement is smooth and fluid.

---

## 🛠️ Detailed Tech Stack

This project is built with a focus on **performance, AI integration, and cinematic visuals**. Each layer of the stack is chosen to contribute to the immersive atmosphere.

### ⚛️ Frontend & Frameworks
- **React 19**: The backbone of the modern UI, managing complex states for the AI agent and section transitions.
- **Vite**: Provides lightning-fast development with Hot Module Replacement (HMR), essential for real-time visual fine-tuning.
- **Tailwind CSS 4**: Utilizes the latest engine for ultra-fast styling, powering the **Glassmorphism** and atmospheric UI effects.

### 🧠 Artificial Intelligence
- **Google MediaPipe Hands**: The AI engine that tracks 21 3D hand landmarks in real-time directly in the browser.
- **Custom Gesture Logic**: A specialized layer built to recognize complex hand patterns to bridge the physical and digital gap.

### 🎭 Motion & Visuals
- **Framer Motion**: Handles the "fluid" feel, including the AI-reactive cursor and smooth UI transitions.
- **tsParticles**: Manages the subtle environmental effects like floating dust and soft particles.
- **HTML5 Canvas API**: Used for the high-performance interactive rain system.

---

## 📂 Project Structure
```text
.
├── my-portfolio/        # React + Vite Application (Main Development)
│   ├── src/             # Source files
│   │   ├── GestureDetector.jsx  # AI Gesture Tracking Logic
│   │   └── index.css            # Global Styles & Animations
│   └── public/          # Static assets
├── index.html           # Production-ready Vanilla JS Version
├── style.css            # Styles for Vanilla version
└── script.js            # Logic for Vanilla version
