const redisClient = require("../config/redisClient");
const Task = require("../models/task");

exports.addTask = async (task) => {
  try {
    // Retrieve tasks from Redis
    const redisData = await new Promise((resolve, reject) => {
      redisClient.get(process.env.REDIS_KEY, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });

    let tasks = [];

    if (redisData) {
      try {
        tasks = JSON.parse(redisData);
      } catch (parseError) {
        console.error("Error parsing JSON from Redis:", parseError);
        tasks = [];
      }
    }

    // Add the new task to the list
    tasks.push(task);

    // Store the updated list in Redis
    await new Promise((resolve, reject) => {
      redisClient.set(process.env.REDIS_KEY, JSON.stringify(tasks), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Check if the task count exceeds the threshold
    if (tasks.length > 50) {
      // Prepare tasks for bulk insertion into MongoDB
      const bulkTasks = tasks.map((task) => ({ content: task }));

      // Insert tasks into MongoDB
      await Task.insertMany(bulkTasks);

      // Clear the tasks from Redis
      await new Promise((resolve, reject) => {
        redisClient.del(process.env.REDIS_KEY, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

exports.fetchAllTasks = async (req, res) => {
  try {
    // // Clear the tasks from Redis
    // await new Promise((resolve, reject) => {
    //   redisClient.del(process.env.REDIS_KEY, (err) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });

    // await Task.deleteMany({});
    // console.log("All tasks have been deleted.");

    // Attempt to fetch tasks from Redis
    const redisData = await new Promise((resolve, reject) => {
      redisClient.get(process.env.REDIS_KEY, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });

    // Handle the case where the data might be undefined or not a valid JSON string
    let tasks = [];
    if (redisData) {
      try {
        tasks = JSON.parse(redisData);
      } catch (parseError) {
        console.error("Error parsing JSON from Redis:", parseError);
        tasks = [];
      }
    }

    // Fetch tasks from MongoDB
    const dbTasks = await Task.find({});
    tasks = tasks.concat(dbTasks.map((task) => task.content));

    // Send the response with all tasks
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send(error.toString());
  }
};
