import express, { Router } from 'express';
import { priceDescription } from '../controllers/bookingController.js';

const newBooking = express.Router();

newBooking.post('/new-booking' ,priceDescription);

export default newBooking;
