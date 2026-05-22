const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Store uploads locally in an 'uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'art-' + Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

const DATA_FILE = path.join(__dirname, 'artworks.json');

function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all artworks
app.get('/api/artworks', (req, res) => {
  res.json(readData());
});

// POST upload new artwork
app.post('/api/upload', upload.single('artwork'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const title = req.body.title || 'Untitled';
  const data = readData();
  const newArtwork = {
    id: Date.now(),
    filename: 'uploads/' + req.file.filename,
    title
  };
  data.push(newArtwork);
  writeData(data);
  res.json({ success: true, artwork: newArtwork });
});

// DELETE artwork
app.delete('/api/artworks/:id', (req, res) => {
  let data = readData();
  const idToDelete = parseInt(req.params.id);
  const item = data.find(d => d.id === idToDelete);

  // Delete file from disk if it's in uploads
  if (item && item.filename.startsWith('uploads/')) {
    const filePath = path.join(__dirname, item.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  data = data.filter(d => d.id !== idToDelete);
  writeData(data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log('');
  console.log('✅ Portfolio admin is running!');
  console.log('');
  console.log(`   Portfolio  →  http://localhost:${PORT}/index.html`);
  console.log(`   Admin      →  http://localhost:${PORT}/admin.html`);
  console.log('');
});
