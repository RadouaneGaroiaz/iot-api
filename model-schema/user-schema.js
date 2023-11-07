const { Schema, model } = require("mongoose");

module.exports = model(
  "users",
  new Schema({
    First_name: String,
    Last_name: String,
    Email: String,
    Password: String,
    Phone: String,
    Address: String,
    Veh_plate: String,
  })
);
