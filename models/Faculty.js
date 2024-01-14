const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  staffID: { type: String, required: true, unique: true },
  assignedcourses: { type: [String], default: null }, // Default value set to null
}, { timestamps: true });

mongoose.models = {};
export default mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema);
