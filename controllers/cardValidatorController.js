// import cardValidator from 'card-validator';

// export const validateCard = async (req, res) => {
//     const { cardNumber, expirationDate, cvv } = req.body;

//     // Validate card number
//     const numberValidation = cardValidator.number(cardNumber);
//     if (!numberValidation.isValid) {
//         return res.status(400).json({ error: 'Invalid card number' });
//     }

//     // Validate expiration date (assuming the format MM/YY)
//     const [month, year] = expirationDate.split('/');
//     const expirationValidation = cardValidator.expirationDate({
//         month: month.trim(),
//         year: '20' + year.trim() // Add '20' prefix for 4-digit year format
//     });

//     if (!expirationValidation.isValid) {
//         return res.status(400).json({ error: 'Invalid expiration date' });
//     }

//     // Validate CVV
//     const cvvValidation = cardValidator.cvv(cvv);
//     if (!cvvValidation.isValid) {
//         return res.status(400).json({ error: 'Invalid CVV' });
//     }

//     // If all validations pass
//     res.status(200).json({ message: 'Card details are valid!' });
// };
