/**
 * Dispatcher
 */
class Dispatcher extends EventTarget {
  dispatch() {
    this.dispatchEvent(new CustomEvent("event"));
  }

  subscribe(subscriber) {
    this.addEventListener("event", subscriber);
  }
}

/**
 * Action Creator and Action Types
 */
const FETCH_TODO_ACTION_TYPE = "Fetch todo list from server";
export const createFetchTodoListAction = () => ({
  type: FETCH_TODO_ACTION_TYPE,
  paylaod: undefined,
});

const CREATE_TODO_ACTION_TYPE = 'Create todo element from user input'
export const createTodoAction = (todo_name) => ({
  type: CREATE_TODO_ACTION_TYPE,
  payload: todo_name,
});

const UPDATE_TODO_ACTION_TYPE = 'Update todo element when clicked checkbox';
export const updateTodoAction = (todo_id) => ({
  type: UPDATE_TODO_ACTION_TYPE,
  payload: todo_id,
});

const DELETE_TODO_ACTION_TYPE = 'Delete todo element when clicked button';
export const deleteTodoAction = (todo_id) => ({
  type: DELETE_TODO_ACTION_TYPE,
  payload: todo_id,
});

const CLEAR_ERROR = "Clear error from state";
export const clearError = () => ({
  type: CLEAR_ERROR,
  payload: undefined,
});

/**
 * Store Creator
 */
const api = "http://localhost:3000/todo";

const defaultState = {
  todoList: [],
  error: null,
};

const headers = {
  "Content-Type": "application/json; charset=utf-8",
};

const reducer = async (prevState, { type, payload }) => {
  switch (type) {
    case FETCH_TODO_ACTION_TYPE: {
      try {
        const resp = await fetch(api).then((d) => d.json());
        defaultState.todoList = resp.todoList;
        return { todoList: resp.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case CREATE_TODO_ACTION_TYPE: {
      try {
        const params = {
          headers,
          method: 'POST',
          body: JSON.stringify({ 
            name: payload,
            done: false
          })
        };
        const resp = await fetch(api, params).then((d) => d.json());
        defaultState.todoList.push(resp);
        return { todoList: defaultState.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case UPDATE_TODO_ACTION_TYPE: {
      try {
        const id = payload;
        const idx = defaultState.todoList.findIndex(el => el.id === id);
        const elm = defaultState.todoList[idx];
        const params = {
          headers,
          method: 'PATCH',
          body: JSON.stringify({
            name: elm.name,
            done: !elm.done
          })
        };
        const resp = await fetch(`${api}/${id}`, params).then((d) => d.json());
        defaultState.todoList[idx] = resp;
        return { todoList: defaultState.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case DELETE_TODO_ACTION_TYPE: {
      try {
        const id = payload;
        const params = {
          headers,
          method: 'DELETE'
        };
        await fetch(`${api}/${id}`, params);
        defaultState.todoList = defaultState.todoList.filter(el => el.id !== id);
        return { todoList: defaultState.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case CLEAR_ERROR: {
      return { ...prevState, error: null };
    }
    default: {
      throw new Error("unexpected action type: %o", { type, payload });
    }
  }
};

export function createStore(initialState = defaultState) {
  const dispatcher = new Dispatcher();
  let state = initialState;

  const dispatch = async ({ type, payload }) => {
    console.group(type);
    console.log("prev", state);
    state = await reducer(state, { type, payload });
    console.log("next", state);
    console.groupEnd();
    dispatcher.dispatch();
  };

  const subscribe = (subscriber) => {
    dispatcher.subscribe(() => subscriber(state));
  };

  return {
    dispatch,
    subscribe,
  };
}
