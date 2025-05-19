let isUnlocked = false;
let allTasksVisible = false;

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.getElementById("sectionTitle").textContent = 
    id.charAt(0).toUpperCase() + id.slice(1);
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

function unlockTasks() {
  const password = document.getElementById("adminPass").value;
  if (password === "admin123") {
    isUnlocked = true;
    document.getElementById("taskPanel").classList.remove("hidden");
    document.getElementById("viewHideBtn").classList.remove("hidden");
    alert("Tasks unlocked!");
  } else {
    alert("Incorrect password!");
  }
}

function addTask() {
  if (!isUnlocked) {
    alert("Please unlock with the admin password first.");
    return;
  }

  const taskInput = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("prioritySelect").value;

  if (!taskInput) return;

  const li = document.createElement("li");
  li.className = "task-item";
  const taskId = Date.now(); // unique ID

  li.innerHTML = `
    <div class="task-content masked" id="task-${taskId}">${taskInput}</div>
    <div class="task-priority">${priority}</div>
    <div class="task-timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
    <div class="task-actions">
      <button onclick="toggleTask(${taskId})" title="View/Hide Task">👁️</button>
      <button onclick="deleteTask(this)" title="Delete Task">❌</button>
    </div>
  `;

  document.getElementById("taskList").appendChild(li);
  document.getElementById("taskInput").value = "";
}

function toggleTask(id) {
  const taskSpan = document.getElementById(`task-${id}`);
  taskSpan.classList.toggle("masked");
}

function deleteTask(button) {
  button.closest("li").remove();
}

function toggleAllTasks() {
  if (!isUnlocked) {
    alert("Please unlock with the admin password first.");
    return;
  }

  const tasks = document.querySelectorAll('.task-content');
  allTasksVisible = !allTasksVisible;

  tasks.forEach(task => {
    if (allTasksVisible) {
      task.classList.remove("masked");
    } else {
      task.classList.add("masked");
    }
  });

  document.getElementById("viewHideBtn").textContent = allTasksVisible ? "Hide All Tasks" : "View All Tasks";
}

function deleteAllTasks() {
  if (!isUnlocked) {
    alert("Please unlock with the admin password first.");
    return;
  }
  if (confirm("Are you sure you want to delete all tasks?")) {
    document.getElementById("taskList").innerHTML = "";
  }
}

// Theme toggle switch logic
document.getElementById("themeSwitch").addEventListener("change", e => {
  if (e.target.checked) {
    document.body.classList.remove("dark-theme");
    document.body.style.background = "#f9fafb";
    document.body.style.color = "#111";
    // Adjust sidebar and nav colors for light theme
    document.querySelector(".sidebar").style.background = "#e6fffa";
    document.querySelector(".top-nav").style.background = "#d1fae5";
    document.querySelector(".top-nav").style.color = "#065f46";
  } else {
    document.body.classList.add("dark-theme");
    document.body.style.background = "#121212";
    document.body.style.color = "#eee";
    document.querySelector(".sidebar").style.background = "#1f2937";
    document.querySelector(".top-nav").style.background = "#1f2937";
    document.querySelector(".top-nav").style.color = "#00c292";
  }
});

// Initialize default section
showSection('dashboard');
// Max tasks for graph scaling
const MAX_TASKS_GRAPH = 20;

function updateKPIs() {
  const taskCount = document.querySelectorAll('#taskList .task-item').length;
  const totalTasksElem = document.getElementById('totalTasks');
  const taskGraphBar = document.getElementById('taskGraphBar');

  totalTasksElem.textContent = taskCount;

  // Calculate width percentage capped at 100%
  const widthPercent = Math.min((taskCount / MAX_TASKS_GRAPH) * 100, 100);

  // Set the width of the inner bar
  taskGraphBar.style.setProperty('--bar-width', widthPercent + '%');
  taskGraphBar.style.position = 'relative';
  taskGraphBar.style.background = '#064e3b';

  // Use ::before to show fill (update its width dynamically)
  taskGraphBar.style.setProperty('--bar-width', widthPercent + '%');
  taskGraphBar.style.setProperty('--bar-width', widthPercent + '%');

  // Directly style ::before via JS (hack: create or update inline style)
  let styleSheet = document.getElementById("dynamicBarStyle");
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    styleSheet.id = "dynamicBarStyle";
    document.head.appendChild(styleSheet);
  }
  styleSheet.textContent = `
    #taskGraphBar::before {
      width: ${widthPercent}%;
    }
  `;
}

// Call updateKPIs after adding or deleting tasks
function addTask() {
  if (!isUnlocked) {
    alert("Please unlock with the admin password first.");
    return;
  }

  const taskInput = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("prioritySelect").value;

  if (!taskInput) return;

  const li = document.createElement("li");
  li.className = "task-item";
  const taskId = Date.now(); // unique ID

  li.innerHTML = `
    <div class="task-content masked" id="task-${taskId}">${taskInput}</div>
    <div class="task-priority">${priority}</div>
    <div class="task-timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
    <div class="task-actions">
      <button onclick="toggleTask(${taskId})" title="View/Hide Task">👁️</button>
      <button onclick="deleteTask(this)" title="Delete Task">❌</button>
    </div>
  `;

  document.getElementById("taskList").appendChild(li);
  document.getElementById("taskInput").value = "";

  updateKPIs();
}

function deleteTask(button) {
  button.closest("li").remove();
  updateKPIs();
}

function deleteAllTasks() {
  if (!isUnlocked) {
    alert("Please unlock with the admin password first.");
    return;
  }
  if (confirm("Are you sure you want to delete all tasks?")) {
    document.getElementById("taskList").innerHTML = "";
    updateKPIs();
  }
}

// Initial KPI update when page loads
updateKPIs();
