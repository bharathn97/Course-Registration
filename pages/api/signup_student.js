import Student from "../../models/Student"; // Assuming Student is your mongoose model for students
import connectDb from "../../middleware/mongoose";
const CryptoJS = require("crypto-js");
require('dotenv').config();

const handler = async (req, res) => {
  try {
    // Check if the request method is POST
    if (req.method === "POST") {
      // Destructure relevant fields from the request body
      const { name, email, password, department, programType, sem, studentID, CGPA, TotalCredits } = req.body;

      // Create a new Student instance with encrypted password
      let student = new Student({
        name,
        email,
        password: CryptoJS.AES.encrypt(password,process.env.SECRET).toString(),
        department,
        programType,
        sem,
        studentID,
        CGPA,
        TotalCredits,
      });

      // Save the student to the database
      await student.save();

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
