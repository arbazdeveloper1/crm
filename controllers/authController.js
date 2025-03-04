import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { query } from '../config/db.js';
import transporter from '../config/mailConfig.js';
import { findUserByEmail, findUserByUsername, updateUserOTP, resetPassword , allBooking } from '../models/userModel.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  const results = await findUserByUsername(username);
  if (results.length > 0) {
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ id: user.id, role: user.userRole, full_name: user.full_name, username: user.username }, process.env.JWT_SECRET, { expiresIn: '12h' });
      res.cookie('token', token, { httpOnly: true, maxAge: 12 * 60 * 60 * 1000 });
      return res.redirect('/dashboard');
    } else {
      return res.status(401).send('Invalid username or password');
    }
  } else {
    return res.status(401).send('Invalid username or password');
  }
};

export const dashboard = async (req, res) => {
  try {
    const userRole = req.userRole;
    const bookings = await allBooking();
    
    // Fetch form_data records
    const formData = await query('SELECT * FROM form_data');

    // Get the count of records in form_data
    const countResult = await query('SELECT COUNT(*) AS total FROM form_data');
    const totalNewbookingCount = countResult[0].total; 

    const empNewBookingCount = await query('SELECT COUNT(*) AS total FROM form_data WHERE booking_type = ?', ['new_booking']);
    const employeeNewBookingCount = empNewBookingCount[0].total; 
    

    res.render('dashboard', { userRole, bookings, formData, totalNewbookingCount, employeeNewBookingCount });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).send('Internal Server Error');
  }
};


export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const results = await findUserByEmail(email);
  if (results.length > 0) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 15 * 60 * 1000;
    await updateUserOTP(email, otp, otpExpiry);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is ${otp}. It will expire in 15 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).send('Error sending OTP. Please try again later.');
      res.status(200).json({ success: true, message: 'OTP  has been sent successfully' });
    });
  } else {
    return res.status(404).json({ success: false, message: 'Email not found.' });
  }
};

export const resetPasswordHandler = async (req, res) => {
  const { newPassword, resetToken } = req.body;
  if (!resetToken) return res.status(401).json({ message: 'Unauthorized request' });

  jwt.verify(resetToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired reset token' });
    const email = decoded.email;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await resetPassword(hashedPassword, email);
    res.status(200).json({ success: true, message: 'Password Reset Successfully' });
  });
};


export const logoutUser = (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Logout failed' });
  }
};


