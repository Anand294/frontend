import React, { useState, useEffect } from "react";
import { url } from '../common/commonrequest';
import { formatDateRange } from "../common/timedate";
import { useCustomers } from "../customerweekly/customer";

function GetCustomerReport({ week, setReportData: setParentReportData }) {
  const { customerIdToNameMap, customersList } = useCustomers(); 
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(""); // Default no customer selected
  const [selectedWeek, setSelectedWeek] = useState(week);

  // Sync the passed 'week' prop with the local state
  useEffect(() => {
    setSelectedWeek(week);
  }, [week]);

  // Fetch report data when the component is first loaded or the week changes
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${url}/customer/report/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
         console.log(data);
        // Filter the data based on selected customer and week
        const filteredData = data.filter(report => {
          const customerMatches = selectedCustomer === "" || report.customer_id === parseInt(selectedCustomer);
          const weekMatches = !selectedWeek || selectedWeek === formatDateRange(report.weekstarttime, report.weekendtime);
          return customerMatches && weekMatches;
        });

        // Append customer name to each report based on customerIdToNameMap
        const enrichedData = filteredData.map(report => ({
          ...report,
          customer_name: customerIdToNameMap[report.customer_id] || "Unknown Customer"
        }));

        setReportData(enrichedData); // Set the enriched data with customer names
        if (setParentReportData) {
          setParentReportData(enrichedData); // Update parent component with enriched data
        }
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedCustomer, selectedWeek, setParentReportData, customerIdToNameMap]);

  // Function to handle input change and update report data
  const handleInputChange = (e, reportId, field) => {
    const updatedValue = e.target.value;
    setReportData(prevData => {
      const updatedData = prevData.map(report =>
        report.report_id === reportId ? { ...report, [field]: updatedValue } : report
      );
      if (setParentReportData) {
        setParentReportData(updatedData); // Update parent component if setReportData is passed
      }
      return updatedData;
    });
  };

  // Group reports by customer
  const groupedReports = reportData.reduce((acc, report) => {
    if (!acc[report.customer_id]) {
      acc[report.customer_id] = [];
    }
    acc[report.customer_id].push(report);
    return acc;
  }, {});

  // Convert grouped reports to an array for rendering
  const groupedArray = Object.keys(groupedReports).map(customerId => ({
    customerId,
    reports: groupedReports[customerId],
  }));

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Error state
  if (error) {
    return <p>{error}</p>; // Display error message
  }

  // Main rendering
  return (
    <div>
      <table border="1">
        <thead>
          <tr><th colSpan={4}>Customer Highlights</th></tr>
          <tr>
            <th>#</th>
            <th>Customer Name</th>
            <th>SPOC</th>
            <th>Highlights/Summary of the week</th>
          </tr>
        </thead>
        <tbody>
          {groupedArray.length > 0 ? (
            groupedArray.map((group, index) => {
              const { customerId, reports } = group;
              const rowspan = reports.length;

              const serialNumber = index + 1;

              return (
                <React.Fragment key={customerId}>
                  <tr>
                    <td rowSpan={rowspan}>{serialNumber}</td>
                    <td rowSpan={rowspan}>{customerIdToNameMap[customerId] || ""}</td>
                    <td>Anand Kumar</td>
                    <td>
                      <h4>Highlights</h4>
                      <textarea
                        className="textarea-custom"
                        value={reports[0].top_highlights}
                        onChange={(e) => handleInputChange(e, reports[0].report_id, 'top_highlights')}
                      />
                      <h4>Next Steps</h4>
                      <textarea
                        className="textarea-custom"
                        value={reports[0].upcoming_milestones}
                        onChange={(e) => handleInputChange(e, reports[0].report_id, 'upcoming_milestones')}
                      />
                      <h4>Help Needed</h4>
                      <textarea
                        className="textarea-custom"
                        value={reports[0].help_needed_ongoing}
                        onChange={(e) => handleInputChange(e, reports[0].report_id, 'help_needed_ongoing')}
                      />
                    </td>
                  </tr>
                  {reports.slice(1).map((report, reportIndex) => (
                    <tr key={reportIndex}>
                      <td>
                        <textarea
                          className="textarea-custom"
                          value={report.top_highlights}
                          onChange={(e) => handleInputChange(e, report.report_id, 'top_highlights')}
                        />
                      </td>
                      <td>
                        <textarea
                          className="textarea-custom"
                          value={report.top_lowlights}
                          onChange={(e) => handleInputChange(e, report.report_id, 'top_lowlights')}
                        />
                      </td>
                      <td>
                        <textarea
                          className="textarea-custom"
                          value={report.help_needed_ongoing}
                          onChange={(e) => handleInputChange(e, report.report_id, 'help_needed_ongoing')}
                        />
                      </td>
                      <td>
                        <textarea
                          className="textarea-custom"
                          value={report.upcoming_milestones}
                          onChange={(e) => handleInputChange(e, report.report_id, 'upcoming_milestones')}
                        />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">No Data Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { GetCustomerReport };
