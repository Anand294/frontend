import React, { useState, useEffect } from "react";
import { url } from '../common/commonrequest'; // Ensure this points to your API base URL
import { formatDateRange } from "../common/timedate"; // Import necessary utility functions
import { useMisc } from "../miscweekly/misc"; // Custom hook to get misc data

function GetMiscReport({ week, setReportData: setParentReportData }) {
  const { miscIdToNameMap } = useMisc(); 
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMisc, setSelectedMisc] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(week);

  useEffect(() => {
    setSelectedWeek(week); // Update selectedWeek when week prop changes
  }, [week]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${url}/misc/report/all`); // Adjust the endpoint accordingly
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();

        // Log fetched data to verify its structure
        console.log('Fetched Data:', data);

        // Filter data based on selectedWeek and selectedMisc
        const filteredData = data.filter(report => {
          const weekMatches = !selectedWeek || selectedWeek === formatDateRange(report.weekstarttime, report.weekendtime);
          const miscMatches = selectedMisc === "" || report.misc_id === parseInt(selectedMisc);
          return weekMatches && miscMatches;
        });

        // Log filtered data to verify the filter results
        console.log('Filtered Data:', filteredData);

        // Append misc name to each report based on miscIdToNameMap
        const enrichedData = filteredData.map(report => ({
            ...report,
            misc_name: miscIdToNameMap[report.misc_id] || "Unknown Customer"
          }));
  

        // Log enriched data to verify the misc names
        console.log('Enriched Data:', enrichedData);

        setReportData(enrichedData); // Set the enriched data with misc names
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
  }, [selectedMisc, selectedWeek, setParentReportData, miscIdToNameMap]); // Fetch when week or selectedMisc changes

  // Grouping reports by misc_id
  const groupedReports = reportData.reduce((acc, report) => {
    if (!acc[report.misc_id]) {
      acc[report.misc_id] = [];
    }
    acc[report.misc_id].push(report);
    return acc;
  }, {});

  // Convert the grouped object back to an array for rendering
  const groupedArray = Object.keys(groupedReports).map(miscId => ({
    miscId,
    reports: groupedReports[miscId],
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
            <th colSpan={4}>MISC HIGHLIGHTS</th>
          </tr>
          <tr>
            <th>#</th>
            <th>Misc<br/> Name</th>
            <th>Misc<br/> Owner</th>
            <th>Key Highlights</th>
          </tr>
        </thead>
        <tbody>
          {groupedArray.length > 0 ? (
            groupedArray.map((group, index) => {
              const { miscId, reports } = group;
              const rowspan = reports.length;

              // Determine the serial number for the current row
              const serialNumber = index + 1;

              return (
                <React.Fragment key={miscId}>
                  <tr>
                    <td rowSpan={rowspan}>{serialNumber}</td>
                    <td rowSpan={rowspan}>{miscIdToNameMap[miscId] || "Unknown Misc"}</td>
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
                          onChange={(e) => handleInputChange(e, reports[0].report_id, 'top_highlights')} 
                        />
                      </td>
                      <td>
                        <textarea 
                          value={report.upcoming_milestones} 
                          onChange={(e) => handleInputChange(e, reports[0].report_id, 'top_highlights')} 
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

export { GetMiscReport };
