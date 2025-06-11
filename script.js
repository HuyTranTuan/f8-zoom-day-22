const addClassModal = document.getElementById("addTaskModal");
const openModalBtn = document.getElementById("add-btn");
const closeModalBtn = document.getElementById("modal-close");
const addTaskForm = document.querySelector(".todo-app-form");
const searchInput = document.querySelector(".search-input");

const todos = JSON.parse(localStorage.getItem("todos")) ?? [];
let todoList = todos.filter(item => item.isCompleted === false); // Filter out completed tasks

let completedTasks = todos.filter(item => item.isCompleted === true); // Filter out active tasks

// Render the todo list from localStorage
window.onload = function() {
  renderTasks(todoList);
};


searchInput.addEventListener("keyup", function() {
  const searchTerm = searchInput.value.toLowerCase();
  const tabButton = document.querySelector('.tab-button.active');
  const filteredTasks = tabButton.textContent.trim() === 'Active Tasks' 
    ? todoList.filter(item => item.title.toLowerCase().includes(searchTerm))
    : completedTasks.filter(item => item.title.toLowerCase().includes(searchTerm));
  renderTasks(filteredTasks);
});

const clickRenderTab = (type, event) => {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => button.classList.remove('active'));
  event.currentTarget.classList.add('active');

  type === 'active' ? renderTasks(todoList) : renderTasks(completedTasks);
};

const renderTasks = (list) => {
  const listTasks = document.querySelector('.task-grid');
  listTasks.innerHTML = '';

  if (list.length === 0) {
    listTasks.innerHTML = '<p class="no-tasks">No tasks available</p>';
    return;
  }
  // Render each task
  list.forEach(item => {
    const listItem = `<div class="task-card ${item.cardColor} ${item.isCompleted ? 'completed' : ''}">
                <div class="task-header">
                    <h3 class="task-title">${item.title}</h3>
                    <button class="task-menu" onclick="showDropdown(event)">
                        <i class="fa-solid fa-ellipsis fa-icon"></i>
                        <div class="dropdown-menu">
                            <div class="dropdown-item" onclick="showEditTask('${item.id}', event)">
                                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                                Edit
                            </div>
                            <div
                              class="dropdown-item complete"
                              onclick="markAsActive('${item.id}', '${item.isCompleted ? "completed" : "active"}')">
                                <i class="fa-solid fa-check fa-icon"></i>
                                Mark as ${!item.isCompleted ? 'Completed' : 'Active'}
                            </div>
                            <div class="dropdown-item delete" onclick="removeTask('${item.id}', '${item.isCompleted ? "completed" : "active"}')">
                                <i class="fa-solid fa-trash fa-icon"></i>
                                Delete
                            </div>
                        </div>
                    </button>
                </div>
                <p class="task-description">${item.description}</p>
                <div class="task-time">${item.startTime} - ${item.endTime}</div>
            </div>`;
    listTasks.innerHTML += listItem;
  });
}


function addTask(event) {
  event.preventDefault();
  
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let category = document.getElementById("taskCategory").value;
  let priority = document.getElementById("taskPriority").value;
  let startTime = document.getElementById("startTime").value;
  let endTime = document.getElementById("endTime").value;
  let dueDate = document.getElementById("taskDate").value;
  let cardColor = document.getElementById("taskColor").value;

  if (!title || !description || !category || !priority || !startTime || !endTime || !dueDate) {
    alert("Please fill in all fields.");
    return;
  }

  const newTask = {
    id: 'id' + (new Date()).getTime(),
    title,
    description,
    category,
    priority,
    startTime,
    endTime,
    dueDate,
    cardColor,
    isCompleted: false
  };

  todoList.unshift(newTask);
  localStorage.setItem("todos", JSON.stringify(todoList.concat(completedTasks)));

  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => button.classList.remove('active'));
  tabButtons[0].classList.add('active');

  renderTasks(todoList);
  closeModal();
}

