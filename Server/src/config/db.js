const mongoose = require("mongoose");

const connection = async () => {
  // mongodb://localhost:27017/

  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_URI_USER}:${process.env.DB_URI_PASS}@cluster0.eecjhwk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then((res) => console.log("Database Connected"))
    .catch((error) => console.warn("db connection faild!", error));
};

module.exports = connection;
