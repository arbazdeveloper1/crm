import express from 'express';
import { login, sendOTP, resetPasswordHandler, dashboard, logoutUser, authforgetpassword, forgetpassword, auth_verify_otp, auth_reset_password, profile} from '../controllers/authController.js';
import { checkAuth, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

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


export default router;
