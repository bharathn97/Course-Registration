import Student from "../../models/Student";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { StudentID } = req.query;

    try {
      // Find the student by ID
      const student = await Student.findOne({ "studentID":StudentID });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
