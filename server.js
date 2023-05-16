const mongoose = require("mongoose");

const app = require('./app');

const DB_HOST = "mongodb+srv://Shamid:p6HIC2bDcmelv18I@cluster0.pin9fr6.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose.connect(DB_HOST)
  .then(() => app.listen(3000, () => console.log("Database connection successful")))
  .catch(error => {
  console.log(error.message);
  process.exit(1);
});
