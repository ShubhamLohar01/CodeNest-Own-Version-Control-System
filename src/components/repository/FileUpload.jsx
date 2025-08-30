import React, { useState } from 'react';
import { UploadIcon, XIcon } from '@primer/octicons-react';
import './file-upload.css';

const FileUpload = ({ repoId, onFileUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('description', description);

      const response = await fetch(`http://localhost:3002/repo/${repoId}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setSelectedFile(null);
        setDescription('');
        
        // Notify parent component
        if (onFileUploaded) {
          onFileUploaded(data.file);
        }
        
        alert('File uploaded successfully!');
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
  };

  return (
    <div className="file-upload-container">
      <h3>Upload File to Repository</h3>
      
      <div className="upload-area">
        <input
          type="file"
          id="file-input"
          onChange={handleFileSelect}
          accept=".txt,.js,.py,.java,.cpp,.c,.html,.css,.json,.xml,.md,.pdf,.doc,.docx"
          style={{ display: 'none' }}
        />
        
        {!selectedFile ? (
          <label htmlFor="file-input" className="upload-dropzone">
            <UploadIcon size={24} />
            <p>Click to select file or drag and drop</p>
            <span>Supports: .txt, .js, .py, .java, .cpp, .html, .css, .json, .md, .pdf</span>
          </label>
        ) : (
          <div className="selected-file">
            <div className="file-info">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
            </div>
            <button className="remove-file-btn" onClick={removeFile}>
              <XIcon size={16} />
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="upload-form">
          <div className="form-group">
            <label htmlFor="description">Description (optional):</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this file does..."
              rows="3"
            />
          </div>
          
          <button 
            className="upload-btn" 
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 