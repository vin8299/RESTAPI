//Express Router
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();


promoRouter.use(bodyParser.json());


promoRouter.route('/')

.get((req,res,next)=>{
    Promotions.find({})
    .then((promos) =>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(promos);
    }, (err) => {next(err)})
    .catch((err) => {next(err)})
})

.post(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.create(req.body)
    .then((promo) => {
        console.log("Created promotion", promo);
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(promo); 
    }, (err) => {next(err)})
    .catch((err) => {next(err)})
})

.put(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode=403;
    res.end("PUT operation will not be supported!");
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.remove({})
    .then((resp)=>{
        console.log("Deleted promotions Successfully");
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(resp); 
    }, (err) =>{next(err)})
});


promoRouter.route('/:promoId')

.get((req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promo) =>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(promo);
    }, (err) => {next(err)})
    .catch((err) => {next(err)})
})

.post(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode=403;
    res.end("POST request not supported!");
})

.put(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId, {$set:req.body},{new:true})
    .then((promo) =>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(promo);
    }, (err) => {next(err)})
    .catch((err) => {next(err)})
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((resp)=>{
        console.log("Deleted promotion"+req.params.promoId+ " Successfully");
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(resp); 
    }, (err) =>{next(err)})
    .catch((err) =>{next(err)})
});


module.exports = promoRouter;
