/***************************  DECLARATIONS START ******************************/
const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const LOCAL_STORAGE_LIST_KEY = "tasks.list";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "tasks.selectedListID";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListID = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
);
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listDisplaycontainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTasksButton = document.querySelector("[data-clear-complete-tasks-button]");

//  let selectedListID = 0;
/***************************  DECLARATIONS END ******************************/

/***************************  EVENT LISTENERS START ******************************/

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName === "" || listName == null) return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});
listsContainer.addEventListener("click", (e) => {
  selectedListID = e.target.closest(".list-name").dataset.listId;
  // console.log(selectedListID);
  saveAndRender();
  // if (e.target.tagName.toLowerCase() === "li") {
  //   selectedListID = e.target.dataset.listId;
  //   saveAndRender();
  // }
});
deleteListButton.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedListID);
  selectedListID = null;
  saveAndRender();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName === "" || taskName == null) return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListID);
  selectedList.tasks.push(task);
  saveAndRender();
});
tasksContainer.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListID);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});
clearCompleteTasksButton.addEventListener("click", e => {
  const selectedList = lists.find(list => list.id === selectedListID);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveAndRender();
})
/***************************  EVENT LISTENERS END ******************************/

/***************************  FUNCTIONS START ******************************/
function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}
function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
function saveAndRender() {
  save();
  render();
}
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(
    LOCAL_STORAGE_SELECTED_LIST_ID_KEY,
    JSON.stringify(selectedListID)
  );
}
function render() {
  clearElement(listsContainer);
  renderlists();
  const selectedList = lists.find((list) => list.id === selectedListID);
  // console.log(selectedList);
  if (selectedListID == null) {
    listDisplaycontainer.style.display = "none";
  } else {
    listDisplaycontainer.style.display = "";
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTask(selectedList);
  }
}
function renderlists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    if (list.id === selectedListID) listElement.classList.add("active-list");
    listsContainer.appendChild(listElement);
  });
}
function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} are remaining`;
}
function renderTask(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    const label = taskElement.querySelector("label");
    checkbox.id = task.id;
    checkbox.checked = task.complete; // all completed tasks will be checked.
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}
/***************************  FUNCTIONS END******************************/

render();
