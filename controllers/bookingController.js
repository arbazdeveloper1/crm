import { Price_Description } from '../models/bookingModel.js';
import { query } from "../config/db.js";


export const priceDescription = async (req, res) => {
    try {
        const FileName = req.files.map((item) => {
            return item.filename;
        });

        req.FileName = FileName.join(",");
        const agentFullName = req.full_name || 'No Name';

        const add_payload = {
            ...req.body,
            fullname: agentFullName  // Add the fullname to payload
        };

        const insert_resp = await Price_Description(add_payload, FileName)
        if (insert_resp) {
            return res.status(201).json(insert_resp);
        }
        return res.status(400).json({ message: 'Not able to insert record', status: false })
    } catch (error) {
        console.log('Error in Bookings Controller: ' + error.message)
        return res.status(500).json({ message: 'Server Error' })
    }
}


export const booking_list = async (req, res) => {
    const userRole = req.userRole;

    let qry = `
        SELECT 
            card_holder_name,
            total_amount,
            email_type,
            created_at,
            agent_name,
            customer_id
        FROM 
            form_data 
        WHERE 
            agent_name = '${req.full_name}'
    `;

    const result = await query(qry)

    if (result.length > 0) {
        res.render('booking', { userRole, result });
    } else {
        res.render('booking', { userRole, result: [] });
    }

};

export const new_booking_draft = async (req, res) => {
    const userRole = req.userRole;
    res.render('new_booking_draft', { userRole });
};



