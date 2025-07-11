import mongoose from "mongoose";
const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});
const College = mongoose.model('College', CollegeSchema);
export default College;