import React, { useState, useEffect } from 'react';

function StockDropdown() {
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    // Fetching stock data from your updated API endpoint
    fetch('https://stock-tracker-d16p.onrender.com/getStocksData')
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
        const response = await fetch(`https://stock-tracker-d16p.onrender.com/${selectedStock}`);
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

    // Setting up an interval to fetch updated price every minute
    const interval = setInterval(fetchPriceForSelectedStock, 2000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [selectedStock]);

  const handleDropdownChange = (event) => {
    const selectedStockName = event.target.value;
    setSelectedStock(selectedStockName);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Stock Price Tracker</h1>
      <div className="row justify-content-center mt-3">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">Stock Price</h3>
              <div className="form-group">
                <label htmlFor="stockDropdown">Select a Stock:</label>
                <select
                  className="form-control"
                  id="stockDropdown"
                  value={selectedStock}
                  onChange={handleDropdownChange}
                >
                  {stockData.map((option) => (
                    <option key={option._id} value={option.stockName}>
                      {option.stockName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-center card shadow my-5">
              {selectedPrice !== null && (
        <h4>Selected Price for {selectedStock}: ${selectedPrice}</h4>
      )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDropdown;
