import { useState } from "react";
import { default as ReactSelect } from "react-select";

const SingleSelect = (props) => {
  const name = props.name;
  const itemOptions = props.options;

  const [selectInput, setSelectInput] = useState("");

  // Filter options based on the input
  const customFilterOption = ({ label }, input) =>
    label.toLowerCase().includes(input.toLowerCase());

  // Handle input change and reset input when menu closes
  const onInputChange = (inputValue, event) => {
    if (event.action === "input-change") setSelectInput(inputValue);
    else if (event.action === "menu-close") setSelectInput("");
  };

  // Handle selection of an option
  const handleChange = (selected) => {
    props.onChange(selected || null); // Update with selected option or clear if null
  };

  // Custom styles for the dropdown and selected options
  const customStyles = {
    option: (styles, { isSelected, isFocused }) => ({
      ...styles,
      backgroundColor: isSelected ? "#DEEBFF" : isFocused ? "#f0f0f0" : null,
      color: isSelected ? "#fff" : "#000",
    }),
    menu: (def) => ({ ...def, zIndex: 9999 }),
  };

  return (
    <ReactSelect
      {...props}
      inputValue={selectInput}
      onInputChange={onInputChange}
      onChange={handleChange}
      options={itemOptions}
      filterOption={customFilterOption}
      menuPlacement={props.menuPlacement ?? "auto"}
      styles={customStyles}
      isClearable // Optional: allow clearing the selection
      closeMenuOnSelect={true}
      blurInputOnSelect={true}
    />
  );
};

export default SingleSelect;
