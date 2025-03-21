const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const auth=require("../middleware/auth")

const router = express.Router();

const { getStats } = require("../controllers/statsController");

router.get("/", auth,getStats);

module.exports=router
