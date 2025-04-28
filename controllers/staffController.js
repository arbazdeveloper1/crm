import bcrypt from 'bcrypt';
import { query } from '../config/db.js';

// Function to get the staff list
export const getStaffList = async (req, res) => {
  try {
    const id = req.userId
    const users = await query('SELECT * FROM users');
    const agentCount = await query('SELECT COUNT(*) as count FROM users WHERE userRole = "agent"');
    const adminCount = await query('SELECT COUNT(*) as count FROM users WHERE userRole = "admin"');
    const hodCount = await query('SELECT COUNT(*) as count FROM users WHERE userRole = "HOD"');
    const userCount = users.length; // Count of total users

    let ProfileData = await query(`select profile_img from users where id='${id}'`)
    let ProfileImg = ProfileData[0]?.profile_img;


    res.render('staff_list', { 
      users, 
      userCount, // Total employee count
      agentCount: agentCount[0].count, 
      adminCount: adminCount[0].count, 
      hodCount: hodCount[0].count, 
      userRole: req.userRole,
      ProfileImg
    });
  } catch (error) {
    console.error('Error fetching staff list:', error);
    res.status(500).send('Error fetching staff list');
  }
};


export const addStaffform = async (req, res) => {
  try {
    const users = await query('SELECT * FROM users');
    const id = req.userId
    
    let ProfileData = await query(`select profile_img from users where id='${id}'`)
    let ProfileImg = ProfileData[0]?.profile_img;

    res.render('add_staff', { users, userRole: req.userRole, ProfileImg });
  } catch (error) {
    console.error('Error fetching staff list:', error);
    res.status(500).send('Server error, API down');
  }
};


