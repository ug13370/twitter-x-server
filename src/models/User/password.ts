import mongoose from "mongoose";
import isPassword from "../../validators/isPassword";

const passwordSchema = new mongoose.Schema(
  {
    user_id: {
      trim: true,
      type: String,
      unique: true,
      required: [true, "user_id is required!"],
    },
    password: {
      trim: true,
      type: String,
      validate: {
        validator: isPassword,
        message: (props: any) => `${props.value} is not a valid password!`,
      },
    },
  },
  { timestamps: true, validateBeforeSave: true }
);

// Create the Password model
const Password = mongoose.model("Password", passwordSchema);

export default Password;
