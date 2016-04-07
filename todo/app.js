// "Reducer composition"
// `todos` reducer handles a collection of todos
// `todo` reducer handles a single todo
// `todos` reducer calls `todo` reducer to handle
// an inividual todo in the collection.
const todo = (state, action) => {
  console.log('todo reducer called, with state, action: ', state, action);

  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return Object.assign({}, state, {
        completed: !state.completed
      });
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  console.log('todos reducer called, with state, action: ', state, action);

  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(
//       state.todos,
//       action
//     ),
//     visibilityFilter: visibilityFilter(
//       state.visibilityFilter,
//       action
//     )
//   };
// };

// Rather than write our own reducer that combines multiple reducers as above,
// we can use the conveneice method provided by Redux: `combineReducers`.
// const { combineReducers } = Redux;

// Re-implement combineReducers to understand how it works
const combineReducers = (reducers) => {
  console.log('in combineReducers, with reducers: ', reducers);

  return (state = {}, action) => {
    console.log('in main reducer function, state, action: ', state, action);

    return Object.keys(reducers).reduce(
      (nextState, key) => {
        console.log('inside reduce, key, nextState: ', key, nextState);

        nextState[key] = reducers[key](
          state[key], action
        );

        return nextState;
      },
      {}
    );
  }
};

const todoApp = combineReducers({
  // todos: todos,
  // visibilityFilter: visibilityFilter
  // or ES6 object shorthand notation (object values match keys)
  todos,
  visibilityFilter
});

const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

const testToggleTodo= () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: false
    }
  ];
  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: true
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();

console.log('Tests passed!');

const { createStore } = Redux;
const store = createStore(todoApp);
