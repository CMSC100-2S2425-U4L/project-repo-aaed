import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { NavLink, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaUsers, FaClipboardList, FaChartBar } from 'react-icons/fa';

function Sidebar({ onSortChange }) {
  const location = useLocation();
  const isShopActive = location.pathname === '/shop';
  const [isProductExpanded, setIsProductExpanded] = useState(false);
  const [selectedSort, setSelectedSort] = useState({ key: '', direction: '' });

  const isSalesActive = location.pathname === '/sales';
  const [isSalesExpanded, setIsSalesExpanded] = useState(isSalesActive);
  const [selectedSalesView, setSelectedSalesView] = useState('weekly');

  useEffect(() => {
    setIsSalesExpanded(isSalesActive);
    if (isSalesActive) {
      if (isSalesActive && !selectedSalesView) {
        setSelectedSalesView('weekly');
        onSortChange({ key: 'salesView', value: 'weekly' });
      }
    }
  }, [isSalesActive, onSortChange])

  useEffect(() => {
    if (isShopActive) {
      setIsProductExpanded(true); // auto-expand on route change to /shop
    }
  }, [isShopActive]);

  const handleSort = (key, direction) => {
    setSelectedSort({ key, direction });
    onSortChange({ key, direction });
  };

  const handleSalesView = (view) => {
    setSelectedSalesView(view);
    onSortChange({ key: 'salesView', value: view });
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
            <NavLink
              to="/shop"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setIsProductExpanded(true)}
            >
              <FaBox className="sidebar-icon" />
              <span className="sidebar-link-text">Products</span>
            </NavLink>
            {isShopActive && isProductExpanded && (
              <div className="sort-options">
                <p className="sort-label">Sort by:</p>
                {[
                  { key: 'productName', label: 'Name' },
                  { key: 'productType', label: 'Type' },
                  { key: 'productPrice', label: 'Price' },
                  { key: 'productQuantity', label: 'Quantity' }
                ].map(({ key, label }) => (
                  <div key={key} className="sort-row">
                    {key === 'productType' ? (
                      <select
                        value={selectedSort.key === key ? selectedSort.value : ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedSort({ key, value });
                          onSortChange({ key, value });
                        }}
                        style={{
                          backgroundColor: '#f5f5f5',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          color: selectedSort.key === key ? '#47532B' : 'black',
                          fontWeight: selectedSort.key === key ? 'bold' : 'normal',
                        }}
                      >
                        <option value="">Filter by Type</option>
                        <option value="Crop">Crop</option>
                        <option value="Poultry">Poultry</option>
                      </select>
                    ) : (
                      <>
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
                      </>
                    )}
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
            <NavLink
              to="/sales"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setIsSalesExpanded(true)}
            >
              <FaChartBar className="sidebar-icon" />
              <span className="sidebar-link-text">Sales</span>
            </NavLink>
            {isSalesActive && isSalesExpanded && (
              <div className="view-options">
                <p className="view-label">View by:</p>
                <div className="view-column">
                  {['Weekly', 'Monthly', 'Annual'].map((view) => (
                    <button
                      key={view}
                      onClick={() => handleSalesView(view.toLowerCase())}
                      style={{
                        backgroundColor: selectedSalesView === view.toLowerCase() ? '#47532B' : '#f5f5f5',
                        color: selectedSalesView === view.toLowerCase() ? 'white' : 'black',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
