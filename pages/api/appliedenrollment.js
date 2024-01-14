import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";



const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      // Extract the 'CourseCode' query parameter from req.query
      const { CourseCode } = req.query;

      // Check if 'CourseCode' is provided
      if (!CourseCode) {
        return res.status(400).json({ error: "Missing 'CourseCode' parameter" });
      }

      // Extract enrolledStudentIDs and appliedStudentIDs from req.body
      const { enrolledStudentIDs, appliedStudentIDs } = req.body;

      // Check if the required data is provided
      if (enrolledStudentIDs === undefined || appliedStudentIDs === undefined) {
        return res.status(400).json({ error: "Missing required data in the request body" });
      }

      // Update the course and get the modified document
      const updatedCourse = await Course.findOneAndUpdate(
        { "CourseCode": CourseCode },
        { $set: { "enrolledStudents": enrolledStudentIDs || [], "appliedStudents": appliedStudentIDs || [] } },
        { new: true }
      );

      if (!updatedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.status(200).json({ success: "Successfully Course Updated", data: updatedCourse });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(400).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
