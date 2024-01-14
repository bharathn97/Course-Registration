const mongoose = require('mongoose');



const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  programType: { type: String, required: true },
  studentID: { type: String, required: true, unique: true },
  sem: { type: Number, required: true },
  enrolledcourses: { type: [String], default: null },
  CGPA:{type:Number,default:0},
  TotalCredits:{type:Number,default:0},
}, { timestamps: true });

mongoose.models = {};
export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
