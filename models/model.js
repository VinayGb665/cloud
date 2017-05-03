var mongoose=require('mongoose');
var bugs=require('./user.js');
mongoose.connect('mongodb://localhost:27017/cc');

var db=mongoose.connection;
db.on('error',console.error.bind('Connection Error'));
db.once('open',function(callback){
	console.log('Connection Succesfsul');
	
});
var bug=mongoose.model('credentials',bugs.userSchema);
var post=mongoose.model('post',bugs.postSchema);
module.exports.bug=bug;
module.exports.post=post;