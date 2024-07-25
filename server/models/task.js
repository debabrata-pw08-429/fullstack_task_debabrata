const mongoose = require("../config/db");

const taskSchema = new mongoose.Schema({
  content: String,
});

const Task = mongoose.model(process.env.MONGO_COLLECTION, taskSchema);

module.exports = Task;
