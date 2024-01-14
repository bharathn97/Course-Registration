import Faculty from "../../models/Faculty";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const { CourseCode, StaffID } = req.query;

    try {
      const result = await Faculty.updateOne(
        { "staffID": StaffID },
        { $pull: { "assignedcourses": CourseCode } }
      );

      if (result.nModified === 1) {
        res.status(200).json({ success: true, message: 'Course removed from faculty successfully' });
      } else if (result.n === 0) {
        res.status(404).json({ success: false, message: 'Faculty not found' });
      } else {
        res.status(404).json({ success: false, message: 'Course not found in the enrolled courses of the faculty' });
      }
    } catch (error) {
      console.error('Error removing faculty from course:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
