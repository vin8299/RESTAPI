//Express Router
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();


dishRouter.use(bodyParser.json());

//For dish
dishRouter.route('/')

.get((req,res,next)=>{
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes); // This will take the data from database and return json to client
    }, (err)=>{next(err)})
    .catch((err) => {next(err)}) //next(err) bcoz error handler is defined in app.js by express-generator
})

.post(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Dishes.create(req.body)
    .then((dish) => {
        console.log("Dish created " , dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish); 
    },(err)=>{next(err)})
    .catch((err) => {next(err)})
})

.put(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode=403;
    res.end("PUT operation will not be supported!");
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Dishes.remove({})
    .then((resp) => {
        console.log("Deleted Successfully");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);  
    }, (err) => {next(err)})
    .catch((err) => next(err))
});


//For Dish/id
dishRouter.route('/:dishId')

.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish); // This will take the data from database and return json to client
    }, (err)=>{next(err)})
    .catch((err) => {next(err)})
})
.post(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode=403;
    res.end("POST request not supported!");
})
.put(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set:req.body}, {new : true})
        .then((dish) => {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish); // This will take the data from database and return json to client
        }, (err)=>{next(err)})
        .catch((err) => {next(err)})
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        console.log("Deleted Successfully");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);  
    }, (err) => {next(err)})
    .catch((err) => next(err))
});

//For comments

dishRouter.route('/:dishId/comments')

.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish!=null){  
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments); 
    }// This will take the data from database and return json to client
    else {
        err = new Error("Dish "+req.params.dishId+" not found");
        err.status = 404;
        return next(err);
    }
    }, (err)=>{next(err)})
    .catch((err) => {next(err)})
})

.post(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null){
            req.body.author = req.user._id;//This user id is contained in body beacuse of verify user
            dish.comments.push(req.body);
            dish.save()
            .then((dish) =>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish.comments);    
                })
            })
    }
    else {
        err = new Error("Dish "+req.params.dishId+" not found");
        err.status = 404;
        return next(err);
    }   
    }, (err) => {next(err)})
    .catch((err) => {next(err)})
})

.put(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode=403;
    res.end("PUT operation is not supported");
})

.delete(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish!=null){
            //Running loop for deleting each comment
            for(var i=(dish.comments.length-1);i>=0;i--){
                dish.comments.id(dish.comments._id).remove();
            };
            dish.save()
            .then((dish) =>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish); 
            })
    }
    else {
        err = new Error("Dish "+req.params.dishId+" not found");
        err.status = 404;
        return next(err);
    }  
    }, (err) => {next(err)})
    .catch((err) => next(err))
});


dishRouter.route('/:dishId/comments/:commentId')

.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish!=null && dish.comments.id(req.params.commentId)!=null){  
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId)); 
            }
        else if(dish==null){
        err = new Error("Dish "+req.params.dishId+" not found");
        err.status = 404;
        return next(err);
            }
        else{
        err = new Error("Comments "+req.params.commentId+" not found");
        err.status = 404;
        return next(err);
        }
    }, (err)=>{next(err)})
    .catch((err) => {next(err)})
})

.post(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode=403;
    res.end("POST request not supported!");
})

.put(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish!=null && dish.comments.id(req.params.commentId)!=null){  
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating=req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment=req.body.comment; 
            }
            dish.save()
            .then((dish) =>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish); 
                })
            })
            }
        else if(dish==null){
        err = new Error("Dish "+req.params.dishId+" not found");
        err.status = 404;
        return next(err);
            }
        else{
        err = new Error("Comments "+req.params.commentId+" not found");
        err.status = 404;
        return next(err);
        }
    }, (err)=>{next(err)})
        .catch((err) => {next(err)})
})

.delete(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish) => {
        if(dish!=null && dish.comments.id(req.params.commentId!=null)){
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish); 
                })
            })
        }
        else if(dish==null){
            err = new Error("Dish "+req.params.dishId+" not found");
            err.status = 404;
            return next(err);
                }
            else{
            err = new Error("Comments "+req.params.commentId+" not found");
            err.status = 404;
            return next(err);
            } 
    }, (err) => {next(err)})
    .catch((err) => next(err))
});


module.exports = dishRouter;
