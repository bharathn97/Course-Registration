import Faculty from "../../models/Faculty";
import connectDb from "../../middleware/mongoose";
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
require('dotenv').config();

const handler = async (req, res) => {
  // Check if the request method is POST
  if (req.method === "POST") {
    // Log the request body
    console.log(req.body);

    // Find faculty by email
    let faculty = await Faculty.findOne({ "email": req.body.email });

    // Check if faculty with given email exists
    if (faculty) {
      // Decrypt faculty password
      const bytes = CryptoJS.AES.decrypt(faculty.password, process.env.SECRET);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      console.log(originalText);

      // Check if provided credentials match faculty details
      if (req.body.email === faculty.email && req.body.password === originalText) {
        // Generate JWT token
        var token = jwt.sign({ email: faculty.email, name: faculty.name }, process.env.TOKEN_SECRET, { expiresIn: "2d" });
        const staffID = faculty.staffID;
        const email = faculty.email;

        // Respond with success and token
        res.status(200).json({ success: true, token, staffID, email });
      } else {
        // Respond with invalid credentials error
        res.status(200).json({ success: false, error: "Invalid Credentials" });
      }
    } else {
      // Respond with faculty not found error
      res.status(200).json({ success: false, error: "No faculty found" });
    }
  } else {
    // Respond with bad request error for non-POST requests
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
