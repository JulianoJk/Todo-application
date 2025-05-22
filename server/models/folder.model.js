const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
    icon: { type: String },
    userId: { type: String, required: true },
    isSystem: { type: Boolean, default: false },
    systemType: {
      type: String,
      enum: ["inbox", "today", "important"],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", folderSchema);
