import React, { useState, useEffect } from 'react';
import { formatDate, isCurrentWeek, getWeekRange, formatDateRange } from '../common/timedate';
import { url } from '../common/commonrequest';
import { GetCustomerReport } from './customerReport';
import { createBulletPoints } from '../common/createbullet';
import { useCustomers } from './customer';
import { useFileUpload } from '../common/fileupload';


function CustomerMainform() {
    const { customerIdToNameMap, customersList } = useCustomers();
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [customerDataList, setCustomerDataList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentWeekDataExists, setCurrentWeekDataExists] = useState(false);
    const [currentReportId, setCurrentReportId] = useState('0');
    const [isReportVisible, setIsReportVisible] = useState(false);
    const { onFileChange, message, uploadedFileName, isSuccess } = useFileUpload();

    useEffect(() => {
        if (selectedCustomer) {
            const fetchCustomerData = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${url}/customer/report/${selectedCustomer}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch customer data');
                    }
                    const data = await response.json();
                    setCustomerDataList(data);

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

            fetchCustomerData();
        } else {
            setCustomerDataList([]);
            setCurrentWeekDataExists(false);
        }
    }, [selectedCustomer]);

    const changePage = () => {
        setIsReportVisible(!isReportVisible);
        if (isReportVisible) {
            setCurrentReportId('0');
        }
    };

    const handleCustomerChange = (event) => {
        setSelectedCustomer(event.target.value);
    };

    const handleFormSubmit = async (event, customerData, start, end) => {
        event.preventDefault();

        const reportId = customerData?.report_id || currentReportId || 0;
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
            customer_id: selectedCustomer
        };
        console.log(formPayload);

        try {
            const response = await fetch(`${url}/customer/report/${reportId}`, {
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
                <h3>WK {formatDateRange(start, end)}</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>Top Highlights</th>
                            <th>Top LowLights</th>
                        </tr>
                        <tr>
                            <td><textarea name="top_highlights" defaultValue="" className='textarea-custom' /></td>
                            <td><textarea name="top_lowlights" defaultValue="" className='textarea-custom' /></td>
                        </tr>
                        <tr>
                            <th>Help Needed</th>
                            <th>Upcoming Milestone</th>
                        </tr>
                        <tr>
                            <td><textarea name="help_needed_ongoing" defaultValue="" className='textarea-custom' /></td>
                            <td><textarea name="upcoming_milestones" defaultValue="" className='textarea-custom' /></td>
                        </tr>
                        <tr>
                            <th>Presentation</th>
                            <td><input type="file" name="presentation" onChange={onFileChange} /><input type ="hidden" name="attachedDoc"defaultValue={uploadedFileName||""} ></input></td>
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
                            <select className='inputfield' value={selectedCustomer} onChange={handleCustomerChange}>
                                <option value="">Select a customer</option>
                                {customersList.map((customer) => (
                                    <option key={customer.customer_id} value={customer.customer_id}>
                                        {customer.customer_name}
                                    </option>
                                ))}
                            </select>

                            {selectedCustomer && (
                                <div>
                                    {currentWeekDataExists ? (
                                        customerDataList
                                            .filter((data) => isCurrentWeek(data.weekstarttime, data.weekendtime))
                                            .map((customerData, index) => {
                                                const { weekstarttime, weekendtime } = customerData;

                                                return (
                                                    <form className='formDiv' key={index} onSubmit={(e) => handleFormSubmit(e, customerData, weekstarttime, weekendtime)}>
                                                        <h3>WK {formatDateRange(weekstarttime, weekendtime)}</h3>
                                                        <input type="hidden" name="report_id" value={customerData.report_id} />
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <th>Top Highlights</th>
                                                                    <th>Top LowLights</th>
                                                                </tr>
                                                                <tr>
                                                                    <td><textarea name="top_highlights" defaultValue={customerData.top_highlights} className='textarea-custom' /></td>
                                                                    <td><textarea name="top_lowlights" defaultValue={customerData.top_lowlights} className='textarea-custom' /></td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Help Needed</th>
                                                                    <th>Upcoming Milestone</th>
                                                                </tr>
                                                                <tr>
                                                                    <td><textarea name="help_needed_ongoing" defaultValue={customerData.help_needed_ongoing} className='textarea-custom' /></td>
                                                                    <td><textarea name="upcoming_milestones" defaultValue={customerData.upcoming_milestones} className='textarea-custom' /></td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Presentation</th>
                                                                    <td><input type="file" name="presentation" onChange={onFileChange} /><input type ="hidden" name="attachedDoc" defaultValue={uploadedFileName || customerData.upload_weekly_presentation || ""}></input>
                                                                    {uploadedFileName || customerData.upload_weekly_presentation ? <a href={`${url}/fileupload/${uploadedFileName || customerData.upload_weekly_presentation}`} target="_blank" rel="noopener noreferrer">Access Attached Document</a> : null}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <button className="submitButton" type="submit">Edit</button>
                                                    </form>
                                                );
                                            })
                                    ) : (
                                        createBlankForm()
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <GetCustomerReport />
            )}
            <div>
                <br></br>
                <button className='inputfield' onClick={changePage}>
                    {isReportVisible ? 'Show Form Page' : 'Show Report Page'}
                </button>
            </div>
        </div>
    );
}

export { CustomerMainform };
