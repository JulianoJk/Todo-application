const Folder = require("../models/folder.model");

exports.getFolders = async (req, res) => {
  try {
    const { user_id } = req.params;
    const folders = await Folder.find({ userId: user_id });
    const formatted = folders.map((folder) => ({
      ...folder.toObject(),
      id: folder._id,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createFolder = async (req, res) => {
  try {
    const { name, color, icon, userId } = req.body;
    const newFolder = new Folder({ name, color, icon, userId });
    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFolder = async (req, res) => {
  try {
    const { folderId, ...updates } = req.body;
    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedFolder)
      return res.status(404).json({ message: "Folder not found" });
    res.json(updatedFolder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.body;
    const deleted = await Folder.findByIdAndDelete(folderId);
    if (!deleted) return res.status(404).json({ message: "Folder not found" });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
