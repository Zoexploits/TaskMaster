const API_URL = 'https://task-manager-yh6f.onrender.com';

// Handle Registration
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'task-manager.html'; // Redirect to task manager page
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle Login
document.getElementById('login-Form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            window.location.href = 'task-manager.html'; // Redirect to task manager page
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle Task Management
document.getElementById('taskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskName = document.getElementById('title').value;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in first.');
            return;
        }

        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: taskName }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Task added successfully!');
            fetchTasks();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Fetch Tasks
async function fetchTasks() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const response = await fetch(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        data.tasks.forEach((task) => {
            const taskItem = document.createElement('div');
            taskItem.textContent = task.name;
            taskList.appendChild(taskItem);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fetch tasks on page load
fetchTasks();










// // Handle Login Form
// document.querySelector('#login-form')?.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//         alert('Login successful');
//         localStorage.setItem('token', data.token);
//         window.location.href = 'task-manager.html';
//     } else {
//         alert(data.message);
//     }
// });

// // Handle Sign-Up Form
// document.querySelector('#signup-form')?.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, email, password }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//         alert('Sign-up successful');
//         window.location.href = 'index.html';
//     } else {
//         alert(data.message);
//     }
// });
