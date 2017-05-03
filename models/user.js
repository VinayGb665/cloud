var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var userSchema=new Schema({
username:{type:String},
password:{type:String},
email:{type:String,unique:true},
following:[],
followers:[],
prourl:{type:String}
});


var postSchema=new Schema({

username:{type:String},
imgurl:{type:String,unique:true},
description:{type:String}


});
module.exports.userSchema=userSchema;
module.exports.postSchema=postSchema;