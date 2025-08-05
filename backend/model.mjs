import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs/promises';
import { unlinkSync } from 'fs';
import path from 'path';

const app = express();
const PORT = 5001;

const upload = multer({ dest: 'uploads/' });

// API Endpoint to handle try-on
app.post('/tryon', upload.single('person'), async (req, res) => {
  const garmentUrl = req.body.garment_url;
  const personPath = req.file?.path;

  if (!garmentUrl || !personPath) {
    return res.status(400).json({ error: 'Missing image or garment URL' });
  }

  try {
    // Read user image from disk
    const personBuffer = await fs.readFile(personPath);

    // Download garment image from remote URL
    const garmentResponse = await axios.get(garmentUrl, {
      responseType: 'arraybuffer',
    });
    const garmentBuffer = Buffer.from(garmentResponse.data);

    // Prepare FormData to send to Gradio app
    const form = new FormData();
    form.append('model', personBuffer, 'person.jpg');
    form.append('cloth', garmentBuffer, 'garment.jpg');

    const response = await axios.post(
      'https://ares1123-virtual-dress-try-on.hf.space/run',
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      }
    );

    // Return the base64 output
    res.json({ output: response.data.data[0] });

  } catch (error) {
    console.error('Try-on error:', error.message);
    res.status(500).json({ error: 'Try-on failed' });
  } finally {
    // Clean up uploaded user image
    if (personPath) {
      try {
        unlinkSync(personPath);
      } catch (e) {
        console.warn('File cleanup failed:', e.message);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Try-on backend running at http://localhost:${PORT}`);
});
