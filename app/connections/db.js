const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const dbURI = "mongodb://localhost:27017/react-native-app";
    const connect = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`database is connected ${connect.connection.host}`);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDb;
