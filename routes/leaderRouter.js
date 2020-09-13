//Express Router
const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');

const leaderRouter = express.Router();


leaderRouter.use(bodyParser.json());


leaderRouter.route('/')

.get((req,res,next)=>{
    Leaders.find({})
    .then((leaders) =>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(leaders);
    }, (err) => {next(err)})
    .catch((err) => {next(err)})
})

.post((req,res,next)=>{
    Leaders.create(req.body)
    .then((leader) => {
        console.log("Created promotion", leader);
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(leader); 
    }, (err) => {next(err)})
    .catch((err) => {next(err)})
})

.put( (req,res,next)=>{
    res.statusCode=403;
    res.end("PUT operation will not be supported!");
})

.delete((req,res,next)=>{
    Leaders.remove({})
    .then((resp)=>{
        console.log("Deleted promotions Successfully");
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(resp); 
    }, (err) =>{next(err)})
});


leaderRouter.route('/:leaderId')

.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader) =>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(leader);
    }, (err) => {next(err)})
    .catch((err) => {next(err)})
})

.post((req,res,next)=>{
    res.statusCode=403;
    res.end("POST request not supported!");
})

.put( (req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId, {$set:req.body},{new:true})
    .then((leader) =>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(leader);
    }, (err) => {next(err)})
    .catch((err) => {next(err)})
})

.delete((req,res,next)=>{
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((resp)=>{
        console.log("Deleted promotion"+req.params.leaderId+ " Successfully");
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(resp); 
    }, (err) =>{next(err)})
    .catch((err) => {next(err)})
});


module.exports = leaderRouter;
