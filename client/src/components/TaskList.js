import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import io from "socket.io-client";
import axios from "axios";

const socket = io(process.env.REACT_APP_BACKEND_URL);

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/fetchAllTasks`)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));

    socket.on("add", (task) => setTasks((prevTasks) => [...prevTasks, task]));

    return () => {
      socket.off("add");
    };
  }, []);

  const addTask = () => {
    setTasks((prevTasks) => [...prevTasks, newTask]);

    if (newTask.trim()) {
      socket.emit("add", newTask);
      setNewTask("");
    }
  };

  return (
    <div className="note-app">
      <header className="note-app-header">
        <img
          src="https://i.pinimg.com/originals/b6/cd/e8/b6cde81d1c489b0e20d85a6e06c5f8f9.png"
          alt="App Icon"
          className="app-icon"
        />
        <h1 className="app-title">Note App</h1>
      </header>

      <div className="new-note-input">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          type="text"
          placeholder="New Note..."
        />
        <button className="add-button" onClick={addTask}>
          <FaCirclePlus />
          Add
        </button>
      </div>

      <div className="notes-list-heading">Notes</div>

      <div className="notes-list">
        {tasks.map((task, index) => (
          <div className="note" key={index}>
            {task}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
