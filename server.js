const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB (replace with your MongoDB credentials if needed)


// Ensure this is using 'mongo' as the host
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/todoDB';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
// Define the task schema
const taskSchema = new mongoose.Schema({
    name: String
});

// Create a model based on the schema
const Task = mongoose.model('Task', taskSchema);

// Home route - fetch tasks from MongoDB
app.get('/', (req, res) => {
    Task.find({}, (err, tasks) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', { tasks: tasks });
        }
    });
});

// Add task to MongoDB
app.post('/addtask', (req, res) => {
    const newTask = new Task({
        name: req.body.newtask
    });
    newTask.save((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

// Remove task from MongoDB
app.post('/removetask', (req, res) => {
    const taskToRemove = req.body.task;
    Task.deleteOne({ name: taskToRemove }, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
