import { query } from '../config/db.js';

export const Price_Description = async(
    newTotalAmountQuoted,
    newMCO_Description,
    newAirlineName,
    newTypeOfCharge,
    newAirlineCost,
    newCardNumber,
    newExpiration,
    newArl_Confirmation,
    newCardType,
    newCVV,
    newEmail,
    newCurrency,
    newBilling_Phone,
    newSubjectLine,
    newCardHolderName,
    newTFN,
    newBillingAddress
) =>{
    try {
        const sql = await query("INSERT INTO form_data (total_amount = ? ,mco_description = ?,airline_names =?,charge_type = ?,airline_cost = ?,card_number = ? ,expiration = ?,arl_confirmation=?, card_type = ?, cvv = ? ,email = ?, currency = ? ,  billing_phone = ?",
        [newTotalAmountQuoted,newMCO_Description,newAirlineName,newTypeOfCharge,newAirlineCost,newCardNumber,newExpiration,newArl_Confirmation,newCardType,newCVV,newEmail,newCurrency,newBilling_Phone]);
        return sql;
    } catch (error) {
        console.log("Error in Inserting Data: " + error.message);
        throw error;
    }
}
// export const cardInformationFunc = async (newCardNumber
//     ,newExpiration,newArl_Confirmation,newCardType,newCVV,newEmail,newCurrency,newBilling_Phone
// ) => {
//     try {
//         const sql = await query("INSERT INTO form_data (card_number = ? ,expiration = ?,arl_confirmation=?, card_type = ?, cvv = ? ,email = ?, currency = ? ,  billing_phone = ?", [newCardNumber,newExpiration,newArl_Confirmation,newCardType,newCVV,newEmail,newCurrency,newBilling_Phone]);
//         return sql;
//     } catch (error) {
//         console.log("Error in CardInformation Controller:" + error.message);
//         throw error;
//     }
// }
export const Header = async (newSubjectLine,newCardHolderName,newTFN,newBillingAddress) => {
    try {
        const sql = await query("INSERT INTO form_data (subject_line = ? , ")
    } catch (error) {
        console.log("Error in Header Controller:" + error.message);
        throw error;
    }
}