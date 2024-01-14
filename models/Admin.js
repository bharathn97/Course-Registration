const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });
mongoose.models={};
export default mongoose.models.Admin || mongoose.model("Admin",AdminSchema)
