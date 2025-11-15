const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/products', require ('./routes/product.routes'));

app.use('/api/cart', require('./routes/cart.routes'));

app.use('/api/orders', require('./routes/order.routes'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database. Server did not start.");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();