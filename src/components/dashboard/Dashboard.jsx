import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import { 
  RepoIcon, 
  StarIcon, 
  GitBranchIcon, 
  EyeIcon,
  PlusIcon,
  SearchIcon,
  CalendarIcon,
  FileIcon,
  DownloadIcon
} from "@primer/octicons-react";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [s3Files, setS3Files] = useState([]);
  const [s3Loading, setS3Loading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/userProfile/${userId}`);
        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        console.error("Error fetching user details: ", err);
      }
    };

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3002/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories || []);
        setSearchResults(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data.slice(0, 5)); // Show only 5 suggested repos
      } catch (err) {
        console.error("Error while fetching suggested repositories: ", err);
      }
    };

    const fetchS3Files = async () => {
      try {
        setS3Loading(true);
        const response = await fetch(`http://localhost:3002/s3/files`);
        const data = await response.json();
        setS3Files(data.files || []);
      } catch (err) {
        console.error("Error while fetching S3 files: ", err);
      } finally {
        setS3Loading(false);
      }
    };

    fetchUserDetails();
    fetchRepositories();
    fetchSuggestedRepositories();
    fetchS3Files();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  const handleCreateRepo = () => {
    // Navigate to create repository page
    window.location.href = "/create";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getRandomLanguage = () => {
    const languages = ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'PHP'];
    return languages[Math.floor(Math.random() * languages.length)];
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading your repositories...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <h1>Welcome back, {userDetails.username || 'Developer'}!</h1>
            <p>Here's what's happening with your repositories.</p>
          </div>
          <button className="create-repo-btn" onClick={handleCreateRepo}>
            <PlusIcon size={16} />
            New repository
          </button>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-main">
            <div className="search-section">
              <div className="search-container">
                <SearchIcon size={16} className="search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Find a repository..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="repositories-section">
              <h2>Your repositories</h2>
              {searchResults.length === 0 ? (
                <div className="empty-state">
                  <img 
                    src="/src/assets/my-proj-img.jpg" 
                    alt="CodeHub Logo" 
                    style={{ width: '48px', height: '48px', borderRadius: '8px', marginBottom: '16px' }}
                  />
                  <h3>No repositories found</h3>
                  <p>Get started by creating a new repository.</p>
                  <button className="create-repo-btn-secondary" onClick={handleCreateRepo}>
                    <PlusIcon size={16} />
                    Create repository
                  </button>
                </div>
              ) : (
                <div className="repositories-grid">
                  {searchResults.map((repo) => (
                    <div key={repo._id} className="repo-card">
                      <div className="repo-header">
                        <div className="repo-info">
                          <h3 className="repo-name">
                            <RepoIcon size={16} />
                            <Link to={`/repo/${repo._id}`}>{repo.name}</Link>
                          </h3>
                          <p className="repo-description">
                            {repo.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                      <div className="repo-meta">
                        <span className="repo-language">{getRandomLanguage()}</span>
                        <span className="repo-updated">
                          Updated {formatDate(repo.updatedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* S3 Files Section */}
            <div className="s3-files-section">
              <h2>S3 Stored Files</h2>
              {s3Loading ? (
                <div className="s3-loading">
                  <div className="spinner"></div>
                  <p>Loading files from S3...</p>
                </div>
              ) : s3Files.length === 0 ? (
                <div className="empty-state">
                  <img 
                    src="/src/assets/my-proj-img.jpg" 
                    alt="CodeHub Logo" 
                    style={{ width: '48px', height: '48px', borderRadius: '8px', marginBottom: '16px' }}
                  />
                  <h3>No files in S3</h3>
                  <p>Files will appear here after you push them to S3.</p>
                </div>
              ) : (
                <div className="s3-files-grid">
                  {s3Files.map((file) => (
                    <div key={file.id} className="s3-file-card">
                      <div className="file-header">
                        <div className="file-info">
                          <h4 className="file-name">
                            <FileIcon size={16} />
                            {file.fileName}
                          </h4>
                          <p className="file-commit-message">
                            {file.commitMessage}
                          </p>
                        </div>
                        <div className="file-actions">
                          <button className="download-btn" title="Download file">
                            <DownloadIcon size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="file-meta">
                        <div className="file-author">
                          <span>👤 {file.author}</span>
                        </div>
                        <div className="file-size">
                          {formatFileSize(file.size)}
                        </div>
                        <div className="file-date">
                          {formatDate(file.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-sidebar">
            <div className="sidebar-section">
              <h3>Suggested repositories</h3>
              <div className="suggested-repos">
                {suggestedRepositories.map((repo) => (
                  <div key={repo._id} className="suggested-repo">
                    <h4>
                      <Link to={`/repo/${repo._id}`}>{repo.name}</Link>
                    </h4>
                    <p>{repo.description || "No description"}</p>
                    <div className="repo-stats">
                      <span><StarIcon size={12} /> {Math.floor(Math.random() * 100)}</span>
                      <span><GitBranchIcon size={12} /> {Math.floor(Math.random() * 50)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Recent activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <CalendarIcon size={14} />
                  <span>Created repository "my-project"</span>
                  <span className="activity-time">2 hours ago</span>
                </div>
                <div className="activity-item">
                  <GitBranchIcon size={14} />
                  <span>Pushed to main branch</span>
                  <span className="activity-time">1 day ago</span>
                </div>
                <div className="activity-item">
                  <StarIcon size={14} />
                  <span>Starred "awesome-library"</span>
                  <span className="activity-time">3 days ago</span>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Upcoming events</h3>
              <div className="events-list">
                {/* Events section left blank */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;