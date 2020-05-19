const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');    //for using req.body
const path = require('path')
const date = require(__dirname + "/date.js");



const app = express();
const port = 5000;

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

// DASHBOARD PAGE
app.get("/dashboard", function(req,res){
    app.use(express.static('./admin dashboard'));   //change static folder since earlier wasnt rendering css
    res.sendFile(__dirname + "/admin dashboard/admin.html");
});

// USERS PAGE
app.post("/add-users", function(req,res) {
   
    let fname = req.body.fname;
    let lname = req.body.lname;
    let contact = req.body.contact;
    let password = req.body.password;
    let email = req.body.email;
    let user_type = req.body.user_type;
    let reg_date = date.currentDate();
    let  updation_date = reg_date;
    // console.log(req.body.user_type);
    // console.log(req.body);
    // console.log(fname + lname + contact + password + email + user_type + reg_date + updation_date);
    let sql = "INSERT INTO user VALUES(null, '" + fname + "', '" + lname + "', '" + contact + "', '" + password + "', '" + email + "', '" + user_type + "', '" + reg_date + "', '" + updation_date + "')";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
        } 
    });
    
    res.render(__dirname + "/pop-up.ejs", {title : "User Added", msg : "Congratulations!!  User has been added successfully" });
});




// con.end();

app.listen(port, function (err) {

    if (err)
        console.log("Error in connection " + err);
    else
        console.log("Listening on localhost:"+port);
});