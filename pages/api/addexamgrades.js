import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { CourseCode } = req.query;
    const { exams } = req.body;

    try {
      // Find the course by CourseCode
      const course = await Course.findOne({ CourseCode });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Update the course with the provided exams
      course.courseGrade = exams.map(exam => ({ studentID: null, grade: exam }));

      // Save the updated course
      await course.save();

      res.status(200).json({ success: true, message: 'Exam grades added successfully' });
    } catch (error) {
      console.error('Error adding exam grades:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
