import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Use multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/api/tryon', upload.fields([
  { name: 'userImage', maxCount: 1 },
  { name: 'clothImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const userImgPath = req.files['userImage'][0].path;
    const clothImgPath = req.files['clothImage'][0].path;

    const form = new FormData();
    form.append('data', fs.readFileSync(userImgPath), {
      filename: path.basename(userImgPath),
      contentType: 'image/jpeg'
    });
    form.append('data', fs.readFileSync(clothImgPath), {
      filename: path.basename(clothImgPath),
      contentType: 'image/jpeg'
    });

    const gradioResponse = await axios.post('http://0.0.0.0:7860/run/predict', form, {
      headers: form.getHeaders(),
    });

    res.json(gradioResponse.data);
  } catch (err) {
    console.error("Error in /api/tryon:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Node.js backend running on http://localhost:${port}`);
});
