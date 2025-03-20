import {
  Price_Description,
  Refund_Description,
  Future_credit,
} from "../models/bookingModel.js";
import { query } from "../config/db.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import createTransporter from "../config/mailConfig.js";
import upload from "../utils/multer.js";

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
    throw new Error(error);
    console.log("Error in Bookings Controller: " + error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const RefundDescription = async (req, res) => {
  try {
    const FileName = req?.files?.map((item) => {
      return item?.filename;
    });
    req.FileName = FileName?.join(",");
    const agentFullName = req?.full_name || "No Name";

    const add_payload = {
      ...req.body,
      fullname: agentFullName, // Add the fullname to payload
    };

    const insert_resp = await Refund_Description(add_payload, FileName);
    if (insert_resp) {
      return res.status(201).json(insert_resp);
    }
    return res
      .status(400)
      .json({ message: "Not able to insert record", status: false });
  } catch (error) {
    throw new Error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const FutureCredit = async (req, res) => {
  try {
    const FileName = req?.files?.map((item) => {
      return item?.filename;
    });
    req.FileName = FileName?.join(",");
    const agentFullName = req?.full_name || "No Name";

    const add_payload = {
      ...req.body,
      fullname: agentFullName, // Add the fullname to payload
    };

    const insert_resp = await Future_credit(add_payload, FileName);
    if (!insert_resp) {
      return res
        .status(400)
        .json({ message: "Not able to insert record", status: false });
    }

    return res.status(201).json(insert_resp);
  } catch (error) {
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server Error" });
  }
};

export const new_booking_list = async (req, res) => {
  try {
    const userRole = req.userRole;

    const QueryCondition =
      userRole == "admin"
        ? `WHERE booking_type = 'new_booking'`
        : `WHERE agent_name = '${req.full_name}' AND booking_type = 'new_booking'`;

    let qry = `
            SELECT 
                card_holder_name,
                total_amount,
                email_type,
                created_at,
                agent_name,
                customer_id,
                booking_type,
                status,
                DATE_FORMAT(updated_at, '%H:%i') as updated_time
            FROM 
                form_data 
                ${QueryCondition}
            ORDER BY id DESC
        `;

    const result = await query(qry);

    if (result.length > 0) {
      res.render("new_booking_list", { userRole, result });
    } else {
      res.render("new_booking_list", { userRole, result: [] });
    }
  } catch (error) {
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};
export const refund_list = async (req, res) => {
  try {
    const userRole = req.userRole;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const QueryCondition =
      userRole == "admin"
        ? `WHERE booking_type = 'refund_form'`
        : `WHERE agent_name = '${req.full_name}' AND booking_type = 'refund_form'`;

    let qry = `
            SELECT 
                card_holder_name,
                total_amount,
                email_type,
                created_at,
                agent_name,
                customer_id,
                booking_type,
                status,
                DATE_FORMAT(updated_at, '%H:%i') as updated_time
            FROM 
                form_data 
                ${QueryCondition}
            ORDER BY id DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

    const result = await query(qry);

    let countQry = `SELECT COUNT(*) AS total FROM form_data ${QueryCondition}`;
    const countResult = await query(countQry);
    const totalRows = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRows / limit);


    if (result.length > 0) {
      res.render("refund_list", { userRole, result, currentPage: page, totalPages });
    } else {
      res.render("refund_list", { userRole, result: [], currentPage: page, totalPages });
    }
  } catch (error) {
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

export const exchange_list = async (req, res) => {
  try {
    const userRole = req.userRole;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const QueryCondition =
      userRole == "admin"
        ? `WHERE booking_type = 'exchange'`
        : `WHERE agent_name = '${req.full_name}' AND booking_type = 'exchange'`;

    let qry = `
            SELECT 
                card_holder_name,
                total_amount,
                email_type,
                created_at,
                agent_name,
                customer_id,
                booking_type,
                status,
                DATE_FORMAT(updated_at, '%H:%i') as updated_time
            FROM 
                form_data 
                ${QueryCondition}
            ORDER BY id DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

    const result = await query(qry);

    let countQry = `SELECT COUNT(*) AS total FROM form_data ${QueryCondition}`;
    const countResult = await query(countQry);
    const totalRows = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRows / limit);

    if (result.length > 0) {
      res.render("exchange_list", { userRole, result, currentPage: page, totalPages });
    } else {
      res.render("exchange_list", { userRole, result: [], currentPage: page, totalPages });
    }
  } catch (error) {
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

export const seat_upgrade_list = async (req, res) => {
  try {
    const userRole = req.userRole;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const QueryCondition =
      userRole == "admin"
        ? `WHERE booking_type = 'seat_upgrade'`
        : `WHERE agent_name = '${req.full_name}' AND booking_type = 'seat_upgrade'`;

    let qry = `
            SELECT 
                card_holder_name,
                total_amount,
                email_type,
                created_at,
                agent_name,
                customer_id,
                booking_type,
                status,
                DATE_FORMAT(updated_at, '%H:%i') as updated_time
            FROM 
                form_data 
                ${QueryCondition}
            ORDER BY id DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

    const result = await query(qry);

    let countQry = `SELECT COUNT(*) AS total FROM form_data ${QueryCondition}`;
    const countResult = await query(countQry);
    const totalRows = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRows / limit);

    if (result.length > 0) {
      res.render("seat_upgrade_list", { userRole, result, currentPage: page, totalPages });
    } else {
      res.render("seat_upgrade_list", { userRole, result: [], currentPage: page, totalPages });
    }
  } catch (error) {
    throw new Error(error);
  }
};

// for all booking list
export const AllBooking = async (req, res) => {
  try {
    const userRole = req.userRole;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const QueryCondition =
      userRole == "admin" ? `` : `WHERE agent_name = '${req.full_name}'`;

    let qry = `
            SELECT 
                card_holder_name,
                total_amount,
                email_type,
                created_at,
                agent_name,
                customer_id,
                booking_type,
                status,
                DATE_FORMAT(updated_at, '%H:%i') as updated_time
            FROM 
                form_data 
                ${QueryCondition}
                ORDER BY id DESC
                LIMIT ${limit} OFFSET ${offset}
        `;

    const result = await query(qry);

    let countQry = `SELECT COUNT(*) AS total FROM form_data ${QueryCondition}`;
    const countResult = await query(countQry);
    const totalRows = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRows / limit);

    let qry2 = `SELECT 
                  full_name,
                  userRole
                FROM users`
    const result2 = await query(qry2);

    if (result.length > 0) {
      res.render("all_booking", { userRole, result, result2, currentPage: page, totalPages });
    } else {
      res.render("all_booking", { userRole, result: [], result2:[], currentPage: page, totalPages });
    }
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
};

// Controller for Mail Draft
export const new_booking_draft = async (req, res) => {
  try {
    const userRole = req.userRole;
    const { customer_id } = req.params;
    const FullName = req.full_name;
    const { email, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;


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
                signed_document,
                uploaded_document,
                status,
                note,
                case_number,
                date_of_expiration
            FROM 
                form_data
            WHERE 
                customer_id = '${customer_id}'
                LIMIT ${limit} OFFSET ${offset}
        `;

    const result = await query(qry);

    let qry2 = `SELECT DISTINCT users.userRole FROM users JOIN form_data ON users.full_name = form_data.agent_name AND form_data.customer_id = '${customer_id}'`;
    const result2 = await query(qry2);
    const user_status = result2[0].userRole;

    let qry3 = `SELECT payment_status FROM customer_booking_status WHERE customer_id = '${customer_id}'`;
    let result3 = await query(qry3);
    const charging_status = result3[0]?.payment_status;

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
        user_status,
        charging_status,
        type,
      });
    } else {
      res.render("new_booking_draft", {
        userRole,
        result: [],
        FullName,
        email,
        BaseFare,
        user_status,
        charging_status,
        type,
      });
    }
  } catch (error) {
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

// Email Acknowledge
export const EmailAcknowledge = async (req, res) => {
  try {
    const { fromEmail, subject, toEmail, emailtype, customer_id } = req.body;
    const { mail_type } = req.params;
    console.log(mail_type);
    const FullName = req.full_name;
    if (!fromEmail || !subject || !toEmail || !emailtype) {
      return res
        .status(400)
        .json({ success: false, ErrorMsg: "All fields are required" });
    }
    if (emailtype === "email") {
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
        Docusign_Verified,
        status,
        note,
        refund_amount,
        date_of_expiration,
        case_number,
        booking_ref_no
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
      let emailHtml;
      if (mail_type == "refund") {
        emailHtml = await ejs.renderFile(
          path.join(__dirname, "../views", "new_booking_draft_refund.ejs"),
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
      } else if(mail_type == 'seat_upgrade') {
        emailHtml = await ejs.renderFile(
          path.join(__dirname, "../views", "new_booking_draft_seat_upgrade.ejs"),
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
      } else if(mail_type == 'future_credit') {
        emailHtml = await ejs.renderFile(
          path.join(__dirname, "../views", "new_booking_draft_future_credit.ejs"),
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
      }else{
        emailHtml = await ejs.renderFile(
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
      }

      const transporter = createTransporter(fromEmail);
      // Email options
      const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        html: emailHtml,
      };

      const info = await transporter.sendMail(mailOptions);

      if (info.accepted.length > 0) {
        return res
          .status(200)
          .json({ success: true, message: "Email sent successfully!" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Email not sent!" });
      }
    } else {
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

      if(isNaN(BaseFare)){
        BaseFare = 0
      }

      if (!result) {
        return res
          .status(404)
          .json({ success: false, ErrorMsg: "User not found" });
      }
      const emailHtml = await ejs.renderFile(
        path.join(__dirname, "../views", "e_ticket.ejs"),
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

      const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        html: emailHtml,
        text: "Please find attached your e-tickets.",
        attachments: req.files.map((file) => ({
          filename: file.originalname,
          path: file.path,
        })),
      };
      const info = await transporter.sendMail(mailOptions);

      if (info.accepted.length > 0) {
        return res
          .status(200)
          .json({ success: true, message: "E-tickets sent successfully!" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "E-tickets not sent!" });
      }
    }
  } catch (error) {
    throw new Error(err);
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
    throw new Error(error);
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
      `update form_data set signed_document = '${fileName}' where customer_id = '${
        customer_id || "no file avaiable"
      }'`
    );

    if (!result1) {
      return res
        .status(400)
        .json({ success: false, message: "Data not inserted" });
    }
    res.render("iptrackingsuccess", { DeviceInfo });
  } catch (error) {
    throw new Error(error);
  }
};

export const docusignPdf = async (req, res) => {
  try {
    const userRole = req.userRole;
    const { customer_id } = req.params;
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
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

export const customer_doc_upload = async (req, res) => {
  try {
    const { customer_id } = req.params;

    res.render("customer_doc_upload", { customer_id });
  } catch (error) {
    console.log(error, "Server error");
  }
};
export const thankyou = async (req, res) => {
  try {
    res.render("thankyou");
  } catch (error) {
    throw new Error(error);
  }
};

export const e_ticket = async (req, res) => {
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
      res.render("e_ticket", {
        userRole,
        result,
        FullName,
        email,
        BaseFare,
      });
    } else {
      res.render("e_ticket", {
        userRole,
        result: [],
        FullName,
        email,
        BaseFare,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const { customer_id } = req.params;

    if (!req.files || req.files.length == 0) {
      return res.status(401).json({ ErrorMsg: "no file uploaded" });
    }

    let documents = req.files.map((item) => item.filename).join(",");

    let qry = `update form_data set uploaded_document='${documents}' where customer_id='${customer_id}'`;
    let result = await query(qry);

    if (result.affectedRows == 0) {
      res.status(401).json({ success: false });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    throw new Error(error);
  }
};

export const ChangeStatus = async (req, res) => {
  try {
    let { customer_id } = req.body;

    let UpdateStatus = await query(
      `update form_data set status='sent_for_issuance' where customer_id='${customer_id}'`
    );

    if (UpdateStatus.affectedRows == 0) {
      return res.status(401).json({ success: false });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    throw new Error(error);
  }
};

export const ChangeBookingStatus = async (req, res) => {
  try {
    let {
      customer_id,
      payment_status,
      card_holder_name,
      queue_name,
      charging_source,
      verfication,
      companycard,
      cardnum,
      voucher,
      amount,
      remarks,
    } = req.body;

    let ExecuteQuery;
    let isCustomerExists = await query(
      `SELECT id FROM customer_booking_status WHERE customer_id='${customer_id}'`
    );

    if (isCustomerExists.length > 0) {
      let qry = `UPDATE customer_booking_status 
      SET customer_name='${card_holder_name}', payment_status='${payment_status}', queue_name='${queue_name}', charging_source='${charging_source}', card_verified='${verfication}', company_card_used='${companycard}', card_number='${cardnum}', voucher_used='${voucher}', amount='${amount}', remarks='${remarks}' WHERE customer_id='${customer_id}'`;
      ExecuteQuery = await query(qry);
    } else {
      let qry = `INSERT INTO customer_booking_status 
      (customer_id, customer_name, payment_status, queue_name, charging_source, card_verified, company_card_used, card_number, voucher_used, amount, remarks)
      VALUES ('${customer_id}','${card_holder_name}', '${payment_status}', '${queue_name}', '${charging_source}', '${verfication}','${companycard}', '${cardnum}', '${voucher}', '${amount}', '${remarks}')`;
      ExecuteQuery = await query(qry);
    }

    await query(
      `update form_data set status='${payment_status}' where customer_id='${customer_id}'`
    );

    if (ExecuteQuery.affectedRows == 0) {
      res.status(401).json({ success: false, msg: "table not updated" });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    throw new Error(error);
  }
};

export const UpdateRemarks = async (req, res) => {
  try {
    let { AddNote, customer_id } = req.body;

    let qry = `UPDATE form_data
    SET note='${AddNote}' 
    WHERE customer_id = '${customer_id}'`;
    let ExecuteQuery = await query(qry);

    if (ExecuteQuery.affectedRows == 0) {
      return res.status(401).json({ success: false, msg: "Row Not updated" });
    }

    res
      .status(200)
      .json({
        success: true,
        msg: "Remarks update successfully",
        Remarknote: AddNote,
      });
  } catch (error) {
    throw new Error(error);
    return res.json(500).status({ msg: "internal server error" });
  }
};

export const booking_exchange = async (req, res) => {
  try {
    const userRole = req.userRole;

    let qry = `
        SELECT 
           id,
            card_holder_name,
            total_amount,
            email_type,
            created_at,
            agent_name,
            customer_id,
            status
        FROM 
            form_data 
        WHERE 
            agent_name = '${req.full_name}' AND booking_type = 'exchange'
        ORDER BY id DESC
    `;

    const result = await query(qry);

    if (result.length > 0) {
      res.render("booking", { userRole, result });
    } else {
      res.render("booking", { userRole, result: [] });
    }
  } catch (error) {
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

export const booking_refund = async (req, res) => {
  try {
    const userRole = req.userRole;

    let qry = `
        SELECT 
           id,
            card_holder_name,
            total_amount,
            email_type,
            created_at,
            agent_name,
            customer_id,
            status
        FROM 
            form_data 
        WHERE 
            agent_name = '${req.full_name}' AND booking_type = 'refund_form'
        ORDER BY id DESC
    `;

    const result = await query(qry);

    if (result.length > 0) {
      res.render("booking", { userRole, result });
    } else {
      res.render("booking", { userRole, result: [] });
    }
  } catch (error) {
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

export const booking_seatupgrade = async (req, res) => {
  try {
    const userRole = req.userRole;

    let qry = `
        SELECT 
           id,
            card_holder_name,
            total_amount,
            email_type,
            created_at,
            agent_name,
            customer_id,
            status
        FROM 
            form_data 
        WHERE 
            agent_name = '${req.full_name}' AND booking_type = 'seat_upgrade'
        ORDER BY id DESC
    `;

    const result = await query(qry);

    if (result.length > 0) {
      res.render("booking", { userRole, result });
    } else {
      res.render("booking", { userRole, result: [] });
    }
  } catch (error) {
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};

export const future_credit_list = async (req, res) => {
  try {
    const userRole = req.userRole;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const QueryCondition =
      userRole == "admin"
        ? `WHERE booking_type = 'future_credit'`
        : `WHERE agent_name = '${req.full_name}' AND booking_type = 'future_credit'`;

    let qry = `
            SELECT 
                card_holder_name,
                total_amount,
                email_type,
                created_at,
                agent_name,
                customer_id,
                booking_type,
                status,
                DATE_FORMAT(updated_at, '%H:%i') as updated_time
            FROM 
                form_data 
                ${QueryCondition}
            ORDER BY id DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

    const result = await query(qry);

    let countQry = `SELECT COUNT(*) AS total FROM form_data ${QueryCondition}`;
    const countResult = await query(countQry);
    const totalRows = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRows / limit);

    if (result.length > 0) {
      res.render("future_credit_list", { userRole, result, currentPage: page, totalPages });
    } else {
      res.render("future_credit_list", { userRole, result: [], currentPage: page, totalPages });
    }
  } catch (error) {
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

// refund email controller
export const new_booking_draft_refund = async (req, res) => {
  try {
    const userRole = req.userRole;
    const { customer_id } = req.params;
    const FullName = req.full_name;
    const { email, type } = req.query;
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
                signed_document,
                uploaded_document,
                status,
                note,
                case_number,
                refund_amount
            FROM 
                form_data
            WHERE 
                customer_id = '${customer_id}'
        `;

    const result = await query(qry);

    let qry2 = `SELECT DISTINCT users.userRole FROM users JOIN form_data ON users.full_name = form_data.agent_name AND form_data.customer_id = '${customer_id}'`;
    const result2 = await query(qry2);
    const user_status = result2[0].userRole;

    let qry3 = `SELECT payment_status FROM customer_booking_status WHERE customer_id = '${customer_id}'`;
    let result3 = await query(qry3);
    const charging_status = result3[0]?.payment_status;

    // Calculate Base Fare
    let BaseFare = 0;
    let FlightDetails = result[0]?.airline_info;
    FlightDetails = JSON.parse(FlightDetails);

    FlightDetails.reduce((acc, item) => {
      return (BaseFare = acc + parseFloat(item.airline_cost));
    }, 0);

    if (result.length > 0) {
      res.render("new_booking_draft_refund", {
        userRole,
        result,
        FullName,
        email,
        BaseFare,
        user_status,
        charging_status,
        type,
      });
    } else {
      res.render("new_booking_draft_refund", {
        userRole,
        result: [],
        FullName,
        email,
        BaseFare,
        user_status,
        charging_status,
        type,
      });
    }
  } catch (error) {
    throw new Error(error);
    return res
      .status(500)
      .json({ success: false, ErrorMsg: "Internal Server Error" });
  }
};


// seat upgrade email controller
export const new_booking_draft_seat_upgrade = async (req, res) => {
  try {
    const userRole = req.userRole;
    const { customer_id } = req.params;
    const FullName = req.full_name;
    const { email, type } = req.query;
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
                signed_document,
                uploaded_document,
                status,
                note,
                case_number,
                refund_amount
            FROM 
                form_data
            WHERE 
                customer_id = '${customer_id}'
        `;

    const result = await query(qry);

    let qry2 = `SELECT DISTINCT users.userRole FROM users JOIN form_data ON users.full_name = form_data.agent_name AND form_data.customer_id = '${customer_id}'`;
    const result2 = await query(qry2);
    const user_status = result2[0].userRole;

    let qry3 = `SELECT payment_status FROM customer_booking_status WHERE customer_id = '${customer_id}'`;
    let result3 = await query(qry3);
    const charging_status = result3[0]?.payment_status;

    // Calculate Base Fare
    let BaseFare = 0;
    let FlightDetails = result[0]?.airline_info;
    FlightDetails = JSON.parse(FlightDetails);

    FlightDetails.reduce((acc, item) => {
      return (BaseFare = acc + parseFloat(item.airline_cost));
    }, 0);
    if(isNaN(BaseFare)){
      BaseFare = 0
    }

    if (result.length > 0) {
      res.render("new_booking_draft_seat_upgrade", {
        userRole,
        result,
        FullName,
        email,
        BaseFare,
        user_status,
        charging_status,
        type,
      });
    } else {
      res.render("new_booking_draft_seat_upgrade", {
        userRole,
        result: [],
        FullName,
        email,
        BaseFare,
        user_status,
        charging_status,
        type,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

// future credit email controller
export const new_booking_draft_future_credit = async (req, res) => {
  try {
    const userRole = req.userRole;
    const { customer_id } = req.params;
    const FullName = req.full_name;
    const { email, type } = req.query;
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
                signed_document,
                uploaded_document,
                status,
                note,
                case_number,
                refund_amount,
                booking_ref_no
            FROM 
                form_data
            WHERE 
                customer_id = '${customer_id}'
        `;

    const result = await query(qry);

    let qry2 = `SELECT DISTINCT users.userRole FROM users JOIN form_data ON users.full_name = form_data.agent_name AND form_data.customer_id = '${customer_id}'`;
    const result2 = await query(qry2);
    const user_status = result2[0].userRole;

    let qry3 = `SELECT payment_status FROM customer_booking_status WHERE customer_id = '${customer_id}'`;
    let result3 = await query(qry3);
    const charging_status = result3[0]?.payment_status;

    // Calculate Base Fare
    let BaseFare = 0;
    let FlightDetails = result[0]?.airline_info;
    FlightDetails = JSON.parse(FlightDetails);

    FlightDetails.reduce((acc, item) => {
      return (BaseFare = acc + parseFloat(item.airline_cost));
    }, 0);
    if(isNaN(BaseFare)){
      BaseFare = 0
    }

    if (result.length > 0) {
      res.render("new_booking_draft_future_credit", {
        userRole,
        result,
        FullName,
        email,
        BaseFare,
        user_status,
        charging_status,
        type,
      });
    } else {
      res.render("new_booking_draft_future_credit", {
        userRole,
        result: [],
        FullName,
        email,
        BaseFare,
        user_status,
        charging_status,
        type,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};




export const DeleteBooking = async(req, res) => {
  try {
    let { customerId } = req.body;

   let DeleteBookig =  await query(`DELETE FROM form_data WHERE customer_id = '${customerId}'`);
   
   if(DeleteBookig.affectedRows == 0){
    return res.status(400).json({success: false,msg:"something went wrong"})
   }

  return res.status(200).json({success: true, msg:"booking delete successfully"})

  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}




export const UpdateEmailDraft = async (req, res) => {
  try {
    let { customer_id, arl_confirmation, pnr_no, card_number, cvv, date_of_expiration, email }  = req.body;

    let UpdateEmailDraft = await query(`UPDATE form_data SET email = '${email}', card_number = '${card_number}',cvv='${cvv}', arl_confirmation='${arl_confirmation}',date_of_expiration='${date_of_expiration}' WHERE customer_id = '${customer_id}'`);

    if(UpdateEmailDraft.affectedRows == 0){
      return res.status(401).json({ success: false, msg: "Something went wrong" });
    }
    return res.status(200).json({ success: true, msg:"Data Updated succesfully" })

  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}



export const filtercontroller = async (req, res) => {
  try {
    let { Agents, type, from_date, to_date, phone, page = 1, limit = 10 } = req.body;
    let offset = (page - 1) * limit;

    let conditions = [];

    if(Agents){
      conditions.push(`agent_name = '${Agents}'`);
    }
    if(type) {
      conditions.push(`booking_type = '${type}'`)
    }
    if(from_date && to_date) {
      conditions.push(`created_at BETWEEN STR_TO_DATE('${from_date}', '%Y-%m-%d') AND STR_TO_DATE('${to_date}', '%Y-%m-%d')`)
    }
    if(phone) {
      conditions.push(`phone='${phone}'`)
    }

    let whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let qry = `SELECT card_holder_name,
                total_amount,
                email_type,
                created_at,
                agent_name,
                customer_id,
                booking_type,
                status,
                DATE_FORMAT(updated_at, '%H:%i') as updated_time FROM form_data ${whereClause} LIMIT ${limit} OFFSET ${offset}`
    let result = await query(qry);

    let countQry = `SELECT COUNT(*) AS total FROM form_data ${whereClause}`;
    let countResult = await query(countQry); // Remove limit & offset values
    let totalRecords = countResult[0].total;
    let totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({ success: true, data: result, totalPages });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, msg: "internal server error" })
  }
}