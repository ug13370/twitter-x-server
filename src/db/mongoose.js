const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const uri = process.env.MONGODB_URL;
mongoose.connect(uri, options);
