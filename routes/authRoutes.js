import express from 'express';
import { login, sendOTP, resetPasswordHandler, dashboard, logoutUser} from '../controllers/authController.js';
import { checkAuth, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Render login page
router.get('/', checkAuth, (req, res) => {
  res.render('login'); // This should point to login.ejs
});


router.get('/Dashboard', verifyToken, dashboard);
router.post('/login', login);
router.post('/logout', logoutUser);
router.post('/forgot_password', verifyToken, sendOTP);
router.post('/reset_password', verifyToken, resetPasswordHandler);


export default router;
