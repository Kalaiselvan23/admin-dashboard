
// const File=require("../models/File")
// const User=require("../models/User")
// const Task=require("../models/Task")
// exports.getStats=async(req, res) => {
//   try {
//     const totalAgents = await User.countDocuments();
//     const uploadedFiles = await File.countDocuments();
//     const distributedItems = await Task.countDocuments();
//     const completedTasks = await Task.countDocuments({ status: "completed" });

//     const completionRate = distributedItems
//       ? ((completedTasks / distributedItems) * 100).toFixed(1) + "%"
//       : "0%";

//     res.json({
//       totalAgents,
//       uploadedFiles, 
//       distributedItems,
//       completionRate,
//     });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: "Error fetching stats" });
//   }
// }


const File = require("../models/File");
const User = require("../models/User");
const Task = require("../models/Task");

exports.getStats = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });
  const adminId=req.user.id;
  if (!adminId) return res.status(400).json({ message: "Admin ID is required" });
  
  try {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalAgents = await User.countDocuments({ _id: { $in: admin.agentsManaged } });

    const uploadedFiles = await File.countDocuments();

    const distributedItems = await Task.countDocuments({ assignedTo: { $in: admin.agentsManaged } });
    const completedTasks = await Task.countDocuments({ assignedTo: { $in: admin.agentsManaged }, status: "completed" });

    const completionRate = distributedItems
      ? ((completedTasks / distributedItems) * 100).toFixed(1) + "%"
      : "0%";

    res.json({
      totalAgents,
      uploadedFiles,
      distributedItems,
      completionRate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching stats" });
  }
};
