const mongoose = require("mongoose");
const isEmail = require("../validators/isEmail");

const userSchema = new mongoose.Schema(
  {
    user_id: {
      trim: true,
      type: String,
      unique: true,
      default: (props) => props.email_id,
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
        message: (props) => `${props.value} is not a valid email Id!`,
      },
    },
    bio: { trim: true, type: String, minLength: 1, maxLength: 100 },
    location: { trim: true, type: String },
    primary_media_id: {},
    secondary_media_id: {},
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.user_id = generateUniqueUserId(this.email_id, this.name);
  console.log(`New user id generated: ${this.user_id}`);
  next();
});

const generateUniqueUserId = (email, name) => {
  let emailName = email.split("@")[0];
  let firstName = name.split(" ")[0];
  return `@${firstName}_${emailName}`;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
