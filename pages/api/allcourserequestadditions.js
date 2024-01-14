import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Extract the 'instructor' query parameter from req.query
      const { instructor } = req.query;

      // Check if 'instructor' is provided
      if (!instructor) {
        return res.status(400).json({ error: "Missing 'instructor' parameter" });
      }
      const courses = await Course.find({ "instructor":instructor, "additionstatus": 'pending' });
//Fetch all the courses whose addition status is pending and belonging to that particular instructor identitied by the staff iD
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
