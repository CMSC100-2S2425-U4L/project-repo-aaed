import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { NavLink, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaUsers, FaClipboardList, FaChartBar } from 'react-icons/fa';

function Sidebar({ onSortChange }) {
  const location = useLocation();
  const isShopActive = location.pathname === '/shop';
  const [isProductExpanded, setIsProductExpanded] = useState(false);
  const [selectedSort, setSelectedSort] = useState({ key: '', direction: '' });

  useEffect(() => {
    if (isShopActive) {
      setIsProductExpanded(true); // auto-expand on route change to /shop
    }
  }, [isShopActive]);

  const handleSort = (key, direction) => {
    setSelectedSort({ key, direction });
    onSortChange({ key, direction });
  };

  return (
    <div className="sidebar-fixed">
      <div className="sidebar-box">
        <h2 className="sidebar-title">AgriMart</h2>
        <ul className="sidebar-links">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaTachometerAlt className="sidebar-icon" /> Dashboard
            </NavLink>
          </li>
          <li>
            <div
              className={`sidebar-link ${isShopActive ? "active" : ""}`}
              onClick={() => {
                setIsProductExpanded(prev => !prev);
              }}
              style={{ cursor: 'pointer' }}
            >
              <FaBox className="sidebar-icon" />
              <NavLink to="/shop" className="sidebar-link-text">Products</NavLink>
            </div>

            {isProductExpanded && (
              <div className="sort-options">
                <p className="sort-label">Sort by:</p>
                {[
                  { key: 'productName', label: 'Name' },
                  { key: 'productType', label: 'Type' },
                  { key: 'productPrice', label: 'Price' },
                  { key: 'productQuantity', label: 'Quantity' }
                ].map(({ key, label }) => (
                  <div key={key} className="sort-row">
                    <button
                      onClick={() => handleSort(key, 'asc')}
                      style={{
                        backgroundColor:
                          selectedSort.key === key && selectedSort.direction === 'asc' ? '#47532B' : '#f5f5f5',
                        color:
                          selectedSort.key === key && selectedSort.direction === 'asc' ? 'white' : 'black',
                      }}
                    >
                      {label} ↑
                    </button>

                    <button
                      onClick={() => handleSort(key, 'desc')}
                      style={{
                        backgroundColor:
                          selectedSort.key === key && selectedSort.direction === 'desc' ? '#47532B' : '#f5f5f5',
                        color:
                          selectedSort.key === key && selectedSort.direction === 'desc' ? 'white' : 'black',
                      }}
                    >
                      {label} ↓
                    </button>

                  </div>
                ))}
              </div>
            )}
          </li>
          <li>
            <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaUsers className="sidebar-icon" /> Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaClipboardList className="sidebar-icon" /> Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/sales" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <FaChartBar className="sidebar-icon" /> Sales
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
