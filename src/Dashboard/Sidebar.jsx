import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Sidebar() {
  const [activeSection, setActiveSection] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const toggleSection = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? null : section));
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="container p-0 mt-4 mb-5">
      <div id="accordionPanelsStayOpenExample">
        <div className="accordion-item">
          <ul className="accordion-header p-0">
            {/* Home */}
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive && activeSection === null ? "nav-link active" : "nav-link"
              }
              onClick={() => setActiveSection(null)} // Reset activeSection on Home click
            >
              <li>Home</li>
            </NavLink>
            <div className="b_border"></div>

            {/* Survey */}
            <ul className="accordion-header p-0">
              <li
                className={`collapsed ${activeSection === "survey" ? "active" : ""}`}
                onClick={() => toggleSection("survey")}
                aria-expanded={activeSection === "survey"}
              >
                Survey
              </li>
              <div className="b_border"></div>
              {activeSection === "survey" && (
                <ul className="accordion-collapse show m-0 px-3">
                  <NavLink
                    to="/choose-survey-type"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    <li>Create New Survey</li>
                  </NavLink>
                  <div className="b_border"></div>
                  <NavLink
                    to="/manage-survey"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    <li>Manage Survey</li>
                  </NavLink>
                  <div className="b_border"></div>
                  <NavLink
                    to="/analyze-result"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    <li>Analyze Result</li>
                  </NavLink>
                  <div className="b_border"></div>
                  <NavLink
                    to="/archive-survey"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    <li>Archive Survey</li>
                  </NavLink>
                </ul>
              )}
            </ul>

            {/* Settings */}
            <ul className="accordion-header p-0 d-none">
              <li
                className={`collapsed ${activeSection === "settings" ? "active" : ""}`}
                onClick={() => toggleSection("settings")}
                aria-expanded={activeSection === "settings"}
              >
                Settings
              </li>
              <div className="b_border"></div>
              {activeSection === "settings" && (
                <ul className="accordion-collapse show m-0 px-3">
                  <NavLink
                    to="/profile-settings"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    <li>Profile Settings</li>
                  </NavLink>
                  <div className="b_border"></div>
                  <NavLink
                    to="/account-settings"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    <li>Account Settings</li>
                  </NavLink>
                </ul>
              )}
            </ul>

            {/* Engagement */}
            <ul className="accordion-header p-0">
              <li
                className={`collapsed ${activeSection === "engagement" ? "active" : ""}`}
                onClick={() => toggleSection("engagement")}
                aria-expanded={activeSection === "engagement"}
              >
                Engagement
              </li>
              <div className="b_border"></div>
              {activeSection === "engagement" && (
                <ul className="accordion-collapse show m-0 px-3">
                  <Link to="/email">
                    <li
                      onClick={() => handleItemClick("Email")}
                      className={activeItem === "Email" ? "active" : ""}
                    >
                      Email
                    </li>
                  </Link>
                  <div className="b_border"></div>
                  <Link to="/customer-database">
                    <li
                      onClick={() => handleItemClick("Customer Database")}
                      className={activeItem === "Customer Database" ? "active" : ""}
                    >
                      Customer Database
                    </li>
                  </Link>
                  <div className="b_border"></div>
                  <Link to="/lottery">
                    <li
                      onClick={() => handleItemClick("Lottery")}
                      className={activeItem === "Lottery" ? "active" : ""}
                    >
                      Lottery
                    </li>
                  </Link>
                </ul>
              )}
            </ul>

            {/* My Account */}
            <ul className="accordion-header p-0">
              <li
                className={`collapsed ${activeSection === "myaccount" ? "active" : ""}`}
                onClick={() => toggleSection("myaccount")}
                aria-expanded={activeSection === "myaccount"}
              >
                My Account
              </li>
              <div className="b_border"></div>
              {activeSection === "myaccount" && (
                <ul className="accordion-collapse show m-0 px-3">
                  <NavLink
                    to="/my-profile"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    <li>My Profile</li>
                  </NavLink>
                </ul>
              )}
            </ul>

            {/* Sign Out */}
            <ul className="accordion-header p-0">
              <NavLink
                to="/logout"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <li>Sign Out</li>
              </NavLink>
              <div className="b_border"></div>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
