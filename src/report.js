import React, { useState } from "react";
import { GetCustomerReport } from './customerweekly/customerReport';
import{GetFunctionReport} from './functionweekly/functionReport';
import{GetMiscReport} from './miscweekly/miscReport';


function WeeklyReport(){
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
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          <label>
            <input
              type="radio"
              value="All"
              checked={selectedOption === "All"}
              onChange={() => handleOptionChange("All")}
            />
            All
          </label>
    
          <div>
            {selectedOption === "Customer" && <GetCustomerReport/>}
            {selectedOption === "Functional" && <GetFunctionReport/>}
            {selectedOption === "Miscellaneous" && <GetMiscReport/>}
            {selectedOption === "All" &&<><GetCustomerReport/><GetFunctionReport/> <GetMiscReport/></>}
            {selectedOption === "" && <p>Please select an option</p>}
          </div>
        </div>
      );
  
}
export{WeeklyReport};