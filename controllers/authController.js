import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { query } from '../config/db.js';
import nodemailer from 'nodemailer';
// import transporter from '../config/mailConfig.js';
import { findUserByEmail, findUserByUsername, updateUserOTP, resetPassword , allBooking } from '../models/userModel.js';

// Nodemailer Transport Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});


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
    return res.render('/login')
    return res.status(401).send('Invalid username or password');
  }
};

export const dashboard = async (req, res) => {
  try {
    const userRole = req.userRole;
    const bookings = await allBooking();
    const users = await query('SELECT * FROM users');

    // Fetch form_data records
    const formData = await query('SELECT * FROM form_data');

    // Extract agent_name from req.userRole (if available)
    const agentName = req?.full_name;  

    // Get total counts for each booking type
    const totalNewbookingCount = (await query('SELECT COUNT(*) AS total FROM form_data WHERE booking_type = ?', ['new_booking']))[0].total;
    const totalExchangeCount = (await query('SELECT COUNT(*) AS total FROM form_data WHERE booking_type = ?', ['exchange']))[0].total;
    const totalRefundCount = (await query('SELECT COUNT(*) AS total FROM form_data WHERE booking_type = ?', ['refund_form']))[0].total;
    const totalSeatUpgradeCount = (await query('SELECT COUNT(*) AS total FROM form_data WHERE booking_type = ?', ['seat_upgrade']))[0].total;

    // Get employee-specific counts
    const employeeNewBookingCount = (await query('SELECT COUNT(*) AS total FROM form_data WHERE booking_type = ? AND agent_name = ?', ['new_booking', agentName]))[0].total;
    const employeeExchangeCount = (await query('SELECT COUNT(*) AS total FROM form_data WHERE booking_type = ? AND agent_name = ?', ['exchange', agentName]))[0].total;
    const employeeRefundCount = (await query('SELECT COUNT(*) AS total FROM form_data WHERE booking_type = ? AND agent_name = ?', ['refund_form', agentName]))[0].total;
    const employeeSeatUpgradeCount = (await query('SELECT COUNT(*) AS total FROM form_data WHERE booking_type = ? AND agent_name = ?', ['seat_upgrade', agentName]))[0].total;


    // Render dashboard with data
    res.render('dashboard', { 
      users, 
      userRole, 
      bookings, 
      formData, 
      totalNewbookingCount, 
      employeeNewBookingCount, 
      totalExchangeCount, 
      employeeExchangeCount, 
      totalRefundCount, 
      employeeRefundCount, 
      totalSeatUpgradeCount, 
      employeeSeatUpgradeCount,
      agentName
    });
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



export const authforgetpassword = (req, res) => {
  try {
    res.render('auth_forgot_password', {})
  } catch (error) {
    console.error(error);
  }
}


export const forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const isUserExist = await query("SELECT DISTINCT email FROM users WHERE email = ?", [email]);
    if (isUserExist.length === 0) {
      return res.status(404).json({ success: false, message: 'Email not found.' });
    }

    // Generate OTP and expiry time
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 15 * 60 * 1000;

    // Update OTP in the database
    await query("UPDATE users SET otp = ?, otpExpiry = ? WHERE email = ?", [otp, otpExpiry, email]);

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is ${otp}. It will expire in 15 minutes.`,
    };
    console.log(mailOptions.from)
    console.log(mailOptions)

    // Send email and handle response properly
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ success: false, message: 'Error sending OTP. Please try again later.' });
      } else {
        return res.status(200).json({ success: true, message: 'OTP has been sent successfully' });
      }
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};




export const auth_verify_otp = async (req, res) => {
  try {
    let { otp } = req.body;

    let Checkotp = await query(`SELECT otp,otpExpiry,email from users WHERE otp = '${otp}'`);

    if(Checkotp.length == 0){
      return res.status(400).json({ success: false, msg: "OTP is Wrong" })
    }

    const { otp: storedotp, expiry, email } = Checkotp[0]

    if(new Date(expiry) < new Date()){
      return res.status(400).json({ success: false, msg: "OTP is Expired"})
    }

    // Set the Token
    const resetToken = jwt.sign({email} , process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({success: true, msg: "otp is correct", resetToken: resetToken})

  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, msg: "Internal server Error" })
  }
}


export const auth_reset_password = async (req, res) => {
  try {
    const { newPassword, resetToken } = req.body;
  if (!resetToken) return res.status(401).json({ message: 'Unauthorized request' });

  jwt.verify(resetToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired reset token' });
    const email = decoded.email;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await resetPassword(hashedPassword, email);
    res.status(200).json({ success: true, message: 'Password Reset Successfully' });
  });
  } catch (error) {
    console.err("Error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error.'}) 
  }
}