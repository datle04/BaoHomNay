const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
