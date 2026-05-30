// Import required modules
const express = require('express');

// Create an Express application
const app = express();

app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// In-memory data storage (no database)
// Each task now has: id, name, deadline, priority, completed
let tasks = [
    { 
        id: 1, 
        name: 'Complete C237 homework', 
        deadline: '2026-06-01',
        priority: 'high',
        completed: false 
    },
    { 
        id: 2, 
        name: 'Buy mouse and keyboard', 
        deadline: '2026-05-31',
        priority: 'medium',
        completed: false 
    },
    { 
        id: 3, 
        name: 'Study for exams', 
        deadline: '2026-05-30',
        priority: 'low',
        completed: true 
    }
];

let nextId = 4;

// Helper function to get priority badge color
function getPriorityColor(priority) {
    switch(priority) {
        case 'high': return 'danger';
        case 'medium': return 'warning';
        case 'low': return 'success';
        default: return 'secondary';
    }
}

// Helper function to get priority icon
function getPriorityIcon(priority) {
    switch(priority) {
        case 'high': return '🔴';
        case 'medium': return '🟡';
        case 'low': return '🟢';
        default: return '⚪';
    }
}

// Make helpers available in all EJS templates
app.locals.getPriorityColor = getPriorityColor;
app.locals.getPriorityIcon = getPriorityIcon;

// Index (home page) - View all tasks
app.get('/', (req, res) => {
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];  
    res.render('index', { tasks, todayDate });
});


// View single task page - NEW ROUTE
app.get('/view/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        res.render('view', { task });
    } else {
        res.redirect('/');
    }
});

// Add task page - Show form
app.get('/additem', (req, res) => {
    res.render('additem');
});

// Add task - Handle form submission
app.post('/additem', (req, res) => {
    const { taskName, deadline, priority } = req.body;
    // Input validation (blank tasks cannot be added)
    if (taskName && taskName.trim() !== '') {
        tasks.push({
            id: nextId++,
            name: taskName.trim(),
            deadline: deadline || '',
            priority: priority || 'medium',
            completed: false
        });
    }
    res.redirect('/');
});

// Delete a task
app.post('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== id);
    res.redirect('/');
});

// Mark task as completed / Undo
app.post('/toggle/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
    }
    res.redirect('/');
});

// Edit task page - Show edit form
app.get('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        res.render('edit', { task });
    } else {
        res.redirect('/');
    }
});

// Update task - Handle edit submission
app.post('/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { taskName, deadline, priority } = req.body;
    const task = tasks.find(t => t.id === id);
    if (task && taskName && taskName.trim() !== '') {
        task.name = taskName.trim();
        task.deadline = deadline || '';
        task.priority = priority || 'medium';
    }
    res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});