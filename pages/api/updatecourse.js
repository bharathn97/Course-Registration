import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { CourseCode } = req.query;
      const courseData = req.body;

      if (!CourseCode) {
        return res.status(400).json({ error: "Missing 'CourseCode' parameter" });
      }

      // Exclude 'courseGrade' from the update
      const updatedCourse = await Course.findOneAndUpdate(
        { "CourseCode": CourseCode },
        { $set: { ...courseData, courseGrade: undefined } },
        { new: true }
      );

      if (!updatedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }

      // If there are new exams, update courseGrade accordingly
      if (courseData.exams && courseData.exams.length > 0) {
        courseData.exams.forEach((newExam) => {
          const existingGrade = updatedCourse.courseGrade.find(
            (grade) => grade.studentID === null && grade.grade.some((g) => g.examName === newExam.examName)
          );

          if (!existingGrade) {
            updatedCourse.courseGrade.push({
              studentID: null,
              grade: [
                {
                  examName: newExam.examName,
                  maxMarks: newExam.maxMarks,
                  weightage: newExam.weightage,
                  marksObtained: newExam.marksObtained,
                },
              ],
            });
          } else {
            // Update existing grade if necessary
            const existingExamIndex = existingGrade.grade.findIndex(
              (g) => g.examName === newExam.examName
            );
            if (existingExamIndex !== -1) {
              existingGrade.grade[existingExamIndex] = {
                examName: newExam.examName,
                maxMarks: newExam.maxMarks,
                weightage: newExam.weightage,
                marksObtained: newExam.marksObtained,
              };
            }
          }
        });
      }

      await updatedCourse.save();

      res.status(200).json({ success: "Successfully Course Updated", data: updatedCourse });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
