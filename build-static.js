const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'dist');

console.log('Cleaning dist directory...');
if (fs.existsSync(destDir)) {
  const files = fs.readdirSync(destDir);
  for (const file of files) {
    const filePath = path.join(destDir, file);
    fs.rmSync(filePath, { recursive: true, force: true });
  }
} else {
  fs.mkdirSync(destDir, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'style.css',
  'script.js',
  'admin.html',
  'bg-music.mp3',
  'img1.webp',
  'hero_bg.png',
  'hero-bg.jpg',
  'portal.png',
  'portal_desert.png',
  'lemonmusiclab-background-music-soft-499262 copy.mp3',
  'art-1.jpg',
  'art-2.jpg',
  'art-3.jpg',
  'art-4.jpg',
  'art-5.jpg'
];

const dirsToCopy = [
  'assets',
  'uploads'
];

// Copy files
filesToCopy.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied file: ${file}`);
  } else {
    console.warn(`Warning: File not found: ${file}`);
  }
});

// Copy directories
dirsToCopy.forEach(dir => {
  const srcPath = path.join(srcDir, dir);
  const destPath = path.join(destDir, dir);
  if (fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, destPath, { recursive: true });
    console.log(`Copied directory: ${dir}`);
  } else {
    console.warn(`Warning: Directory not found: ${dir}`);
  }
});

console.log('Build completed successfully!');
