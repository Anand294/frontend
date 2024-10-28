import React, { useState, useEffect } from "react";
import { url } from '../common/commonrequest'; // Ensure this points to your API base URL
import { formatDateRange } from "../common/timedate"; // Import necessary utility functions
import { useFunctions } from "../functionweekly/function"; // Custom hook to get functions data

function GetFunctionReport({ week, setReportData: setParentReportData }) {
  const { functionIdToNameMap } = useFunctions(); 
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(week);

  useEffect(() => {
    setSelectedWeek(week); // Update selectedWeek when week prop changes
  }, [week]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${url}/function/report/all`); // Adjust the endpoint accordingly
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();

        // Log fetched data to verify its structure
        console.log('Fetched Data:', data);

        // Filter data based on selectedWeek and selectedFunction
        const filteredData = data.filter(report => {
          const weekMatches = !selectedWeek || selectedWeek === formatDateRange(report.weekstarttime, report.weekendtime);
          const functionMatches = selectedFunction === "" || report.function_id === parseInt(selectedFunction);
          return weekMatches && functionMatches;
        });

        // Log filtered data to verify the filter results
        console.log('Filtered Data:', filteredData);

        // Append function name to each report based on functionIdToNameMap
        const enrichedData = filteredData.map(report => ({
            ...report,
            function_name: functionIdToNameMap[report.function_id] || "Unknown function"
          }));

        // Log enriched data to verify the function names
        console.log('Enriched Data:', enrichedData);

        setReportData(enrichedData); // Set the enriched data with function names
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
  }, [selectedFunction, selectedWeek, setParentReportData, functionIdToNameMap]); // Fetch when week or selectedFunction changes

  // Grouping reports by function_id
  const groupedReports = reportData.reduce((acc, report) => {
    if (!acc[report.function_id]) {
      acc[report.function_id] = [];
    }
    acc[report.function_id].push(report);
    return acc;
  }, {});

  // Convert the grouped object back to an array for rendering
  const groupedArray = Object.keys(groupedReports).map(functionId => ({
    functionId,
    reports: groupedReports[functionId],
  }));

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>; // Display error message
  }

  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th colSpan={4}>FUNCTIONAL HiGHLIGHTS</th>
          </tr>
          <tr>
            <th>#</th>
            <th>Function<br/> Name</th>
            <th>Function<br/> Owner</th>
            <th>Key Highlights</th>
          </tr>
        </thead>
        <tbody>
          {groupedArray.length > 0 ? (
            groupedArray.map((group, index) => {
              const { functionId, reports } = group;
              const rowspan = reports.length;

              // Determine the serial number for the current row
              const serialNumber = index + 1;

              return (
                <React.Fragment key={functionId}>
                  <tr>
                    <td rowSpan={rowspan}>{serialNumber}</td>
                    <td rowSpan={rowspan}>{functionIdToNameMap[functionId] || "Unknown Function"}</td>
                    <td></td>
                    <td>
                      <textarea className="textarea-custom"
                        value={reports[0].top_highlights} 
                        onChange={(e) => handleInputChange(e, reports[0].report_id, 'top_highlights')} 
                      />
                    </td>
                  </tr>
                  {reports.slice(1).map((report, reportIndex) => (
                    <tr key={reportIndex}>
                      <td>
                        <textarea 
                          value={report.top_highlights} 
                          onChange={(e) => handleInputChange(e, reports[0].report_id, 'top_highlights')} 
                        />
                      </td>
                      <td>
                        <textarea 
                          value={report.top_lowlights} 
                          onChange={(e) => handleInputChange(e, reports[0].report_id, 'top_highlights')} 
                        />
                      </td>
                      <td>
                        <textarea 
                          value={report.help_needed_ongoing} 
                          onChange={(e) =>handleInputChange(e, reports[0].report_id, 'top_highlights')} 
                        />
                      </td>
                      <td>
                        <textarea 
                          value={report.upcoming_milestones} 
                          onChange={(e) =>handleInputChange(e, reports[0].report_id, 'top_highlights')} 
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

export { GetFunctionReport };
