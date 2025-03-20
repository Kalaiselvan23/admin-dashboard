const express = require("express");
const { uploadCSV } = require("../controllers/taskController");
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", auth, upload.single("file"), uploadCSV);

module.exports = router;
