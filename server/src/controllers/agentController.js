const User = require("../models/User");

exports.addAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const newUser = new User({ name, email, mobile, password, role: "agent" });
    await newUser.save();
    res.json({ message: "Agent created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-password"); // Exclude password from response
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const agent = await User.findById(req.params.id).select("-password");
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.deleteAgent = async (req, res) => {
  try {
    const agent = await User.findById(req.params.id);
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found" });
    }

    await agent.deleteOne();
    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
