import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Extract the 'StudentID' query parameter from req.query
      const { StudentID } = req.query;

      // Check if 'StudentID' is provided
      if (!StudentID) {
        return res.status(400).json({ error: "Missing 'Student ID' parameter" });
      }
//Get only those ocurses in which the studnet ID is presnet in the neorlled ocurse
      const courses = await Course.find({ enrolledStudents: { $in: [StudentID] } });

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
