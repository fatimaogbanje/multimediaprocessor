import React, { useState } from 'react';

const FileUpload = ({ onFileProcessed }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [apiRequest, setApiRequest] = useState(''); 

  
  const validateFile = (file) => {
    const validTypes = [
      'image/jpeg', 'image/png', 'video/mp4', 'video/avi', 
      'application/pdf', 'application/vnd.ms-excel', 'text/csv'
    ];
    const maxSize = 50 * 1024 * 1024; 

    if (file.size > maxSize) {
      alert("File size exceeds 50MB.");
      return false;
    }

    if (!validTypes.includes(file.type)) {
      alert("Unsupported file type.");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setFileType(selectedFile.type);
    } else {
      setFile(null);
    }
  };
  const handleUpload = async () => {
    if (!file || !apiRequest) {
      alert("Please select a file and enter your request before uploading.");
      return;
    }
  
    try {
      setUploadStatus('Converting to Data URL...');
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result; 
  
        
        const payload = {
          fileData: dataUrl,
          request: apiRequest
        };
  
        
        const simulateApiCall = async (payload) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ message: 'File processed successfully!', data: payload });
            }, 2000); 
          });
        };
  
        try {
          setUploadStatus('Uploading...');
  
          
          const resultData = await simulateApiCall(payload);
          setUploadStatus('Processing...');
  
          
          onFileProcessed(resultData, file, fileType);
          setUploadStatus('Completed');
        } catch (error) {
          setUploadStatus('Error during upload or processing');
          console.error("Error:", error);
        }
      };
  
      reader.readAsDataURL(file); 
    } catch (error) {
      setUploadStatus('Error during file conversion');
      console.error("Error:", error);
    }
  };
  
  return (
    <div className="file-upload">
      <input type="file" onChange={handleFileChange} />
      
      
      {file && (
        <div className="file-preview">
          <p>Selected File: {file.name} (Type: {fileType})</p>
          {fileType.startsWith('image/') && <img src={URL.createObjectURL(file)} alt="preview" width="200" />}
          {fileType.startsWith('video/') && <video src={URL.createObjectURL(file)} controls width="300" />}
          {fileType === 'application/pdf' && <p>PDF File Preview: {file.name}</p>}
          {fileType === 'application/vnd.ms-excel' && <p>Excel File Preview: {file.name}</p>}
          {fileType === 'text/csv' && <p>CSV File Preview: {file.name}</p>}
        </div>
      )}

      
      {file && (
        <div className="api-request-input">
          <label>
            Enter what information you need (e.g., object detection, scene analysis):
            <input
              type="text"
              value={apiRequest}
              onChange={(e) => setApiRequest(e.target.value)}
              placeholder="Describe what analysis you need"
            />
          </label>
        </div>
      )}

      
      <button onClick={handleUpload} disabled={!file || !apiRequest}>
        Upload & Process
      </button>

      {uploadStatus && <p>Status: {uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
