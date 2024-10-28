import { useState } from 'react';
import axios from 'axios';
import { url } from './commonrequest';

const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle file selection and automatic upload with event
  const onFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    setSelectedFile(file);

    // Automatically upload the file when it's selected
    const formData = new FormData();
    formData.append('file', file);
     console.log(`${url}/fileupload/upload`);
    try {
      const res = await axios.post(`${url}/fileupload/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setIsSuccess(true);
      setMessage('File uploaded successfully!');
      setUploadedFileName(res.data.filename);  // Save the new file name from response

    } catch (err) {
      console.error(err);
      setMessage('File upload failed.');
      setIsSuccess(false);
    }
  };

  return {
    onFileChange,   // Expose file change handler (auto-upload)
    message,        // Expose message state
    uploadedFileName, // Expose uploaded file name
    isSuccess,      // Expose upload success state
  };
};

export {useFileUpload};
