// ------------------------------------Modules Required---------------
var express = require('express');
var passwordHash=require('password-hash');
var email=require('./node_modules/emailjs/email')
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var multer=require('multer')
var app = express();
var authenticationController = require('./server/controllers/authentication-controller');
var profileController = require('./server/controllers/profile-controller');
var wasteController = require('./server/controllers/waste-controller');
var usersController = require('./server/controllers/users-controller');
var path=require('path')
fs=require('fs')
var session = require('express-session');
//var store = new session.MemoryStore;


//<------------------------------End of requirements ---------------------------------



//------------------Configs----------------
var server=email.server.connect({
	user:"stupiddevforum@gmail.com	",
	password:"pesuisstupid",
	host:"smtp.gmail.com",
	ssl:true
});

var user=require('./models/model.js');

app.use(session({ secret: 'whatever'}));

//<--------------------------Configs Over -----



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser({uploadDir:'/uploads'}));
app.use(multipartMiddleware);
app.use('/app', express.static(__dirname + "/app" ));
app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use('/uploads', express.static(__dirname + "/uploads"));
app.get('/', function(req, res){
    res.redirect('/login');
});

app.use('/css', express.static(__dirname + '/views/src/'));
app.use(express.static(__dirname + '/views/src'));
app.use(express.static(path.join(__dirname, '../views/src/')));



//Signup And Signin here ->


// ---------------------------login -------------------------------------------------
app.get('/login',function(req,res){
res.sendFile(__dirname+'/views/signin.html')

	
});

app.post('/login',function(req,res){
	var us={
		email:req.body.email,
		
	}
	
	user.bug.find(us,function(err,results){
		if(err) console.log(err)
	else if(results.length==0) {console.log("No Such user ");res.send(passwordHash.generate('123'));}
	else {
		
		var hash=results[0].password
		if(passwordHash.verify(req.body.pass,hash)){
			console.log("Successful Login");
			
			req.session.user=results[0].username
			req.session.loggedin=true
			//res.send("adios");
			console.log(req.session);
		}
		else{
			console.log("Failed Login Atempt");
			
			req.session.loggedin=false
			//res.send("Muchos");
			
		}
		
		}
	
	res.redirect('/main');

	
});
	
	
	
	
	
	
});

// ----------------------------Signup-------------------------------------------------
app.get('/signup',function(req,res){
	res.sendFile(__dirname+'/views/signup.html');
	
});

app.post('/signup',function(req,res){

	var mail=req.body.email;
	var ur= new user.bug({
		username:req.body.name,
		password:passwordHash.generate(req.body.pass),
		email:req.body.email
		
	});
	ur.save(function(err){
	if(err) {console.log(err);}
	else {
		console.log('Signed Up');	
	//----------------Trying to send an email---------------
	server.send({
		text: 'Hey '+req.body.name+'are you so fucked up that you signed up here.Get outta here' ,
		from:'CCBD shit',
		to: mail,
		cc: '',
		subject: 'Ice is not nice'
	},
	function(er,message){
		console.log(err||message);
	});
	
	//-------------------------------Creating a Folder for the new user-------------------
	var dir = './uploads/'+req.body.name;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
		dir+='/posts'
		fs.mkdirSync(dir);
		
    }else
    {
        console.log("Directory already exist");
    }
	res.redirect('/login');
}
		
	});
	
	
	
	
	
});





//<------------------------------Done Here --------------------


//-------------------------------Main Pages-------------------

app.get('/main',function(req,res){
	
	if(!req.session.loggedin) res.redirect('/login')
	else{
		res.sendFile(__dirname+'/views/src/index.html');
	}
		
	
})
app.get('/post',function(req,res){
	
	if(!req.session.loggedin) res.redirect('/login')
	else{
		res.sendFile(__dirname+'/views/posts1.html');
	}
		
	
})

// -----------------------Photo Uploading------------------


app.post('/photoup',function(req,res){
	
fs.readFile(req.files.userPhoto.path, function (err, data) {
	 if(err){console.log(err);}
	 console.log(__dirname);
  var newPath = __dirname + '\\' +"uploads\\"+req.session.user+'\\posts\\'+req.files.userPhoto.name;
  fs.writeFile(newPath, data, function (err) {
	  if(err){console.log(err);}
	  else{
		  newPath='\\' +"uploads\\"+req.session.user+'\\'+'posts\\'+req.files.userPhoto.name;
		  var ins={
		username:req.session.user,
		imgurl:newPath,
		description:req.body.desc
		
	}
	console.log(ins);
		  var post= new user.post(ins);
	post.save(function(err){
	if(err) {console.log(err);}
	else {console.log("Photo Updated");}
	});

		res.redirect("/main");  
	  }
    
  });
  
  
 
  
  
});





 

});



