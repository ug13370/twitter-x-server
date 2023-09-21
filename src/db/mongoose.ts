import mongoose from "mongoose";

const options: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

console.log("Mongo DB URL :- " + process.env.MONGODB_URL);

const uri: string = process.env.MONGODB_URL || "";
mongoose.connect(uri, options);
