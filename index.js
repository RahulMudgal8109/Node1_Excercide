const fs = require('fs');
const path = require('path');
const readline = require('readline');

// File where tasks will be stored
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to load tasks from the file
const loadTasks = () => {
  if (fs.existsSync(tasksFilePath)) {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
};

// Helper function to save tasks to the file
const saveTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
};

// Display menu
const displayMenu = () => {
  console.log('\nTask Manager');
  console.log('1. Add a new task');
  console.log('2. View tasks');
  console.log('3. Mark task as complete');
  console.log('4. Remove task');
  console.log('5. Exit');
  rl.question('Choose an option: ', handleMenuChoice);
};

// Handle menu choice
const handleMenuChoice = (choice) => {
  switch (choice) {
    case '1':
      addTask();
      break;
    case '2':
      viewTasks();
      break;
    case '3':
      markTaskComplete();
      break;
    case '4':
      removeTask();
      break;
    case '5':
      rl.close();
      break;
    default:
      console.log('Invalid choice, please try again.');
      displayMenu();
  }
};

// Add a new task
const addTask = () => {
  rl.question('Enter task description: ', (taskDescription) => {
    const tasks = loadTasks();
    tasks.push({ description: taskDescription, completed: false });
    saveTasks(tasks);
    console.log('Task added successfully!');
    displayMenu();
  });
};

// View all tasks
const viewTasks = () => {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks available.');
  } else {
    console.log('\nTask List:');
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.description} [${task.completed ? 'Completed' : 'Incomplete'}]`);
    });
  }
  displayMenu();
};

// Mark task as complete
const markTaskComplete = () => {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks available.');
    displayMenu();
    return;
  }
  
  console.log('\nSelect a task to mark as complete:');
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.description}`);
  });

  rl.question('Enter task number: ', (taskNumber) => {
    const taskIndex = parseInt(taskNumber) - 1;
    if (taskIndex >= 0 && taskIndex < tasks.length) {
      tasks[taskIndex].completed = true;
      saveTasks(tasks);
      console.log('Task marked as complete.');
    } else {
      console.log('Invalid task number.');
    }
    displayMenu();
  });
};

// Remove a task
const removeTask = () => {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks available.');
    displayMenu();
    return;
  }

  console.log('\nSelect a task to remove:');
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.description}`);
  });

  rl.question('Enter task number to remove: ', (taskNumber) => {
    const taskIndex = parseInt(taskNumber) - 1;
    if (taskIndex >= 0 && taskIndex < tasks.length) {
      tasks.splice(taskIndex, 1);
      saveTasks(tasks);
      console.log('Task removed successfully.');
    } else {
      console.log('Invalid task number.');
    }
    displayMenu();
  });
};

// Start the application
displayMenu();
