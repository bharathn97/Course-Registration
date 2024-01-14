import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'DELETE') {
    const { CourseCode } = req.body;
    try {
      const course = await Course.findOne({ "CourseCode": CourseCode });
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      const { enrolledStudents, instructor } = course;
      res.status(200).json({ success: true, enrolledStudents, instructor });
      const result = await Course.deleteOne({ "CourseCode": CourseCode });
//Just remove the course from the COurses database with help of COurse code as the identifier
      if (result.deletedCount === 1) {
        console.log(`Course deleted successfully: ${CourseCode}`);
      } else {
        console.error('Error deleting course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}

export default connectDb(handler);
