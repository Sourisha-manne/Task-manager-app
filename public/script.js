const API_URL = "http://localhost:5000";


async function loadTasks() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/tasks/all`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        const tasks = await response.json();

        let output = "";

        tasks.forEach(task => {
            output += `
            <div class="task-card">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Status: ${task.status}</p>

                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="completeTask(${task.id})">Complete</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
            `;
        });

        document.getElementById("tasks").innerHTML = output;

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}


/* =========================
   REGISTER
========================= */
async function registerUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    alert(data.message);
}


/* =========================
   LOGIN
========================= */
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } else {
        alert(data.message);
    }
}


/* =========================
   ADD TASK
========================= */
async function addTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/api/tasks/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ title, description })
    });

    await loadTasks(); // 🔥 IMPORTANT REFRESH
}


/* =========================
   EDIT TASK
========================= */
async function editTask(id) {
    const newTitle = prompt("Enter new title");
    if (!newTitle) return;

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/api/tasks/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ title: newTitle })
    });

    await loadTasks();
}


/* =========================
   COMPLETE TASK
========================= */
async function completeTask(id) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/api/tasks/complete/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": token
        }
    });

    await loadTasks();
}


/* =========================
   DELETE TASK
========================= */
async function deleteTask(id) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/api/tasks/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    });

    await loadTasks();
}


/* =========================
   AUTO LOAD DASHBOARD
========================= */
if (window.location.pathname.includes("dashboard.html")) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    } else {
        loadTasks();
    }
}


/* =========================
   LOGOUT
========================= */
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}