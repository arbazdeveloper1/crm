import express from 'express';
import { login, sendOTP, resetPasswordHandler, dashboard, logoutUser } from '../controllers/authController.js';
import { checkAuth, verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Render login page
router.get('/', checkAuth, (req, res) => {
  res.render('login');
});

// Protect the adminDashboard route with verifyToken
router.get('/adminDashboard', verifyToken, dashboard);

// Login route
router.post('/auth/login', login);

//logout route 
router.post('/auth/logout', logoutUser);

// Forgot password route
router.post('/auth_forgot_password', verifyToken, sendOTP);

// Reset password route
router.post('/auth_reset_password', verifyToken, resetPasswordHandler);

export default router;



