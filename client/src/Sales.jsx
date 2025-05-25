import React, { useState, useEffect } from 'react';
import './Sales.css';
import Sidebar from './Sidebar';
import { useCart } from './CartContext';

function Sales() {
  const { orders, products } = useCart();
  const [currentTab, setCurrentTab] = useState("weekly");
  const [salesData, setSalesData] = useState({ weekly: {}, monthly: {}, annual: {} });

  const handleSortChange = (sortOptions) => {
    if(sortOptions.key === 'salesView' && ['weekly', 'monthly', 'annual'].includes(sortOptions.value)) {
      setCurrentTab(sortOptions.value);
    }
  };

  useEffect(() => {
    const now = new Date();

    // Calculate date boundaries for weekly, monthly, and annual
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // Helper: filter orders by date range
    const categories = {
      weekly: {
        filter: (dateStr) => dateStr && new Date(dateStr) >= oneWeekAgo,
        data: {}
      },
      monthly: {
        filter: (dateStr) => dateStr && new Date(dateStr) >= oneMonthAgo,
        data: {}
      },
      annual: {
        filter: (dateStr) => dateStr && new Date(dateStr) >= oneYearAgo,
        data: {}
      },
    };

    const computedData = {};

    // For each time range, process orders
    for (const [range, { filter }] of Object.entries(categories)) {
      const filteredOrders = orders.filter(order => order.orderStatus !== 2 && order.dateOrdered && filter(order.dateOrdered));

      const productMap = {};
      let totalSales = 0;
      let unitSales = 0;

      filteredOrders.forEach(order => {
        totalSales += order.totalAmount || 0;

        if(order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const product = products[item.productId] || {};
            const name = product.name || 'Unknown';
            const price = product.price || 0;

            if (!productMap[name]) {
              productMap[name] = { unitSold: 0, salesIncome: 0 };
            }

            productMap[name].unitSold += item.quantity;
            productMap[name].salesIncome += item.quantity * price;
            unitSales += item.quantity;
          });
        }
      });

      // Convert productMap to array and sort by salesIncome descending
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
                  {/* <td>Php {product.salesIncome.toFixed(2)}</td> */}
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
