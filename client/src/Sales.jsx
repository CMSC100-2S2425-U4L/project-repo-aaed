import React, { useState, useEffect } from 'react';
import './Sales.css';
import Sidebar from './Sidebar';
import axios from 'axios';

function Sales() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [currentTab, setCurrentTab] = useState("weekly");
  const [salesData, setSalesData] = useState({ weekly: {}, monthly: {}, annual: {} });
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSortChange = (sortOptions) => {
    if (sortOptions.key === 'salesView' && ['weekly', 'monthly', 'annual'].includes(sortOptions.value)) {
      setCurrentTab(sortOptions.value);
    }
  };

  useEffect(() => {
    // Fetch orders and products from backend
    const fetchOrdersAndProducts = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/orders?populate=productId`),
          axios.get(`${API_URL}/product/`)
        ]);
        setOrders(ordersRes.data);
        // Map products by _id for fast lookup
        const productMap = {};
        productsRes.data.forEach(p => {
          productMap[p._id] = p;
        });
        setProducts(productMap);
      } catch (err) {
        setOrders([]);
        setProducts({});
      }
    };
    fetchOrdersAndProducts();
  }, [API_URL]);

  useEffect(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const categories = {
      weekly: {
        filter: (dateStr) => dateStr && new Date(dateStr) >= oneWeekAgo,
      },
      monthly: {
        filter: (dateStr) => dateStr && new Date(dateStr) >= oneMonthAgo,
      },
      annual: {
        filter: (dateStr) => dateStr && new Date(dateStr) >= oneYearAgo,
      },
    };

    const computedData = {};
    for (const [range, { filter }] of Object.entries(categories)) {
      const filteredOrders = orders.filter(order => order.orderStatus === 1 && order.dateOrdered && filter(order.dateOrdered));
      const productMap = {};
      let totalSales = 0;
      let unitSales = 0;
      filteredOrders.forEach(order => {
        const product = products[order.productId?._id] || order.productId || {};
        const name = product.productName || product.name || 'Unknown';
        const price = product.productPrice || product.price || 0;
        if (!productMap[name]) {
          productMap[name] = { unitSold: 0, salesIncome: 0 };
        }
        productMap[name].unitSold += order.quantity;
        productMap[name].salesIncome += order.totalAmount || (order.quantity * price);
        unitSales += order.quantity;
        totalSales += order.totalAmount || (order.quantity * price);
      });
      const productsSold = Object.entries(productMap)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.salesIncome - a.salesIncome);
      computedData[range] = { totalSales, unitSales, productsSold };
    }
    setSalesData(computedData);
  }, [orders, products]);

  const currentTabData = {
    totalSales: salesData[currentTab]?.totalSales ?? 0,
    unitSales: salesData[currentTab]?.unitSales ?? 0,
    productsSold: salesData[currentTab]?.productsSold ?? []
  };

  return (
    <div className="admin-shop-container">
      <Sidebar onSortChange={handleSortChange} />
      <main className="sales-panel">
        <div className="sales-grid">
          <div className="sales-card">
            <h2>Total Sales</h2>
            <h3>Php {currentTabData.totalSales.toFixed(2)}</h3>
          </div>
          <div className="sales-card">
            <h2>Unit Sales</h2>
            <h3>{currentTabData.unitSales}</h3>
          </div>
        </div>
        <div className="sales-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Sales Income</th>
              </tr>
            </thead>
            <tbody>
              {currentTabData.productsSold.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.unitSold}</td>
                  <td>Php {(typeof product.salesIncome === 'number' ? product.salesIncome : 0).toFixed(2)}</td>
                </tr>
              ))}
              {currentTabData.productsSold.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No sales data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Sales;
