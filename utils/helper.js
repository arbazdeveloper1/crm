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
    const formattedDate = `${date.getFullYear()}-${pad(
      date.getMonth() + 1
    )}-${pad(date.getDate())} 00:00:00`;
    return formattedDate;
  } catch (error) {
    console.error(error);
  }
}

export { getCurrentDateFormatted, formatExpirationNative };
