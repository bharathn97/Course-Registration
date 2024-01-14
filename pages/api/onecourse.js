import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {

      const { CourseCode } = req.query;

      // Check if 'staffID' is provided
      if (!CourseCode) {
        return res.status(400).json({ error: "Missing 'staffID' parameter" });
      }

      const courses = await Course.findOne({ "CourseCode":CourseCode });

      res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
