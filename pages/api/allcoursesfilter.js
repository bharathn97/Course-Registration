import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";


const handler = async (req, res) => {
  if (req.method === "GET") {
    const { degree, branch, StudentID } = req.query;
   console.log("The degree is "+degree);
   console.log("The branch is "+branch);
   //Get those courses whose prerequisistes consist of the degree and branch and also the ones in which the studnet ID is not present in either
   //applied students and enrolled students this is required to display the vaialable courses to each studnet
    try {
      const courses = await Course.find({
        "prerequisites": {
          $elemMatch: {
            "prerequisitesDegree": degree,
            "prerequisitesBranch": branch,
          }
        },
        $and: [
          { "appliedStudents": { $nin: [StudentID] } },
          { "enrolledStudents": { $nin: [StudentID] } },
        ],
      });

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
