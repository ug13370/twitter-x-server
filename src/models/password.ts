import mongoose from "mongoose";
import isPassword from "../validators/isPassword";

const passwordSchema = new mongoose.Schema({
  user_id: {
    trim: true,
    type: String,
    unique: true,
    required: [true, "user_id is required."],
  },
  password: {
    trim: true,
    type: String,
    validate: {
      validator: isPassword,
      message: (props) => `${props.value} is not a valid password!`,
    },
  },
});

const Password = mongoose.model("Password", passwordSchema);
export default Password
