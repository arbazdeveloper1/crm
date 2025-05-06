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

async function fetchImageAsBase64(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    return buffer.toString("base64");
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`Image not found at ${url}`);
    } else {
      console.error("Error fetching image:", error);
    }
    return null;
  }
}


async function GeneratePDF(req, res, customer_id, FullName) {
  try {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Ensure pdfupload folder exists
    const pdfFolderPath = path.join(__dirname, "../pdfupload");
    if (!fs.existsSync(pdfFolderPath)) {
      fs.mkdirSync(pdfFolderPath, { recursive: true });
    }

    const fileName = `client_${customer_id}_${Date.now()}.pdf`;
    const filePath = path.join(pdfFolderPath, fileName);

    // Fetch form data
    const qry = `
      SELECT DISTINCT
        card_holder_name, total_amount, email_type, created_at, agent_name,
        customer_id, card_number, subject_line, image, passenger_details,
        airline_info, gds_pnr, billing_address, email, billing_phone,
        expiration, cvv, card_type, arl_confirmation, currency,
        mco_description, mco_calculated, Docusign_Verified
      FROM form_data
      WHERE customer_id = '${customer_id}'
    `;
    const result = await query(qry);

    // Calculate Base Fare
    let BaseFare = 0;
    let FlightDetails = JSON.parse(result[0]?.airline_info || "[]");
    BaseFare = FlightDetails.reduce((acc, item) => acc + parseFloat(item.airline_cost || 0), 0);
    if (isNaN(BaseFare)) BaseFare = 0;

    // Fetch images as base64
    const imgList = result[0]?.image?.split(",");
    const base64Images = {};

    for (let img of imgList) {
      const imageUrl = `http://localhost:3000/uploads/${img.trim()}`;
      const base64Data = await fetchImageAsBase64(imageUrl);
      if (base64Data) {
        base64Images[img.trim()] = base64Data;
      }
    }

    // Get system config
    const qry1 = `SELECT * FROM user_device_config WHERE customer_id = '${customer_id}'`;
    const SystemConfig = await query(qry1);

    // Render HTML from EJS
    const templatePath = path.join(__dirname, "../views/docusign_pdf.ejs");
    const html = await ejs.renderFile(templatePath, {
      result,
      FullName,
      BaseFare,
      SystemConfig,
      base64Images, // Pass the base64 images to EJS
    });

    // Launch browser
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--allow-running-insecure-content",
      ],
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Load HTML and wait for network to settle
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    // Ensure all images are loaded before generating PDF
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
        })
      );
    });

    // Generate PDF
    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();
    return fileName;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
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
