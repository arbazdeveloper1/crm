import moment from "moment";
import {
  getCurrentDateFormatted,
  formatExpirationNative,
  generateRandomAlphaNumeric
} from "../utils/helper.js";
import { query } from "../config/db.js";

export const Price_Description = async (payload, FileName) => {
  try {

    const { totalAmountQuoted, mcoDescription, typeOfCharge } = payload;
    const { cvv, GDS_PRN, arlConfirmation, email, billingPhone } = payload;
    const {
      cardNumber,
      cardType,
      currency,
      expiration,
      airline_info,
      passenger_details,
      mco_calculated
    } = payload;
    const { subjectLine, cardHolderName, TFN, billingAddress, fullname } = payload;
    const insert_query = `INSERT INTO form_data 
        (total_amount, mco_description, charge_type,
        card_number, expiration, arl_confirmation, 
        card_type , cvv, email, currency, 
        billing_phone, mco_calculated, card_holder_name, airline_info, passenger_details, gds_pnr,
        subject_line, tfn, billing_address,image,customer_id, agent_name,created_at, email_type, booking_type,Docusign_Verified) VALUES
        ('${parseFloat(totalAmountQuoted)}', '${mcoDescription}','${typeOfCharge}', '${cardNumber}', '${formatExpirationNative(expiration)}','${arlConfirmation}', '${cardType}', '${cvv}', '${email}', '${currency}', '${billingPhone}', '${mco_calculated}', '${cardHolderName}','${airline_info}', '${passenger_details}','${GDS_PRN}', '${subjectLine}', '${TFN}', '${billingAddress}','${FileName}','${generateRandomAlphaNumeric()}','${fullname}','${getCurrentDateFormatted()}','supplier','new_booking','false')`;
        
    const insert_resp = await query(insert_query);

    if (!insert_resp.insertId) {
      return {
        status: false,
        data: [],
        c_msg: "Data not Inserted!",
        alert_status: "error",
      };
    }
    return {
      status: true,
      data: [{ id: insert_resp.insertId, payload }],
      c_msg: "Data Inserted!",
      alert_status: "success",
    };
  } catch (error) {
    console.log("Error in Inserting Data: " + error.message);
  }
};
