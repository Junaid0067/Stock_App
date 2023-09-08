import React, { useState, useEffect } from 'react';

function StockDropdown() {
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://stock-tracker-d16p.onrender.com/getStocksData');
      const data = await response.json();
      setStockData(data);

      // Check if the selected stock is still present in the fetched data
      const selectedStockData = data.find((stock) => stock.stockName === selectedStock);
      if (selectedStockData) {
        setSelectedPrice(selectedStockData.price);
      } else {
        // If selected stock is not present, select the first stock
        setSelectedStock(data.length > 0 ? data[0].stockName : '');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial data fetch

    const interval = setInterval(() => {
      fetchData(); // Fetch updated data every minute
    }, 60000);

    return () => {
      clearInterval(interval); // Clean up the interval
    };
  }, []); // Empty dependency array to run only once

  const handleDropdownChange = (event) => {
    const selectedStockName = event.target.value;
    setSelectedStock(selectedStockName);

    // Find the corresponding price based on the selected stockName
    const selectedStockData = stockData.find((stock) => stock.stockName === selectedStockName);
    if (selectedStockData) {
      setSelectedPrice(selectedStockData.price);
    }
  };

  return (
    <div>
      <h2>Select a Stock:</h2>
      <select value={selectedStock} onChange={handleDropdownChange}>
        {stockData.map((stock) => (
          <option key={stock._id} value={stock.stockName}>
            {stock.stockName}
          </option>
        ))}
      </select>
      {selectedPrice !== null && (
        <p>Selected Price for {selectedStock}: ${selectedPrice}</p>
      )}
    </div>
  );
}

export default StockDropdown;
