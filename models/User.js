const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["google", "github"],
      required: true,
    },
    socialId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema, "users");

module.exports = {
  User,
  UserSchema,
};
