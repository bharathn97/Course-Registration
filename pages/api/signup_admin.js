import Admin from "../../models/Admin";
import connectDb from "../../middleware/mongoose";
const CryptoJS = require("crypto-js");
require('dotenv').config();

const handler = async (req, res) => {
  try {
    // Check if the request method is POST
    if (req.method === "POST") {
      // Destructure relevant fields from the request body
      const { name, email, password } = req.body;

      // Create a new Admin instance with encrypted password
      let admin = new Admin({
        name,
        email,
        password: CryptoJS.AES.encrypt(password,process.env.SECRET).toString(),
      });

      // Save the admin to the database
      await admin.save();

      // Respond with success status
      res.status(200).json({ success: "success" });
    } else {
      // Respond with bad request error for non-POST requests
      res.status(400).json({ error: "Bad Request" });
    }
  } catch (error) {
    // Log and respond with internal server error for exceptions
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler);
