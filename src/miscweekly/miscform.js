import React, { useState, useEffect } from 'react';
import { formatDate, isCurrentWeek, getWeekRange, formatDateRange } from '../common/timedate';
import { url } from '../common/commonrequest';
import { GetMiscReport } from './miscReport'; // Adjust the import based on your file
import { createBulletPoints } from '../common/createbullet';
import { useMisc } from './misc';
import '../App.css';
import { useFileUpload } from '../common/fileupload';

function MiscMainform() {
    const { miscIdToNameMap, miscList } = useMisc();
    const [selectedMisc, setSelectedMisc] = useState('');
    const [miscDataList, setMiscDataList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentWeekDataExists, setCurrentWeekDataExists] = useState(false);
    const [currentReportId, setCurrentReportId] = useState('0');
    const [isReportVisible, setIsReportVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [filteredMiscList, setFilteredMiscList] = useState([]);
    const { onFileChange, message, uploadedFileName, isSuccess } = useFileUpload();

    useEffect(() => {
        if (selectedMisc) {
            const fetchMiscData = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${url}/misc/report/${selectedMisc}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch misc data');
                    }
                    const data = await response.json();
                    setMiscDataList(data);
                    console.log(miscDataList);

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

            fetchMiscData();
        } else {
            setMiscDataList([]);
            setCurrentWeekDataExists(false);
        }
    }, [selectedMisc]);

    useEffect(() => {
        // Filter miscList based on inputValue
        if (inputValue) {
            const filteredList = miscList.filter(misc =>
                misc.misc_name.toLowerCase().includes(inputValue.toLowerCase())
            );
            
            if (filteredList.length === 0) {
                // Add the input value as a new entry with misc_id 0
                filteredList.push({
                    misc_id: 0,
                    misc_name: inputValue
                });
            }
        
            setFilteredMiscList(filteredList);
            setSelectedMisc(filteredList.length === 0 ? 0 : filteredList[0].misc_id);
           // console.log(selectedMisc);
        } else {
            setFilteredMiscList([]);
        }
    }, [inputValue, miscList]);

    const changePage = () => {
        setIsReportVisible(!isReportVisible);
        if (isReportVisible) {
            setCurrentReportId('0');
        }
    };

    const handleMiscChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleMiscSelect = (miscId) => {
        setSelectedMisc(miscId);
        const selectedMiscName = miscIdToNameMap[miscId]; // Adjust if necessary to map ID to name
        setInputValue(selectedMiscName);
        setFilteredMiscList([]);
    };

    const handleFormSubmit = async (event, miscData, start, end) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const reportId = formData.get('report_id');

        const formPayload = {
            top_highlights: formData.get('top_highlights'),
            top_lowlights: formData.get('top_lowlights'),
            help_needed_ongoing: formData.get('help_needed_ongoing'),
            upcoming_milestones: formData.get('upcoming_milestones'),
            weekstarttime: start,
            weekendtime: end,
            attachedDoc: formData.get('attachedDoc'),
            report_id: reportId,
            misc_id: selectedMisc || '0', // Set to '0' if selectedMisc is falsy
            input_value: inputValue // Include inputValue in the form payload
        };
        console.log(`${url}/misc/report/${reportId}`);
        console.log(JSON.stringify(formPayload));
        try {
            const response = await fetch(`${url}/misc/report/${reportId}`, {
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
                <h3> WK {formatDateRange(start, end)} </h3>
                <input type="hidden" name="report_id" value={currentReportId} />
                <table>
                    <tbody>
                        <tr>
                            <th>Top Highlights</th>
                            <td>
                                <textarea name="top_highlights" defaultValue="" className='textarea-custom' />
                            </td>
                            <th>Top LowLights</th>
                            <td>
                                <textarea name="top_lowlights" defaultValue="" className='textarea-custom' />
                            </td>
                        </tr>
                        <tr>
                            <th>Help Needed</th>
                            <td>
                                <textarea name="help_needed_ongoing" defaultValue="" className='textarea-custom' />
                            </td>
                            <th>Upcoming Milestone</th>
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
                <button type="submit">Submit</button>
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
                            <div>
                                <input
                                    className='inputfield'
                                    type="text"
                                    value={inputValue}
                                    onChange={handleMiscChange}
                                    placeholder="Type to search for misc..."
                                />
                                {filteredMiscList.length > 0 && (
                                    <ul className="suggestions">
                                        {filteredMiscList.map((misc) => (
                                            <li key={misc.misc_id} onClick={() => handleMiscSelect(misc.misc_id)}>
                                                {misc.misc_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {selectedMisc && (
                                <div>
                                    {currentWeekDataExists? (
                                        miscDataList
                                        .filter((data) => isCurrentWeek(data.weekstarttime, data.weekendtime))
                                        .map((miscData, index) => {
                                            const editable = isCurrentWeek(miscData.weekstarttime, miscData.weekendtime);
                                            const { weekstarttime, weekendtime } = miscData;

                                            return (
                                                <form className='formDiv' key={index} onSubmit={(e) => handleFormSubmit(e, miscData, weekstarttime, weekendtime)}>
                                                    <h3>WK {formatDateRange(weekstarttime, weekendtime)}</h3>
                                                    <input type="hidden" name="report_id" value={miscData.report_id} />
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th>Top Highlights</th>
                                                                <td>
                                                                    {editable ? (
                                                                        <textarea
                                                                            name="top_highlights"
                                                                            defaultValue={miscData.top_highlights || ''}
                                                                            className='textarea-custom' />
                                                                    ) : (
                                                                        createBulletPoints(miscData.top_highlights || 'N/A')
                                                                    )}
                                                                </td>
                                                                <th>Top LowLights</th>
                                                                <td>
                                                                    {editable ? (
                                                                        <textarea
                                                                            name="top_lowlights"
                                                                            defaultValue={miscData.top_lowlights || ''}
                                                                            className='textarea-custom' />
                                                                    ) : (
                                                                        createBulletPoints(miscData.top_lowlights || 'N/A')
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Help Needed</th>
                                                                <td>
                                                                    {editable ? (
                                                                        <textarea
                                                                            name="help_needed_ongoing"
                                                                            defaultValue={miscData.help_needed_ongoing || ''}
                                                                            className='textarea-custom' />
                                                                    ) : (
                                                                        createBulletPoints(miscData.help_needed_ongoing || 'N/A')
                                                                    )}
                                                                </td>
                                                                <th>Upcoming Milestone</th>
                                                                <td>
                                                                    {editable ? (
                                                                        <textarea
                                                                            name="upcoming_milestones"
                                                                            defaultValue={miscData.upcoming_milestones || ''}
                                                                            className='textarea-custom' />
                                                                    ) : (
                                                                        createBulletPoints(miscData.upcoming_milestones || 'N/A')
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Presentation</th>
                                                                <td>
                                                                    {editable ? (<>
                                                                        <input type="file" name="presentation" onChange={onFileChange} /><input type ="hidden" name="attachedDoc" defaultValue={uploadedFileName || miscData.upload_weekly_presentation || ""}></input>
                                                                        {uploadedFileName || miscData.upload_weekly_presentation ? <a href={`${url}/fileupload/${uploadedFileName || miscData.upload_weekly_presentation}`} target="_blank" rel="noopener noreferrer">Access Attached Document</a> : null}</>
                                                                    ) : (
                                                                        <a href={miscData.upload_weekly_presentation} target="_blank" rel="noopener noreferrer">View Presentation</a>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    {editable && <button type="submit">Update</button>}
                                                </form>
                                            );
                                        })
                                    ) : createBlankForm()} {/* Call createBlankForm if miscDataList is empty */}
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <GetMiscReport />
            )}
            {selectedMisc===0&&createBlankForm()}
            <button onClick={changePage}>{isReportVisible ? 'Back' : 'View Report'}</button>
        </div>
    );
}

export {MiscMainform};
