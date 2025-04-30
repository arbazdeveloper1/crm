import moment from "moment";
import axios from "axios";
import path from "path";
import ejs from "ejs";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import fs from "fs";
import { query } from "../config/db.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const numbers = "0123456789";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "KJ";

  const chars = numbers + letters;
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

async function getPublicIP() {
  try {
    const publicIP = await axios.get("https://api64.ipify.org?format=json");
    return publicIP?.data?.ip;
  } catch (error) {
    console.error(error);
  }
}

async function GeneratePDF(req, res, customer_id, FullName) {
  try {
    // Delay function to add a pause (3 seconds)
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Introduce a 3-second delay before proceeding
    await delay(4000);

    // Ensure the pdfupload folder exists
    const pdfFolderPath = path.join(__dirname, "../pdfupload");
    if (!fs.existsSync(pdfFolderPath)) {
      fs.mkdirSync(pdfFolderPath, { recursive: true });
    }

    // Generate dynamic file name (timestamp-based)
    const fileName = `client_${customer_id}_${Date.now()}.pdf`;
    const filePath = path.join(pdfFolderPath, fileName);

    // Get dynamic data from request
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
        expiration,
        cvv,
        card_type,
        arl_confirmation,
        currency,
        mco_description,
        mco_calculated,
        Docusign_Verified
    FROM 
        form_data
    WHERE 
        customer_id = '${customer_id}'
    `;

    const result = await query(qry);

    // Calculate Base Fare
    let BaseFare = 0;
    let FlightDetails = result[0]?.airline_info;
    FlightDetails = JSON.parse(FlightDetails);

    FlightDetails.reduce((acc, item) => {
      return (BaseFare = acc + parseFloat(item.airline_cost));
    }, 0);

    if (isNaN(BaseFare)) {
      BaseFare = 0;
    }

    // Query to get the user device configuration
    let qry1 = `select * from user_device_config where customer_id = '${customer_id}'`;
    const SystemConfig = await query(qry1);

    const templatePath = path.join(__dirname, "../views/docusign_pdf.ejs"); // Adjust path
    const html = await ejs.renderFile(templatePath, { result: result, FullName: FullName, BaseFare: BaseFare, SystemConfig: SystemConfig });

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
    });
    const page = await browser.newPage();

    // Set page content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate and save PDF
    await page.pdf({
      path: filePath, // Save to folder
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return fileName;
 
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}



function getCurrentTime24H() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}


export {
  getCurrentDateFormatted,
  formatExpirationNative,
  generateRandomAlphaNumeric,
  getPublicIP,
  GeneratePDF,
  getCurrentTime24H
};
