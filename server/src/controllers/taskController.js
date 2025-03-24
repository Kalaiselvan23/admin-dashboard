// const multer = require("multer");
// const csvParser = require("csv-parser");
// const fs = require("fs");
// const User = require("../models/User");
// const Task = require("../models/Task");
// const File = require("../models/File")

// const upload = multer({ dest: "uploads/" });

// exports.uploadCSV = async (req, res) => {
//   const filePath = req.file.path;
//   const results = [];

//   fs.createReadStream(filePath)
//     .pipe(csvParser())
//     .on("data", (data) => {
//       results.push(data);
//     })
//     .on("end", async () => {
//       try {
//         const agents = await User.find({ role: "agent" });
//         if (agents.length === 0) return res.status(400).json({ message: "No agents found!" });

//         let index = 0;
//         for (const item of results) {
//           const assignedTo = agents[index % agents.length]._id;
//           await new Task({ ...item, assignedTo }).save();
//           index++;
//         }

//         await new File({ filename: req.file.originalname }).save();

//         fs.unlinkSync(filePath);
//         res.json({ message: "CSV uploaded and distributed successfully!" });
//       } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Server error" });
//       }
//     });
// };

// exports.getDistributedTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find().populate("assignedTo", "name email");

//     const formattedTasks = tasks.map(task => ({
//       id: task._id,
//       agentName: task.assignedTo ? task.assignedTo.name : "Unassigned",
//       agentEmail: task.assignedTo ? task.assignedTo.email : "N/A",
//       firstName: task.firstName,
//       phone: task.phone,
//       notes: task.notes,
//       assignedAt: task._id.getTimestamp(),
//       status:task.status,
//     }));

//     res.json(formattedTasks);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const User = require("../models/User");
const Task = require("../models/Task");
const File = require("../models/File");

const upload = multer({ dest: "uploads/" });

const moment = require("moment");


exports.uploadCSV = async (req, res) => {
  const filePath = req.file.path;
  const results = [];
  const adminId = req.user.id;

  try {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      fs.unlinkSync(filePath);
      return res.status(403).json({ message: "Only admins can upload tasks" });
    }

    let agents = await User.find({ _id: { $in: admin.agentsManaged } }).lean();
    if (agents.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "No agents managed by this admin!" });
    }

    const agentTaskCounts = await Task.aggregate([
      { $match: { assignedTo: { $in: agents.map(a => a._id) } } },
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } }
    ]);

    const agentMap = {};
    agents.forEach(agent => {
      agentMap[agent._id] = agentTaskCounts.find(a => a._id.equals(agent._id))?.count || 0;
    });

    agents.sort((a, b) => agentMap[a._id] - agentMap[b._id]);

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          if (results.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: "No tasks found in the CSV!" });
          }

          for (const item of results) {
            const parsedDeadline = item.deadline ? new Date(item.deadline.split("/").reverse().join("-")) : null;
            if (!parsedDeadline || isNaN(parsedDeadline)) {
              console.error(`Invalid deadline format: ${item.deadline}`);
              continue;
            }

            const assignedTo = agents[0]._id;

            const newTask = await new Task({
              ...item,
              deadline: parsedDeadline,
              assignedTo,
            }).save();

            agentMap[assignedTo] += 1;

            agents.sort((a, b) => agentMap[a._id] - agentMap[b._id]);

            await User.findByIdAndUpdate(assignedTo, { $push: { tasksAssigned: newTask._id } });
          }

          await new File({ filename: req.file.originalname }).save();

          fs.unlinkSync(filePath);

          res.json({ message: "CSV uploaded and tasks distributed successfully!" });
        } catch (error) {
          console.error(error);
          if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
          res.status(500).json({ message: "Server error", error: error.message });
        }
      });
  } catch (error) {
    console.error(error);
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDistributedTasks = async (req, res) => {
  const adminId = req.user.id;
  if (!adminId)
    return res.status(400).json({ message: "Admin ID is required" });

  try {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const agents = await User.find({
      _id: { $in: admin.agentsManaged },
    }).select("name email");

    if (agents.length === 0) {
      return res
        .status(404)
        .json({ message: "No agents managed by this admin!" });
    }

    const agentsWithTasks = await Promise.all(
      agents.map(async (agent) => {
        const tasks = await Task.find({ assignedTo: agent._id }).select(
          "taskName notes status"
        );
        return {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          taskCount: tasks.length,
          tasks: tasks,
        };
      })
    );

    res.json(agentsWithTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
