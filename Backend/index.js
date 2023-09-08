import React, { useState, useEffect } from 'react';

function StockDropdown() {
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    // Fetch stock data from your updated API endpoint (adjust the URL)
    fetch('http://localhost:3001/api/stocks')
      .then((response) => response.json())
      .then((data) => {
        setStockData(data);
        if (data.length > 0) {
          // Check if the selectedStock is still present in the fetched data
          if (data.find((stock) => stock.stockName === selectedStock)) {
            setSelectedPrice(data[0].price);
          } else {
            setSelectedStock(data[0].stockName);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching stock data:', error);
      });
  }, []);

  useEffect(() => {
    // Function to fetch and update the price for the selected stock
    const fetchPriceForSelectedStock = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/stocks/${selectedStock}`);
        const data = await response.json();
        if (data.price) {
          setSelectedPrice(data.price);
        }
      } catch (error) {
        console.error('Error fetching stock price:', error);
      }
    };

    // Fetch price initially when the component mounts
    fetchPriceForSelectedStock();

    // Set up an interval to fetch updated price every minute
    const interval = setInterval(fetchPriceForSelectedStock, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [selectedStock]);

  const handleDropdownChange = (event) => {
    const selectedStockName = event.target.value;
    setSelectedStock(selectedStockName);
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
