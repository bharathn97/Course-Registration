import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { feedback } = req.body;
    const { StudentID, CourseCode } = req.query;

    try {
      // Find the course based on CourseCode
      const course = await Course.findOne({ CourseCode });

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      // Create a new object for the student and push it to the courseFeedback array
      course.courseFeedback.push({ studentID: StudentID, feedback });

      // Save the updated course
      const updatedCourse = await course.save();

      res.status(200).json({ success: true, data: updatedCourse });
    } catch (error) {
      console.error("Error updating course feedback:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
