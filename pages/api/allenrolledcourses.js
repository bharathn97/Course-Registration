import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { StudentID } =req.query;
    try {
      const courses = await Course.find({
        appliedStudents: { $nin: [StudentID] },
        enrolledStudents: { $in: [StudentID] },
        "setCourseFeedBackForm": "false"
      });
//Get the ones in which studnet has actually enrolled
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
