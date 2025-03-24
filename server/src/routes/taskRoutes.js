const express = require("express");
const { uploadCSV, getDistributedTasks } = require("../controllers/taskController");
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload",auth,upload.single("file"), uploadCSV);
router.get("/distributed",auth, getDistributedTasks);
module.exports = router;
