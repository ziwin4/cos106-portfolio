// Academic planner: add, complete and delete tasks

var STORAGE_KEY = "cos106-planner-tasks";
var tasks = [];          // array of { id, text, course, done }
var currentFilter = "all";

var form, input, courseSelect, errorBox, list, counter, clearBtn, filterButtons;

document.addEventListener("DOMContentLoaded", function () {
  form = document.getElementById("taskForm");
  input = document.getElementById("taskInput");
  courseSelect = document.getElementById("taskCourse");
  errorBox = document.getElementById("taskError");
  list = document.getElementById("taskList");
  counter = document.getElementById("taskCounter");
  clearBtn = document.getElementById("clearDone");
  filterButtons = document.querySelectorAll("[data-filter]");

  loadTasks();
  render();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask(input.value, courseSelect.value);
  });

  // One listener on the list handles every checkbox and delete button
  list.addEventListener("click", function (event) {
    var item = event.target.closest(".task");
    if (!item) return;
    var id = Number(item.dataset.id);
    if (event.target.matches(".delete")) deleteTask(id);
  });

  list.addEventListener("change", function (event) {
    if (!event.target.matches("input[type='checkbox']")) return;
    var item = event.target.closest(".task");
    toggleTask(Number(item.dataset.id));
  });

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentFilter = btn.dataset.filter;
      filterButtons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      render();
    });
  });

  clearBtn.addEventListener("click", clearCompleted);
});

function loadTasks() {
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    tasks = saved ? JSON.parse(saved) : [];
  } catch (e) {
    tasks = [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) { /* storage unavailable: the planner still works for this visit */ }
}

function addTask(text, course) {
  text = text.trim();
  if (text === "") {
    errorBox.textContent = "Type a task before adding it.";
    input.focus();
    return;
  }
  errorBox.textContent = "";
  tasks.unshift({ id: Date.now(), text: text, course: course, done: false });
  input.value = "";
  saveTasks();
  render();
  input.focus();
}

function toggleTask(id) {
  tasks = tasks.map(function (t) {
    return t.id === id ? { id: t.id, text: t.text, course: t.course, done: !t.done } : t;
  });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter(function (t) { return !t.done; });
  saveTasks();
  render();
}

function visibleTasks() {
  if (currentFilter === "active") return tasks.filter(function (t) { return !t.done; });
  if (currentFilter === "done") return tasks.filter(function (t) { return t.done; });
  return tasks;
}

function render() {
  list.innerHTML = "";
  var shown = visibleTasks();

  if (shown.length === 0) {
    var empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = tasks.length === 0
      ? "No tasks yet. Add your first task above."
      : "Nothing in this view.";
    list.appendChild(empty);
  }

  shown.forEach(function (task) {
    var li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");
    li.dataset.id = task.id;

    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = task.done;
    box.setAttribute("aria-label", "Mark \"" + task.text + "\" as completed");

    var body = document.createElement("div");
    body.className = "task-body";
    var text = document.createElement("div");
    text.className = "task-text";
    text.textContent = task.text;           // textContent keeps user input safe
    var course = document.createElement("div");
    course.className = "task-course";
    course.textContent = task.course;
    body.appendChild(text);
    body.appendChild(course);

    var del = document.createElement("button");
    del.type = "button";
    del.className = "delete";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete \"" + task.text + "\"");

    li.appendChild(box);
    li.appendChild(body);
    li.appendChild(del);
    list.appendChild(li);
  });

  var remaining = tasks.filter(function (t) { return !t.done; }).length;
  counter.textContent = remaining + " to do, " + (tasks.length - remaining) + " done";
}
