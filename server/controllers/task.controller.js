const Task = require("../models/task.model");

exports.getTasks = async (req, res) => {
  try {
    const { user_id } = req.params;
    const tasks = await Task.find({ user_id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { name, user_id } = req.body;

    const newTask = new Task({
      name,
      user_id,
      completed: false,
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { _id, completed } = req.body;

    const updated = await Task.findByIdAndUpdate(_id, { completed }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { _id } = req.body;

    const deleted = await Task.findByIdAndDelete(_id);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
