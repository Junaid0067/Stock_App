const mongoose = require('mongoose');
require('dotenv').config()

const connectToMongoDB = ()=>{
    mongoose.connect(process.env.APP_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {console.log( 'Database Connected' )
})
  .catch(err => console.log( err ));
}

module.exports = connectToMongoDB;