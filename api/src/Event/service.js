const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dbproperties = require("../../../properties");
var enums = require("../../../enums");
const eventModel = require("./model");

//Connection to mongoDB
mongoose.connect(dbproperties.DB_URL);
mongoose.connection.on("connected", () => console.log("Connected to mongoDb"));

async function insert(newEvent) {
  var isInserted = false;
  var errorMsg = "";
  await newEvent
    .save()
    .then(() => {
      isInserted = true;
    })
    .catch((err) => {
      isInserted = false;
      errorMsg = err;
    });
  if (isInserted) {
    return {
      status: true,
      statusCode: enums.CREATED,
      count: null,
      result: newEvent,
      error: null,
    };
  } else {
    return {
      status: false,
      statusCode: enums.INTERNAL_SERVER_ERROR,
      count: null,
      result: null,
      error: errorMsg,
    };
  }
}

async function getbydate() {
  try {
    const currentDate = new Date();
    const event = await eventModel.find({ on: { $gte: currentDate } });
    if (event) {
      return {
        status: true,
        statusCode: enums.OK,
        count: 1,
        result: event,
        error: null,
      };
    } else {
      return {
        status: false,
        statusCode: enums.NOT_FOUND,
        count: null,
        result: null,
        error: null,
      };
    }
  } catch (error) {
    return {
      status: false,
      statusCode: enums.INTERNAL_SERVER_ERROR,
      count: null,
      result: null,
      error: error,
    };
  }
}

async function getbyid(id) {
  try {
    var event = await eventModel.findById(id);
    console.log(event);
    if (event) {
      return {
        status: true,
        statusCode: enums.OK,
        count: 1,
        result: event,
        error: null,
      };
    } else {
      return {
        status: false,
        statusCode: enums.NOT_FOUND,
        count: null,
        result: null,
        error: null,
      };
    }
  } catch (error) {
    return {
      status: false,
      statusCode: enums.INTERNAL_SERVER_ERROR,
      count: null,
      result: null,
      error: error,
    };
  }
}

async function update(id, eventNewData) {
  var eventToBeUpdated = await eventModel.findOne({ _id: id });
  var isUpdated = false;
  var errorMsg = "";
  console.log(eventToBeUpdated);
  try {
    if (eventToBeUpdated) {
      (eventToBeUpdated.title = eventNewData.title),
        (eventToBeUpdated.details = eventNewData.details),
        (eventToBeUpdated.on = eventNewData.on),
        (eventToBeUpdated.venue = eventNewData.venue),
        (eventToBeUpdated.registrationLink = eventNewData.registrationLink);
      await eventToBeUpdated
        .save()
        .then(() => {
          isUpdated = true;
        })
        .catch((err) => {
          isUpdated = false;
          errorMsg = err;
        });
      if (isUpdated) {
        return {
          status: true,
          statusCode: enums.OK,
          count: 1,
          result: eventToBeUpdated,
          error: null,
        };
      } else {
        return {
          status: false,
          statusCode: enums.INTERNAL_SERVER_ERROR,
          count: 0,
          result: null,
          error: errorMsg,
        };
      }
    } else {
      return {
        status: false,
        statusCode: enums.NOT_FOUND,
        count: 0,
        result: null,
        error: null,
      };
    }
  } catch (error) {
    return {
      status: false,
      statusCode: enums.INTERNAL_SERVER_ERROR,
      count: null,
      result: null,
      error: error,
    };
  }
}

//Delete Event BY ID

async function deleteByid(id) {
  var eventToBeDeleted = await eventModel.findOne({ _id: id });
  var isDeleted = false;
  var errorMsg = "";

  try {
    if (eventToBeDeleted) {
      await eventModel
        .findByIdAndDelete(id)
        .then(() => {
          isDeleted = true;
        })
        .catch((err) => {
          isDeleted = false;
          errorMsg = err;
        });
      if (isDeleted) {
        return {
          status: true,
          statusCode: enums.OK,
          count: 0,
          result: id,
          error: null,
        };
      } else {
        return {
          status: false,
          statusCode: enums.INTERNAL_SERVER_ERROR,
          count: 0,
          result: null,
          error: errorMsg,
        };
      }
    } else {
      return {
        status: false,
        statusCode: enums.NOT_FOUND,
        count: 0,
        result: null,
        error: null,
      };
    }
  } catch (error) {
    return {
      status: false,
      statusCode: enums.INTERNAL_SERVER_ERROR,
      count: null,
      result: null,
      error: error,
    };
  }
}

module.exports = { insert, getbydate, getbyid, update, deleteByid};
