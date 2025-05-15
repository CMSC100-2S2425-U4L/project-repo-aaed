import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaUsers, FaClipboardList, FaChartBar } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="sidebar-fixed">
      <div className="sidebar-box">
        <h2 className="sidebar-title">AgriMart</h2>
        <ul className="sidebar-links">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaTachometerAlt className="sidebar-icon" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaBox className="sidebar-icon" />
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaUsers className="sidebar-icon" />
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaClipboardList className="sidebar-icon" />
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/sales" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaChartBar className="sidebar-icon" />
              Sales
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
