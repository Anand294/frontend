import React, { useState, useEffect } from "react";
import { getWeeklyRanges, getWeekRange, formatDateRange } from "../common/timedate";
import { GetCustomerReport } from './customerexe';
import { GetFunctionReport } from "./functionexe";
import { GetMiscReport } from "./miscexe";
import { url } from '../common/commonrequest'; // Assuming you have this for the API URL

function ExeDashPage() {
  const { start, end } = getWeekRange();
  const [selectedWeek, setSelectedWeek] = useState(formatDateRange(start, end));
  
  // State to hold data from each report component
  const [customerReportData, setCustomerReportData] = useState([]);
  const [functionReportData, setFunctionReportData] = useState([]);
  const [miscReportData, setMiscReportData] = useState([]);

  const handleWeekChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedWeek(selectedValue);
  };

  // Function to submit data
  const handleSubmit = async () => {
    console.log(customerReportData);
    console.log(functionReportData);
    console.log(miscReportData);
    const requestData = {
      customerReportData,
      functionReportData,
      miscReportData,
      selectedWeek
    };
    console.log(requestData);
  
   try {
      const response = await fetch(`${url}/sendmail/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Report submitted successfully", result);
      } else {
        console.error("Error submitting report:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div>
      <div>
        <h3>Executive Dashboard</h3>
        <select className="inputfield" id="week-select" onChange={handleWeekChange} value={selectedWeek}>
          {getWeeklyRanges().reverse().map((weekRange, index) => (
            <option key={index} value={weekRange}>
              WK {weekRange}
            </option>
          ))}
        </select>
      </div>

      {selectedWeek && (
        <>
          <p>Selected Week: {selectedWeek}</p>
          <GetCustomerReport week={selectedWeek} setReportData={setCustomerReportData} />
          <GetFunctionReport week={selectedWeek} setReportData={setFunctionReportData} />
          <GetMiscReport week={selectedWeek} setReportData={setMiscReportData} />
        </>
      )}

      <button className="inputfield" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export { ExeDashPage };
