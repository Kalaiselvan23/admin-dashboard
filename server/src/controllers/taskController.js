const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const User = require("../models/User");
const Task = require("../models/Task");
const File = require("../models/File")

const upload = multer({ dest: "uploads/" });


exports.uploadCSV = async (req, res) => {
  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (data) => {
      results.push(data);
    })
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

        await new File({ filename: req.file.originalname }).save();

        fs.unlinkSync(filePath);
        res.json({ message: "CSV uploaded and distributed successfully!" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
      }
    });
};

exports.getDistributedTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const formattedTasks = tasks.map(task => ({
      id: task._id,
      agentName: task.assignedTo ? task.assignedTo.name : "Unassigned",
      agentEmail: task.assignedTo ? task.assignedTo.email : "N/A",
      firstName: task.firstName,
      phone: task.phone,
      notes: task.notes,
      assignedAt: task._id.getTimestamp(),
      status:task.status,
    }));

    res.json(formattedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};