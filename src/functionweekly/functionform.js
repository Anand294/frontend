import React, { useState, useEffect } from 'react';
import { formatDate, isCurrentWeek, getWeekRange, formatDateRange } from '../common/timedate';
import { url } from '../common/commonrequest';
import { GetFunctionReport } from './functionReport'; // Assume you have a similar report component for functions
import { createBulletPoints } from '../common/createbullet';
import { useFunctions } from './function'; // Assuming you have a custom hook for functions
import { useFileUpload } from '../common/fileupload';

function FunctionMainform() {
    const { functionIdToNameMap, functionsList } = useFunctions();
    const [selectedFunction, setSelectedFunction] = useState('');
    const [functionDataList, setFunctionDataList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentWeekDataExists, setCurrentWeekDataExists] = useState(false);
    const [currentReportId, setCurrentReportId] = useState('0');
    const [isReportVisible, setIsReportVisible] = useState(false);
    const { onFileChange, message, uploadedFileName, isSuccess } = useFileUpload();

    useEffect(() => {
        if (selectedFunction) {
            const fetchFunctionData = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${url}/function/report/${selectedFunction}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch function data');
                    }
                    const data = await response.json();
                    
                    setFunctionDataList(data);
                    console.log(functionDataList);

                    const { start, end } = getWeekRange();
                    const currentWeekExists = data.some((entry) => {
                        const weekStart = new Date(entry.weekstarttime);
                        const weekEnd = new Date(entry.weekendtime);
                        return weekStart <= end && weekEnd >= start;
                    });
                    setCurrentWeekDataExists(currentWeekExists);
                    
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchFunctionData();
        } else {
            setFunctionDataList([]);
            setCurrentWeekDataExists(false);
        }
    }, [selectedFunction]);

    const changePage = () => {
        setIsReportVisible(!isReportVisible);
        if (isReportVisible) {
            setCurrentReportId('0');
        }
    };

    const handleFunctionChange = (event) => {
        setSelectedFunction(event.target.value);
    };

    const handleFormSubmit = async (event, functionData, start, end) => {
        event.preventDefault();

        const reportId = functionData?.report_id || currentReportId || 0;
        const formData = new FormData(event.target);
        
        const formPayload = {
            top_highlights: formData.get('top_highlights'),
            top_lowlights: formData.get('top_lowlights'),
            help_needed_ongoing: formData.get('help_needed_ongoing'),
            upcoming_milestones: formData.get('upcoming_milestones'),
            weekstarttime: start,
            weekendtime: end,
            attachedDoc: formData.get('attachedDoc'),
            report_id: reportId,
            function_id: selectedFunction
        };

        try {
            const response = await fetch(`${url}/function/report/${reportId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formPayload)
            });

            if (!response.ok) {
                throw new Error('Failed to submit the form');
            }
            const result = await response.json();
            setCurrentReportId(result[0].report_id);
            alert('Form submitted successfully!');
        } catch (error) {
            setError(error.message);
        }
    };

    const createBlankForm = () => {
        const { start, end } = getWeekRange();

        return (
            <form className='formDiv' onSubmit={(e) => handleFormSubmit(e, null, start, end)}>
                <h3>WK- {formatDateRange(start, end)}</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>Topic</th>
                            <th>Top Highlights</th>
                        </tr>
                        <tr>
                            <td>
                                <input type="hidden" name="report_id" value={currentReportId} />
                                <textarea name="top_highlights" defaultValue="" className='textarea-custom' />
                            </td>
                            <td>
                                <textarea name="top_lowlights" defaultValue="" className='textarea-custom' />
                            </td>
                        </tr>
                        <tr>
                            <th>Help Needed</th>
                            <th>Upcoming Milestone</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea name="help_needed_ongoing" defaultValue="" className='textarea-custom' />
                            </td>
                            <td>
                                <textarea name="upcoming_milestones" defaultValue="" className='textarea-custom' />
                            </td>
                        </tr>
                        <tr>
                            <th>Presentation</th>
                            <td>
                            <input type="file" name="presentation" onChange={onFileChange} /><input type ="hidden" name="attachedDoc"defaultValue={uploadedFileName||""} ></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className="submitButton" type="submit">Submit</button>
            </form>
        );
    };

    return (
        <div>
            {!isReportVisible ? (
                <>
                    {error && <p>Error: {error}</p>}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <select className='inputfield' value={selectedFunction} onChange={handleFunctionChange}>
                                <option value="">Select a function</option>
                                {functionsList.map((func) => (
                                    <option key={func.function_id} value={func.function_id}>
                                        {func.function_name}
                                    </option>
                                ))}
                            </select>

                            {selectedFunction && (
                                <div>
                                    {functionDataList.length > 0 ? (
                                        functionDataList
                                        .filter((data) => isCurrentWeek(data.weekstarttime, data.weekendtime))
                                        .map((functionData, index) => {
                                            const editable = isCurrentWeek(functionData.weekstarttime, functionData.weekendtime);
                                            const { weekstarttime, weekendtime } = functionData;

                                            return (
                                                <form className='formDiv' key={index} onSubmit={(e) => handleFormSubmit(e, functionData, weekstarttime, weekendtime)}>
                                                    <h3>WK- {formatDateRange(weekstarttime, weekendtime)}</h3>
                                                    <input type="hidden" name="report_id" value={functionData.report_id} />
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th>Top Highlights</th>
                                                                <th>Top LowLights</th>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <div id="dataDiv">
                                                                        {editable ? (
                                                                            <textarea
                                                                                name="top_highlights"
                                                                                defaultValue={functionData.top_highlights || ''}
                                                                                className='textarea-custom' />
                                                                        ) : (
                                                                            createBulletPoints(functionData.top_highlights || 'N/A')
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div id="dataDiv">
                                                                        {editable ? (
                                                                            <textarea
                                                                                name="top_lowlights"
                                                                                defaultValue={functionData.top_lowlights || ''}
                                                                                className='textarea-custom' />
                                                                        ) : (
                                                                            createBulletPoints(functionData.top_lowlights || 'N/A')
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Help Needed</th>
                                                                <th>Upcoming Milestone</th>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <div id="dataDiv">
                                                                        {editable ? (
                                                                            <textarea
                                                                                name="help_needed_ongoing"
                                                                                defaultValue={functionData.help_needed_ongoing || ''}
                                                                                className='textarea-custom' />
                                                                        ) : (
                                                                            createBulletPoints(functionData.help_needed_ongoing || 'N/A')
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div id="dataDiv">
                                                                        {editable ? (
                                                                            <textarea
                                                                                name="upcoming_milestones"
                                                                                defaultValue={functionData.upcoming_milestones || ''}
                                                                                className='textarea-custom' />
                                                                        ) : (
                                                                            createBulletPoints(functionData.upcoming_milestones || 'N/A')
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Presentation</th>
                                                                <td>
                                                                    {editable ? (<>
                                                                       <input type="file" name="presentation" onChange={onFileChange} /><input type ="hidden" name="attachedDoc" defaultValue={uploadedFileName || functionData.upload_weekly_presentation || ""}></input>
                                                                       {uploadedFileName || functionData.upload_weekly_presentation ? <a href={`${url}/fileupload/${uploadedFileName || functionData.upload_weekly_presentation}`} target="_blank" rel="noopener noreferrer">Access Attached Document</a> : null}</>
                                                                    ) : (
                                                                        <span>{functionData.presentation || 'No file uploaded'}</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    {editable ? (
                                                        <button className="submitButton" type="submit">Edit</button>
                                                    ) : null}
                                                </form>
                                            );
                                        })
                                    ) : (
                                        <p>No reports available.</p>
                                    )}

                                    {!currentWeekDataExists && createBlankForm()}
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : <GetFunctionReport />} {/* Change to your corresponding report component */}
            <div>
                <button className='toggleButton' onClick={changePage}>
                    {isReportVisible ? "Hide Report" : "Show Report"}
                </button>
            </div>
        </div>
    );
}

export{ FunctionMainform};
