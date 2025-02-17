import express, { Router } from "express";
import {
  priceDescription,
  booking_list,
  new_booking_draft,
  AllBooking,
  EmailAcknowledge,
  UpdateCurrency,
  TrackIp,
  docusignPdf,
  customer_doc_upload,
  thankyou,
  e_ticket,
  uploadDocuments
} from "../controllers/bookingController.js";
import upload from "../utils/multer.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const route = express.Router();
// Request for booking
route.post(
  "/make_booking",
  verifyToken,
  upload.array("file", 10),
  priceDescription
);
route.get("/booking_list", verifyToken, booking_list);
route.get("/new_booking_draft/:customer_id", verifyToken, new_booking_draft);
route.get("/all_booking", verifyToken, AllBooking);

route.post("/api/send_email",verifyToken,upload.array('files',10),EmailAcknowledge)
route.post("/api/update_currency", verifyToken,UpdateCurrency)

route.get("/api/TrackIp/:customer_id", verifyToken, TrackIp)

route.get("/docusign_pdf/:customer_id", verifyToken, docusignPdf)
route.get('/customer_doc_upload/:customer_id',verifyToken, customer_doc_upload);
route.get('/thankyou', thankyou);
route.get('/e_ticket/:customer_id',e_ticket);


route.post('/api/upload_documents', verifyToken, upload.array('documents',5) ,uploadDocuments)

export default route;
