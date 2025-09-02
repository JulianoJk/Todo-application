const express = require("express");
const router = express.Router();
const {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} = require("../controllers/folder.controller");
const auth = require("../middleware/auth.middleware");

router.get("/get/:user_id", auth, getFolders);
router.post("/add", auth, createFolder);
router.put("/update", auth, updateFolder);
router.delete("/delete", auth, deleteFolder);

module.exports = router;
