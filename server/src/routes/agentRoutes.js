const express = require("express");
const { addAgent, getAllAgents, getAgentById, deleteAgent } = require("../controllers/agentController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/add", addAgent);
router.get("/",getAllAgents);
router.get("/:id",getAgentById);
router.delete("/:id",deleteAgent)

module.exports = router;
