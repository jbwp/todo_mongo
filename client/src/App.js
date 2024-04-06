// import logo from './logo.svg';
// import './App.css';
import { useEffect } from 'react';
import ToDoList from './components/ToDoList';


const DATA = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false },
];

function App() {
  return (
    <ToDoList tasks={DATA} />

  );
}

export default App;
