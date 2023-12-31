const express = require("express");
const router = express.Router();
const { eventLogger, errorLogger } = require("./logger");
const eventController = require("./controller");
const eventModel = require("./model");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var validationEvent = require("./validation");
var enums = require("../../../enums");
const middlewareRouter = require('./middlewareLogger')
var urlencodedParser = bodyParser.urlencoded({ extended: true });


router.use(middlewareRouter.requestLoggerMiddleware)

//Adding a new event
router.post(
  "/add",
  jsonParser,
  validationEvent.validateEvent,
  async function (req, res, next) {
    try {
      var newEvent = new eventModel({
        title: req.body.title,
        details: req.body.details,
        on: req.body.on,
        venue: req.body.venue,
        registrationLink: req.body.registrationLink,
      });
      var dbActionFeedback = await eventController.insert(newEvent);
      if (dbActionFeedback.status) {
        eventLogger.info("Successfully added new Event");
        res.status(201).json({
          status: true,
          statusCode: enums.CREATED,
          count: dbActionFeedback.count,
          result: dbActionFeedback.result,
          error: null,
        });
      } else {
        errorLogger.error("Error in adding new Event");
        res.status(400).json({
          status: false,
          statusCode: enums.BAD_REQUEST,
          count: 0,
          result: null,
          error: null,
        });
      }
    } catch (error) {
      errorLogger.error("Error in adding new Event");
      res.status(500).json({
        status: false,
        statusCode: enums.INTERNAL_SERVER_ERROR,
        count: 0,
        result: null,
        error: null,
      });
    }
    res.end();
  }
);

//Get Event By Date

router.get(
  "/getbydate/:date",
  urlencodedParser,
  async function (req, res, next) {
    try {
      var dbActionFeedback = await eventController.getbydate(req.params.date);
      if (dbActionFeedback) {
        eventLogger.info("Successfully Got the Event");
        res.status(200).json({
          status: true,
          statusCode: enums.OK,
          count: dbActionFeedback.result.length,
          result: dbActionFeedback.result,
          error: null,
        });
      } else {
        errorLogger.error("Error in getting the Event");
        res.status(500).json({
          status: false,
          statusCode: enums.INTERNAL_SERVER_ERROR,
          count: null,
          result: null,
          error: null,
        });
      }
    } catch (error) {
      errorLogger.error("Error in getting the Event" +logMessage);
      res.status(500).json({
        status: false,
        statusCode: enums.INTERNAL_SERVER_ERROR,
        count: null,
        result: null,
        error: error,
      });
    }
    res.end();
  }
);

//Get Event by ID

router.get("/getbyid/:id", urlencodedParser, async function (req, res, next) {
  try {
    var dbActionFeedback = await eventController.getbyid(req.params.id);
    if (dbActionFeedback.status) {
      eventLogger.info("Successfully got the Event");
      res.status(200).json({
        status: true,
        statusCode: enums.OK,
        count: dbActionFeedback.count,
        result: dbActionFeedback.result,
        error: null,
      });
    } else {
      errorLogger.error("Error in getting the Event");
      res.status(404).json({
        status: false,
        statusCode: enums.NOT_FOUND,
        count: null,
        result: null,
        error: null,
      });
    }
  } catch (error) {
    errorLogger.error("Error in getting the Event");
    res.status(500).json({
      status: false,
      statusCode: enums.INTERNAL_SERVER_ERROR,
      count: null,
      result: null,
      error: error,
    });
  }
  res.end();
});

//Update by id

router.put("/update/:id", jsonParser, async function (req, res, next) {
  var idQuery = req.params.id;
  var eventNewData = new eventModel({
    title: req.body.title,
    details: req.body.details,
    on: req.body.on,
    venue: req.body.venue,
    registrationLink: req.body.registrationLink,
  });
  try {
    var dbActionFeedback = await eventController.update(idQuery, eventNewData);
    if (dbActionFeedback.status) {
      eventLogger.info("Successfully updated the Event");
      res.status(200).json({
        status: true,
        statusCode: enums.OK,
        count: dbActionFeedback.count,
        result: dbActionFeedback.result,
        error: null,
      });
    } else {
      if (dbActionFeedback.statusCode == enums.NOT_FOUND) {
        errorLogger.error("Error in updating the Event");
        res.status(404).json({
          status: false,
          statusCode: enums.NOT_FOUND,
          count: null,
          result: null,
          error: null,
        });
      } else {
        errorLogger.error("Error in updating the Event");
        res.status(500).json({
          status: false,
          statusCode: enums.FORBIDDEN,
          count: null,
          result: null,
          error: null,
        });
      }
    }
  } catch (error) {
    errorLogger.error("Error in updating the Event");
    res.status(500).json({
      status: false,
      statusCode: enums.FORBIDDEN,
      count: null,
      result: null,
      error: null,
    });
  }
  res.end();
});

//#region delete by id
router.delete(
  "/deletebyid/:id",
  urlencodedParser,
  async function (req, res, next) {
    try {
      var dbActionFeedback = await eventController.deleteById(req.params.id);

      if (dbActionFeedback.status) {
        eventLogger.info("Successfully deleted the Event");
        res.status(200).json({
          status: true,
          statusCode: enums.OK,
          count: null,
          result: null,
          error: null,
        });
      } else {
        if (dbActionFeedback.statusCode == enums.NOT_FOUND) {
          errorLogger.error(
            "Error in deleting the Event.Cannot find the Event"
          );
          res.status(404).json({
            status: false,
            statusCode: enums.NOT_FOUND,
            count: null,
            result: null,
            error: null,
          });
        } else {
          errorLogger.error("Error in deleting the Event.");
          res.status(500).json({
            status: false,
            statusCode: enums.INTERNAL_SERVER_ERROR,
            count: null,
            result: null,
            error: null,
          });
        }
      }
    } catch (error) {
      errorLogger.error("Error in deleting the Event");
      res.status(500).json({
        status: false,
        statusCode: enums.INTERNAL_SERVER_ERROR,
        count: null,
        result: null,
        error: null,
      });
    }

    res.end();
  }
);
//#endregion

module.exports = router;
