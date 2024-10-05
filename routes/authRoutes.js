import express from 'express';
import { login, sendOTP, resetPasswordHandler, dashboard, logoutUser } from '../controllers/authController.js';
import { checkAuth, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Render login page
router.get('/', checkAuth, (req, res) => {
  res.render('login'); // This should point to login.ejs
});

// Protect the adminDashboard route with verifyToken
router.get('/adminDashboard', verifyToken, dashboard);

// Login route
router.post('/login', login);

// Logout route 
router.post('/logout', logoutUser);

// Forgot password route
router.post('/forgot_password', verifyToken, sendOTP);

// Reset password route
router.post('/reset_password', verifyToken, resetPasswordHandler);

export default router;
