
import { useState, useRef, useEffect } from 'react';
import FilterButton from './FilterButton';
import Form from './Form';
import Todo from './Todo.jsx';
import { nanoid } from "nanoid";


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


const ToDoList = (props) => {

  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  }

  const FILTER_NAMES = Object.keys(FILTER_MAP);


  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ))

  const addTask = (name) => {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }


  const toggleTaskCompleted = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  const editTask = (id, newName) => {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName }
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const deleteTask = (id) => {
    const remainingTasks = tasks.filter((task) => task.id !== id);
    setTasks(remainingTasks);
    // console.log(id);
  }

  const taskList = tasks.filter(FILTER_MAP[filter]).map(task =>
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  );


  const taskNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${taskNoun} remaining`;

  const listHeadingRef = useRef(null);

  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);


  return (
    <div className="container">
      <h1>Todo List</h1>
      <Form addTask={addTask} />
      <div className='filters btn-group'>
        {filterList}
      </div>
      <br />
      <h2
        id='list-heading'
        tabIndex="-1"
        ref={listHeadingRef}
      >{headingText}
      </h2>
      <ul className='todo-list'>
        {taskList}
      </ul>
    </div>
  );
}

export default ToDoList;