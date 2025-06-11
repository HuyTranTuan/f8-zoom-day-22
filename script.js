// 1
let addClassModal = document.getElementById("addTaskModal");
let openModalBtn = document.getElementById("add-btn");
let closeModalBtn = document.getElementById("modal-close");
let addTaskForm = document.querySelector(".todo-app-form");

let todoList = [];


// Local Storage
// Check if todos exist in localStorage, if not initialize it
const todos = localStorage.getItem("todos");
if (todos) {
  todoList = JSON.parse(localStorage.getItem("todos"));
  console.log("Todos loaded from localStorage:", todoList);
} else {
  localStorage.setItem("todos", JSON.stringify([]));
  todoList = [];
}

// Render the todo list from localStorage
window.onload = function() {
  renderTasks();
};

const renderTasks = () => {
  const list = document.querySelector('.task-grid');
  list.innerHTML = '';

  if (todoList.length === 0) {
    list.innerHTML = '<p class="no-tasks">No tasks available</p>';
    return;
  }
  todoList.forEach(item => {
    const listItem = `<div class="task-card ${item.cardColor} ${item.isCompleted ? 'completed' : ''}" data-category="${item.category}" data-priority="${item.priority}">
                <div class="task-header">
                    <h3 class="task-title">${item.title}</h3>
                    <button class="task-menu">
                        <i class="fa-solid fa-ellipsis fa-icon"></i>
                        <div class="dropdown-menu">
                            <div class="dropdown-item" onclick="showEditTask(${item})">
                                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                                Edit
                            </div>
                            <div class="dropdown-item complete" onclick="markAsActive(this.closest('.task-card'))">
                                <i class="fa-solid fa-check fa-icon"></i>
                                Mark as Active
                            </div>
                            <div class="dropdown-item delete" onclick="removeTask(this.closest('.task-card'))">
                                <i class="fa-solid fa-trash fa-icon"></i>
                                Delete
                            </div>
                        </div>
                    </button>
                </div>
                <p class="task-description">${item.description}</p>
                <div class="task-time">${item.startTime} - ${item.endTime}</div>
            </div>`;
    list.innerHTML += listItem;
  });
};


openModalBtn.addEventListener("click", () => {
  addClassModal.className = "modal-overlay show";
  document.querySelector(".modal-footer").innerHTML = `
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" onclick="addTask()">Create Task</button>
  `;

  setTimeout(() => {
    let taskTitle = document.getElementById("taskTitle");
    if (taskTitle) {
      taskTitle.focus();
    }
  }, 300);
});


function closeModal() {
  addClassModal.className = "modal-overlay";
  addTaskForm.reset();
}


function addTask() {

  let title = document.querySelector("#taskTitle").value;
  let description = document.querySelector("#taskDescription").value;
  let category = document.querySelector("#taskCategory").value;
  let priority = document.querySelector("#taskPriority").value;
  let startTime = document.querySelector("#startTime").value;
  let endTime = document.querySelector("#endTime").value;
  let dueDate = document.querySelector("#taskDate").value;
  let cardColor = document.querySelector("#taskColor").value;
  let isCompleted = false;

  if (title && description && category && priority && startTime && endTime && dueDate && cardColor) {
    let task = {
      id: "id" + Math.random().toString(16).slice(2),
      title,
      description,
      category,
      priority,
      startTime,
      endTime,
      dueDate,
      cardColor,
      isCompleted
    };
    
    localStorage.setItem("todos", JSON.stringify([task, ...todoList]));
    todoList.push(task);
    addTaskForm.reset();
    addClassModal.className = "modal-overlay";
    renderTasks();
  } else {
    alert("Please fill in all fields.");
  }
}

function showEditTask(item) {
  addClassModal.className = "modal-overlay show";


  setTimeout(() => {
    document.querySelector("#taskTitle").value = item.title;
    document.querySelector("#taskDescription").value = item.description;
    document.querySelector("#taskCategory").value = item.category;
    document.querySelector("#taskPriority").value = item.priority;
    document.querySelector("#startTime").value = item.startTime;
    document.querySelector("#endTime").value = item.endTime;
    document.querySelector("#taskColor").value = item.cardColor;
  }, timeout = 300);

  document.querySelector(".modal-footer").innerHTML = `
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" onclick="editTask(${item.id})">Edit Task</button>
  `;
}

const editTask = (id) => {

  let task = todoList.find(t => t.id === id);
  if (!task) {
    console.error("Task not found");
    return;
  }
  if (task) {
    task.title = document.querySelector("#taskTitle").value;
    task.description = document.querySelector("#taskDescription").value;
    task.category = document.querySelector("#taskCategory").value;
    task.priority = document.querySelector("#taskPriority").value;
    task.startTime = document.querySelector("#startTime").value;
    task.endTime = document.querySelector("#endTime").value;
    task.cardColor = document.querySelector("#taskColor").value;
    
    localStorage.setItem("todos", JSON.stringify(todoList));
    closeModal();
    renderTasks();
  }

}

const removeTask = (taskElement) => {
  let taskIndex = todoList.findIndex(task => task.id === taskElement.dataset.id);
  if (taskIndex > -1) {
    todoList.splice(taskIndex, 1);
    localStorage.setItem("todos", JSON.stringify(todoList));
    taskElement.remove();
  }
}

const markAsActive = (taskElement) => {
  taskElement.classList.toggle("completed");
  let taskTitle = taskElement.querySelector(".task-title").textContent;
  let task = todoList.find(t => t.title === taskTitle);
  
  if (task) {
    task.isCompleted = !task.isCompleted;
    localStorage.setItem("todos", JSON.stringify(todoList));
  }
}