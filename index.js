const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');    //for using req.body
const path = require('path')
const date = require(__dirname + "/date.js");



const app = express();
const port = 5000;

app.locals.myvar="hello";
                                  //to render css along with html in node.js app , need to use static method to include such static css, js files
app.use(express.static('./'));    // './' is current dir specified since all static files i.e pics,.css,etc r in root dir
app.use(bodyParser.urlencoded({ extended: true }));    // to get the form contents from req.body

app.set('view engine', 'ejs');                 //sets ejs as the templating engine
app.set('views', path.join(__dirname, './'));    //using this no need to use  res.sendFile(__dirname + "/index.html");

// MYSQL CONNECTION
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'dbms'
});

con.connect(function (err) {
    if (err)
        console.log("Error in connection " + err);
    else
        console.log("Connected to dbms");
});

// INDEX PAGE
app.get("/", function(req,res){
    res.sendFile("index.html");
});

// LOGIN REGISTER
app.get("/login", function(req,res){
    app.use(express.static('./login signup')); 

    res.sendFile(__dirname + "/login signup/login.html");
});

app.get("/register", function(req,res){
    app.use(express.static('./login signup')); 

    res.sendFile(__dirname + "/login signup/register.html");
});

//CITIES
app.get("/explore-cities", function(req,res){
    app.use(express.static('./cities')); 

    res.sendFile(__dirname + "/cities/cities.html");
});

app.get("/varanasi", function(req,res){
    app.use(express.static('./cities/places')); 

    res.sendFile(__dirname + "/cities/places/varanasi.html");
});

app.get("/kolkata", function(req,res){
    app.use(express.static('./cities/places')); 

    res.sendFile(__dirname + "/cities/places/kolkata.html");
});


//PACKAGES
app.get("/varanasi-package", function(req,res){
    app.use(express.static('./packages')); 

    res.sendFile(__dirname + "/packages/varanasi-package.html");
});

app.get("/kolkata-package", function(req,res){
    app.use(express.static('./packages')); 

    res.sendFile(__dirname + "/packages/kolkata-package.html");
});

// DASHBOARD PAGE
app.get("/dashboard", function(req,res){
    app.use(express.static('./admin dashboard'));   //change static folder since earlier wasnt rendering css   

    res.render(__dirname + "/admin dashboard/admin.ejs");
});

// PROFILE PAGE
app.get("/profile", function(req,res){
    app.use(express.static('./admin dashboard')); 

    res.render(__dirname + "/admin dashboard/profile.ejs");
});


// USERS PAGE
app.get("/users", function(req,res){
    app.use(express.static('./admin dashboard')); 

    let sql = "SELECT * FROM user";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            // console.log(rows);
            res.render(__dirname + "/admin dashboard/users.ejs", {users: rows});
        } 
    });
});

app.post("/add-users", function(req,res) {
   
    let user_name = req.body.user_name;
    let contact = req.body.contact;
    let password = req.body.password;
    let email = req.body.email;
    let user_type = req.body.user_type;
    let reg_date = date.currentDate();
    let  updation_date = reg_date;
    // console.log(req.body.user_type);
    // console.log(req.body);
    // console.log(fname + lname + contact + password + email + user_type + reg_date + updation_date);
    let sql = "INSERT INTO user VALUES(null, '" + user_name + "', '" + contact + "', '" + password + "', '" + email + "', '" + user_type + "', '" + reg_date + "', '" + updation_date + "')";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
        } 
    });
    
    let msg = "Congratulations!!  User " + user_name +" has been successfully added."
    res.render(__dirname + "/pop-up.ejs", {title : "User Added", msg : msg});
});

app.post("/update-users", function(req,res) {
   
    let user_name = req.body.user_name;
    let contact = req.body.contact;
    let password = req.body.password;
    let email = req.body.email;
    let user_type = req.body.user_type;
    let updation_date = date.currentDate();
    // console.log(req.body);
    // console.log(user_name + contact + password + email + user_type + updation_date);

    let sql = "UPDATE user SET contact = '" + contact + "' , password = '" + password + "' , email = '" + email + "' , user_type = '" + user_type + "' , updation_date = '" + updation_date + "' WHERE user_name = '" + user_name +"'";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
        } 
    });
    
    let msg = "Congratulations!!  User "+ user_name + " has been updated successfully with values <br> "
    let m1 =  "<br>User Name : "+ user_name;
    let m2 =  "<br>Email : "+ email;
    let m3 =  "<br>Password : "+ password;
    let m4 =  "<br>Contact : "+ contact;
    let m5 =  "<br>User Type : "+ user_type;
    msg =  msg + m1 + m2 + m3 + m4 + m5;

    res.render(__dirname + "/pop-up.ejs", {title : "User Updated", msg : msg });
});

app.post("/delete-user", function(req,res) {
   
    let user_name = req.body.user_name;

    console.log(req.body);
    let sql = "DELETE FROM user WHERE user_name = '" + user_name + "'";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
        } 
    });
    let msg = "User "+ user_name + " has been successfully removed from the database. "

    res.render(__dirname + "/pop-up.ejs", {title : "User Deleted", msg : msg });
    
});

// app.post("/autofill-users", function(req,res){

//     let fname = req.body.fname;
//     let sql = "SELECT * FROM user WHERE fname= '" + fname +"'";
//     con.query(sql, function(err,rows){
//         if(err)
//         console.log(err);
//         else{
//             console.log(rows);
//             // document.querySelector("#update-users input[name=fname]").val("abc");
//             // $("#update-users input[name=user_type]").val(["general"]);
//             res.render(__dirname + "/admin dashboard/users.ejs", {updates: rows,users});
//             // res.redirect("localhost:"+ port+ "/users#update-users");
//         } 
//     });
    
// });


// CATEGORY PAGE
app.get("/category", function(req,res){
    app.use(express.static('./admin dashboard')); 

    res.render(__dirname + "/admin dashboard/category.ejs");
});

// CITIES PAGE
app.get("/city", function(req,res){
    app.use(express.static('./admin dashboard')); 

    res.render(__dirname + "/admin dashboard/cities.ejs");
});

// PLACES PAGE
app.get("/places", function(req,res){
    app.use(express.static('./admin dashboard')); 

    res.render(__dirname + "/admin dashboard/places.ejs");
});

// PACKAGES PAGE
app.get("/package", function(req,res){
    app.use(express.static('./admin dashboard')); 

    res.render(__dirname + "/admin dashboard/packages.ejs");
});

// REVIEWS PAGE
app.get("/reviews", function(req,res){
    app.use(express.static('./admin dashboard')); 

    res.render(__dirname + "/admin dashboard/reviews.ejs");
});

// BOOKINGS PAGE
app.get("/bookings", function(req,res){
    app.use(express.static('./admin dashboard')); 

    res.render(__dirname + "/admin dashboard/bookings.ejs");
});

// ENQUIRIES PAGE
app.get("/enquiries", function(req,res){
    app.use(express.static('./admin dashboard')); 

    res.render(__dirname + "/admin dashboard/enquiries.ejs");
});

// ANALYTICS PAGE
app.get("/analytics", function(req,res){
    app.use(express.static('./admin dashboard')); 

    res.render(__dirname + "/admin dashboard/analytics.ejs");
});

// CHARTS PAGE
app.get("/charts", function(req,res){
    app.use(express.static('./admin dashboard')); 

    res.render(__dirname + "/admin dashboard/charts.ejs");
});


// con.end();

app.listen(port, function (err) {

    if (err)
        console.log("Error in connection " + err);
    else
        console.log("Listening on localhost:"+port);
});