const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB: ON");
  } catch (err) {
    console.log("Error connecting to MongoDB: ", err);
    throw new Error("Error connecting to MongoDB");
  }
};

mongoose.set("useFindAndModify", false);

module.exports = { dbConnection };
