const express = require('express');
const eventService = require('../Event/service')

async function insert(newEvent){
    return await eventService.insert(newEvent);
}

async function getbydate(event){
    return await eventService.getbydate(event)
}

async function getbyid(id){
    return await eventService.getbyid(id)
}

async function update(id,eventNewData){
    return await eventService.update(id,eventNewData)
}

async function deleteById(id){
    return await eventService.deleteByid(id)
}


module.exports={insert,getbydate,getbyid,update,deleteById};