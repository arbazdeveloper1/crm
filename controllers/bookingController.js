import {  Price_Description } from "../models/bookingModel.js";

export const priceDescription = async (req,res) => {
    const { 
        totalAmountQuoted,
        MCO_Description, 
        AirlineName, 
        TypeOfCharge, 
        AirlineCost,
        CardNumber,
        Expiration,
        Arl_Confirmation,
        CardType,
        CVV,
        Email,
        Currency,
        Billing_Phone,
        subjectLine,
        cardHolderName,
        TFN,
        billingAddress
    } = req.body;
    // console.log(req.body);
    try {
        const newTotalAmountQuoted =  totalAmountQuoted;
        const newMCO_Description =  MCO_Description;
        const newAirlineName =  AirlineName;
        const newTypeOfCharge =  TypeOfCharge;
        const newAirlineCost =  AirlineCost;
        const newCardNumber = CardNumber;
        const newExpiration = Expiration;
        const newArl_Confirmation = Arl_Confirmation;
        const newCardType = CardType;
        const newCVV = CVV;
        const newEmail = Email;
        const newCurrency = Currency;
        const newBilling_Phone = Billing_Phone;
        const newSubjectLine = subjectLine;
        const newCardHolderName = cardHolderName;
        const newTFN = TFN;
        const newBillingAddress = billingAddress;


        const sql = await Price_Description(
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
        );
        if (sql) {
            return res.status(201).json({
                totalAmountQuoted: newTotalAmountQuoted,
                MCO_Description: newMCO_Description,
                AirlineName: newAirlineName,
                TypeOfCharge: newTypeOfCharge,
                AirlineCost: newAirlineCost,
                CardNumber:newCardNumber,
                Expiration:newExpiration,
                Arl_Confirmation:newArl_Confirmation,
                CardType:newCardType,
                CVV:newCVV,
                Email:newEmail,
                Currency:newCurrency,
                Billing_Phone:newBilling_Phone,
                subjectLine:newSubjectLine,
                cardHolderName:newCardHolderName,
                TFN:newTFN,
                billingAddress:newBillingAddress
            });
        }
        return res.status(400).json({message: "Not able to insert record" ,status:false});
    } catch (error) {
        console.log("Error in Bookings Controller: " + error.message);
       return res.status(500).json({message: "Server Error"})
    }
}

// export const cardInformation = async (req, res) => {
//     const {CardNumber,Expiration,Arl_Confirmation,CardType,CVV,Email,Currency,Billing_Phone} = req.body;
//     try {
//         const newCardNumber = CardNumber;
//         const newExpiration = Expiration;
//         const newArl_Confirmation = Arl_Confirmation;
//         const newCardType = CardType;
//         const newCVV = CVV;
//         const newEmail = Email;
//         const newCurrency = Currency;
//         const newBilling_Phone = Billing_Phone;
//         const sql = await cardInformationFunc(newCardNumber,newExpiration,newArl_Confirmation,newCardType,newCVV,newEmail,newCurrency,newBilling_Phone)
//         if(sql){
//             return res.status(201).json({
//                 CardNumber:newCardNumber,
//                 Expiration:newExpiration,
//                 Arl_Confirmation:newArl_Confirmation,
//                 CardType:newCardType,
//                 CVV:newCVV,
//                 Email:newEmail,
//                 Currency:newCurrency,
//                 Billing_Phone:newBilling_Phone
//             });
//         }
//         return res.status(400).json({message: "Not able to insert record", status:false});
//     } catch (error) {
//         console.log("Error in cardInformation Controller: " + error.message);
//         res.status(500).json({message: "Server Error"})
//     }
// }
// export const headerController = async (req,res) => {
//     const {subjectLine,cardHolderName,TFN,billingAddress}=req.body;
//     try {
//         const newSubjectLine = subjectLine;
//         const newCardHolderName = cardHolderName;
//         const newTFN = TFN;
//         const newBillingAddress = billingAddress;
//         const sql = await Header(newSubjectLine,newCardHolderName,newTFN,newBillingAddress);
//         if(sql){
//             return res.status(201).json({
//                 subjectLine:newSubjectLine,
//                 cardHolderName:newCardHolderName,
//                 TFN:newTFN,
//                 billingAddress:newBillingAddress
//             });
//         }
//         return res.status(400).json({message: "Not able to insert record", status:false});
//     } catch (error) {
//         console.log("Error in header Controller: "+ error.message);
//         throw error;
//     }
// }