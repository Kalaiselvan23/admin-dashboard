// const User = require("../models/User");

// exports.addAgent = async (req, res) => {
//   const { name, email, mobile, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "Email already in use" });

//     const newUser = new User({name, email, mobile, password, role: "agent" });
//     await newUser.save();
//     res.json({ message: "Agent created successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// exports.getAllAgents = async (req, res) => {
//   try {
//     const agents = await User.find({ role: "agent" }).select("-password");
//     res.json(agents);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// exports.getAgentById = async (req, res) => {
//   try {
//     const agent = await User.findById(req.params.id).select("-password");
//     if (!agent || agent.role !== "agent") {
//       return res.status(404).json({ message: "Agent not found" });
//     }
//     res.json(agent);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// exports.updateAgentById = async (req, res) => {
//   try {
//     const agent = await User.findById(req.params.id);

//     if (!agent || agent.role !== "agent") {
//       return res.status(404).json({ error: "Agent not found" });
//     }

//     const { name, email, mobile, status } = req.body;
//     if (name) agent.name = name;
//     if (email) agent.email = email;
//     if (mobile) agent.mobile = mobile;
//     if (status) agent.status = status;

//     await agent.save();

//     return res.status(200).json({ message: "Agent updated successfully", agent });
//   } catch (error) {
//     console.error("Update error:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// exports.deleteAgent = async (req, res) => {
//   try {
//     const agent = await User.findById(req.params.id);
//     if (!agent || agent.role !== "agent") {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     await agent.deleteOne();
//     res.json({ message: "Agent deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


const User = require("../models/User");
exports.addAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newAgent = new User({
      name,
      email,
      mobile,
      password,
      role: "agent",
      managedBy: req.user.id,
    });

    await newAgent.save();

    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.agentsManaged.push(newAgent._id); 
    await admin.save();

    res.json({ message: "Agent created successfully", agent: newAgent });
  } catch (error) {
    console.error("Error adding agent:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getAllAgents = async (req, res) => {
  try {

    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const agents = await User.find({ role: "agent", managedBy: req.user.id }).select("-password");
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateAgentById = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const agent = await User.findOne({ _id: req.params.id, managedBy: req.user.id });
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    const { name, email, mobile, status } = req.body;
    if (name) agent.name = name;
    if (email) agent.email = email;
    if (mobile) agent.mobile = mobile;
    if (status) agent.status = status;

    await agent.save();
    res.json({ message: "Agent updated successfully", agent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const agent = await User.findOne({ _id: req.params.id, managedBy: req.user.id });
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    await agent.deleteOne();
    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agent ID format" });
    }

    const agent = await User.findById(id).select("-password");

    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
