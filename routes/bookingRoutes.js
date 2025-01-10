import express, { Router } from 'express';
import { checkAuth } from '../middlewares/authMiddleware';
import { priceDescription } from '../controllers/bookingController';

const router = express.Router();

router.post('/new-booking', checkAuth ,priceDescription);
