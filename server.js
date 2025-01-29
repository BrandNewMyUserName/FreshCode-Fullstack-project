const express = require('express'); 
const bodyParser = require('body-parser'); 
const fs = require('fs'); 
const cors = require('cors'); 
const app = express();

app.use(bodyParser.json());
app.use(cors());
const tasksFile = './tasks.json';

app.get('/tasks', (req, res) => {
    fs.readFile(tasksFile, (err, data) => {
        if (err) res.status(500).send('Error reading tasks.'); 
        else res.json(JSON.parse(data)); 
    });
});

app.post('/tasks', (req, res) => {
    const task = { id: Date.now(), name: req.body.name, time: new Date().toLocaleString('uk-UA'), completed: false };

    fs.readFile(tasksFile, (err, data) => {
        const tasks = err ? [] : JSON.parse(data); 
        tasks.push(task); 
        fs.writeFile(tasksFile, JSON.stringify(tasks), () => res.json(task)); 
    });
});


app.put('/tasks/:id', (req, res) => {

    fs.readFile(tasksFile, (err, data) => {
        const tasks = JSON.parse(data); 
        const task = tasks.find(t => t.id == req.params.id); 
        if (task) {
            task.completed = req.body.completed; ь
            fs.writeFile(tasksFile, JSON.stringify(tasks), () => res.json(task)); 
        } else res.status(404).send('Task not found.'); 
    });
});


app.delete('/tasks/:id', (req, res) => {

    fs.readFile(tasksFile, (err, data) => {
        let tasks = JSON.parse(data); 
        tasks = tasks.filter(t => t.id != req.params.id); 

        fs.writeFile(tasksFile, JSON.stringify(tasks), () => res.sendStatus(204));
    });
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
