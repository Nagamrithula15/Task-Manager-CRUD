// API base URL
const API_URL = '/api/tasks';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');
const taskStatusInput = document.getElementById('task-status');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const tasksContainer = document.getElementById('tasks-container');
const taskCountSpan = document.getElementById('task-count');
const filterStatusSelect = document.getElementById('filter-status');
const alertBox = document.getElementById('alert-box');

// Modal Elements
const viewModal = document.getElementById('view-modal');
const modalId = document.getElementById('modal-id');
const modalTaskTitle = document.getElementById('modal-task-title');
const modalDesc = document.getElementById('modal-desc');
const modalStatus = document.getElementById('modal-status');
const modalDate = document.getElementById('modal-date');
const closeModalBtn = document.getElementById('close-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalEditBtn = document.getElementById('modal-edit-btn');

let currentTasks = [];
let activeModalTaskId = null;

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();
  setupEventListeners();
});

// --- Event Listeners ---
function setupEventListeners() {
  // Form submit (Create or Update)
  taskForm.addEventListener('submit', handleFormSubmit);

  // Cancel edit button
  cancelBtn.addEventListener('click', resetForm);

  // Status filter dropdown change
  filterStatusSelect.addEventListener('change', () => {
    renderTasks(currentTasks);
  });

  // Modal close buttons
  closeModalBtn.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside modal box
  viewModal.addEventListener('click', (e) => {
    if (e.target === viewModal) closeModal();
  });

  // Edit from inside modal
  modalEditBtn.addEventListener('click', () => {
    if (activeModalTaskId) {
      const task = currentTasks.find(t => t._id === activeModalTaskId);
      if (task) {
        closeModal();
        populateFormForEdit(task);
      }
    }
  });
}

// --- 1. READ: Fetch all tasks (GET /api/tasks) ---
async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const tasks = await res.json();
    currentTasks = tasks;
    renderTasks(tasks);
  } catch (err) {
    showAlert(err.message, 'error');
    tasksContainer.innerHTML = `<p class="empty-state">Could not load tasks. Ensure server and database are running.</p>`;
  }
}

// --- 2. Render tasks to DOM ---
function renderTasks(tasks) {
  const selectedFilter = filterStatusSelect.value;
  const filteredTasks = selectedFilter === 'All'
    ? tasks
    : tasks.filter(t => t.status === selectedFilter);

  taskCountSpan.textContent = filteredTasks.length;

  if (filteredTasks.length === 0) {
    tasksContainer.innerHTML = `<p class="empty-state">No tasks found. Create a new task to get started!</p>`;
    return;
  }

  tasksContainer.innerHTML = filteredTasks.map(task => {
    const isCompleted = task.status === 'Completed';
    const statusClass = isCompleted ? 'completed' : 'pending';
    const badgeClass = isCompleted ? 'badge-completed' : 'badge-pending';
    const nextStatus = isCompleted ? 'Pending' : 'Completed';
    const toggleLabel = isCompleted ? 'Mark Pending' : 'Mark Done';

    return `
      <div class="task-item ${statusClass}" data-id="${task._id}">
        <div class="task-main">
          <div>
            <h3 class="task-title" onclick="viewTaskDetails('${task._id}')">${escapeHtml(task.title)}</h3>
            ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}
          </div>
          <span class="badge ${badgeClass}">${task.status}</span>
        </div>
        <div class="task-meta">
          <span>📅 ${formatDate(task.createdAt)}</span>
          <div class="task-actions">
            <button class="btn btn-sm btn-outline" onclick="viewTaskDetails('${task._id}')">View</button>
            <button class="btn btn-sm btn-outline" onclick="toggleTaskStatus('${task._id}', '${nextStatus}')">${toggleLabel}</button>
            <button class="btn btn-sm btn-secondary" onclick="editTaskById('${task._id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- 3. CREATE & UPDATE (POST /api/tasks or PUT /api/tasks/:id) ---
async function handleFormSubmit(e) {
  e.preventDefault();

  const id = taskIdInput.value;
  const title = taskTitleInput.value.trim();
  const description = taskDescInput.value.trim();
  const status = taskStatusInput.value;

  if (!title) {
    showAlert('Title is required', 'error');
    return;
  }

  const payload = { title, description, status };

  try {
    let res;
    if (id) {
      // UPDATE (PUT)
      res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // CREATE (POST)
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Operation failed');
    }

    showAlert(id ? 'Task updated successfully!' : 'Task created successfully!', 'success');
    resetForm();
    fetchTasks();
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

// --- 4. READ ONE: View single task details (GET /api/tasks/:id) ---
async function viewTaskDetails(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const task = await res.json();

    if (!res.ok) throw new Error(task.error || 'Failed to fetch task details');

    activeModalTaskId = task._id;
    modalId.textContent = task._id;
    modalTaskTitle.textContent = task.title;
    modalDesc.textContent = task.description || '(No description provided)';
    modalStatus.textContent = task.status;
    modalStatus.className = `badge ${task.status === 'Completed' ? 'badge-completed' : 'badge-pending'}`;
    modalDate.textContent = formatDate(task.createdAt);

    viewModal.classList.remove('hidden');
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

// --- 5. UPDATE: Quick status toggle (PUT /api/tasks/:id) ---
async function toggleTaskStatus(id, newStatus) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status');

    showAlert(`Task marked as ${newStatus}!`, 'success');
    fetchTasks();
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

// --- 6. DELETE: Delete a task (DELETE /api/tasks/:id) ---
async function deleteTask(id) {
  const confirmed = confirm('Are you sure you want to delete this task?');
  if (!confirmed) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete task');

    showAlert('Task deleted successfully!', 'success');
    
    // If deleted while viewing in modal, close modal
    if (activeModalTaskId === id) closeModal();

    // If deleted while editing, reset form
    if (taskIdInput.value === id) resetForm();

    fetchTasks();
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

// --- Helper Functions ---
function editTaskById(id) {
  const task = currentTasks.find(t => t._id === id);
  if (task) {
    populateFormForEdit(task);
  }
}

function populateFormForEdit(task) {
  taskIdInput.value = task._id;
  taskTitleInput.value = task.title;
  taskDescInput.value = task.description || '';
  taskStatusInput.value = task.status;

  formTitle.textContent = '✏️ Edit Task';
  submitBtn.textContent = 'Update Task';
  cancelBtn.classList.remove('hidden');

  taskTitleInput.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  taskForm.reset();
  taskIdInput.value = '';
  formTitle.textContent = '➕ Add New Task';
  submitBtn.textContent = 'Add Task';
  cancelBtn.classList.add('hidden');
}

function closeModal() {
  viewModal.classList.add('hidden');
  activeModalTaskId = null;
}

function showAlert(message, type = 'success') {
  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;
  alertBox.classList.remove('hidden');

  setTimeout(() => {
    alertBox.classList.add('hidden');
  }, 3500);
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
