import React, { useState, useEffect } from "react";
import { url } from '../common/commonrequest';
import { formatDate ,formatDateRange,getWeeklyRanges} from "../common/timedate";
import { createBulletPoints } from "../common/createbullet";
import { useCustomers } from "./customer";

function GetCustomerReport() {
  const { customerIdToNameMap, customersList } = useCustomers(); 
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch(`${url}/customer/report/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleCustomerChange = (event) => {
    setSelectedCustomer(event.target.value);
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  // Filtering logic for both customer and week
  const filteredReports = reportData.filter(data => {
    
    console.log(selectedWeek+"-"+formatDateRange(data.weekstarttime,data.weekendtime));

    const customerMatches = selectedCustomer === "" || data.customer_id === parseInt(selectedCustomer);
    const weekMatches = !selectedWeek || selectedWeek===formatDateRange(data.weekstarttime,data.weekendtime);

    return customerMatches && weekMatches;
  });

  // Grouping reports by customer_id
  const groupedReports = filteredReports.reduce((acc, report) => {
    if (!acc[report.customer_id]) {
      acc[report.customer_id] = [];
    }
    acc[report.customer_id].push(report);
    return acc;
  }, {});

  // Convert the grouped object back to an array for rendering
  const groupedArray = Object.keys(groupedReports).map(customerId => ({
    customerId,
    reports: groupedReports[customerId],
  }));

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div>
        <label htmlFor="customer-select">Select Customer:</label>
        &nbsp;
        
        <select className="inputfield" id="customer-select" onChange={handleCustomerChange}>
          <option value="">All Customers</option>
          {customersList.map(customer => (
            <option key={customer.customer_id} value={customer.customer_id}>
              {customer.customer_name}
            </option>
          ))}
        </select>
        &nbsp;
        &nbsp;
        &nbsp;

        <select className="inputfield" id="week-select" onChange={handleWeekChange}>
  <option value="">All Weeks</option>
  {getWeeklyRanges().reverse().map((weekRange, index) => (
    <option key={index} value={weekRange}>
      WK {weekRange}
    </option>
  ))}
</select>
        
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer ID</th>
            <th>Top Highlights</th>
            <th>Top Lowlights</th>
            <th>Help Needed</th>
            <th>Upcoming Milestones</th>
            <th>Week Start</th>
            <th>Week End</th>
          </tr>
        </thead>
        <tbody>
          {groupedArray.length > 0 ? (
            groupedArray.map((group, index) => {
              const { customerId, reports } = group;
              const rowspan = reports.length;

              // Determine the serial number for the current row
              const serialNumber = index + 1;

              return (
                <React.Fragment key={customerId}>
                  <tr>
                    <td rowSpan={rowspan}>{serialNumber}</td>
                    <td rowSpan={rowspan}>{customerIdToNameMap[customerId] || ""}</td>
                    <td><div className="dataDiv">{createBulletPoints(reports[0].top_highlights)}</div></td>
                    <td><div className="dataDiv">{createBulletPoints(reports[0].top_lowlights)}</div></td>
                    <td><div className="dataDiv">{createBulletPoints(reports[0].help_needed_ongoing)}</div></td>
                    <td><div className="dataDiv">{createBulletPoints(reports[0].upcoming_milestones)}</div></td>
                    <td>{formatDate(reports[0].weekstarttime)}</td>
                    <td>{formatDate(reports[0].weekendtime)}</td>
                  </tr>
                  {reports.slice(1).map((report, reportIndex) => (
                    <tr key={reportIndex}>
                      <td><div className="dataDiv">{createBulletPoints(report.top_highlights)}</div></td>
                      <td><div className="dataDiv">{createBulletPoints(report.top_lowlights)}</div></td>
                      <td><div className="dataDiv">{createBulletPoints(report.help_needed_ongoing)}</div></td>
                      <td><div className="dataDiv">{createBulletPoints(report.upcoming_milestones)}</div></td>
                      <td>{formatDate(report.weekstarttime)}</td>
                      <td>{formatDate(report.weekendtime)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="8">No Data Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { GetCustomerReport };
