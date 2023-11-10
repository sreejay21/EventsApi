var mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: {
    type: String
  },
  details: {
    type: String,
  },
  on: {
    type: Date,
  },
  venue: {
    type: String
  },
  registrationLink: {
    type: String
  },
});

module.exports=mongoose.model("Event",eventSchema)