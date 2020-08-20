const express = require("express");
let router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongoDB = 'mongodb://127.0.0.1:27017/local';
mongoose.connect(mongoDB, { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const bcrypt = require('bcrypt');

const saltRounds = 10;

var userSchema = new Schema({
    username : String,
    password : String,
    email : String
})

var userObj = mongoose.model('users', userSchema);



router.get('/', function(request, response,next) {
    response.redirect('/login');
});

router.get('/login', function(req, res){
    res.render('login.html' , {msg:""});
 });

router.post('/login', async function(req, res){
    var username = req.body.username;
    var password = req.body.password;


    var arr = "";
    //find username with password
    try {
        arr = await userObj.findOne({ username: username });
    } catch (error) {
        response.status(400).send('Cannot find user')
    }
    console.log("arr")
    console.log(arr);
    if (arr) {
        if (await bcrypt.compare(password, arr.password)) {
            console.log("login success")
            res.render('dashboard.html' , {username:username});
        } else {
            console.log("login failed")
            res.render('login.html' , {msg:"Password incorrect"});
            return;
        }
        
        return;
    } else {
        console.log("login failed")
        res.render('login.html' , {msg:"User not found"});
        return;
    }


    
 });

 router.get('/signup', function(req, res){
    res.render('signup.html', {msg: ""});
 });



router.post('/signup', async function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var confirmpassword = req.body.confirmpassword;
    var email = req.body.email;

    if (!username || !password || !confirmpassword || !email) {
        res.render('signup.html' , {msg: "Incomplete credentials!"});
        return;
    }

    if (password != confirmpassword) {
        res.render('signup.html' , {msg: "Password does not match reinput password!"});
        return;
    }

    if (password.length < 7) {
        res.render('signup.html' , {msg: "Password too short!"});
        return;
    }


    
    var arr = "";

    //find if username used
    try {
        arr = await userObj.find({ username: username });
    } catch (error) {
        console.log("error : " + error);
    }
    
    console.log(arr);
    if (arr.length > 0) {
        res.render('signup.html' , {msg: "Username already exist!"});
        return;
    }
    
    
    bcrypt.hash(password, saltRounds, async function(err, hash) {

        await signupObj.create({username : username, password : hash, email : email}, function(err,result) {
            if (err){ 
                console.log(err); 
            } 
            else{ 
                console.log(result) 
            }
            res.render('signup.html' , {msg: "Sign up success! Click <a href='/login'>HERE</a> to login"});
        });


        //var data = new signupObj({username : username, password : hash, email : email})
        //data.save(function(err,result){ 

        //});
        return;
        
    })
    
    
 });

module.exports = router;