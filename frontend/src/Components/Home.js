import React, { useState, useEffect } from 'react';
import axios from "axios";

function Home() {
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const fetchPriceForSelectedStock = async ()=>{
       await fetch(
            "https://localhost:8080/getStocksData")
                        .then((res) => res.json())
                        .then((data) => {
                            setStockData(data);
                            if (data.length > 0) {
                                setSelectedStock(data[0].stockName);
                                setSelectedPrice(data[0].price);
                              }
                        })
    }
  //useEffect to fetch stock price data when the selected stock changes
  useEffect(() => {
    // Setting up an interval to fetch updated price every minute
    const interval = setInterval(fetchPriceForSelectedStock, 60000);

    // Cleaning up the interval when the component unmounts
    return () => clearInterval(interval);

  }, [selectedStock]);

  const handleDropdownChange = (event) => {
    const selectedStockName = event.target.value;
    setSelectedStock(selectedStockName);

    // Finding the corresponding price based on the selected stockName
    const selectedStockData = stockData.find((stock) => stock.stockName === selectedStockName);
    if (selectedStockData) {
      setSelectedPrice(selectedStockData.price);
    }
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

export default Home;
