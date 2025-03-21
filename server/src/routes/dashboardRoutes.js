const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const router = express.Router();

const { getStats } = require("../controllers/statsController");

router.get("/", getStats);

module.exports=router
