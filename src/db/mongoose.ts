import mongoose from "mongoose";

const options: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const uri: string = process.env.MONGODB_URL || "";
mongoose.connect(uri, options);
