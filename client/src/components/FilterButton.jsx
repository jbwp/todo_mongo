
const FilterButton = (props) => {

  return (
    <button
      type="button"
      onClick={() => (
        props.setFilter(props.name)
      )}
      className="toggle-btn"
      aria-pressed={props.isPressed}
    >
      <span>{props.name}</span>
    </button>
  );
}

export default FilterButton;