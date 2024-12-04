import express from 'express';
import { getStaffList, addStaffform, addStaff, deleteUser,updateUser,getUserById, newBooking, test
    , newBookingForm
} from '../controllers/staffController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/staff_list', verifyToken, getStaffList);
router.get('/addStaffform', addStaffform); // Route to add new staff
router.post('/add_staff', addStaff); // Route to add new staff
router.delete('/delete/:id', deleteUser); // Route to delete user by ID
router.get('/get_user/:id',getUserById); // get user by single id 
router.post('/update_user', updateUser); //update user detail by id
router.get('/new-booking',verifyToken, newBooking); //New booking auth
router.post('/newBookingForm', verifyToken, newBookingForm)




router.get('/test',verifyToken, test); //New booking auth
export default router;  
