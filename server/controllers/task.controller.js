const Task = require("../models/task.model");
const User = require("../models/user.model"); // adjust the path if needed

exports.getTasks = async (req, res) => {
  try {
    const { user_id } = req.params;
    const tasks = await Task.find({ userId: user_id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority = "none",
      dueDate,
      folderId,
      userId,
      labels = [],
    } = req.body;

    // 🔒 Check if userId exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User does not exist." });
    }

    const newTask = new Task({
      title,
      description,
      completed: false,
      priority,
      dueDate,
      folderId,
      userId,
      labels,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Task already exists in this folder for this user.",
      });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { _id, ...updates } = req.body;

    const updated = await Task.findByIdAndUpdate(
      _id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { _id } = req.body;

    const deleted = await Task.findByIdAndDelete(_id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
