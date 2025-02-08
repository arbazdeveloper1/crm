import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';
import cookieParser from 'cookie-parser';
import multer from 'multer'

import authRoutes from './routes/authRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
// import { checkAuth } from './middlewares/authMiddleware.js';
 // Only import checkAuth since verifyToken is used in specific routes
import newBooking from './routes/bookingRoutes.js';

dotenv.config();

const app = express();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Set static folder and views
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
app.use('/', newBooking);


// Add a 404 route handler for undefined routes
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.get('/forms', (req, res) => {
    res.render('forms');
});

export default app;