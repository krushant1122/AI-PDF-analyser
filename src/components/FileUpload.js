import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadSuccess(response.data.document_id);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Upload PDF</Typography>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
};

export default FileUpload;
