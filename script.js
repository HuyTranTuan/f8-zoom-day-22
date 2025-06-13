const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const addClassModal = $("#addTaskModal");
const removeClassModal = $("#confirmDeleteTaskModal");
const openModalBtn = $("#add-btn");
const closeModalBtn = $("#modal-close");
const addTaskForm = $(".todo-app-form");
const searchInput = $(".search-input");

updateTodos();

// Render the todo list from localStorage
window.onload = function() {
  renderTasks(todos);
};


searchInput.addEventListener("keyup", function() {
  const searchTerm = searchInput.value.toLowerCase();
  switchAllTasksTab();

  const filteredTasks = todos.filter(item => {
    return item.title.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm);
  });

  renderTasks(filteredTasks);
});

const clickRenderTab = (type, event) => {
  const tabButtons = $$('.tab-button');
  tabButtons.forEach(button => button.classList.remove('active'));
  event.currentTarget.classList.add('active');
  if(type === "all")
    renderTasks(todos);
  if(type === 'activated')
    renderTasks(todoList);
  if(type === 'completed')
    renderTasks(completedTasks);
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
                              onclick="markAsActive('${item.id}')">
                                <i class="fa-solid fa-check fa-icon"></i>
                                Mark as ${!item.isCompleted ? 'Completed' : 'Active'}
                            </div>
                            <div class="dropdown-item delete" onclick="removeTask('${item.id}')">
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


function addTask(event, id) {
  event.preventDefault();

  const task = {
    id: id ? id : 'id' + (new Date()).getTime(),
    title: $("#taskTitle").value,
    description: $("#taskDescription").value,
    category: $("#taskCategory").value,
    priority: $("#taskPriority").value,
    startTime: $("#startTime").value,
    endTime: $("#endTime").value,
    dueDate: $("#taskDate").value,
    cardColor: $("#taskColor").value,
    isCompleted: false
  };
  if (!task.title || !task.description || !task.category || !task.priority || !task.startTime || !task.endTime || !task.dueDate) {
    alert("Please fill in all fields.");
    return;
  }
  id
    ? todos = todos.map(item => item.id === id ? task : item)
    : todos.unshift(task);
    localStorage.setItem("todos", JSON.stringify(todos));
  updateTodos();

  switchAllTasksTab();
  renderTasks(todos);
  closeModal(event);

}

function showDropdown(event) {
  const dropdownMenu = event.currentTarget.querySelector('.dropdown-menu');
  dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  
  let show = function(event) {
    if (!event.target.closest('.task-menu'))
      dropdownMenu.style.display = 'none';
  }
}

function showEditTask(id) {
  const task = todoList.find(item => item.id === id);
  if (task && task.isCompleted === false) {
    openModal("edit", id);

    $("#taskTitle").value = task.title;
    $("#taskDescription").value = task.description;
    $("#taskCategory").value = task.category;
    $("#taskPriority").value = task.priority;
    $("#startTime").value = task.startTime;
    $("#endTime").value = task.endTime;
    $("#taskDate").value = task.dueDate;
    $("#taskColor").value = task.cardColor;
  } else {
    alert("Task not found or already completed.");
  }
}

function markAsActive(id) {
  let item = todos.find(item => item.id === id);
  item.isCompleted = !item.isCompleted;
  localStorage.setItem("todos", JSON.stringify(todos));
  updateTodos();
  switchAllTasksTab();
  renderTasks(todos);
}

function removeTask(id) {
  removeClassModal.className = "modal-overlay show";
  let modalTitle = removeClassModal.querySelector(".modal-title");
  let modalFooter = removeClassModal.querySelector(".modal-footer");
  
  modalTitle.textContent = "Delete Task ?";
  modalFooter.innerHTML = `
        <button class="btn btn-danger" onclick="confirmDeleteTask('${id}')">Delete</button>
        <button type="button" class="btn btn-secondary" onclick="closeModal(event)">Cancel</button>
    `;
  
}

function confirmDeleteTask(id){
  todos = todos.filter(item => item.id !== id)
  localStorage.setItem("todos", JSON.stringify(todos));
  updateTodos();
  switchAllTasksTab();
  renderTasks(todos);
  removeClassModal.className = "modal-overlay";
}

const switchAllTasksTab = () => {
  const tabButtons = $$('.tab-button');
  tabButtons.forEach(button => button.classList.remove('active'));
  tabButtons[0].classList.add('active');
}

function openModal(type, taskId) {
  addClassModal.className = "modal-overlay show";
  let modalTitle = addClassModal.querySelector(".modal-title");
  let modalFooter = addClassModal.querySelector(".modal-footer");
  modalTitle.textContent = type === "edit" ? "Edit Task" : "Add New Task";
  modalFooter.innerHTML = `
          <button type="button" class="btn btn-secondary" onclick="closeModal(event)">Cancel</button>
          ${ type === "edit"
            ? `<button type="submit" class="btn btn-primary" onclick="addTask(event,'${taskId}')">Update Task</button>`
            : `<button type="submit" class="btn btn-primary" onclick="addTask(event)">Create Task</button>`
          }
    `;

  setTimeout(() => {
    let taskTitle = $("#taskTitle");
    if (taskTitle) taskTitle.focus();
  }, 100);
}

function updateTodos(){
  todos = JSON.parse(localStorage.getItem("todos")) ?? [];
  completedTasks = todos.filter(item => item.isCompleted === true)
  todoList = todos.filter(item => item.isCompleted === false)
}

function closeModal(e) {
  let element = e.target.closest(".modal-overlay")
  element.className = "modal-overlay";
  if(element.id = "addTaskModal") addTaskForm.reset();
}
