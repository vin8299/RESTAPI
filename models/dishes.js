const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment: {
        type:String,
        required:true
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
}, {
    timestamps:true
});

const dishSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        require:true
    },
    image : {
        type:String,
        required:true
    },
    category : {
        type:String,
        required:true
    },
    label : {
        type:String,
        required:""
    },
    price : {
        type:Currency,
        required:true
    },
    featured : {
        type:Boolean,
        required:false
    },
    comments:[commentSchema]
}, {
    timestamps:true
});

var Dishes = mongoose.model('Dish', dishSchema);//Collection is Dish when stored it will be converted in plural i.e to Dishes

module.exports = Dishes;