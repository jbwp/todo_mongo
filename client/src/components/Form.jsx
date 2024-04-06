import { useState } from "react";



const Form = (props) => {
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addTask(name);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        <label
          htmlFor="new-todo-input"
          className="label_lg"
        >
          What needs to be done?
        </label>
      </h2>
      <input
        type='text'
        id='new-todo-input'
        name='text'
        value={name}
        onChange={handleChange}
      />
      <button
        type='submit'
        className="btn_lg"
      >Add</button>
    </form>
  );
}

export default Form;