import React, { useState } from 'react';
import SingleSelect from 'react-select';  // Assuming react-select is used for dropdowns

const MainForm = () => {
  // Initial state setup for form fields
  const [formData, setFormData] = useState({
    reqNo: '',
    domain: '',
    subDomain: '',
    position: '',
    location: '',
    newHireRequest: '',
    replacementRequest: '',
    justification: '',
    hiringTrackerOption: '',
    justificationStatement: '',
  });

  // Dropdown options
  const domainOptions = [
    { value: 'IT', label: 'IT' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    // Add more domain options as needed
  ];

  const subDomainOptions = [
    { value: 'Development', label: 'Development' },
    { value: 'Support', label: 'Support' },
    { value: 'Operations', label: 'Operations' },
    // Add more sub-domain options as needed
  ];

  const positionOptions = [
    { value: 'Manager', label: 'Manager' },
    { value: 'Engineer', label: 'Engineer' },
    { value: 'Analyst', label: 'Analyst' },
    // Add more position options as needed
  ];

  const hiringTrackerOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    // Add more options based on the "hiring tracker system"
  ];

  // Handlers for form input and select changes
  const handleChange = (selectedOption, field) => {
    setFormData({
      ...formData,
      [field]: selectedOption ? selectedOption.value : '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Logic to send formData to backend or API
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Req No.</label>
        <input
          type="text"
          name="reqNo"
          value={formData.reqNo}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Domain</label>
        <SingleSelect
          name="domain"
          options={domainOptions}
          onChange={(selectedOption) => handleChange(selectedOption, 'domain')}
          value={domainOptions.find(option => option.value === formData.domain)}
          menuPlacement="bottom"
        />
      </div>

      <div>
        <label>Sub-domain</label>
        <SingleSelect
          name="subDomain"
          options={subDomainOptions}
          onChange={(selectedOption) => handleChange(selectedOption, 'subDomain')}
          value={subDomainOptions.find(option => option.value === formData.subDomain)}
          menuPlacement="bottom"
        />
      </div>

      <div>
        <label>Position</label>
        <SingleSelect
          name="position"
          options={positionOptions}
          onChange={(selectedOption) => handleChange(selectedOption, 'position')}
          value={positionOptions.find(option => option.value === formData.position)}
          menuPlacement="bottom"
        />
      </div>

      <div>
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>New Hire Request</label>
        <input
          type="checkbox"
          name="newHireRequest"
          checked={formData.newHireRequest}
          onChange={() =>
            setFormData({ ...formData, newHireRequest: !formData.newHireRequest })
          }
        />
      </div>

      <div>
        <label>Replacement Request</label>
        <input
          type="checkbox"
          name="replacementRequest"
          checked={formData.replacementRequest}
          onChange={() =>
            setFormData({ ...formData, replacementRequest: !formData.replacementRequest })
          }
        />
      </div>

      <div>
        <label>Justification for Request</label>
        <textarea
          name="justification"
          value={formData.justification}
          onChange={handleInputChange}
          rows="4"
        />
      </div>

      <div>
        <label>Hiring Tracker Options</label>
        <SingleSelect
          name="hiringTrackerOption"
          options={hiringTrackerOptions}
          onChange={(selectedOption) => handleChange(selectedOption, 'hiringTrackerOption')}
          value={hiringTrackerOptions.find(option => option.value === formData.hiringTrackerOption)}
          menuPlacement="bottom"
        />
      </div>

      <div>
        <label>Justification Statement</label>
        <input
          type="text"
          name="justificationStatement"
          value={formData.justificationStatement}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default MainForm;