// Function to add new staff
export const addStaff = async (req, res) => {
  const { full_name, username, department, extn, shift_time, allowed_ip, role, allowed_leaves, email, password } = req.body;

  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  // Check if all required fields are present
  if (!full_name || !username || !department || !role || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  try {
    console.log('Received data:', req.body); // Debugging log

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Define the query and values
    const sql = `
      INSERT INTO users (full_name, username, department, extn, shift_time, allowed_ip, userRole, allowed_leaves, email, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [full_name, username, department, extn, shift_time, allowed_ip, role, allowed_leaves, email, hashedPassword];

    // Execute the query
    await query(sql, values);

    // Respond with a success message
    res.status(201).json({ 
      success: true, 
      message: 'Staff added successfully.',
      redirectUrl: '/staff_list' // Include the redirect URL
    });
  } catch (error) {
    // Log the error and send a server error response
    console.error('Error adding staff:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Function to delete a user
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  console.log(`Received delete request for user ID: ${userId}`);

  try {
    // Use parameterized query to prevent SQL injection
    const sql = 'DELETE FROM users WHERE id = ?';
    await query(sql, [userId]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Fetch a single user by ID
export const getUserById = async (req, res) => {
  const userId = req.params.id; 
  try {
    const user = await query('SELECT * FROM users WHERE id = ?', [userId]);

    if (user.length > 0) {
      res.status(200).json(user[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};
  
// Update a user by ID
export const updateUser = async (req, res) => {
  const { user_id, full_name, username, department, role, password } = req.body;
  console.log(req.body)
  let hashedPassword = await bcrypt.hash(password, 10)
  try {
    const sql = `
      UPDATE users 
      SET full_name = ?, username = ?, department = ?, userRole = ?, password = ?
      WHERE id = ?
    `;
    await query(sql, [full_name, username, department, role, user_id, hashedPassword]);

    res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    throw new Error(err)
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error updating user data' });
  }
};

export const newBooking = async (req, res) => {
  try{
    const id = req.userId;
    let { customer_id } = req.query
    const users = await query('SELECT * FROM users');
    const form_data = await query(`SELECT * FROM form_data WHERE customer_id='${customer_id}'`)

    let ProfileData = await query(`select profile_img from users where id='${id}'`)
    let ProfileImg = ProfileData[0]?.profile_img;

    res.render('new-booking',{users, form_data, ProfileImg})
  }catch(error){
    console.log(error)
    throw new Error(error)
  }
}

export const refund_form = async (req, res) => {
  try{
    const id = req.userId;
    const users = await query('SELECT * FROM users');
    let ProfileData = await query(`select profile_img from users where id='${id}'`)
    let ProfileImg = ProfileData[0]?.profile_img;

    res.render('refund_form',{users, ProfileImg})
  }catch(error){
    throw new Error(err)
    res.status(500).json({success:false, message: 'Error loading page'})
  }
}
export const future_credit_form = async (req, res) => {
  try{
    const id = req.userId;
    const users = await query('SELECT * FROM users');
    let ProfileData = await query(`select profile_img from users where id='${id}'`)
    let ProfileImg = ProfileData[0]?.profile_img;

    res.render('future_credit_form',{users, ProfileImg})
  }catch(error){
    throw new Error(err)
    res.status(500).json({success:false, message: 'Error loading page'})
  }
}

export const docusign_list = async (req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const id = req.userId;

    const form_data = await query(`SELECT * FROM form_data LIMIT ${limit} OFFSET ${offset}`);

    let countQry = `SELECT COUNT(*) AS total`;
    const countResult = await query(countQry);
    const totalRows = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRows / limit);

    let ProfileData = await query(`select profile_img from users where id='${id}'`)
    let ProfileImg = ProfileData[0]?.profile_img;

    res.render('docusign_list', { 
      form_data, 
      userRole: req.userRole,
      currentPage: page, totalPages,
      ProfileImg
    });
  } catch(error){
    res.status(500).json({success:false, message: 'Error loading page'})
  }
}


export const newBookingForm = async (req, res) => {
  const {
      total_amount, mco_description, charge_type, mco_calculated,
      airline_names, airline_costs,
      card_number, card_type, currency, expiration, cvv, email, billing_phone,
      full_name, dob, gender, ticket_number,
      arl_confirmation, tfn, subject_line, billing_address
  } = req.body;

  // Check for missing values and set them as null or empty string
  const data = {
    total_amount: total_amount || null,
    mco_description: mco_description || null,
    charge_type: charge_type || null,
    mco_calculated: mco_calculated || null,
    airline_names: airline_names && Array.isArray(airline_names) ? JSON.stringify(airline_names) : null,  // Ensure it's an array
    airline_costs: airline_costs && Array.isArray(airline_costs) ? JSON.stringify(airline_costs) : null,  // Ensure it's an array
    card_number: card_number || null,
    card_type: card_type || null,
    currency: currency || null,
    expiration: expiration || null,
    cvv: cvv || null,
    email: email || null,
    billing_phone: billing_phone || null,
    full_name: full_name || null,
    dob: dob || null,
    gender: gender || null,
    ticket_number: ticket_number || null,
    arl_confirmation: arl_confirmation || null,
    tfn: tfn || null,
    tfn: tfn || null,
    subject_line: subject_line || null,
    billing_address: billing_address || null
  };

  console.log(data,'This is the data')

  // Query to insert data into form_data table
  const queryText = `
      INSERT INTO form_data (
          total_amount, mco_description, charge_type, mco_calculated,
          airline_names, airline_costs,
          card_number, card_type, currency, expiration, cvv, email, billing_phone,
          full_name, dob, gender, ticket_number,
          arl_confirmation, tfn, subject_line, billing_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  // Data to be inserted, using the sanitized 'data' object
  const values = Object.values(data);

  try {
      // Check if the number of values matches the number of placeholders
      // if (values.length !== 20) {
      //   return res.status(400).json({ error: 'Number of values does not match number of columns in the table.' });
      // }

      // Execute the query
      await query(queryText, values);
      res.status(201).redirect('/dashboard');
  } catch (err) {
      console.error('Error inserting data: ', err);
      throw new Error(err)
      return res.status(500).json({ error: 'Failed to insert data' });
  }
}







export const chat = async (req, res) => {
  try{
    const userRole = req.userRole;
    const full_name = req.full_name;
    const user_id = req.userId;
    const id = req.userId;

   
    let qry = await query(`SELECT * FROM users`);
    let ProfileData = await query(`select profile_img from users where id='${id}'`)
    let ProfileImg = ProfileData[0]?.profile_img;

    res.render('chat', {userRole, data: qry, full_name: full_name, senderid: user_id, ProfileImg})
  }catch{
  res.status(500).json({success: false, message: 'Error loading page'})
  }
}








export const test = async (req, res) => {
  try{
    const id = req.userId;
    let ProfileData = await query(`select profile_img from users where id='${id}'`)
    let ProfileImg = ProfileData[0]?.profile_img;

    res.render('test',{ProfileImg})
  }catch{
    res.status(500).json({success: false, message: 'Error loading page'})
  }
}



export const getChats = async(req, res) => {
  try {

    let { receiver_id, sender_id } = req.params;
    const id = req.userId;

    let qry = await query(`
      SELECT * FROM messages 
      WHERE (receiver = '${receiver_id}' AND sender = '${sender_id}')
      OR (receiver = '${sender_id}' AND sender = '${receiver_id}')
      ORDER BY sent_at ASC
    `);


    let qry1 = await query(`SELECT profile_img FROM users WHERE id = '${receiver_id}'`);
    let receiverimg = qry1[0]?.profile_img

    let qry2 = await query(`SELECT profile_img FROM users WHERE id = '${sender_id}'`);
    let senderimg = qry2[0]?.profile_img

    res.status(200).json({ success: true, msg: 'Chats retrieved successfully', data: qry, receiverimg, senderimg});

  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, msg: "Internal Server Error" })
  }
}






