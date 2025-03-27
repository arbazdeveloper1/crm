import express from 'express';
import { login, sendOTP, resetPasswordHandler, dashboard, logoutUser, authforgetpassword, forgetpassword, auth_verify_otp, auth_reset_password, profile, UploadProfileImg} from '../controllers/authController.js';
import { checkAuth, verifyToken } from '../middlewares/authMiddleware.js';
import multer from "multer";
import path from "path";
const router = express.Router();


// multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profileImg/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and PDF files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });


// Render login page
router.get('/', checkAuth, (req, res) => {
  res.render('login'); // This should point to login.ejs
});


router.get('/Dashboard', verifyToken, dashboard);
router.get('/profile', verifyToken, profile);
router.post('/login', login);
router.post('/logout', logoutUser);
router.post('/forgot_password', sendOTP);
router.post('/reset_password', resetPasswordHandler);
router.get('/auth_forgot_password', authforgetpassword)
router.post('/verify_email', forgetpassword)
router.post('/auth_verify_otp',auth_verify_otp)
router.post('/auth_reset_password', auth_reset_password)
router.post('/profileImgupload', verifyToken, upload.single('image') , UploadProfileImg)


export default router;
