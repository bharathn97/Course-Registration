import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const { CourseCode } = req.query;
    const { StudentID } = req.query;
    try {
      const result = await Course.updateOne(
        { "CourseCode": CourseCode },
        { $pull: { "enrolledStudents": StudentID } }
      );
//Once dropped remove the student ID from the nerolled courses of that particualr course
      if (result.nModified === 1) {
        res.status(200).json({ success: true, message: 'Student removed from course successfully' });
      } else if (result.n === 0) {
        res.status(404).json({ success: false, message: 'Course not found' });
      } else {
        res.status(404).json({ success: false, message: 'Student not found in the enrolled students of the course' });
      }
    } catch (error) {
      console.error('Error removing student from course:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
