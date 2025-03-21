
const File=require("../models/File")
const User=require("../models/User")
const Task=require("../models/Task")
exports.getStats=async(req, res) => {
  try {
    const totalAgents = await User.countDocuments();
    const uploadedFiles = await File.countDocuments();
    const distributedItems = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });

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
    console.log(error)
    res.status(500).json({ error: "Error fetching stats" });
  }
}
