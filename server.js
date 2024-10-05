// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MySQL using Sequelize
const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  logging: false, // Disable Sequelize logs if not needed
});

// Define the Task model (this maps to a MySQL table)
const Task = sequelize.define('Task', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sync the model with the database
// `force: false` ensures the table is created if it doesn't exist without dropping it if it already exists.
sequelize.sync({ alter: true })  // `alter: true` ensures the table structure is updated without dropping data
  .then(() => {
    console.log("Tables have been created or updated.");
  })
  .catch((err) => {
    console.error("Unable to sync the database:", err);
  });

// Routes remain the same

// Home route - fetch tasks from MySQL
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.render('index', { tasks: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching tasks');
  }
});

// Add task to MySQL
app.post('/addtask', async (req, res) => {
  try {
    await Task.create({ name: req.body.newtask });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding task');
  }
});

// Remove task from MySQL
app.post('/removetask', async (req, res) => {
  try {
    const taskToRemove = req.body.task;
    await Task.destroy({ where: { name: taskToRemove } });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error removing task');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
