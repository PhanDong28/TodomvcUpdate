// This is a helper function called delegate which is used to handle events that happen on a specific selector within a parent element. The function takes four parameters:
// el: The parent element on which the event listener will be added.
// selector: A CSS selector which is used to identify the child elements that will trigger the event.
// event: The type of event to listen for (e.g. 'click', 'keydown', etc.).
// handler: A callback function to execute when the event is triggered.
function delegate(el, selector, event, handler) {
  el.addEventListener(event, (e) => {
    const targetEl = e.target.closest(selector); //o find the closest ancestor of the event target that matches the specified selector
    if (targetEl && el.contains(targetEl)) {
      handler(e, targetEl); //function is called with the event object and the closest matching element as its arguments.
    }
  });
}

function createTodoItemEl({ value, id, completed }) {
  const li = document.createElement('li');
  li.dataset.id = id;                         //Set the id property of the li element using the dataset property.
  li.className = 'group border-b-[2px] border-solid px-[60px] py-[16px] bor-border float'; //Set the class name of the li element.
  li.innerHTML = `
    <i data-todo="completed" class="bx ${completed ? 'bx-check-square' : 'bx-square'} text-[30px] cursor-pointer"></i>
    <span data-todo="value" contenteditable>${value}</span>                                                               
    <i data-todo="remove" class="bx bx-x text-[30px] cursor-pointer invisible group-hover:visible float-right"></i>     
  `; 
  // Set the HTML content of the li element. This creates a list item with a checkbox, the Todo item value, and a delete button.
  return li;
}

function App() {
  const inputEl = document.getElementById('input');
  const listEl = document.getElementById('list');
  const countEl = document.getElementById('count');
  let todos = []; 

  function saveTodos() {                                  //Store the Todos list as the JSON string into Local Storage.
    localStorage.setItem('todos', JSON.stringify(todos)); //Store the Todos list as the JSON string into Local Storage.
  }

  function loadTodos() {                                  //loading list of todo from local storage
    const todosString = localStorage.getItem('todos');
    if (todosString) {
      todos = JSON.parse(todosString);
      listEl.innerHTML = '';
      todos.forEach((todo) => {
        const todoEl = createTodoItemEl(todo);
        listEl.appendChild(todoEl);
      });
    }
  }
  function addTodo() {
    // Create a new todo object with the value from the input, completed status false, and an ID generated from the current timestamp.
    const newTodo = {
      value: inputEl.value,
      completed: false,
      id: Date.now().toString()
    };
    todos.push(newTodo);
    const todoEl = createTodoItemEl(newTodo);
    listEl.appendChild(todoEl);
    // Clear the input value to prepare for the next todo.
    inputEl.value = '';
    updateCount();
    saveTodos();
  }

  function removeTodo(el) {
  // Use the `filter()` method to filter the `todos` array and keep only the todos with ids different from the id of the clicked todo element.
    todos = todos.filter((todo) => todo.id !== el.dataset.id);
  // Dispatch a `save` event on the parent `listEl` element to save the latest state to localStorage.
    listEl.dispatchEvent(new CustomEvent('save'));
    el.remove();
    updateCount();
    saveTodos();
  }

  function completeTodoAndEdit(e, el) {
    // Check if the clicked element's dataset is 'completed', indicating a click on the checkbox.
    if (el.dataset.todo === 'completed') {
      // Find the corresponding todo object using the parent element's id.
      const todo = todos.find((todo) => todo.id === el.parentElement.dataset.id);
      // Toggle the `completed` status of the todo.
      todo.completed = !todo.completed;
      // Update the icon class of the checkbox based on the new status.
      const completedIconClass = todo.completed ? 'bx-check-square' : 'bx-square';
      el.className = `bx ${completedIconClass} text-[30px] cursor-pointer`;
      // Update the text decoration of the todo value based on the new status.
      el.nextElementSibling.className = `${todo.completed ? 'line-through' : ''}`;
      // Update the count of completed and remaining todos on the UI.
      updateCount();
    } 
    // Check if the clicked element's dataset is 'value', indicating a click on the todo value.
    else if (el.dataset.todo === 'value') {
      if (e.keyCode === 13) {
        // Prevent the default behavior of the enter key, which is to add a new line.
        e.preventDefault();
        const content = el.textContent;
        todos = todos.map((todo) => (todo.id === el.parentElement.dataset.id ? { ...todo, value: content } : todo));
        updateCount();
        saveTodos();
      }
    }
  }
  

  function updateCount() {
    //Use the filter method to create a new array with all the incomplete todos.
    const count = todos.filter((todo) => !todo.completed).length;  //Get the length of this new array and assign it to the count variable.
    countEl.textContent = `${count} item${count !== 1 ? 's' : ''} left`; //Update the text content of the countEl element to display the count variable followed by the string "item" or "items" depending on whether count is equal to 1 or not.
    saveTodos();
  }

  inputEl.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      addTodo();
    }
  });

  const getURLHash = () => document.location.hash.replace(/^#\//, ''); //This is a JavaScript function that retrieves the current URL hash value and removes the "#/" prefix if it exists

  function renderTodos() {
    const filter = getURLHash();
    let filterTodos = [...todos];             // declares a variable filterTodos and initializes it to a copy of the todos array using the spread operator.
    //check the value of the filter variable and filter the filterTodos array accordingly
    if (filter === 'active') filterTodos = todos.filter((todo) => !todo.completed);        //If the filter is active, the filterTodos array is filtered to only include items that are not completed.
    else if (filter === 'completed') filterTodos = todos.filter((todo) => todo.completed); //If the filter is completed, the filterTodos array is filtered to only include items that are completed.
    listEl.replaceChildren(...filterTodos.map((todo) => createTodoItemEl(todo)));      //uses the replaceChildren() method to replace the current child nodes of the listEl element with new child nodes created from the filterTodos array,using the map() method, and passes each element to the createTodoItemEl() function to create a new todo item element.
    document.querySelectorAll(`[data-todo="filters"] a`).forEach((el) => {  //selects all the a elements that are descendants of elements with a data-todo attribute value of filters
      if (el.matches(`[href="#/${filter}"]`)) {
        el.classList.add('checked');
      } else {
        el.classList.remove('checked');
      }
    });
  }

  delegate(listEl, '[data-todo="remove"], [data-todo="completed"], [data-todo="value"]', 'click', (e, el) => {
    // Call the `completeTodoAndEdit()` function and pass in the event object and clicked element as arguments.
    completeTodoAndEdit(e, el);
    // Check if the clicked element's dataset is 'remove', indicating a click on the remove button.
    if (el.dataset.todo === 'remove') {
      // Call the `removeTodo()` function and pass in the parent element of the clicked element (the todo item) as an argument.
      removeTodo(el.parentElement);
    }
  });
  
  delegate(listEl, '[data-todo="value"]', 'keydown', (e, el) => {
    // Call the `completeTodoAndEdit()` function and pass in the event object and clicked element as arguments.
    completeTodoAndEdit(e, el);
  }); 

  window.addEventListener('hashchange', () => { // adds an event listener to the window object, listening for the 'hashchange' event
  renderTodos();                                //When the hash of the URL changes, the renderTodos() function is called
  });


  loadTodos();
  renderTodos();
  }
  
  App();