import { query } from '../config/db.js';

export const findUserByUsername = async (username) => {
  return await query('SELECT * FROM users WHERE username = ?', [username]);
};

export const findUserByEmail = async (email) => {
  return await query('SELECT * FROM users WHERE email = ?', [email]);
};

export const updateUserOTP = async (email, otp, otpExpiry) => {
  return await query('UPDATE users SET otp = ?, otpExpiry = ? WHERE email = ?', [otp, otpExpiry, email]);
};

export const resetPassword = async (hashedPassword, email) => {
  return await query('UPDATE users SET password = ?, otp = NULL, otpExpiry = NULL WHERE email = ?', [hashedPassword, email]);
};

export const findUserByUserId = async (id) => {
  return await query('SELECT * FROM users WHERE id = ?', [id]);
}

export const allBooking = async () => {
  return await query('SELECT * FROM form_data');
}
// export const exchange = async (booking_type) => {
//   return await query('SELECT * FROM form_data WHERE booking_type = ?', [booking_type]);
// };
// export const refund = async () => {
//   return await query('SELECT * FROM form_data');
// }
// export const futureCredit = async () => {
//   return await query('SELECT * FROM form_data');
// }
// export const seatUpgrade = async () => {
//   return await query('SELECT * FROM form_data');
// }

