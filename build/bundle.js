System.register("index", [], function (exports_1, context_1) {
    "use strict";
    var Todo;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Todo = class Todo {
                constructor() {
                    this.todoList = [];
                    this.init();
                }
                init() {
                    const $input = document.querySelector('#todo-input');
                    const $controlBtns = document.querySelectorAll('.btn');
                    $controlBtns.forEach((btn) => {
                        const btnClass = btn.classList.value.split(' ')[1];
                        btn.addEventListener('click', (event) => {
                            const filteredTodo = this.filterTodo(btnClass);
                            this.addActiveStatus(event);
                            this.renderTodo(filteredTodo);
                        });
                    });
                    $input.addEventListener('keydown', this.onEnterClick.bind(this));
                }
                filterTodo(filterBy) {
                    if (filterBy === 'all')
                        return this.todoList;
                    if (filterBy === 'complete')
                        return this.todoList.filter((todo) => todo.isDone);
                    if (filterBy === 'not-complete')
                        return this.todoList.filter((todo) => !todo.isDone);
                }
                addActiveStatus({ target }) {
                    this.resetActiveStatus();
                    const activeTarget = target;
                    activeTarget.classList.add('active');
                }
                resetActiveStatus() {
                    const $controlBtns = document.querySelectorAll('.btn');
                    $controlBtns.forEach((btn) => btn.classList.remove('active'));
                }
                resetInput(inputElement) {
                    inputElement.value = '';
                }
                getStatus() {
                    let status;
                    const $controlBtns = document.querySelectorAll('.btn');
                    $controlBtns.forEach((btn) => {
                        if (btn.classList.contains('active')) {
                            status = btn.classList.value.split(' ')[1];
                        }
                    });
                    return status;
                }
                onEnterClick(event) {
                    if (event.key === 'Enter') {
                        const $input = event.target;
                        const lastElementId = this.todoList.length ? this.todoList[this.todoList.length - 1].id : -1;
                        this.todoList.push({ id: lastElementId + 1, isDone: false, content: $input.value });
                        this.resetInput($input);
                        this.renderTodo(this.todoList);
                    }
                }
                updateTodo(id) {
                    const index = this.todoList.findIndex((todo) => todo.id === id);
                    const todo = this.todoList[index];
                    const newTodo = Object.assign(Object.assign({}, todo), { isDone: !todo.isDone });
                    this.todoList.splice(index, 1, newTodo);
                    this.renderTodo(this.filterTodo(this.getStatus()));
                }
                editTodo({ target }, id) {
                    const index = this.todoList.findIndex((todo) => todo.id === id);
                    const todo = this.todoList[index];
                    const newTodo = Object.assign(Object.assign({}, todo), { content: target.innerText });
                    this.todoList.splice(index, 1, newTodo);
                    this.renderTodo(this.filterTodo(this.getStatus()));
                }
                makeTodo(todo) {
                    const itemContainer = document.createElement('div');
                    const item = `
      <div class="item__div">
        <input type='checkbox' ${todo.isDone && 'checked'}/>
        <div class='content ${todo.isDone && 'checked'}' contentEditable>${todo.content}</div>
        <button>X</button>
      </div>`;
                    itemContainer.classList.add('item');
                    itemContainer.innerHTML = item;
                    const todoItem = itemContainer.querySelector('.content');
                    const checkbox = itemContainer.querySelector('input[type=checkbox]');
                    const deleteBtn = itemContainer.querySelector('button');
                    todoItem.addEventListener('blur', (event) => this.editTodo(event, todo.id));
                    deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
                    checkbox.addEventListener('change', () => this.updateTodo(todo.id));
                    itemContainer.appendChild(deleteBtn);
                    return itemContainer;
                }
                deleteTodo(id) {
                    this.todoList = this.todoList.filter((todo) => todo.id !== id);
                    this.renderTodo(this.filterTodo(this.getStatus()));
                }
                resetContent(element) {
                    element.innerHTML = '';
                }
                renderTodo(todoList) {
                    const $todoItems = document.querySelector('.todo-items');
                    const $todoCount = document.querySelector('#todo-count');
                    this.resetContent($todoItems);
                    const frag = document.createDocumentFragment();
                    const todoElements = todoList.map((todo) => this.makeTodo(todo));
                    frag.append(...todoElements);
                    $todoItems.appendChild(frag);
                    $todoCount.innerText = `${todoList.length}`;
                }
            };
            exports_1("default", Todo);
            new Todo();
        }
    };
});
