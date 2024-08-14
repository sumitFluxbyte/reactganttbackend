const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
let tasks  = require('./data');

const adjustRandomTaskDate = (tasks) => {
    const intervalInDays = Math.floor(Math.random() * 5) + 2;
    const interval = intervalInDays * 24 * 60 * 60 * 1000;
    const randomIndex = Math.floor(Math.random() * tasks.length);
    const updatedTasks = [...tasks];
    const selectedTask = updatedTasks[randomIndex];
    const startDate = new Date(selectedTask.startDate);
    const endDate = new Date(selectedTask.endDate);
    const newStartDate = new Date(startDate.getTime() + interval);
    let newEndDate = new Date(newStartDate.getTime() + (endDate - startDate));
    const maxDuration = 5 * 24 * 60 * 60 * 1000;
    if (newEndDate.getTime() > newStartDate.getTime() + maxDuration) {
      newEndDate = new Date(newStartDate.getTime() + maxDuration);
    }
    updatedTasks[randomIndex] = {
      ...selectedTask,
      startDate: newStartDate.toISOString(),
      endDate: newEndDate.toISOString(),
    };
    console.log(`Task ${updatedTasks[randomIndex].taskId} updated:`, updatedTasks[randomIndex]);
    return updatedTasks;
};

// Use CORS
app.use(cors("*"));

// Default route
app.get('/', (req, res) => res.send('Hello World!'));

// Update tasks every second
setInterval(() => {
    tasks = adjustRandomTaskDate(tasks);
}, 1000);

// Serve updated tasks data
app.get('/tasks', (req, res) => res.json(tasks));

// Start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
