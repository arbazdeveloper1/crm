import express, { Router } from "express";
import {
  priceDescription,
  new_booking_draft,
  AllBooking,
  EmailAcknowledge,
  UpdateCurrency,
  TrackIp,
  docusignPdf,
  customer_doc_upload,
  thankyou,
  e_ticket,
  uploadDocuments,
  ChangeStatus,
  ChangeBookingStatus,
  UpdateRemarks,
  RefundDescription,
  new_booking_list,
  exchange_list,
  refund_list,
  seat_upgrade_list,
  FutureCredit,
  future_credit_list,
  new_booking_draft_refund,
  new_booking_draft_seat_upgrade,
  new_booking_draft_future_credit,
  DeleteBooking,
  UpdateEmailDraft,
  filtercontroller,
  swap_tax,
  upcoming_travels
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
route.get("/new_booking_list", verifyToken, new_booking_list);
route.get("/exchange_list", verifyToken, exchange_list);
route.get("/refund_list", verifyToken, refund_list);
route.get("/seat_upgrade_list", verifyToken, seat_upgrade_list);
route.get("/future_credit_list", verifyToken, future_credit_list);

route.get("/new_booking_draft/:customer_id", verifyToken, new_booking_draft);
route.get("/all_booking", verifyToken, AllBooking);
route.post("/api/send_email", verifyToken, upload.array('files', 10), EmailAcknowledge)
route.post("/api/update_currency", verifyToken, UpdateCurrency)
route.post("/api/send_email/:mail_type", verifyToken, upload.array('files',10), EmailAcknowledge)
route.post("/api/update_currency", verifyToken,UpdateCurrency)

route.get("/api/TrackIp/:customer_id", verifyToken, TrackIp)

route.get("/docusign_pdf/:customer_id", verifyToken, docusignPdf)
route.get('/customer_doc_upload/:customer_id', verifyToken, customer_doc_upload);
route.get('/thankyou', thankyou);
route.get('/e_ticket/:customer_id', e_ticket);


route.post('/api/upload_documents/:customer_id', verifyToken, upload.array('documents', 5), uploadDocuments)


route.post('/api/change_status', verifyToken, ChangeStatus)


route.post('/api/bookingstatus', verifyToken, ChangeBookingStatus)


route.post('/api/Remarks', verifyToken, UpdateRemarks)


route.post('/api/refund_booking', verifyToken, upload.array('file', 10), RefundDescription);

route.post('/api/future_credit', verifyToken, upload.array('file', 10), FutureCredit)



// refund booking
route.get("/new_booking_draft_refund/:customer_id", verifyToken, new_booking_draft_refund);

// seat upgrade booking
route.get('/new_booking_draft_seat_upgrade/:customer_id',verifyToken, new_booking_draft_seat_upgrade)

// future credit booking
route.get('/new_booking_draft_future_credit/:customer_id', verifyToken, new_booking_draft_future_credit)


route.post('/api/delete_booking', verifyToken, DeleteBooking);


route.post('/api/update_Email_Draft', verifyToken, UpdateEmailDraft)

route.post('/api/filter', verifyToken, filtercontroller)


route.post('/api/swap_tax', verifyToken, swap_tax);



route.get('/upcoming_travels', verifyToken, upcoming_travels);


export default route;
