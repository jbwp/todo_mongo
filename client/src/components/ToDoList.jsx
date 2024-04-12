
import { useState, useRef, useEffect } from 'react';
import FilterButton from './FilterButton';
import Form from './Form';
import Todo from './Todo.jsx';
// import { nanoid } from "nanoid";
import { useNavigate, useLocation } from "react-router-dom";




function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


const ToDoList = (props) => {

  // const [tasks, setTasks] = useState(props.tasks);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  console.log(tasks);

  const navigate = useNavigate()
  const location = useLocation();

  // const FILTER_MAP = {
  //   All: () => true,
  //   Active: (task) => !task.completed,
  //   Completed: (task) => task.completed,
  // }

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.done,
    Completed: (task) => task.done,
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

  async function addTask(name) {
    // const newTask = { id: `todo-${nanoid()}`, name, completed: false };

    const newTask = { name };
    try {
      const response = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask)
      })

      if (!response.ok) {
        const message = await response.json()
        window.alert(message.error);
        return;
      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      navigate("/");
    }

    // setTasks([...tasks, newTask]);
  }


  async function toggleTaskCompleted(id, completed) {

    try {
      const response = await fetch(`http://localhost:3001/${id}/toggle`, {
        method: "POST",
        body: JSON.stringify({ done: completed }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok && response.status === 404) {
        const message = `Record with id ${id} ${response.statusText.toLowerCase()}`
        window.alert(message);
      } else if (!response.ok && response.status === 400) {
        const message = await response.json();
        window.alert(message.error);
        return;
      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      navigate("/");
    }
    // const updatedTasks = tasks.map((task) => {
    //   if (id === task.id) {
    //     return { ...task, completed: !task.completed };
    //   }
    //   return task;
    // });
    // setTasks(updatedTasks);
  }

  async function editTask(id, newName) {
    try {
      const response = await fetch(`http://localhost:3001/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: newName }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok && response.status === 404) {
        const message = `Record with id ${id} ${response.statusText.toLowerCase()}`
        window.alert(message);
      } else if (!response.ok && response.status === 400) {
        const message = await response.json();
        window.alert(message.error);
        return;
      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      navigate("/");
    }

    // const editedTaskList = tasks.map((task) => {
    //   if (id === task.id) {
    //     return { ...task, name: newName }
    //   }
    //   return task;
    // });
    // setTasks(editedTaskList);
  }

  async function deleteTask(id) {
    await fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    })
    const remainingTasks = tasks.filter((task) => task._id !== id);
    setTasks(remainingTasks);
  }

  const taskList = tasks.filter(FILTER_MAP[filter]).map(task =>
    <Todo
      // id={task.id}
      id={task._id}
      name={task.name}
      // completed={task.completed}
      completed={task.done}
      // key={task.id}
      key={task._id}
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

  useEffect(() => {
    async function getTasks() {
      const response = await fetch(`http://localhost:3001/`);
      if (!response.ok) {
        const message = `An error occurred:${response.statusText}`
        window.alert(message);
        return;
      }

      const tasks = await response.json();
      setTasks(tasks);
    }
    getTasks();
    return;
  }, [location]);
  /* location + navigate (w addTodo) => odświeża after addTask, editTask and toggling */

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