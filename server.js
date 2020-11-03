const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.URL.replace('<password>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected To DB'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App Started at ${PORT}`);
});

process.on('unhandledRejection', () => {
  console.log('something went wrong');
});
