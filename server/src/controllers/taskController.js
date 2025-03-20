const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const User = require("../models/User");
const Task = require("../models/Task");

// Multer Storage
const upload = multer({ dest: "uploads/" });

// Upload & Distribute CSV
exports.uploadCSV = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access Denied!" });

  const filePath = req.file.path;
  const results = [];
  
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const agents = await User.find({ role: "agent" });
        if (agents.length === 0) return res.status(400).json({ message: "No agents found!" });

        let index = 0;
        for (const item of results) {
          const assignedTo = agents[index % agents.length]._id;
          await new Task({ ...item, assignedTo }).save();
          index++;
        }

        fs.unlinkSync(filePath);
        res.json({ message: "CSV uploaded and distributed successfully!" });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    });
};
