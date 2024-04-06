import { useState, useRef, useEffect } from "react";


const Todo = ({ name, completed, id, toggleTaskCompleted, deleteTask, editTask }) => {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  // console.log(isEditing);
  // console.log(wasEditing);

  // console.log(editButtonRef.current);
  // console.log(editFieldRef.current);



  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }


  const handleChange = (e) => {
    setNewName(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    editTask(id, newName);
    setNewName('');
    setEditing(false);
  }

  const editingTemplate = (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor={id}>New name for {name}:</label>
          <br />
          <input
            id={id}
            type='text'
            value={newName}
            onChange={handleChange}
            ref={editFieldRef}
          />
        </div>
        <div>
          <button
            type='button'
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
          <button type='submit'>
            Save
          </button>
        </div>
      </form>
    </>
  );

  const viewTemplate = (
    <>
      <div className="c-cb"  >
        <input
          id={id}
          type='checkbox'
          defaultChecked={completed}
          onChange={() => {
            toggleTaskCompleted(id)
          }}
          className="checkbox"
        />
        <label
          htmlFor={id}
          className="todo-label"
        >{name}</label>
      </div>
      <div className="btn-group">
        <button
          type='button'
          onClick={() => setEditing(true)}
          ref={editButtonRef}
        >
          Edit
        </button>
        <button
          type='button'
          onClick={() => {
            deleteTask(id);
          }}
          className="btn_danger"
        >
          Delete
        </button>
      </div>
    </>
  )

  useEffect(() => {
    if (!wasEditing && isEditing) {
      editFieldRef.current.focus();
    } else if (wasEditing && !isEditing) { editButtonRef.current.focus() }
    // console.log("side effect");
  }, [wasEditing, isEditing])

  // console.log("main render");
  return (
    <li className="todo" >
      {isEditing ? editingTemplate : viewTemplate}
    </li>
  );
}

export default Todo;