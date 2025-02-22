const mongoose = require("mongoose");

const UserDocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cnic: { type: String, required: true, unique: true },
  userType: { type: String, enum: ["Employee", "Student"], required: true },
  salarySlip: { type: String, default: "" },
  cnicDocument: { type: String, required: true },
  bankStatement: { type: String, default: "" },
  studentId: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("UserDocument", UserDocumentSchema);
