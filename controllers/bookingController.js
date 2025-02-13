import { Price_Description } from "../models/bookingModel.js";
import { query } from "../config/db.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import createTransporter from "../config/mailConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import requestIp from "request-ip";
// import * as UAParser from "ua-parser-js";
import { UAParser } from "ua-parser-js";
import {
  getCurrentDateFormatted,
  getPublicIP,
  GeneratePDF,
} from "../utils/helper.js";
import os from "os";

export const priceDescription = async (req, res) => {
  try {
    const FileName = req.files.map((item) => {
      return item.filename;
    });

    req.FileName = FileName.join(",");
    const agentFullName = req.full_name || "No Name";

    const add_payload = {
      ...req.body,
      fullname: agentFullName, // Add the fullname to payload
    };

    const insert_resp = await Price_Description(add_payload, FileName);
    if (insert_resp) {
      return res.status(201).json(insert_resp);
    }
    return res
      .status(400)
      .json({ message: "Not able to insert record", status: false });
  } catch (error) {
    console.log("Error in Bookings Controller: " + error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

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

    const result = await query(qry);

    if (result.length > 0) {
      res.render("booking", { userRole, result });
    } else {
      res.render("booking", { userRole, result: [] });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
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

    const result = await query(qry);

    if (result.length > 0) {
      res.render("all_booking", { userRole, result });
    } else {
      res.render("all_booking", { userRole, result: [] });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

// Controller for Mail Draft
export const new_booking_draft = async (req, res) => {
  try {
    const userRole = req.userRole;
    const { customer_id } = req.params;
    const FullName = req.full_name;
    const { email } = req.query;
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
                Docusign_Verified,
                signed_document
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

    if (result.length > 0) {
      res.render("new_booking_draft", {
        userRole,
        result,
        FullName,
        email,
        BaseFare,
      });
    } else {
      res.render("new_booking_draft", {
        userRole,
        result: [],
        FullName,
        email,
        BaseFare,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

// Email Acknowledge
export const EmailAcknowledge = async (req, res) => {
  try {
    const { fromEmail, subject, toEmail, emailTypeAuth, customer_id } =
      req.body;
    console.log(fromEmail);
    const FullName = req.full_name;

    if (!fromEmail || !subject || !toEmail || !emailTypeAuth) {
      return res
        .status(400)
        .json({ success: false, ErrorMsg: "All fields are required" });
    }

    if (emailTypeAuth === "email") {
      let qry = `SELECT DISTINCT
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
        Docusign_Verified
              FROM 
                  form_data
                  WHERE 
                  customer_id = '${customer_id}'
                  `;

      const result = await query(qry);

      let BaseFare = 0;
      let FlightDetails = result[0]?.airline_info;
      FlightDetails = JSON.parse(FlightDetails);
      FlightDetails.reduce((acc, item) => {
        return (BaseFare = acc + parseFloat(item.airline_cost));
      }, 0);

      if (!result) {
        return res
          .status(404)
          .json({ success: false, ErrorMsg: "User not found" });
      }
      const emailHtml = await ejs.renderFile(
        path.join(__dirname, "../views", "new_booking_draft.ejs"),
        {
          fromEmail,
          subject,
          toEmail,
          result,
          FullName: FullName,
          email: "false",
          BaseFare,
        }
      );

      const transporter = createTransporter(fromEmail);
      // Email options
      const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        html: emailHtml,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

export const UpdateCurrency = async (req, res) => {
  try {
    const { customer_id, currency } = req.body;

    let qry = `UPDATE form_data SET currency = '${currency}' WHERE customer_id = '${customer_id}'`;
    const result = await query(qry);
    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Currency updated" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Currency not updated" });
    }
  } catch (error) {
    console.error(error);
  }
};

// Controller for Track the User IP
export const TrackIp = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const FullName = req.full_name;
    if (!customer_id) {
      return res
        .status(400)
        .json({ success: false, message: "Customer ID is required" });
    }

    const userAgent = req.headers["user-agent"];
    const parser = new UAParser(userAgent);
    const deviceInfo = parser.getResult();

    const networkInterfaces = os.networkInterfaces();
    let userIp = "Not Found";

    Object.values(networkInterfaces).forEach((interfaces) => {
      interfaces?.forEach((iface) => {
        if (!iface.internal && iface.family === "IPv4") {
          userIp = iface.address;
        }
      });
    });

    let CurrentDate = getCurrentDateFormatted();

    let publicIP = await getPublicIP();

    let DeviceInfo = {
      browser: deviceInfo.browser.name || "Unknown",
      browserVersion: deviceInfo.browser.version || "Unknown",
      os: deviceInfo.os.name || "Unknown",
      osVersion: deviceInfo.os.version || "Unknown",
      deviceType: deviceInfo.device.type || "Desktop",
      CurrentDate: CurrentDate || "Null",
      systemIp: publicIP || "Null",
      userIp: userIp || "Null",
    };

    // update the form_data table with the docusign_verified status
    let qry = `update form_data set docusign_verified = 'true' where customer_id = '${customer_id}'`;
    const result = await query(qry);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "IP Address not updated" });
    }

    // Insert the data store user system configuration
    let qry1 = `insert into user_device_config (customer_id, browser, browser_version, operating_system, operating_system_version, device_type, system_ip, user_ip) values ('${customer_id}', '${DeviceInfo?.browser}', '${DeviceInfo?.browserVersion}', '${DeviceInfo?.os}', '${DeviceInfo?.osVersion}', '${DeviceInfo?.deviceType}', '${DeviceInfo?.systemIp}', '${DeviceInfo?.userIp}')`;
    const result1 = await query(qry1);

    // Function to generate the PDF
    const fileName = await GeneratePDF(req, res, customer_id, FullName);
    if (!fileName) {
      return res
        .status(400)
        .json({ success: false, message: "PDF not generated" });
    }

    await query(
      `update form_data set signed_document = '${fileName}' where customer_id = '${customer_id || 'no file avaiable'}'`
    );

    if (!result1) {
      return res
        .status(400)
        .json({ success: false, message: "Data not inserted" });
    }
    res.render("iptrackingsuccess", { DeviceInfo });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

export const docusignPdf = async (req, res) => {
  try {
    const userRole = req.userRole;
    const { customer_id } = req.params;
    console.log(customer_id);
    const FullName = req.full_name;
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

    // Query to get the user device configuration
    let qry1 = `select * from user_device_config where customer_id = '${customer_id}'`;
    const SystemConfig = await query(qry1);

    if (result.length > 0 && SystemConfig.length > 0) {
      res.render("docusign_pdf", {
        userRole,
        result,
        FullName,
        BaseFare,
        SystemConfig,
      });
    } else {
      res.render("docusign_pdf", {
        userRole,
        result: [],
        FullName,
        BaseFare,
        SystemConfig,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};
