import moment from "moment";

// Function for Current Date
function getCurrentDateFormatted() {
  const date = new Date();
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

// Function to change the Expiration format
function formatExpirationNative(expiration) {
  try {
    let [month, year] = expiration?.split("/");
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    year = year < 50 ? 2000 + year : 1900 + year;

    const date = new Date(year, month - 1, 1);

    const pad = (num) => num?.toString()?.padStart(2, "0");
    const formattedDate = `${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
    return formattedDate;
  } catch (error) {
    console.error(error);
  }
}

// Function to generate random alphanumeric string
function generateRandomAlphaNumeric(length = 10) {
  const numbers = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 'KJ';
  
  const chars = numbers + letters;
  for(let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

export { getCurrentDateFormatted, formatExpirationNative, generateRandomAlphaNumeric };
