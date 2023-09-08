const express = require('express');
const Stocks = require('../Models/Stocks');
const router = express.Router();

router.get('/getStocksData', async (req,res)=>{
    try {
        const stocksData = await Stocks.find();
        res.status(200).json(stocksData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")
    }
})

router.post('/addPrice', async (req,res)=>{
    const { stockName, price } = req.body;

    try {
        const newRandomNo = new Stocks({stockName,price});
        await newRandomNo.save();
        res.status(201).json({ message: 'Random stock prices saved successfully' });
    } catch (error) {
        console.error('Error saving random stock prices:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/update', async (req, res) => {
    try {
      // Fetching all existing stocks from the database
      const existingStocks = await Stocks.find();
  
      // Updating the price for each existing stock
      for (const stock of existingStocks) {
        stock.price = (Math.random() * 1000).toFixed(2);
        await stock.save();
      }
  
      res.status(200).json({ message: 'Stock prices updated successfully' });
    } catch (error) {
      console.error('Error updating stock prices:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Route to fetch stock price by stockName
router.get('/:stockName', async (req, res) => {
  const { stockName } = req.params;
  try {
    const stock = await Stocks.findOne({ stockName });
    if (!stock) {
      res.status(404).json({ message: 'Stock not found' });
    } else {
      res.json({ price: stock.price });
    }
  } catch (error) {
    console.error('Error fetching stock price:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





module.exports = router;
