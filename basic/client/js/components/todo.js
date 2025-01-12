import { updateTodoAction, deleteTodoAction } from '../flux/index.js';
import store from '../store.js';

class Todo {
  constructor(parent, { id, name, done }) {
    this.parent = parent;
    this.props = { id, name, done };
    this.mounted = false;
  }

  mount() {
    if (this.mounted) return;

    const checkbox = this.element.querySelector('.todo-toggle');
    checkbox?.addEventListener('click', () => {
      console.log('update:', this.props.id, 'clicked');
      store.dispatch(updateTodoAction(this.props.id));
    });

    const removeButton = this.element.querySelector('.todo-remove-button');
    removeButton?.addEventListener('click', () => {
      console.log('delete:', this.props.id, 'clicked');
      store.dispatch(deleteTodoAction(this.props.id));
    });

    this.mounted = true;
  }

  render() {
    const { id, name, done } = this.props;
    const next = document.createElement("li");
    next.className = "todo-item";
    next.innerHTML = `
      <label class="todo-toggle__container">
        <input
          data-todo-id="${id}"
          type="checkbox"
          class="todo-toggle"
          value="checked"
          ${done ? "checked" : ""}
        />
        <span class="todo-toggle__checkmark"></span>
      </label>
      <div class="todo-name">${name}</div>
      <div data-todo-id="${id}" class="todo-remove-button">x</div>
    `;
    if (!this.element) {
      this.parent.appendChild(next);
    } else {
      this.parent.replaceChild(this.element, next);
    }
    this.element = next;
    this.mount();
  }
}

export default Todo;
