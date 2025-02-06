import express, { Router } from "express";
import { priceDescription, booking_list, new_booking_draft, AllBooking } from "../controllers/bookingController.js";
import upload from "../utils/multer.js";
import multer from 'multer';
import { verifyToken } from "../middlewares/authMiddleware.js";
const route = express.Router();


// Request for booking
route.post("/make_booking",verifyToken, upload.array('file',10), priceDescription);
route.get("/booking_list",verifyToken, booking_list)
route.get("/new_booking_draft", verifyToken, new_booking_draft)
route.get("/all_booking", verifyToken, AllBooking)

export default route;
