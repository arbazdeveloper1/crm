import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
// import cardRoutes from './routes/cardRoutes.js';
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

// Routes
app.use('/', authRoutes);  // Correct route prefix for auth
app.use('/auth', authRoutes);  // Correct route prefix for auth
app.use('/', staffRoutes); // Correct route prefix for staff
app.use('/staff', staffRoutes); // Correct route prefix for staff
// app.use('/card', cardRoutes);  // Use cardRoutes under '/card' prefix

// Add a 404 route handler for undefined routes
app.use((req, res, next) => {
    res.status(404).send('Sorry, page not found');
});

export default app;