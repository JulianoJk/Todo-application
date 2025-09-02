const express = require("express");
const router = express.Router();
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask
} = require("../controllers/task.controller");
const auth = require("../middleware/auth.middleware");

router.get("/get/:user_id", auth, getTasks);
router.post("/add", auth, addTask);
router.put("/update", auth, updateTask);
router.delete("/delete", auth, deleteTask);

module.exports = router;
