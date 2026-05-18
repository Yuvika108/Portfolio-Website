import re

filepath = '/Users/skmishra19/Desktop/PROJECTS/Portfolio-website/style.css'
with open(filepath, 'r') as f:
    content = f.read()

target = """.projects-list {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 600px;
  margin: 4rem 0;
}

.project-row {
  display: flex;
  flex-direction: column;
  background: var(--bg-dark);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: absolute;
  width: 320px;
  height: 480px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  transform-origin: bottom center;
  cursor: pointer;
  transform: translateX(var(--x)) rotate(var(--r));
}

.project-row:nth-child(1) { --x: -200px; --r: -15deg; z-index: 1; }
.project-row:nth-child(2) { --x: -120px; --r: -9deg; z-index: 2; }
.project-row:nth-child(3) { --x: -40px; --r: -3deg; z-index: 3; }
.project-row:nth-child(4) { --x: 40px; --r: 3deg; z-index: 4; }
.project-row:nth-child(5) { --x: 120px; --r: 9deg; z-index: 5; }
.project-row:nth-child(6) { --x: 200px; --r: 15deg; z-index: 6; }

article.project-row:hover {
  background: rgba(20,20,25,0.95);
  border-color: rgba(167, 139, 250, 0.6);
  box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(167, 139, 250, 0.2);
  transform: translateX(var(--x)) translateY(-80px) rotate(0deg) scale(1.1);
  z-index: 100;
}

.pr-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.8rem;
  overflow-y: auto;
}

.pr-image {
  flex: none;
  height: 160px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--glass-border);
}

.pr-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--transition-smooth);
}

.project-row:hover .pr-image img {
  transform: scale(1.05);
}

.pr-meta {
  display: flex;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--accent-soft);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.pr-number { opacity: 0.6; }
.pr-title { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 600; color: var(--text-primary); }
.pr-desc { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5; }

.pr-link { 
  display: inline-block;
  color: var(--accent-soft); 
  text-decoration: none; 
  font-weight: 600; 
  font-size: 0.85rem; 
  text-transform: uppercase; 
  letter-spacing: 0.1em; 
  transition: var(--transition-smooth); 
  margin-top: 1rem; 
}
.pr-link:hover { color: var(--text-primary); letter-spacing: 0.2em; }

.pr-text-only .pr-image { display: none; }
.pr-text-only { min-height: auto; }
.pr-text-only .pr-content { padding: 2rem; }

.behind-the-code {
  padding: 1rem;
  background: rgba(255,255,255,0.02);
  border-left: 2px solid var(--accent-soft);
  border-radius: 4px;
}

.btc-label { font-size: 0.65rem; color: var(--accent-soft); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem; }
.behind-the-code p { font-size: 0.85rem; font-style: italic; color: var(--text-secondary); }"""

replacement = """.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 4rem 0;
  align-items: start;
}

.project-row {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
}

article.project-row:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(167, 139, 250, 0.4);
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
}

.pr-content {
  flex: 1;
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.8rem;
}

.pr-meta {
  display: flex;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent-soft);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.pr-number { opacity: 0.6; }
.pr-title { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 600; color: var(--text-primary); margin: 0; }
.pr-desc { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.6; margin: 0; flex: 1; }

.pr-link { 
  display: inline-block;
  color: var(--accent-soft); 
  text-decoration: none; 
  font-weight: 600; 
  font-size: 0.75rem; 
  text-transform: uppercase; 
  letter-spacing: 0.1em; 
  margin-top: 1.5rem; 
  align-self: flex-start;
}
.pr-link:hover { color: var(--text-primary); letter-spacing: 0.15em; }

.pr-text-only .pr-image { display: none; }
.pr-text-only .pr-content { padding: 1.8rem; }"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Target not found. Please check manually.")

with open(filepath, 'w') as f:
    f.write(content)
