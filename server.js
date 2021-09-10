const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = require('./app.js');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
//Variables ENV
const DB_URL = process.env.DB_LOCAL;
const PORT = process.env.PORT || 3000;

//MongoDB connection
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to DB!');
    app.listen(PORT, () => {
      console.log(`App is running in: http://localhost:${PORT}/`);
    });
  });

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  
  process.exit(1);
});
