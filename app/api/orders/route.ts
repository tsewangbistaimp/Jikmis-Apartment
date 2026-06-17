import { google } from "googleapis";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type OrderPayload = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  orderType?: string;
  product?: string;
  quantity?: string;
  notes?: string;
};

const requiredEnv = [
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  "GOOGLE_SPREADSHEET_ID",
  "SMTP_USER",
  "SMTP_APP_PASSWORD",
  "ORDER_NOTIFICATION_EMAIL"
] as const;

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getMissingEnv() {
  return requiredEnv.filter((key) => !process.env[key]);
}

function formatPrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, "\n");
}

async function appendOrderToSheet(order: Required<OrderPayload>, orderId: string) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: formatPrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || ""),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const hasOrdersSheet = spreadsheet.data.sheets?.some(
    (sheet) => sheet.properties?.title === "Orders"
  );

  if (!hasOrdersSheet) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: "Orders"
              }
            }
          }
        ]
      }
    });
  }

  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Orders!A1:J1"
  });

  if (!headerResponse.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Orders!A1:J1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            "Submitted At",
            "Order ID",
            "Customer Name",
            "Customer Email",
            "Customer Phone",
            "Order Type",
            "Product / Service",
            "Quantity / Budget",
            "Notes",
            "Status"
          ]
        ]
      }
    });
  }

  const values = [
    [
      new Date().toISOString(),
      orderId,
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.orderType,
      order.product,
      order.quantity,
      order.notes,
      "Received"
    ]
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Orders!A:J",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values }
  });
}

async function sendOrderEmails(order: Required<OrderPayload>, orderId: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD?.replace(/\s/g, "")
    }
  });

  const orderLines = `
Order ID: ${orderId}
Customer: ${order.customerName}
Email: ${order.customerEmail}
Phone: ${order.customerPhone}
Type: ${order.orderType}
Product / Service: ${order.product}
Quantity / Budget: ${order.quantity}
Notes: ${order.notes}
`;

  await transporter.sendMail({
    from: `"TsewangBistaX Orders" <${process.env.SMTP_USER}>`,
    to: process.env.ORDER_NOTIFICATION_EMAIL,
    subject: `New order received: ${order.orderType} (${orderId})`,
    text: `A new order was submitted from the portfolio website.\n\n${orderLines}`
  });

  await transporter.sendMail({
    from: `"TsewangBistaX" <${process.env.SMTP_USER}>`,
    to: order.customerEmail,
    subject: `Order received - ${orderId}`,
    text: `Hi ${order.customerName},\n\nThank you. Your order has been received and Tsewang Bista will contact you soon.\n\n${orderLines}\n\nTsewangBistaX\nTechnology, Business & Innovation`
  });
}

export async function POST(request: Request) {
  try {
    const missingEnv = getMissingEnv();
    if (missingEnv.length > 0) {
      return NextResponse.json(
        { message: `Order system is missing server configuration: ${missingEnv.join(", ")}` },
        { status: 500 }
      );
    }

    const body = (await request.json()) as OrderPayload;
    const order = {
      customerName: cleanValue(body.customerName),
      customerEmail: cleanValue(body.customerEmail),
      customerPhone: cleanValue(body.customerPhone),
      orderType: cleanValue(body.orderType),
      product: cleanValue(body.product),
      quantity: cleanValue(body.quantity),
      notes: cleanValue(body.notes)
    };

    const missingFields = Object.entries(order)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Please complete all required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const orderId = `TBX-${Date.now()}`;
    await appendOrderToSheet(order, orderId);
    await sendOrderEmails(order, orderId);

    return NextResponse.json({
      message: `Order received. Your confirmation email has been sent. Order ID: ${orderId}`
    });
  } catch (error) {
    console.error("Order submission failed", error);
    return NextResponse.json(
      { message: "Order could not be submitted. Please try again or contact us on WhatsApp." },
      { status: 500 }
    );
  }
}
