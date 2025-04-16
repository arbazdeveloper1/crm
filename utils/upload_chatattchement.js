import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const chat_router = express.Router();

// Make sure upload folder exists
const uploadDir = 'chatuploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

chat_router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        const fileUrl = `/chatuploads/${req.file.filename}`;
        res.json({ fileUrl });   
    } catch (error) {
        console.error(error);
    }
});

export default chat_router;
