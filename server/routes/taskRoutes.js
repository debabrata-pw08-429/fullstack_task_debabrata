const express = require("express");
const { fetchAllTasks } = require("../controllers/taskController");

const router = express.Router();

router.get("/fetchAllTasks", fetchAllTasks);

module.exports = router;
