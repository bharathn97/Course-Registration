import Faculty from "../../models/Faculty";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { FacultyID, CourseCode } = req.query;

      // Check if 'FacultyID' is provided
      if (!FacultyID) {
        return res.status(400).json({ error: "Missing 'FacultyID' parameter" });
      }

      // Check if 'CourseCode' is provided
      if (!CourseCode) {
        return res.status(400).json({ error: "Missing 'CourseCode' parameter" });
      }

      // Update the faculty document to add the CourseCode to assignedCourses
      const updatedFaculty = await Faculty.findOneAndUpdate(
        { "staffID": FacultyID },
        { $addToSet: { "assignedcourses": CourseCode } },
        { new: true,projection:{email:1} } // Return the updated document
      );
//Add the course code to the faculty assigned course array once approved by the amdin with teh help of staff ID
      if (!updatedFaculty) {
        return res.status(404).json({ error: "Faculty not found" });
      }

      res.status(200).json(updatedFaculty);
    } catch (error) {
      console.error("Error updating faculty:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
