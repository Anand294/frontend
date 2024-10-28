import React, { useState } from "react";
import { CustomerMainform } from './customerweekly/customerform';
import{FunctionMainform} from './functionweekly/functionform';
import{MiscMainform} from './miscweekly/miscform'

function MyWeekly() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  return (
    

    <div>
        <div >
        {selectedOption === "" && <p>Welcome</p>}
        </div>
      <h3>Select an option:</h3>
      <label>
        <input
          type="radio"
          value="Customer"
          checked={selectedOption === "Customer"}
          onChange={() => handleOptionChange("Customer")}
        />
        Customer
      </label>
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;

      <label>
        <input
          type="radio"
          value="Functional"
          checked={selectedOption === "Functional"}
          onChange={() => handleOptionChange("Functional")}
        />
        Functional
      </label>
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      <label>
        <input
          type="radio"
          value="Miscellaneous"
          checked={selectedOption === "Miscellaneous"}
          onChange={() => handleOptionChange("Miscellaneous")}
        />
        Miscellaneous
      </label>

      <div>
        {selectedOption === "Customer" && <CustomerMainform />}
        {selectedOption === "Functional" && <FunctionMainform/>}
        {selectedOption === "Miscellaneous" && <MiscMainform/>}
        {selectedOption === "" && <p>Please select an option</p>}
      </div>
    </div>
  );
}

export { MyWeekly };
