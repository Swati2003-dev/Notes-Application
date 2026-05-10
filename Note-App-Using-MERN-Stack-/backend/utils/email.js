import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (options) => {
  try {
    const payload = {
      sender: {
        name: "Notes Application",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: options.email,
        },
      ],
      subject: options.subject,
      textContent: options.message,
      htmlContent: options.html,
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Brevo email sent successfully:", response.data);
  } catch (error) {
    console.error("Brevo Email Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};
