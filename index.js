const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
let tasks  = require('./data');

const adjustRandomTaskDate = (tasks) => {
    // Select a random interval between 1 to 5 days (converted to milliseconds)
    const intervalInDays = Math.floor(Math.random() * 5) + 1;
    const interval = intervalInDays * 24 * 60 * 60 * 1000;

    // Select a random index within the tasks array
    const randomIndex = Math.floor(Math.random() * tasks.length);
  
    // Clone the tasks array to avoid mutating the original data
    const updatedTasks = [...tasks];
    
    // Get the selected task
    const selectedTask = updatedTasks[randomIndex];
    
    // Parse the start and end dates
    const startDate = new Date(selectedTask.startDate);
    const endDate = new Date(selectedTask.endDate);
    
    // Calculate the new start and end dates
    const newStartDate = new Date(startDate.getTime() + interval);
    
    // Ensure the duration does not exceed 5 days
    let newEndDate = new Date(newStartDate.getTime() + (endDate - startDate));
    const maxDuration = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
    
    if (newEndDate.getTime() > newStartDate.getTime() + maxDuration) {
      newEndDate = new Date(newStartDate.getTime() + maxDuration);
    }
    
    // Update the task with new dates
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

// Update tasks every 5 seconds
setInterval(() => {
    tasks = adjustRandomTaskDate(tasks);
}, 5000);

// Serve updated tasks data
app.get('/tasks', (req, res) => res.json(tasks));

// Start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
