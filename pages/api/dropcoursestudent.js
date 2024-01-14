import Student from "../../models/Student";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const { CourseCode } = req.query;
    const { StudentID } = req.query;
    try {
      const result = await Student.updateOne(
        { "studentID": StudentID },
        { $pull: { "enrolledcourses": CourseCode } }
      );
//Once dropped remove the course  form the enrolled courses of the studnet databse
      if (result.nModified === 1) {
        res.status(200).json({ success: true, message: 'Course removed from student successfully' });
      } else if (result.n === 0) {
        res.status(404).json({ success: false, message: 'Student not found' });
      } else {
        res.status(404).json({ success: false, message: 'Course not found in the enrolled courses of the student' });
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
