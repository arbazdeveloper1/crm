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
    try {
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
            agent_name = '${req.full_name}' AND booking_type = 'new_booking'
    `;

        const result = await query(qry)

        if (result.length > 0) {
            res.render('booking', { userRole, result });
        } else {
            res.render('booking', { userRole, result: [] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, ErrorMsg: "Internal Server Error" })
    }
};

// for all booking list
export const AllBooking = async (req, res) => {
    try {
        const userRole = req.userRole;

        let qry = `
            SELECT 
                card_holder_name,
                total_amount,
                email_type,
                created_at,
                agent_name,
                customer_id,
                booking_type
            FROM 
                form_data 
            WHERE 
                agent_name = '${req.full_name}'
            ORDER BY id DESC
        `;

        const result = await query(qry)

        if (result.length > 0) {
            res.render('all_booking', { userRole, result });
        } else {
            res.render('all_booking', { userRole, result: [] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, ErrorMsg: "Internal Server Error" })
    }
}


// Controller for Mail Draft
export const new_booking_draft = async (req, res) => {
    const userRole = req.userRole;
    const { customername } = req.params;
    const FullName = req.full_name

    let qry = `
            SELECT DISTINCT
                card_holder_name,
                total_amount,
                email_type,
                created_at,
                agent_name,
                customer_id,
                card_number,
                subject_line,
                image,
                passenger_details,
                airline_info,
                gds_pnr,
                billing_address,
                email,
                billing_phone,
                DATE_FORMAT(expiration,"%y-%m-%d") as expiration,
                cvv,
                card_type,
                arl_confirmation,
                Docusign_Verified
            FROM 
                form_data
            WHERE 
                card_holder_name = '${customername}'
        `;

    const result = await query(qry)

    if (result.length > 0) {
        res.render('new_booking_draft', { userRole, customername, result, FullName });
    } else {
        res.render('new_booking_draft', { userRole, customername, result: [], FullName });

    }
};

