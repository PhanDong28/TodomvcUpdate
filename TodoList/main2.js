function delegate(el, selector, event, handler) {
    el.addEventListener(event, (e) => {
      const targetEl = e.target.closest(selector);
      if (targetEl && el.contains(targetEl)) {
        handler(e, targetEl);
      }
    });
  }
  
  function createTodoItemEl({ value, id, completed }) {
    const li = document.createElement('li');
    li.dataset.id = id;
    li.className = 'group border-b-[2px] border-solid px-[60px] py-[16px] bor-border float';
    li.innerHTML = `
      <i data-todo="completed" class="bx ${completed ? 'bx-check-square' : 'bx-square'} text-[30px] cursor-pointer"></i>
      <span data-todo="value" contenteditable>${value}</span>
      <i data-todo="remove" class="bx bx-x text-[30px] cursor-pointer invisible group-hover:visible float-right"></i>
    `;
    return li;
  }
  
  function App() {
    const inputEl = document.getElementById('input');
    const listEl = document.getElementById('list');
    let todos = [];
  
    function addTodo() {
      const newTodo = {
        value: inputEl.value,
        completed: false,
        id: Date.now().toString()
      };
      todos.push(newTodo);
      const todoEl = createTodoItemEl(newTodo);
      listEl.appendChild(todoEl);
      inputEl.value = '';
    }
  
    function removeTodo(el) {
      todos = todos.filter((todo) => todo.id !== el.dataset.id);
      listEl.dispatchEvent(new CustomEvent('save'));
      el.remove();
    }
  
    function completeTodoAndEdit(e, el) {
      if (el.dataset.todo === 'completed') {
        const todo = todos.find((todo) => todo.id === el.parentElement.dataset.id);
        todo.completed = !todo.completed;
        const completedIconClass = todo.completed ? 'bx-check-square' : 'bx-square';
        el.className = `bx ${completedIconClass} text-[30px] cursor-pointer`;
        el.nextElementSibling.className = `${todo.completed ? 'line-through' : ''}`;
      } else if (el.dataset.todo === 'value') {
        if (e.keyCode === 13) {
          e.preventDefault();
          const content = el.textContent;
          todos = todos.map((todo) => (todo.id === el.parentElement.dataset.id ? { ...todo, value: content } : todo));
        }
      }
    }
  
    inputEl.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' || event.keyCode === 13) {
        addTodo();
      }
    });
  
    delegate(listEl, '[data-todo="remove"], [data-todo="completed"], [data-todo="value"]', 'click', (e, el) => {
      completeTodoAndEdit(e, el);
      if (el.dataset.todo === 'remove') {
        removeTodo(el.parentElement);
      }
    });
  
    delegate(listEl, '[data-todo="value"]', 'keydown', (e, el) => {
      completeTodoAndEdit(e, el);
    });
  }
  
  App();