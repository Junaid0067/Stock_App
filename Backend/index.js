const express = require('express')
const app = express()
const PORT = 8080;
const connectToMongoDB = require('./db');
var cors = require('cors');
const axios = require('axios');
const  appRoute  = require('./Routes/appRoute');
connectToMongoDB();

app.use(cors(
    {
        origin:["https://stock-app-bay.vercel.app"],
        methods:["POST","GET"],
        credentails:true
    }
))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', appRoute);
// Setting up polling to insert random stock prices for all stocks every minute
const updateStockPrices = () => {
    setInterval(async () => {
      try {
        await axios.post('https://stock-app-server.vercel.app/update');
      } catch (error) {
        console.error('Error updating stock prices:', error);
      }
    }, 60000); // 1 minute interval
  };
  


app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
    updateStockPrices();
})
