import express from 'express';
const router = express.Router();

import { getStaffList, addStaffform, addStaff, deleteUser,updateUser,getUserById, newBooking, test, newBookingForm, refund_form, docusign_list, future_credit_form, chat, getChats  
} from '../controllers/staffController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';



router.get('/staff_list', verifyToken, getStaffList);
router.get('/addStaffform', addStaffform); // Route to add new staff
router.post('/add_staff', addStaff); // Route to add new staff
router.delete('/delete/:id', deleteUser); // Route to delete user by ID
router.get('/get_user/:id',getUserById); // get user by single id 
router.post('/update_user', updateUser); //update user detail by id
router.get('/new-booking',verifyToken, newBooking); //New booking auth
router.post('/newBookingForm', newBookingForm);
router.get('/refund_form', verifyToken, refund_form);
router.get('/future_credit_form', verifyToken, future_credit_form);
router.get('/docusign_list', verifyToken, docusign_list);
router.get('/chat',verifyToken, chat)



router.get('/test',verifyToken, test); //New booking auth

router.get('/getChats/:sender_id/:receiver_id', verifyToken, getChats); //New booking auth

export default router;  
