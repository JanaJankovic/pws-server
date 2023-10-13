const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const notificationSchema = new Schema({
  title: String,
  type: String,
  note: String,
  date_time: String,
  read: Boolean,
});

const userSchema = new Schema({
  email: { type: String, unique: true, required: true, dropDups: true },
  password: String,
  notifications: [notificationSchema],
});

userSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({ email: email }).exec(function (err, user) {
    if (err) {
      console.log("Error");
      return callback(err);
    } else if (!user) {
      console.log("User not found.");
      const err = new Error("User not found.");
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        console.log("Passwords match");
        return callback(null, user);
      } else {
        console.log("Passwords dont match");
        return callback();
      }
    });
  });
};

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("user", userSchema);
