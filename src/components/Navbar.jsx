import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  PlusIcon, 
  ChevronDownIcon 
} from "@primer/octicons-react";
import "./navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search functionality here
    console.log("Searching for:", searchQuery);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side - Brand and Search */}
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <img
              src="/src/assets/my-proj-img.jpg"
              alt="CodeHub Logo"
              width="32"
              height="32"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23FF8C42'/%3E%3Ctext x='16' y='20' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3EC%3C/text%3E%3C/svg%3E";
              }}
            />
            <span className="navbar-title">CodeHub</span>
          </Link>

          <div className="navbar-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                className="search-input"
                placeholder="Search or jump to..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* Right side - Navigation Links */}
        <div className="navbar-right">
          <Link to="/create" className="navbar-link">
            <PlusIcon size={16} />
            <span>New</span>
          </Link>

          <div className="navbar-dropdown">
            <button 
              className="navbar-dropdown-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setProfileDropdown(!profileDropdown);
              }}
            >
              <img
                src="/src/assets/my-proj-img.jpg"
                alt="User Avatar"
                className="avatar"
                width="32"
                height="32"
              />
              <ChevronDownIcon size={16} />
            </button>
            {profileDropdown && (
              <div className="navbar-dropdown-menu">
                <div className="dropdown-header">
                  <strong>Signed in as</strong>
                  <span>github-user</span>
                </div>
                <Link to="/profile" className="dropdown-item">
                  <span>Your profile</span>
                </Link>
                <Link to="/create" className="dropdown-item">
                  <span>New repository</span>
                </Link>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item">
                  <span>Sign out</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;