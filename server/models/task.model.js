const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "none"],
      default: "none",
    },
    dueDate: String,
    folderId: { type: String, required: true },
    userId: { type: String, required: true },
    labels: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
