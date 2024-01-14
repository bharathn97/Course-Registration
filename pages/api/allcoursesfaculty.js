import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Extract the 'staffID' query parameter from req.query
      const { instructor } = req.query;

      // Check if 'staffID' is provided
      if (!instructor) {
        return res.status(400).json({ error: "Missing 'staffID' parameter" });
      }

      const courses = await Course.find({ "instructor":instructor ,"additionstatus":"success"});
     //Find all the courses whose course has been approved and the instructor is the particualr staff iD
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
