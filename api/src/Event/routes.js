const express = require("express");
const router = express.Router();
const eventController = require("./controller");
const eventModel = require("./model");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var validationEvent =require('./validation')
var enums = require("../../../enums");
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//Adding a new event
router.post("/add", jsonParser,validationEvent.validateEvent, async function (req, res, next) {
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
      res.status(201).json({
        status: true,
        statusCode: enums.CREATED,
        count: dbActionFeedback.count,
        result: dbActionFeedback.result,
        error: null,
      });
    } else {
      res.status(500).json({
        status: false,
        statusCode: enums.INTERNAL_SERVER_ERROR,
        count: 0,
        result: null,
        error: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      statusCode: enums.INTERNAL_SERVER_ERROR,
      count: 0,
      result: null,
      error: null,
    });
  }
  res.end();
});

//Get Event By Date

router.get(
  "/getbydate/:date",
  urlencodedParser,
  async function (req, res, next) {
    try {
      var dbActionFeedback = await eventController.getbydate(req.params.date);
      console.log(dbActionFeedback)
      if (dbActionFeedback) {
        res.status(200).json({
          status: true,
          statusCode: enums.OK,
          count: dbActionFeedback.count,
          result: dbActionFeedback.result,
          error: null,
        });
      } else {
        if (dbActionFeedback.status == enums.NOT_FOUND) {
          res.status(404).json({
            status: false,
            statusCode: enums.NOT_FOUND,
            count: null,
            result: null,
            error: null,
          });
        } else {
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
    console.log(dbActionFeedback)
    if (dbActionFeedback.status) {
      res.status(200).json({
        status: true,
        statusCode: enums.OK,
        count: dbActionFeedback.count,
        result: dbActionFeedback.result,
        error: null,
      });
    } else {
      if (dbActionFeedback.status == enums.NOT_FOUND) {
        res.status(404).json({
          status: false,
          statusCode: enums.NOT_FOUND,
          count: null,
          result: null,
          error: null,
        });
      } else {
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
    Details: req.body.details,
    on: req.body.on,
    venue: req.body.venue,
    RegistrationLink: req.body.registrationLink
  });
  try {
    var dbActionFeedback = await eventController.update(idQuery, eventNewData);
    if (dbActionFeedback.status) {
      res
        .status(200)
        .json({
          status: true,
          statusCode: enums.OK,
          count: dbActionFeedback.count,
          result: dbActionFeedback.result,
          error: null,
        });
    } else {
      if (
        dbActionFeedback.statusCode == enums.NOT_FOUND
      ) {
        res
          .status(404)
          .json({
            status: false,
            statusCode: enums.NOT_FOUND,
            count: null,
            result: null,
            error: null,
          });
      } else {
        res
          .status(500)
          .json({
            status: false,
            statusCode: enums.FORBIDDEN,
            count: null,
            result: null,
            error: null,
          });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        statusCode: enums.FORBIDDEN,
        count: null,
        result: null,
        error: null,
      });
      console.log(error)
  }
  res.end()
});


//#region delete by id
router.delete('/deletebyid/:id', urlencodedParser, async function (req, res, next) {
  try {
          var dbActionFeedback = await eventController.deleteById(req.params.id);

          if(dbActionFeedback.status) {
              res.status(200).json({status:true, statusCode:enums.OK, count:null, result:null, error: null});
          } else {
              if(dbActionFeedback.statusCode == enums.NOT_FOUND) {
                  res.status(404).json({status:false, statusCode:enums.NOT_FOUND, count:null, result:null, error: null});
              } else {
                  res.status(500).json({status:false, statusCode:enums.INTERNAL_SERVER_ERROR, count:null, result:null, error: null});
              }
          }
      } catch (error) {
          res.status(500).json({status:false, statusCode:enums.INTERNAL_SERVER_ERROR, count:null, result:null, error: null});
      }

      res.end();
  }
);
//#endregion

module.exports = router;
