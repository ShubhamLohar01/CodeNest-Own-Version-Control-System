import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import FileUpload from "./FileUpload";
import { 
  RepoIcon, 
  CodeIcon,
  FileIcon,
  DownloadIcon,
  CopyIcon,
  IssueOpenedIcon
} from "@primer/octicons-react";
import "./repository-view.css";

const RepositoryView = () => {
  const { id } = useParams();
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("code");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [repoFiles, setRepoFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3002/repo/${id}`);
        const data = await response.json();
        setRepository(data[0]);
        
        // Set default file if repository has content
        if (data[0] && data[0].content && data[0].content.length > 0) {
          const firstContent = data[0].content[0];
          if (typeof firstContent === 'string') {
            setSelectedFile("README.md");
            setFileContent(firstContent);
          } else if (typeof firstContent === 'object' && firstContent.fileName) {
            setSelectedFile(firstContent.fileName);
            setFileContent(`# ${firstContent.fileName}\n\nFile uploaded to this repository.\n\nSize: ${formatFileSize(firstContent.fileSize)}\nUploaded: ${formatDate(firstContent.uploadDate)}`);
          }
        }
      } catch (err) {
        console.error("Error fetching repository: ", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRepoFiles = async () => {
      try {
        setFilesLoading(true);
        const response = await fetch(`http://localhost:3002/repo/${id}/files`);
        const data = await response.json();
        setRepoFiles(data.files || []);
      } catch (err) {
        console.error("Error fetching repository files: ", err);
      } finally {
        setFilesLoading(false);
      }
    };

    if (id) {
      fetchRepository();
      fetchRepoFiles();
    }
  }, [id]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://github.com/${repository?.owner?.username}/${repository?.name}.git`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileClick = async (fileName, fileKey) => {
    setSelectedFile(fileName);
    setContentLoading(true);
    
    try {
      // Fetch actual file content from S3
      const response = await fetch(`http://localhost:3002/file/content/${encodeURIComponent(fileKey)}`);
      const data = await response.json();
      
      if (response.ok) {
        if (data.isBinary) {
          // For binary files, show a message
          setFileContent(`# ${fileName}\n\nThis is a binary file (${data.fileType}).\n\nFile size: ${formatFileSize(data.fileSize)}\n\nBinary content cannot be displayed in text format.`);
        } else {
          // For text files, show the actual content
          setFileContent(data.content);
        }
      } else {
        // Fallback content if fetch fails
        setFileContent(`# ${fileName}\n\nError loading file content.\n\nThis could be because:\n- The file doesn't exist\n- You don't have permission to view it\n- Network error`);
      }
    } catch (err) {
      console.error("Error fetching file content:", err);
      setFileContent(`# ${fileName}\n\nError loading file content.\n\nNetwork error occurred while trying to fetch the file.`);
    } finally {
      setContentLoading(false);
    }
  };

  const handleFileUploaded = (newFile) => {
    // Add the new file to the list
    setRepoFiles(prevFiles => [newFile, ...prevFiles]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Ensure fileContent is always a string
  const getFileContent = () => {
    if (typeof fileContent === 'string') {
      return fileContent;
    }
    if (typeof fileContent === 'object') {
      return JSON.stringify(fileContent, null, 2);
    }
    return '# Welcome to ' + (repository?.name || 'Repository') + '\n\nThis is a sample repository.';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-loading">
          <div className="spinner"></div>
          <p>Loading repository...</p>
        </div>
      </>
    );
  }

  if (!repository) {
    return (
      <>
        <Navbar />
        <div className="repo-error">
          <h2>Repository not found</h2>
          <p>The repository you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/" className="btn-primary">Go to Dashboard</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="repo-container">
        {/* Repository Header */}
        <div className="repo-header">
          <div className="repo-breadcrumb">
            <Link to="/" className="breadcrumb-link">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="repo-name">{repository.name}</span>
          </div>
        </div>

        {/* Repository Info */}
        <div className="repo-info">
          <div className="repo-description">
            <h1>{repository.name}</h1>
            <p>{repository.description || "No description provided"}</p>
          </div>
          
          <div className="repo-meta">
            <span className="repo-updated">
              Updated {formatDate(repository.updatedAt)}
            </span>
          </div>
        </div>

        {/* File Upload Section */}
        <FileUpload repoId={id} onFileUploaded={handleFileUploaded} />

        {/* Repository Tabs */}
        <div className="repo-tabs">
          <button 
            className={`tab-button ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <CodeIcon size={16} />
            Code
          </button>
          <button 
            className={`tab-button ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            <IssueOpenedIcon size={16} />
            Issues
          </button>
        </div>

        {/* Repository Content */}
        <div className="repo-content">
          {activeTab === 'code' && (
            <div className="code-tab">
              <div className="file-explorer">
                <div className="file-explorer-header">
                  <h3>Files ({repoFiles.length})</h3>
                  <button className="btn-secondary" onClick={handleCopyUrl}>
                    <CopyIcon size={14} />
                    {copied ? 'Copied!' : 'Clone'}
                  </button>
                </div>
                
                <div className="file-list">
                  {filesLoading ? (
                    <div className="loading-files">
                      <div className="spinner"></div>
                      <span>Loading files...</span>
                    </div>
                  ) : repoFiles.length > 0 ? (
                    repoFiles.map((file, index) => (
                      <div 
                        key={index}
                        className={`file-item ${selectedFile === file.fileName ? 'selected' : ''}`}
                        onClick={() => handleFileClick(file.fileName, file.fileKey)}
                      >
                        <FileIcon size={16} />
                        <div className="file-details">
                          <span className="file-name">{file.fileName}</span>
                          <span className="file-meta">
                            {formatFileSize(file.fileSize)} • {formatDate(file.uploadDate)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-files">
                      <img 
                        src="/src/assets/my-proj-img.jpg" 
                        alt="CodeHub Logo" 
                        style={{ width: '24px', height: '24px', borderRadius: '4px', marginBottom: '8px' }}
                      />
                      <span>No files uploaded yet</span>
                      <p>Upload files using the form above</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="code-viewer">
                <div className="code-header">
                  <h3>{selectedFile || 'README.md'}</h3>
                  <div className="code-actions">
                    <button className="btn-secondary">
                      <DownloadIcon size={14} />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="code-content">
                  {contentLoading ? (
                    <div className="content-loading">
                      <div className="spinner"></div>
                      <p>Loading file content...</p>
                    </div>
                  ) : (
                    <pre className="code-block">
                      <code>{getFileContent()}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'issues' && (
            <div className="issues-tab">
              <div className="empty-state">
                <img 
                  src="/src/assets/my-proj-img.jpg" 
                  alt="CodeHub Logo" 
                  style={{ width: '48px', height: '48px', borderRadius: '8px', marginBottom: '16px' }}
                />
                <h3>No issues yet</h3>
                <p>Issues are used to track ideas, enhancements, tasks, or bugs for work on GitHub.</p>
                <button className="btn-primary">
                  <IssueOpenedIcon size={16} />
                  New issue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RepositoryView; 