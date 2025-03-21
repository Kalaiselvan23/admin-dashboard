const express = require("express");
const { addAgent, getAllAgents, getAgentById, deleteAgent, updateAgentById } = require("../controllers/agentController");
const auth=require("../middleware/auth")


const router = express.Router();

router.post("/add",auth,addAgent);
router.get("/",getAllAgents);
router.get("/:id",getAgentById);
router.put("/:id",auth,updateAgentById);
router.delete("/:email",auth,deleteAgent)

module.exports = router;
