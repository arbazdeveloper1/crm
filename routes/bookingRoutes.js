import express, { Router } from "express";
import { priceDescription } from "../controllers/bookingController.js";
import upload from "../utils/multer.js";
import multer from 'multer';
const route = express.Router();


// Request for booking
route.post("/make_booking", upload.array('file',10), priceDescription);

export default route;
