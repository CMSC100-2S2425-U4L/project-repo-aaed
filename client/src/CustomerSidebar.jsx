import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { NavLink, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaUsers, FaClipboardList, FaChartBar } from 'react-icons/fa';

function CustomerSidebar({ onSortChange }) {
    const location = useLocation();
    const isShopActive = location.pathname === '/customershop';
    const [isProductExpanded, setIsProductExpanded] = useState(isShopActive);
    const [selectedSort, setSelectedSort] = useState({ key: '', direction: '' });

    useEffect(() => {
        setIsProductExpanded(isShopActive);
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
                        <NavLink
                            to="/customershop"
                            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                            onClick={() => setIsProductExpanded(true)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FaBox className="sidebar-icon" />
                            <span className="sidebar-link-text">Products</span>
                        </NavLink>

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
                        <NavLink to="/customerorder" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            <FaClipboardList className="sidebar-icon" /> Orders
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default CustomerSidebar;
