import moment from 'moment'
import { query } from '../config/db.js'

export const Price_Description = async (payload) => {
    try {
        console.log('payload', payload)
        const { totalAmountQuoted, mcoDescription, typeOfCharge, } = payload
        const { cvv, GDS_PRN, arlConfirmation, email, billingPhone } = payload
        const { cardNumber, cardType, currency, expiration, airline_info, passenger_details } = payload
        const { subjectLine, cardHolderName, TFN, billingAddress, } = payload
        const insert_query = `INSERT INTO form_data 
        (total_amount  ,mco_description ,charge_type,
        card_number  , expiration ,arl_confirmation, 
        card_type , cvv  ,email , currency, 
        billing_phone, mco_calculated, card_holder_name, airline_info, passenger_details, gds_pnr,
        subject_line, tfn, billing_address) VALUES
        (${parseFloat(totalAmountQuoted)}, '${mcoDescription}', 
        '${typeOfCharge}', '${cardNumber}', '${moment(expiration).format("YYYY-MM-DD HH:mm:ss")}', 
        '${arlConfirmation}', '${cardType}', '${cvv}', '${email}', '${currency}', 
        '${billingPhone}', 10.0 , '${cardHolderName}','${airline_info}', '${passenger_details}',
        '${GDS_PRN}', '${subjectLine}', '${TFN}', '${billingAddress}'); 
        `
        console.log("Insert Query: " , insert_query);
        
        const insert_resp = await query(insert_query)
        console.log('insert_resp', insert_resp)
        if(!insert_resp.insertId){
            return {status: false, data:[], c_msg: "Data not Inserted!", alert_status: "error"}
        }
        return { status: true, data:[{ id: insert_resp.insertId, payload }], c_msg: "Data Inserted!", alert_status: "success"}
    } catch (error) {
        console.log('Error in Inserting Data: ' + error.message)
        throw error
    }
}

