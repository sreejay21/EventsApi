var express = require('express');
const api = express();

var eventsRouter= require('./api/src/Event/routes');

api.use('/event',eventsRouter)
api.use(express.json());

api.listen('3000',()=>{
    console.log("Events service Started")
})

module.exports=api;