//---------------------------------


//-------------------------------Being Jobless------------

app.get('/check',function(req,res){
	//res.sendFile(__dirname+'/views/')
	//arr=[{user:"Vinay",imgurl:"\\uploads\\Vinay\\posts\\askquest.png"}]
	var qu="{imgurl:1,username:1,_id:0}"
	user.post.find(qu,function(err,results){
		console.log(results);
	 var html = buildHtml(results);
		res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': html.length,
    'Expires': new Date().toUTCString()
  });
  res.end(html);
		
	});
	

  
	
	
	
});


function buildHtml(req) {
  var header = '';
  var body = '<div id="posts">'
  

  // concatenate header string
  // concatenate body string
  
  
  header+=`
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-blue-grey.css">
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>
html,body,h1,h2,h3,h4,h5 {font-family: "Open Sans", sans-serif}
#logout {
	position: relative;
	right: 0px;
	left: 400px;
	top: 8px;
}
#dp {
	position: relative;
	left: 64px;
	top: 8px;
}
#pr {
	top: 8px;
	position: relative;
	left: 20px;
}
</style>
`
  
  
  
  
 for(i=0;i<req.length;i++){
	 //body+="<div id='"+req[i].username+"' style='position:relative;padding-top:30px'>"+"<span 	style='position:relative;font-size:25px;top:-175px;left:20px;border:1px solid transparent;border-radius:2px;' >"+req[i].username+"</span>"+"<img style='position:relative;padding:5px;top:50px'  src='"+req[i].imgurl+"' height=200 width=200/> </br></br>"+"<p></p><p></p><br><br><span 	style='position:relative;font-size:25px;left:20px;border:1px solid transparent;border-radius:2px;' >"+req[i].description+"</span>"+"</div>"
	 
	 
	 
	 
	 
	body+=`
<div class="w3-container w3-card-2 w3-white w3-round w3-margin"><br>
        <img src="uploads/`+req[i].username+`/pro.png" alt="Avatar" class="w3-left w3-circle w3-margin-right" style="width:60px">
        <span class="w3-right w3-opacity">1 min</span>
        <h4>`+req[i].username+`</h4><br>
        <hr class="w3-clear">
        <p>`+req[i].description +`</p>
          <div class="w3-row-padding" style="margin:0 -16px">
            <div class="w3-half">
              <img src="`+ req[i].imgurl+`" style="width:100%" alt="Northern Lights" class="w3-margin-bottom">
            </div>
            
        </div>
        <button type="button" class="w3-button w3-theme-d1 w3-margin-bottom"><i class="fa fa-thumbs-up"></i>  Like</button> 
        <button type="button" class="w3-button w3-theme-d2 w3-margin-bottom"><i class="fa fa-comment"></i>  Comment</button> 
      </div>
      
`
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
 }

  
  return '<!DOCTYPE html>'
       + '<html>' + header + '<body>' + body + '</body></html>';
};



//--------------------------------------Searching users to chase em------------------------
app.post ('/search',function(req,res){
	
	var name={username:new RegExp('^'+req.body.name)};
	console.log(name)
	user.bug.find(name,function(err,results){
		if(err) console.log(err)
		else{
			//console.log(results);
			var ht=buildSeacrh(results);
			res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': ht.length,
    'Expires': new Date().toUTCString()
  });
  res.end(ht);
		}
	}
	)
	
	
});


function buildSeacrh(req) {
  var header = '';
  var body = ''

  // concatenate header string
  // concatenate body string
  
 for(i=0;i<req.length;i++){
	 body+='<form method="POST" action="/follow"><input type="text" name="follow" style="border:0;font-size:22px" value="'+req[i].username+'" readonly/><input type="text" style="visibility:hidden" name="_id" style="border:0;font-size:22px" value="'+req[i]._id+'" readonly/><input style="position:relative;left:300px;" type="submit" value="Follow"/></form>'
	 
 }
 
  
  return '<!DOCTYPE html>'
       + '<html><header>' + header + '</header><body>' + body + '</body></html>';
};



app.post('/follow',function(req,res){
	var c_user=req.session.user;
	
	var f_id=req.body._id
	user.bug.update({username:c_user},{$push:{following:{$each :[f_id]} }},function(err,results){
		if(err) console.log(err)
		else console.log("Done")
		
	});
	res.send("Foolowing"+req.body.follow);
	
});