function showDropdown(event) {
  const dropdownMenu = event.currentTarget.querySelector('.dropdown-menu');
  dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  
  let show = function(event) {
    if (!event.target.closest('.task-menu'))
      dropdownMenu.style.display = 'none';
  }
  // Close the dropdown if clicked outside
  document.addEventListener('click', show);
  document.removeEventListener('click', show);
}

function showEditTask(id) {
  const task = todoList.find(item => item.id === id);
  if (task && task.isCompleted === false) {
    openModal("edit", id);
    
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDescription").value = task.description;
    document.getElementById("taskCategory").value = task.category;
    document.getElementById("taskPriority").value = task.priority;
    document.getElementById("startTime").value = task.startTime;
    document.getElementById("endTime").value = task.endTime;
    document.getElementById("taskDate").value = task.dueDate;
    document.getElementById("taskColor").value = task.cardColor;
  } else {
    alert("Task not found or already completed.");
  }
}

function updateTask(event, id) {
  event.preventDefault();
  
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let category = document.getElementById("taskCategory").value;
  let priority = document.getElementById("taskPriority").value;
  let startTime = document.getElementById("startTime").value;
  let endTime = document.getElementById("endTime").value;
  let dueDate = document.getElementById("taskDate").value;
  let cardColor = document.getElementById("taskColor").value;

  if (!title || !description || !category || !priority || !startTime || !endTime || !dueDate || !cardColor) {
    alert("Please fill in all fields.");
    return;
  }

  const updatedTask = {
    id: id,
    title,
    description,
    category,
    priority,
    startTime,
    endTime,
    dueDate,
    cardColor,
    isCompleted: false
  };

  todoList = todoList.map(item => item.id === id ? updatedTask : item);
  localStorage.setItem("todos", JSON.stringify(todoList.concat(completedTasks)));
  
  renderTasks(todoList);
  closeModal();
}

function markAsActive(id, type) {
  if(type === "active") {
    let task = todoList.find(item => item.id === id);
    task.isCompleted = true;
    completedTasks.unshift(task);
    todoList = todoList.filter(item => item.id !== id);
    renderTasks(todoList);
  } else{
    let task = completedTasks.find(item => item.id === id);
    task.isCompleted = false;
    todoList.unshift(task);
    completedTasks = completedTasks.filter(item => item.id !== id);
    renderTasks(completedTasks);
  }
  localStorage.setItem("todos", JSON.stringify(todoList.concat(completedTasks)));
}

function removeTask(id, type) {
  type === "active"
    ? todoList = todoList.filter(item => item.id !== id)
    : completedTasks = completedTasks.filter(item => item.id !== id);
  localStorage.setItem("todos", JSON.stringify(todoList.concat(completedTasks)));
  type === "active" ? renderTasks(todoList) : renderTasks(completedTasks);
}


function openModal(type, taskId) {
  addClassModal.className = "modal-overlay show";
  let modalTitle = addClassModal.querySelector(".modal-title");
  let modalFooter = addClassModal.querySelector(".modal-footer");
  if (type === "edit" && taskId) {
    modalTitle.textContent = "Edit Task";
    modalFooter.innerHTML = `
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" onclick="updateTask(event,'${taskId}')">Update Task</button>
    `;
  } else {
    modalTitle.textContent = "Add New Task";
    modalFooter.innerHTML = `
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" onclick="addTask(event)">Create Task</button>
    `;

    setTimeout(() => {
      let taskTitle = document.getElementById("taskTitle");
      if (taskTitle) taskTitle.focus();
    }, 100);
  }
  addClassModal.addEventListener('click', function(event) {
    if (!event.target.closest('.modal'))
      closeModal();
  });
  document.removeEventListener('click', function(event) {
    if (!event.target.closest('.modal'))
      closeModal();
  });
}

function closeModal() {
  addClassModal.className = "modal-overlay";
  addTaskForm.reset();
}