import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  name: String,
  gender: String,
  college: String,
  course: String,
  year: String,
  dob: String,
  registrationDate: String,
  whatsapp: String
});

const Candidate = mongoose.model('Candidate', CandidateSchema);
export default Candidate;