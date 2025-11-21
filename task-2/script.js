document.addEventListener("DOMContentLoaded", () => {
    // Theme Toggle
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;
    const savedTheme = localStorage.getItem("theme") || "light";
    body.classList.toggle("dark-mode", savedTheme === "dark");
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDark = body.classList.contains("dark-mode");
        themeToggle.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    // Form Validation
    const form = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        if (nameInput.value.trim() === "") {
            showError("nameError", "Name is required");
            isValid = false;
        } else {
            clearError("nameError");
        }

        if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
            showError("emailError", "Please enter a valid email");
            isValid = false;
        } else {
            clearError("emailError");
        }

        if (isValid) {
            alert("Form Submitted Successfully!");
            form.reset();
        }
    });

    function showError(elementId, message) {
        const errorEl = document.getElementById(elementId);
        errorEl.innerText = message;
        errorEl.style.display = "block";
        errorEl.classList.add("shake"); // Trigger shake animation
        setTimeout(() => errorEl.classList.remove("shake"), 300);
    }

    function clearError(elementId) {
        const errorEl = document.getElementById(elementId);
        errorEl.style.display = "none";
    }

    // To-Do List with Persistence and Completion
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    // Load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTaskToDOM(task.text, task.completed));
    };

    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll("#taskList li").forEach(li => {
            tasks.push({
                text: li.firstChild.textContent,
                completed: li.classList.contains("completed")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const addTaskToDOM = (taskText, completed = false) => {
        const li = document.createElement("li");
        li.innerText = taskText;
        if (completed) li.classList.add("completed");

        // Toggle completion on click
        li.addEventListener("click", () => {
            li.classList.toggle("completed");
            saveTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent toggle on delete click
            if (confirm("Delete this task?")) {
                taskList.removeChild(li);
                saveTasks();
            }
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    };

    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }
        addTaskToDOM(taskText);
        saveTasks();
        taskInput.value = "";
    });

    // Allow Enter key to add tasks
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTaskBtn.click();
    });

    loadTasks(); // Load on page load
});