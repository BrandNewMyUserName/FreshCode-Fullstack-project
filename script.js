async function fetchTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

        const taskText = document.createElement('span');
        taskText.textContent = task.name;
        taskItem.appendChild(taskText);

        const completeButton = document.createElement('button');
        completeButton.textContent = '✔';
        completeButton.onclick = async () => {
            await fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !task.completed })
            });
            fetchTasks();
        };
        taskItem.appendChild(completeButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✖';
        deleteButton.onclick = async () => {
            await fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: 'DELETE'
            });
            fetchTasks();
        };
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
    });
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');

    if (taskInput.value.trim() === '') {
        alert('Please enter a task.');
        return;
    }

    await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: taskInput.value })
    });

    taskInput.value = '';
    fetchTasks();
}

fetchTasks();
