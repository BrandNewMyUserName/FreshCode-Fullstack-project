// Імпортуємо необхідні модулі
const express = require('express'); // Для створення веб-сервера
const bodyParser = require('body-parser'); // Для парсингу JSON у тілі запиту
const fs = require('fs'); // Для роботи з файловою системою (читання/запис файлів)
const cors = require('cors'); // Для обробки запитів з різних доменів (CORS)

// Створюємо екземпляр додатка Express
const app = express();

// Використовуємо middleware для парсингу JSON у запитах
app.use(bodyParser.json());

// Використовуємо middleware для підтримки CORS
app.use(cors());

// Шлях до файлу, в якому зберігаються завдання
const tasksFile = './tasks.json';

// Читання завдань з файлу
app.get('/tasks', (req, res) => {
    fs.readFile(tasksFile, (err, data) => {
        if (err) res.status(500).send('Error reading tasks.'); // Якщо сталася помилка при читанні, повертаємо помилку
        else res.json(JSON.parse(data)); // Якщо все гаразд, відправляємо завдання у вигляді JSON
    });
});

// Додавання нового завдання
app.post('/tasks', (req, res) => {
    // Створюємо нове завдання з унікальним ID, назвою та статусом "не виконано"
    const task = { id: Date.now(), name: req.body.name, time: new Date().toLocaleString('uk-UA'), completed: false };

    // Читаємо існуючі завдання з файлу
    fs.readFile(tasksFile, (err, data) => {
        const tasks = err ? [] : JSON.parse(data); // Якщо помилка, створюємо порожній масив
        tasks.push(task); // Додаємо нове завдання
        // Записуємо оновлений список завдань назад у файл
        fs.writeFile(tasksFile, JSON.stringify(tasks), () => res.json(task)); // Відправляємо нове завдання у відповіді
    });
});

// Оновлення існуючого завдання
app.put('/tasks/:id', (req, res) => {
    // Читаємо завдання з файлу
    fs.readFile(tasksFile, (err, data) => {
        const tasks = JSON.parse(data); // Парсимо існуючі завдання
        const task = tasks.find(t => t.id == req.params.id); // Шукаємо завдання за ID
        if (task) {
            task.completed = req.body.completed; // Оновлюємо статус виконання завдання
            // Записуємо оновлений список завдань
            fs.writeFile(tasksFile, JSON.stringify(tasks), () => res.json(task)); // Відправляємо оновлене завдання
        } else res.status(404).send('Task not found.'); // Якщо завдання не знайдено, повертаємо помилку
    });
});

// Видалення завдання
app.delete('/tasks/:id', (req, res) => {
    // Читаємо завдання з файлу
    fs.readFile(tasksFile, (err, data) => {
        let tasks = JSON.parse(data); // Парсимо існуючі завдання
        tasks = tasks.filter(t => t.id != req.params.id); // Видаляємо завдання за ID
        // Записуємо оновлений список завдань без видаленого
        fs.writeFile(tasksFile, JSON.stringify(tasks), () => res.sendStatus(204)); // Відправляємо статус 204 (без контенту)
    });
});

// Запускаємо сервер на порту 3000
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
