import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { 
  RepoIcon
} from "@primer/octicons-react";
import "./create-repository.css";

const CreateRepository = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    addReadme: true,
    addGitignore: false,
    addLicense: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const repoName = formData.name.trim();
    
    if (!repoName) {
      newErrors.name = "Repository name is required";
    } else if (repoName.length < 3) {
      newErrors.name = "Repository name must be at least 3 characters";
    } else if (repoName.includes(' ')) {
      newErrors.name = "Repository name cannot contain spaces. Use hyphens (-) or underscores (_) instead.";
    } else if (!/^[a-zA-Z0-9-_]+$/.test(repoName)) {
      newErrors.name = "Repository name can only contain letters, numbers, hyphens, and underscores";
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:3002/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          owner: userId,
          content: formData.addReadme ? ["# " + formData.name + "\n\n" + (formData.description || "No description provided")] : []
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        navigate(`/repo/${data.repositoryID}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || "Failed to create repository" });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-container">
        <div className="create-repo-content">
          <div className="create-repo-header">
            <h1>Create a new repository</h1>
            <p>A repository contains all project files, including the revision history.</p>
          </div>

          <form onSubmit={handleSubmit} className="create-repo-form">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Repository name <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="my-awesome-project"
                    autoFocus
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description <span className="optional">(optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Add a description..."
                  rows={3}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>Additional options</h3>
              <div className="checkbox-options">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="addReadme"
                    checked={formData.addReadme}
                    onChange={handleInputChange}
                  />
                  <span>Add a README file</span>
                </label>

                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="addGitignore"
                    checked={formData.addGitignore}
                    onChange={handleInputChange}
                  />
                  <span>Add .gitignore</span>
                </label>

                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="addLicense"
                    checked={formData.addLicense}
                    onChange={handleInputChange}
                  />
                  <span>Choose a license</span>
                </label>
              </div>
            </div>

            {errors.submit && (
              <div className="error-banner">
                <span>❌ {errors.submit}</span>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !formData.name.trim()}
              >
                {loading ? "Creating..." : "Create repository"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepository; 