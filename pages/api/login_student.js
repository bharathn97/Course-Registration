import Student from "../../models/Student";
import connectDb from "../../middleware/mongoose";
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
require('dotenv').config();

const handler = async (req, res) => {
  // Check if the request method is POST
  if (req.method === "POST") {
    // Log the request body
    console.log(req.body);

    // Find student by email
    let student = await Student.findOne({ "email": req.body.email });

    // Check if student with given email exists
    if (student) {
      // Decrypt student password
      const bytes = CryptoJS.AES.decrypt(student.password, process.env.SECRET);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      console.log(originalText);

      // Check if provided credentials match student details
      if (req.body.email === student.email && req.body.password === originalText) {
        // Generate JWT token
        var token = jwt.sign({ email: student.email, name: student.name },process.env.TOKEN_SECRET, { expiresIn: "2d" });
        const email = student.email;
        const studentID = student.studentID;

        // Log the email and respond with success and token
        console.log(email);
        res.status(200).json({ success: true, token, email, studentID });
      } else {
        // Respond with invalid credentials error
        res.status(200).json({ success: false, error: "Invalid Credentials" });
      }
    } else {
      // Respond with student not found error
      res.status(200).json({ success: false, error: "No student found" });
    }
  } else {
    // Respond with bad request error for non-POST requests
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
