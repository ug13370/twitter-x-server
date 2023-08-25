import mongoose from "mongoose";
import isEmail from "../validators/isEmail";

interface UserDocument extends mongoose.Document {
  user_id: string;
  name: string;
  email_id: string;
  bio?: string;
  location?: string;
  primary_media_id?: any;
  secondary_media_id?: any;
}

const userSchema = new mongoose.Schema(
  {
    user_id: {
      trim: true,
      type: String,
      unique: true,
      default: (props: any) => props.email_id,
      required: [true, "user_id is required."],
    },
    name: {
      trim: true,
      type: String,
      required: [true, "name is required."],
    },
    email_id: {
      trim: true,
      unique: true,
      type: String,
      lowercase: true,
      required: [true, "Email Id is required."],
      validate: {
        validator: isEmail,
        message: (props: any) => `${props.value} is not a valid email Id!`,
      },
    },
    bio: { trim: true, type: String, minLength: 1, maxLength: 100 },
    location: { trim: true, type: String },
    primary_media_id: {},
    secondary_media_id: {},
  },
  { timestamps: true }
);

userSchema.pre<UserDocument>("save", async function (next) {
  this.user_id = generateUniqueUserId(this.email_id, this.name);
  console.log(`New user id generated: ${this.user_id}`);
  next();
});

const generateUniqueUserId = (email: string, name: string): string => {
  let emailName = email.split("@")[0];
  let firstName = name.split(" ")[0];
  return `@${firstName}_${emailName}`;
};

const User = mongoose.model("User", userSchema);
export default User;
