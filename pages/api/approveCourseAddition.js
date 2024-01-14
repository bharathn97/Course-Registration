// Import necessary modules
import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { CourseCode } = req.query;

      // Check if 'CourseCode' is provided
      if (!CourseCode) {
        return res.status(400).json({ error: "Missing 'CourseCode' parameter" });
      }

      // Update the course with the provided CourseCode
      const updatedCourse = await Course.findOneAndUpdate(
        { CourseCode },
        { "additionstatus": 'success' },
        { new: true } // Return the updated document
      );
//To approve by admin just make the addition staus success once the admin clicks the approve button
      if (!updatedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }
      console.log(updatedCourse);
      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
