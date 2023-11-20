const express = require("express");
const router = express.Router();
const moment = require('moment');
const winston = require("winston");

const logger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: "request_logs.log" }),
    ],
  });

const requestLoggerMiddleware = (req, res, next) => {
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  
    const logMessage = `${timestamp} - ${method} request to ${url}`;
    logger.info(logMessage)
    next(); 
  };
  
module.exports={requestLoggerMiddleware}