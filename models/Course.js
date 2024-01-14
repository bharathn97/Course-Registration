const mongoose = require('mongoose');

const CourseFeedbackSchema = new mongoose.Schema({
  studentID: { type: String, required: true },
  feedback: {
    instructorAvailability: { type: Number, default: null },
    realWorldExamples: { type: Number, default: null },
    relevantCourseContent: { type: Number, default: null },
    engagingActivities: { type: Number, default: null },
    fairAssessmentMethods: { type: Number, default: null },
    overallSatisfaction: { type: Number, default: null },
  },
});

const GradeSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  maxMarks: { type: Number, required: true },
  weightage: { type: Number, required: true },
  marksObtained: { type: Number, default: null },
});

const CourseSchema = new mongoose.Schema({
  CourseTitle: { type: String, default:null },
  CourseCode: { type: String, required: true, unique: true },
  instructor: { type: String, ref: 'Faculty', default: null },
  credits: { type: Number, default: 0},
  CourseRegDeadline: { type: Date, default: null },
  CourseDropDeadline: { type: Date, default: null },
  NoLectures: { type: Number, default: 0 },
  NoPracticals: { type: Number, default: 0 },
  CourseType:{type:String,default:"None"},
  RequiredCGPA:{type:Number,default:0},
  RequiredCredits:{type:Number,default:0},
  prerequisites: [{
   prerequisitesDegree: { type: String, enum: ['Mtech', 'Btech', 'Phd']},
   prerequisitesBranch: { type: String, enum: ['IT', 'CS', 'AI', 'CIVIL', 'MECH', 'EEE', 'ECE', 'META']},
 }],
 CreatedSlots: [{
   prerequisitesDegree: { type: String, enum: ['Mtech', 'Btech', 'Phd'] },
   prerequisitesBranch: { type: String, enum: ['IT', 'CS', 'AI', 'CIVIL', 'MECH', 'EEE', 'ECE', 'META'] },
   LectureSlots: [{
     day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
     time: { type: String, enum: ['8-9', '9-10', '10-11','11-12','12-1','1-2','2-3','3-4','4-5'] },
   }],
   PracticalSlots: [{
     day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
     time: { type: String, enum: ['8-9', '9-10', '10-11','11-12','12-1','1-2','2-3','3-4','4-5' ]},
   }],
 }],
  description: { type: String },
  additionstatus: { type: String, default: 'pending' },
  appliedStudents: { type: [String], default: null },
  enrolledStudents: { type: [String], default: null },
  setCourseFeedBackForm: { type: String, default: 'false' },
  courseFeedback: [CourseFeedbackSchema],
  courseGrade: [{
    studentID: { type: String },
    grade: {
      type: [GradeSchema],
    },
  }],
}, { timestamps: true });

mongoose.models = {};
export default mongoose.model('Course', CourseSchema) || mongoose.model.Course;
