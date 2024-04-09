// import logo from './logo.svg';
// import './App.css';


import { useRoutes } from 'react-router-dom';

import ToDoList from './components/ToDoList';


// const DATA = [
//   { id: "todo-0", name: "Eat", completed: true },
//   { id: "todo-1", name: "Sleep", completed: false },
//   { id: "todo-2", name: "Repeat", completed: false },
// ];

function App() {
  const routes = useRoutes(
    [
      {
        path: "/",
        // element: <ToDoList tasks={DATA} />
        element: <ToDoList />
      }
    ]

  );

  return (
    <div>
      {routes}
    </div>
  );
}

export default App;
