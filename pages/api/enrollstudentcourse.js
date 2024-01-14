// Import necessary modules
import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { studentID } = req.query;
      const { courseCodes } = req.body; // Extract an array of course codes from the request body
      console.log(studentID)
      // Check if 'courseCodes' and 'studentID' are provided
      if (!courseCodes || !studentID) {
        return res.status(400).json({ error: "Missing 'courseCodes' or 'studentID' parameter" });
      }

      // Update all courses with the provided course codes
      const updatedCourses = await Course.updateMany(
        { CourseCode: { $in: courseCodes } },
        { $addToSet: { appliedStudents: studentID } },
        { new: true } // Return the updated documents
      );
//Add the studnetID to enrolled studnets list in the course data
      if (updatedCourses.nModified === 0) {
        return res.status(404).json({ error: "No courses found" });
      }

      console.log(updatedCourses);
      res.status(200).json(updatedCourses);
    } catch (error) {
      console.error("Error updating courses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
