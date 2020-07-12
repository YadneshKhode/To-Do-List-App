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
  lists = lists.filter(list => list.id !== selectedListID);
  selectedListID = null;
  saveAndRender();
});

/***************************  EVENT LISTENERS END ******************************/

/***************************  FUNCTIONS START ******************************/
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
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
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    if (list.id === selectedListID) listElement.classList.add("active-list");
    listsContainer.appendChild(listElement);
  });
}
/***************************  FUNCTIONS END******************************/
render();
