const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  deadline: { type: Date, required: true },
  notes: { type: String },
  status:{type:String,enum:["pending","completed","progress"],default:"pending"},
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Task", TaskSchema);
