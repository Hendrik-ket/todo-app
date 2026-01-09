/* ===========
   DOM ELEMENTS
  =========== */
const addBtn = document.getElementById("addBtn");
const overlay = document.getElementById("overlay");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const list = document.getElementById("list");
const categoryList = document.getElementById("category-list");
const overlay2 = document.getElementById("overlay2");
const saveBtn2 = document.getElementById("saveBtn2");
const cancelBtn2 = document.getElementById("cancelBtn2");
const addBtn2 = document.getElementById("Addcat");
const catSelect = document.getElementById("cat");
const DEFAULT_CATEGORIES = [
  "Werk",
  "Vrije tijd",
  "Persoonlijk"
];

/* ============
   INITIAL LOAD
  ============= */
document.addEventListener("DOMContentLoaded", () => {
  showTasks();
  showCategories();
  CategorySelect();
});


/* ===============
   OVERLAY CONTROLS
  ================ */
addBtn.onclick = () => {
  overlay.style.display = "flex";
};

cancelBtn.onclick = () => {
  overlay.style.display = "none";
};

addBtn2.onclick = () => {
  overlay2.style.display = "flex";
};

cancelBtn2.onclick = () => {
  overlay2.style.display = "none";
};

/* =========
   SAVE TASKS
  ========= */
saveBtn.onclick = () => {
  const name = document.getElementById("name").value.trim();
  const desc = document.getElementById("desc").value;
  const cat = document.getElementById("cat").value;

  if (!name) return;

  const tasks = getTasks();

  tasks.push({
    name,
    desc,
    cat,
    done: false
  });

  saveTasks(tasks);

  document.getElementById("name").value = "";
  document.getElementById("desc").value = "";
  overlay.style.display = "none";

  showTasks();
};

/* ==============
   FILTER BUTTONS
  =============== */

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    showTasks(button.dataset.cat);
  });
});

/* =============
   TASK FUNCTIONS
  =============== */
function showTasks(filterCat = null) {
  list.innerHTML = "";

  const tasks = getTasks();

  tasks.forEach((task, i) => {
    if (filterCat && task.cat !== filterCat) return;

    const li = document.createElement("li");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;
    check.onclick = () => {
      task.done = !task.done;
      saveTasks(tasks);
      showTasks(filterCat);
    };

    const text = document.createElement("span");
    text.textContent = `${task.name} (${task.cat})`;
    text.classList.add("max-size");

    const desc = document.createElement("small");
    desc.textContent = task.desc;
    desc.classList.add("max-size");

    const del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = () => {
      tasks.splice(i, 1);
      saveTasks(tasks);
      showTasks(filterCat);
    };

    li.append(check, text, desc, del);
    list.append(li);
  });
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


/* ===================
    category functions
    ================= */

saveBtn2.onclick = () => {
  const name = document.getElementById("name2").value.trim();
  if (!name) return;

  const existing = [...DEFAULT_CATEGORIES, ...getCategories().map(c => c.name)];
  if (existing.includes(name)) return;

  saveCategories([...getCategories(), { name }]);

  document.getElementById("name2").value = "";
  overlay2.style.display = "none";

  showCategories();
  CategorySelect();
};

function showCategories() {
  categoryList.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.classList.add("filter-btn");
  allBtn.onclick = () => showTasks(null);
  categoryList.append(allBtn);

  const saved = getCategories().map(c => c.name);
  const categories = [...DEFAULT_CATEGORIES, ...saved];

  categories.forEach((name, index) => {
    const button = document.createElement("button");
    button.textContent = name;
    button.classList.add("filter-btn");
    button.dataset.cat = name;

    button.onclick = () => showTasks(name);

    if (!DEFAULT_CATEGORIES.includes(name)) {
      const del = document.createElement("button");
      del.textContent = "❌";
      del.classList.add("delete-cat-btn");

      del.onclick = (e) => {
        e.stopPropagation();
        const all = getCategories();
        const i = all.findIndex(c => c.name === name);
        if (i !== -1) {
          all.splice(i, 1);
          saveCategories(all);
          showCategories();
          CategorySelect();
        }
      };

      button.append(del);
    }

    categoryList.append(button);
  });
}

function CategorySelect() {
  catSelect.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "All";
  allOption.textContent = "All";
  catSelect.append(allOption);

  const saved = getCategories().map(c => c.name);
  const categories = [...DEFAULT_CATEGORIES, ...saved];

  categories.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    catSelect.append(option);
  });
}


function getCategories() {
  return JSON.parse(localStorage.getItem("categories")) || [];
}

function saveCategories(categories) {
  localStorage.setItem("categories", JSON.stringify(categories));
}

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});