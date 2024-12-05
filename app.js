import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';
import cookieParser from 'cookie-parser';
import multer from 'multer'

import authRoutes from './routes/authRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import { checkAuth } from './middlewares/authMiddleware.js'; // Only import checkAuth since verifyToken is used in specific routes

dotenv.config();

const app = express();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Set static folder and views
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img'); // Destination folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique filename
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    },
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.post('/upload', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        if (req.file) {
            res.json({ success: true, filePath: `/public/img/${req.file.filename}` });
        } else {
            res.status(400).json({ success: false, message: 'No file uploaded' });
        }
    });
});

// Routes
app.use('/', authRoutes);  // Correct route prefix for auth
app.use('/auth', authRoutes);  // Correct route prefix for auth
app.use('/', staffRoutes); // Correct route prefix for staff
app.use('/staff', staffRoutes); // Correct route prefix for staff


// Add a 404 route handler for undefined routes
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});


export default app;