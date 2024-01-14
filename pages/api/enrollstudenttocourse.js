import Student from "../../models/Student";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { StudentID, CourseCode } = req.query;

      // Check if 'StudentID' is provided
      if (!StudentID) {
        return res.status(400).json({ error: "Missing 'StudentID' parameter" });
      }

      // Check if 'CourseCode' is provided
      if (!CourseCode) {
        return res.status(400).json({ error: "Missing 'CourseCode' parameter" });
      }

      // Update the student document to add the CourseCode to assignedCourses
      const updatedStudent = await Student.findOneAndUpdate(
        { "studentID": StudentID },
        { $addToSet: { "enrolledcourses": CourseCode } },
        { new: true } // Return the updated document
      );

      if (!updatedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json(updatedStudent);
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