//-------------------------------------Profile------------------------------
app.get('/profile',function(req,res){
	
	var un={username:req.session.user};
	
	user.bug.find(un,function(err,results){
		if(err || results.length==0) console.log(err);
		else{
			
			
			var h=buildProfile(results,req);
			
			
			res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': h.length,
    'Expires': new Date().toUTCString()
  });
  res.end(h);
			
			
			
			
	}
	}
	);
		
		
	}	
);


function buildProfile(requ,req) {
	var str=req.session.user
	
  var header = '';
  var body = ''

  // concatenate header string
  // concatenate body string
  
 header+=`
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-blue-grey.css">
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>
html,body,h1,h2,h3,h4,h5 {font-family: "Open Sans", sans-serif}
</style>
` 
  
 
 body+=`
<div class="w3-card-2 w3-round w3-white">
        <div class="w3-container">
         <h4 class="w3-center">`+requ[0].username+`</h4>
         <p class="w3-center"><img src="uploads/`+req.session.user+`/pro.png" class="w3-circle" style="height:106px;width:106px" alt="Avatar"></p>
         <hr>
		 <form style="position:relative;left:40%" action="/proup" enctype="multipart/form-data" method="POST">
		 <input type="file" name="pro"/>
		 <button style="position:relative;left:35%%"type="submit" class="w3-button w3-theme"><i class="fa fa-pencil"></i>  Post</button> 
			</form>
         <p><i class="fa fa-pencil fa-fw w3-margin-right w3-text-theme"></i> Designer, UI</p>
         <p><i class="fa fa-home fa-fw w3-margin-right w3-text-theme"></i> London, UK</p>
         <p><i class="fa fa-birthday-cake fa-fw w3-margin-right w3-text-theme"></i> April 1, 1988</p>
        </div>
      </div>
      <br>
	  
      <div class="w3-card-2 w3-round">
        <div class="w3-white">
          <button onclick="myFunction('Demo1')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-circle-o-notch fa-fw w3-margin-right"></i> Followers `
		  
		 +requ[0].followers.length+` 
		  
		  </button>
          <div id="Demo1" class="w3-hide w3-container">
            <p>Some text..</p>
          </div>
          <button onclick="myFunction('Demo2')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-calendar-check-o fa-fw w3-margin-right"></i> Following  `+requ[0].following.length+`</button>
          <div id="Demo2" class="w3-hide w3-container">
            <p>Some other text..</p>
          </div>
          <button onclick="myFunction('Demo3')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-users fa-fw w3-margin-right"></i> My Photos</button>
          <div id="Demo3" class="w3-hide w3-container">
         <div class="w3-row-padding">
         <br>
           <div class="w3-half">
             <img src="/w3images/lights.jpg" style="width:100%" class="w3-margin-bottom">
           </div>
           <div class="w3-half">
             <img src="/w3images/nature.jpg" style="width:100%" class="w3-margin-bottom">
           </div>
           <div class="w3-half">
             <img src="/w3images/mountains.jpg" style="width:100%" class="w3-margin-bottom">
           </div>
           <div class="w3-half">
             <img src="/w3images/forest.jpg" style="width:100%" class="w3-margin-bottom">
           </div>
           <div class="w3-half">
             <img src="/w3images/nature.jpg" style="width:100%" class="w3-margin-bottom">
           </div>
           <div class="w3-half">
             <img src="/w3images/fjords.jpg" style="width:100%" class="w3-margin-bottom">
           </div>
         </div>
          </div>
        </div>      
      </div>	  
	  
	  `
	  
	  
 
  
  return '<!DOCTYPE html>'
       + '<html><header>' + header + '</header><body>' + body + '</body></html>';
};

app.get('/logout',function(req,res){
	req.session.user="";
	req.session.loggedin=false;
	res.redirect('/login');
	
	
});


////////=====================now i just want sapce

app.post('/proup',function(req,res){
	
fs.readFile(req.files.pro.path, function (err, data) {
	 if(err){console.log(err);}
	 console.log(__dirname);
  var newPath = __dirname + '\\' +"uploads\\"+req.session.user+'\\'+'pro.png';
  fs.writeFile(newPath, data, function (err) {
	  if(err){console.log(err);}
	  else{
		 
		res.redirect("/main");  
	  }
    
  });
  
  
 
  
  
});





 

});
















app.listen(3000,function(err){
	if(err) console.log(err);
	else console.log("Listening")
});