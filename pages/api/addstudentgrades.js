import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    const { CourseCode } = req.query;
    const { updatedGradesStructure } = req.body;
    const { StudentID } = req.query;

    try {
      // Find the course by CourseCode
      const course = await Course.findOne({ CourseCode });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Check if there's an existing student grade entry with the provided studentID
      const existingStudentGrade = course.courseGrade.find(grade => grade.studentID === StudentID);

      if (existingStudentGrade) {
        // If a student grade entry exists, update the grades for the exams
        updatedGradesStructure.forEach(exam => {
          const existingExamIndex = existingStudentGrade.grade.findIndex(
            grade => grade.examName === exam.examName
          );

          if (existingExamIndex !== -1) {
            // If the exam already exists, update its details
            existingStudentGrade.grade[existingExamIndex] = {
              examName: exam.examName,
              maxMarks: exam.maxMarks,
              weightage: exam.weightage,
              marksObtained: exam.marksObtained,
            };
          } else {
            // If the exam doesn't exist, add a new object to the grade array
            existingStudentGrade.grade.push({
              examName: exam.examName,
              maxMarks: exam.maxMarks,
              weightage: exam.weightage,
              marksObtained: exam.marksObtained,
            });
          }
        });
      } else {
        // If no existing student grade entry is found, create a new entry
        const newStudentGradeEntry = {
          studentID: StudentID,
          grade: updatedGradesStructure.map(exam => ({
            examName: exam.examName,
            maxMarks: exam.maxMarks,
            weightage: exam.weightage,
            marksObtained: exam.marksObtained,
          })),
        };

        course.courseGrade.push(newStudentGradeEntry);
      }

      // Save the updated course
      await course.save();

      res.status(200).json({ success: true, message: 'Exam grades added/updated successfully' });
    } catch (error) {
      console.error('Error adding/updating exam grades:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
