import React, { useState, useEffect }  from 'react';
import './Sales.css';
import Sidebar from './Sidebar';

function Sales({onSortChange}) {
  const [currentTab, setCurrentTab] = useState("weekly");

  const handleSortChange = (sortOptions) => {
    if (sortOptions.key === 'salesView') {
      setCurrentTab(sortOptions.value);
    }
    
    if (onSortChange) {
      onSortChange(sortOptions);
    }
  };

  //sample data only
  const salesData = {
    weekly: {
      totalSales : 475.00,
      unitSales : 18,
      productsSold: [
          {name: 'Chicken Eggs', unitSold: 10, salesIncome: 70.00},
          {name: 'Whole Milk', unitSold: 5, salesIncome: 270.00},
          {name: "Rice", unitSold: 3, salesIncome: 135.00}
      ]
    },

    monthly : {
      totalSales : 1920.00,
      unitSales : 65,
      productsSold: [
          {name: 'Chicken Eggs', unitSold: 30, salesIncome: 210.00},
          {name: 'Whole Milk', unitSold: 15, salesIncome: 810.00},
          {name: "Rice", unitSold: 20, salesIncome: 900.00}
      ]

    },

    annual : {
        totalSales : 5695.00,
        unitSales : 200,
        productsSold: [
            {name: 'Chicken Eggs', unitSold: 100, salesIncome: 700.00},
            {name: 'Whole Milk', unitSold: 55, salesIncome: 2970.00},
            {name: "Rice", unitSold: 45, salesIncome: 2025.00}
        ]

    }
  }

  const currentTabData = salesData[currentTab]

  return (
    <div className="admin-shop-container">
      <Sidebar onSortChange={handleSortChange}/>
      <main className="sales-panel">

        <div className= "sales-grid">
          <div className = "sales-card">
            <h2>Total Sales</h2>
            <h3>Php {currentTabData.totalSales}</h3>
          </div>
          <div className= "sales-card">
            <h2>Unit Sales</h2>
            <h3>Php {currentTabData.unitSales}</h3>
          </div>
        </div>

          {/* summary data table */}
          <div className= "sales-table">
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
                    <td>Php {product.salesIncome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Insert charts or data visualization */}
      </main>
    </div>
  );
}

export default Sales;
