const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
    icon: { type: String },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", folderSchema);
