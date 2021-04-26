import { createTodoAction } from '../flux/index.js';
import store from '../store.js';

class TodoForm {
  constructor() {
    this.button = document.querySelector(".todo-form__submit");
    this.form = document.querySelector(".todo-form__input");
  }

  mount() {
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('submit:', 'clicked');
      store.dispatch(createTodoAction(this.form.value));
    });
  }
}

export default TodoForm;
