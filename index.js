//jshint esversion: 6
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');    //for using req.body
const path = require('path')
const dotenv = require('dotenv');
const date = require(__dirname + "/date.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const authController = require(__dirname + '/controllers/auth');


dotenv.config({ path: './.env' });     //to safequard our database details n other passwords

const app = express();
const port = 5000;

app.locals.myvar = "hello";
//to render css along with html in node.js app , need to use static method to include such static css, js files
app.use(express.static('./'));    // './' is current dir specified since all static files i.e pics,.css,etc r in root dir
app.use(bodyParser.urlencoded({ extended: true }));    // to get the form contents from req.body
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');                 //sets ejs as the templating engine
app.set('views', path.join(__dirname, './'));    //using this no need to use  res.sendFile(__dirname + "/index.html");

// MYSQL CONNECTION
const con = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true
});

con.connect(function (err) {
    if (err)
        console.log("Error in connection " + err);
    else
        console.log("Connected to dbms");
});

// INDEX PAGE
app.get("/", authController.isLoggedIn, function (req, res) {
    res.render("index.ejs", { user: req.user });
});

// LOGIN REGISTER
<<<<<<< HEAD
app.get("/login", function(req,res){
=======
app.get("/login", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./login signup'));

    res.render(__dirname + "/login signup/login.ejs", { msg: "" });
});

<<<<<<< HEAD
app.get("/register", function(req,res){
=======
app.post("/login", async function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./login signup'));

    try {
        let { user_name, password } = req.body;
        console.log(req.body);
        if (!user_name || !password) {
            return res.status(400).render(__dirname + "/login signup/login.ejs", { msg: "Please provide username and password" });
        }

        let sql = "SELECT * FROM user WHERE user_name = '" + user_name + "'";
        con.query(sql, async function (err, rows) {
            if (err)
                console.log(err);

            console.log(rows);
            if (!rows || !(await bcrypt.compare(password, rows[0].password))) {
                res.status(401).render(__dirname + "/login signup/login.ejs", { msg: "Username or password is incorrect" });
            }
            else {
                const user_id = rows[0].user_id;

                const token = jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET, {    //creates jwt token
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The token is " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }
        });

    } catch (err) {
        console.log(err);
    }

});

app.get("/user-profile", authController.isLoggedIn, function (req, res) {    //the page to be hidden n visible only if it matches current token, for such authentication we create a middleware   
    app.use(express.static('./login signup'));
    // console.log(req.message);                                          //we include the authController middleware's isLoggedIn func first in which the defined variables can be accessed here

    if (req.user) {
        res.render(__dirname + "/login signup/user-profile.ejs", { user: req.user });
    }
    else {
        res.redirect("/login");
    }

});

app.get("/logout", function (req, res) {
    res.cookie('jwt', 'logout', {                         //new cookie that will overwrite existing cookie n expires in 2ms after logout is pressed
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });

    res.status(200).redirect("/");
});

app.get("/register", function (req, res) {
    app.use(express.static('./login signup'));

    res.render(__dirname + "/login signup/register.ejs", { msg: "" });
});

app.post("/register", function (req, res) {
    app.use(express.static('./login signup'));

    let { user_name, contact, password, confirm_password, email } = req.body;   //SHORTCUT IF NAMES R SAME
    let user_type = "general";
    let reg_date = date.currentDate();
    let updation_date = reg_date;
    // console.log(user_type);
    // console.log(req.body);
    // console.log(user_name +" "+ contact +" " + password +" " + confirm_password +" " + email +" " + user_type +" " + reg_date +" " + updation_date);

    let sql = "SELECT user_name FROM user WHERE user_name = '" + user_name + "'";
    con.query(sql, async function (err, rows) {
        if (err)
            console.log(err);

        // console.log(rows);
        if (rows.length > 0) {
            res.render(__dirname + "/login signup/register.ejs", { msg: "That user name is already in use!! " });
        }
        else if (password != confirm_password) {
            res.render(__dirname + "/login signup/register.ejs", { msg: "Passwords do not match, Enter again!! " });
        }
        else {
            let hashed_password = await bcrypt.hash(password, 8);     //8 pased as no of rounds for encrypting, by default it takes salt (additional val added) so that even if a person who gets access to db n hacks one password, wont be able to hack others with same tech vuz of diff salt
            //  console.log(hashed_password);

            let sql = "INSERT INTO user VALUES(null, '" + user_name + "', '" + contact + "', '" + hashed_password + "', '" + email + "', '" + user_type + "', '" + reg_date + "', '" + updation_date + "')";
            con.query(sql, function (err, rows) {
                if (err)
                    console.log(err);
                else {
                    // console.log(rows);
                    res.render(__dirname + "/login signup/register.ejs", { msg: "User Registered!!" });
                }
            });
        }

    });

    // res.send("submitted");
});

//CITIES
<<<<<<< HEAD
app.get("/explore-cities", function(req,res){
=======
app.get("/explore-cities", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./cities'));

    res.sendFile(__dirname + "/cities/cities.html");
});

<<<<<<< HEAD
app.get("/varanasi", function(req,res){
=======
app.get("/varanasi", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./cities/places'));

    res.sendFile(__dirname + "/cities/places/varanasi.html");
});

<<<<<<< HEAD
app.get("/kolkata", function(req,res){
=======
app.get("/kolkata", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./cities/places'));

    res.sendFile(__dirname + "/cities/places/kolkata.html");
});


//PACKAGES
<<<<<<< HEAD
app.get("/varanasi-package", function(req,res){
=======
app.get("/varanasi-package", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./packages'));

    res.sendFile(__dirname + "/packages/varanasi-package.html");
});

<<<<<<< HEAD
app.get("/kolkata-package", function(req,res){
=======
app.get("/kolkata-package", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./packages'));

    res.sendFile(__dirname + "/packages/kolkata-package.html");
});

//TRIP-PLAN PAGE
app.get("/trip-plan", function (req, res) {
    app.use(express.static('./map'));

    res.render(__dirname + "/map/trip-plan.ejs");
});


// DASHBOARD PAGE
<<<<<<< HEAD
app.get("/dashboard", function(req,res){
    app.use(express.static('./admin dashboard'));   //change static folder since earlier wasnt rendering css
=======
app.get("/dashboard", function (req, res) {
    app.use(express.static('./admin dashboard'));   //change static folder since earlier wasnt rendering css   
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814

    let sql = "SELECT (SELECT COUNT(*) FROM user) as userCount ,(SELECT COUNT(*) FROM cities) as cityCount ,(SELECT COUNT(*) FROM places) as placesCount ,(SELECT COUNT(*) FROM packages) as packagesCount ,(SELECT COUNT(*) FROM reviews) as reviewsCount ,(SELECT COUNT(*) FROM bookings) as bookingsCount ,(SELECT COUNT(*) FROM enquiries) as enquiriesCount ";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            res.render(__dirname + "/admin dashboard/admin.ejs", { user: rows[0] });
        }
    });

});

// PROFILE PAGE
<<<<<<< HEAD
app.get("/profile", function(req,res){
    app.use(express.static('./admin dashboard'));
=======
app.get("/profile", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user) {
        res.render(__dirname + "/admin dashboard/profile.ejs", { user: req.user });
    }
    else {
        res.redirect("/login");
    }

});

app.post("/profile", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    let { contact, email } = req.body;
    let updation_date = date.currentDate();
    // console.log(req.body);
    // console.log(user_name + contact + password + email + user_type + updation_date);

    if (req.user) {

        let sql = "UPDATE user SET contact = '" + contact + "' , email = '" + email + "' , updation_date = '" + updation_date + "' WHERE user_name = '" + req.user.user_name + "'";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows);
                res.redirect("/profile");
            }
        });
    }
    else {
        res.redirect("/login");
    }


});

app.get("/user-profile", authController.isLoggedIn, function (req, res) {    //the page to be hidden n visible only if it matches current token, for such authentication we create a middleware   
    app.use(express.static('./login signup'));
    // console.log(req.message);                                          //we include the authController middleware's isLoggedIn func first in which the defined variables can be accessed here

    if (req.user) {
        res.render(__dirname + "/login signup/user-profile.ejs", { user: req.user });
    }
    else {
        res.redirect("/login");
    }
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814

});


// USERS PAGE
<<<<<<< HEAD
app.get("/users", function(req,res){
=======
app.get("/users", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./admin dashboard'));

    let sql = "SELECT * FROM user";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
<<<<<<< HEAD
            res.render(__dirname + "/admin dashboard/users.ejs", {users: rows});
=======
            res.render(__dirname + "/admin dashboard/users.ejs", { users: rows });
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
        }
    });
});

<<<<<<< HEAD
app.post("/add-users", function(req,res) {
=======
app.post("/add-users", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814

    let user_name = req.body.user_name;
    let contact = req.body.contact;
    let password = req.body.password;
    let email = req.body.email;
    let user_type = req.body.user_type;
    let reg_date = date.currentDate();
    let updation_date = reg_date;
    // console.log(req.body.user_type);
    // console.log(req.body);
    // console.log(user_name + contact + password + email + user_type + reg_date + updation_date);
    let sql = "INSERT INTO user VALUES(null, '" + user_name + "', '" + contact + "', '" + password + "', '" + email + "', '" + user_type + "', '" + reg_date + "', '" + updation_date + "')";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            console.log(rows);
        }
    });

<<<<<<< HEAD
    let msg = "Congratulations!!  User " + user_name +" has been successfully added."
    res.render(__dirname + "/pop-up.ejs", {title : "User Added", msg : msg});
});

app.post("/update-users", function(req,res) {
=======
    let msg = "Congratulations!!  User " + user_name + " has been successfully added."
    res.render(__dirname + "/pop-up.ejs", { title: "User Added", msg: msg });
});

app.post("/update-users", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814

    let user_name = req.body.user_name;
    let contact = req.body.contact;
    let password = req.body.password;
    let email = req.body.email;
    let user_type = req.body.user_type;
    let updation_date = date.currentDate();
    // console.log(req.body);
    // console.log(user_name + contact + password + email + user_type + updation_date);

    let sql = "UPDATE user SET contact = '" + contact + "' , password = '" + password + "' , email = '" + email + "' , user_type = '" + user_type + "' , updation_date = '" + updation_date + "' WHERE user_name = '" + user_name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            console.log(rows);
        }
    });
<<<<<<< HEAD

    let msg = "Congratulations!!  User "+ user_name + " has been updated successfully with values <br> "
    let m1 =  "<br>User Name : "+ user_name;
    let m2 =  "<br>Email : "+ email;
    let m3 =  "<br>Password : "+ password;
    let m4 =  "<br>Contact : "+ contact;
    let m5 =  "<br>User Type : "+ user_type;
    msg =  msg + m1 + m2 + m3 + m4 + m5;
=======
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814

    let msg = "Congratulations!!  User " + user_name + " has been updated successfully with values <br> "
    let m1 = "<br>User Name : " + user_name;
    let m2 = "<br>Email : " + email;
    let m3 = "<br>Password : " + password;
    let m4 = "<br>Contact : " + contact;
    let m5 = "<br>User Type : " + user_type;
    msg = msg + m1 + m2 + m3 + m4 + m5;

    res.render(__dirname + "/pop-up.ejs", { title: "User Updated", msg: msg });
});

<<<<<<< HEAD
app.post("/delete-user", function(req,res) {
=======
app.post("/delete-user", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814

    let user_name = req.body.user_name;

    console.log(req.body);
    let sql = "DELETE FROM user WHERE user_name = '" + user_name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            console.log(rows);
        }
    });
    let msg = "User " + user_name + " has been successfully removed from the database. "

    res.render(__dirname + "/pop-up.ejs", { title: "User Deleted", msg: msg });

<<<<<<< HEAD
    res.render(__dirname + "/pop-up.ejs", {title : "User Deleted", msg : msg });

=======
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
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
<<<<<<< HEAD
app.get("/category", function(req,res){
=======
app.get("/category", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./admin dashboard'));

    res.render(__dirname + "/admin dashboard/category.ejs");
});

// CITIES PAGE
<<<<<<< HEAD
app.get("/city", function(req,res){
    app.use(express.static('./admin dashboard'));
    let sql = "SELECT * FROM cities";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
            res.render(__dirname + "/admin dashboard/cities.ejs", {cities: rows});
        }
    });
});

app.post("/add-cities", function(req,res) {

    let name = req.body.name;
    let location = req.body.location;
    let description = req.body.description;

    console.log(req.body);
    console.log(name + location + description);
    let sql = "INSERT INTO cities VALUES(null, '" +name + "', '" + location + "', '" + description + "')";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
        }
    });

    let msg = "Congratulations!!  City " + name +" has been successfully added."
    res.render(__dirname + "/pop-up.ejs", {title : "City Added", msg : msg});
});

app.post("/update-cities", function(req,res) {

    let name = req.body.name;
    let location = req.body.location;
    let description = req.body.description;
    console.log(name + location + description);
    let sql = "UPDATE city SET location = '" + location + "' , description = '" + description + "' WHERE name = '" + name +"'";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
        }
    });

    let msg = "Congratulations!!  City "+ name + " has been updated successfully with values <br> "
    let m1 =  "<br>Name : "+ name;
    let m2 =  "<br>location : "+ location;
    let m3 =  "<br>description : "+ description;
    msg =  msg + m1 + m2 + m3;

    res.render(__dirname + "/pop-up.ejs", {title : "City Updated", msg : msg });
});

app.post("/delete-city", function(req,res) {

    let name = req.body.name;

    console.log(req.body);
    let sql = "DELETE FROM cities WHERE name = '" + name + "'";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
        }
    });
    let msg = "Name "+ name + " has been successfully removed from the database. "

    res.render(__dirname + "/pop-up.ejs", {title : "City Deleted", msg : msg });
=======
app.get("/city", function (req, res) {
    app.use(express.static('./admin dashboard'));
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814

});


// PLACES PAGE
<<<<<<< HEAD
app.get("/places", function(req,res){
    app.use(express.static('./admin dashboard'));

    let sql = "SELECT * FROM places";
        con.query(sql, function(err,rows){
            if(err)
            console.log(err);
            else{
                // console.log(rows);
                res.render(__dirname + "/admin dashboard/places.ejs", {places: rows});
            }
        });
    });

    app.post("/add-places", function(req,res) {
    let place_name = req.body.place_name;
    let city_id = req.body.city_id;
    let address = req.body.address;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let description = req.body.description;
    console.log(req.body);

    let sql = "INSERT INTO places VALUES(null, '" + place_name + "', '" + city_id + "', '" + address + "', '" + latitude + "', '" + longitude + "', '" + description + "')";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
        }
    });

    let msg = "Congratulations!! Place " + place_name +" has been successfully added."
    res.render(__dirname + "/pop-up.ejs", {title : "Place Added", msg : msg});
});

app.post("/update-places", function(req,res) {

  let place_name = req.body.place_name;
  let city_id = req.body.city_id;
  let address = req.body.address;
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let description = req.body.description;


    let sql = "UPDATE places SET place = '" + place_name + "', city_id '" + city_id + "', address '" + address + "', latitude '" + latitude + "', longitude'" + longitude + "', description'" + description + "')";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
        }
    });

    let msg = "Congratulations!!  place "+ place_name + " has been updated successfully with values <br> "
    let m1 =  "<br>Place Name : "+ place_name;
    let m2 =  "<br>City_id : "+ city_id;
    let m3 =  "<br>Address : "+ address;
    let m4 =  "<br>latitude : "+ latitude;
    let m5 =  "<br>longitude : "+ longitude;
    let m6 =  "<br>description : "+ description;
    msg =  msg + m1 + m2 + m3 + m4 + m5 +m6;

    res.render(__dirname + "/pop-up.ejs", {title : "place Updated", msg : msg });
});

app.post("/delete-place", function(req,res) {

    let place_name = req.body.place_name;

    console.log(req.body);
    let sql = "DELETE FROM places WHERE place_name = '" + place_name + "'";
    con.query(sql, function(err,rows){
        if(err)
        console.log(err);
        else{
            console.log(rows);
        }
    });
    let msg = "Place "+ place_name + " has been successfully removed from the database. "

    res.render(__dirname + "/pop-up.ejs", {title : "Place Deleted", msg : msg });
=======
app.get("/places", function (req, res) {
    app.use(express.static('./admin dashboard'));
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814

});



// PACKAGES PAGE
<<<<<<< HEAD
app.get("/package", function(req,res){
=======
app.get("/package", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./admin dashboard'));

    res.render(__dirname + "/admin dashboard/packages.ejs");
});

// REVIEWS PAGE
<<<<<<< HEAD
app.get("/reviews", function(req,res){
=======
app.get("/reviews", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./admin dashboard'));

    res.render(__dirname + "/admin dashboard/reviews.ejs");
});

// BOOKINGS PAGE
<<<<<<< HEAD
app.get("/bookings", function(req,res){
    app.use(express.static('./admin dashboard'));
=======
app.get("/bookings", function (req, res) {
    app.use(express.static('./admin dashboard'));

    let sql = "SELECT b.*, p.name, u.* FROM bookings AS b, packages AS p, user AS u WHERE b.package_id = p.package_id AND b.user_id = u.user_id;";
    sql += "SELECT name FROM packages;";
    sql += "SELECT user_name FROM user;";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows[0]);
            // console.log(rows[1]);
            // console.log(rows[2]);
            res.render(__dirname + "/admin dashboard/bookings.ejs", { bookings: rows[0], packages: rows[1], users: rows[2] });
        }
    });
});

app.post("/add-bookings", function (req, res) {

    let { package_name, user_name, count, total_price, travel_date } = req.body;
    let booking_date = date.currentDate();
    let status = "pending";

    let sql = "SELECT p.package_id, u.user_id FROM packages AS p, user AS u WHERE p.name = '" + package_name + "' AND u.user_name = '" + user_name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            console.log(rows);
            let package_id = rows[0].package_id;
            let user_id = rows[0].user_id;
            let sql = "INSERT INTO bookings VALUES(null, '" + package_id + "', '" + user_id + "', '" + count + "', '" + total_price + "', '" + booking_date + "', '" + travel_date + "', '" + status + "')";
            con.query(sql, function (err, rows) {
                if (err)
                    console.log(err);
                else {
                    console.log(rows);
                }
            });

        }
    });
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814


    let msg = "Congratulations!!  Booking for " + user_name + " has been successfully completed."
    res.render(__dirname + "/pop-up.ejs", { title: "Package Booking Added", msg: msg });
});

app.post("/update-bookings", function (req, res) {

    let { package_name, user_name, count, total_price, travel_date } = req.body;
    let status = "pending";

    let sql = "SELECT p.package_id, u.user_id FROM packages AS p, user AS u WHERE p.name = '" + package_name + "' AND u.user_name = '" + user_name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            let package_id = rows[0].package_id;
            let user_id = rows[0].user_id;
            console.log(package_id + " " + user_id)
            let sql = "UPDATE bookings SET count = '" + count + "' , total_price = '" + total_price + "' , travel_date = '" + travel_date + "' , status = '" + status + "' WHERE user_id = '" + user_id + "' AND package_id = '" + package_id + "'";
            con.query(sql, function (err, rows) {
                if (err)
                    console.log(err);
                else {
                    console.log(rows);
                }
            });
        }
    });

    let msg = "Congratulations!! Package booking for User " + user_name + " has been updated successfully with values <br> "
    let m1 = "<br>User Name : " + user_name;
    let m2 = "<br>Package Name : " + package_name;
    let m3 = "<br>People Count : " + count;
    let m4 = "<br>Total Amount : " + total_price;
    let m5 = "<br>Travel Date : " + travel_date;
    msg = msg + m1 + m2 + m3 + m4 + m5;

    res.render(__dirname + "/pop-up.ejs", { title: "Package Booking Updated", msg: msg });
});

app.post("/delete-bookings", function (req, res) {

    let { package_booking_id, user_booking_id } = req.body;

    if (package_booking_id == user_booking_id) {
        let sql = "DELETE FROM bookings WHERE booking_id = '" + package_booking_id + "'";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows);
                let msg = "Booking with id " + package_booking_id + " has been successfully removed from the database. "
                res.render(__dirname + "/pop-up.ejs", { title: "Package Booking Deleted", msg: msg });
            }
        });
    }
    else {
        let msg = "Package and User information does not match, Select again!!! "
        res.render(__dirname + "/pop-up.ejs", { title: "Error", msg: msg });
    }

});


// ENQUIRIES PAGE
<<<<<<< HEAD
app.get("/enquiries", function(req,res){
    app.use(express.static('./admin dashboard'));
=======
app.get("/enquiries", function (req, res) {
    app.use(express.static('./admin dashboard'));

    let sql = "SELECT * FROM enquiries";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            res.render(__dirname + "/admin dashboard/enquiries.ejs", { enquiries: rows });
        }
    });

});

app.post("/add-enquiry", function (req, res) {

    let { name, contact, email, subject, message } = req.body;
    let enquiry_date = date.currentDate();
    let status = "pending";
    let sql = "INSERT INTO enquiries VALUES(null, '" + name + "', '" + contact + "', '" + email + "', '" + subject + "', '" + message + "', '" + enquiry_date + "', '" + status + "')";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
        }
    });
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814

    let msg = "Dear " + name + " your enquiry has been submitted successfully. <br> We will contact you soon. <br> Thank you!! <br>"
    let m1 = "<br>User Name : " + name;
    let m2 = "<br>Contact : " + contact;
    let m3 = "<br>Email : " + email;
    let m4 = "<br>Subject : " + subject;
    let m5 = "<br>Message : " + message;
    msg = msg + m1 + m2 + m3 + m4 + m5;
    res.render(__dirname + "/pop-up.ejs", { title: "Enquiry Submitted", msg: msg });
});

// ANALYTICS PAGE
<<<<<<< HEAD
app.get("/analytics", function(req,res){
=======
app.get("/analytics", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./admin dashboard'));

    res.render(__dirname + "/admin dashboard/analytics.ejs");
});

// CHARTS PAGE
<<<<<<< HEAD
app.get("/charts", function(req,res){
=======
app.get("/charts", function (req, res) {
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
    app.use(express.static('./admin dashboard'));

    res.render(__dirname + "/admin dashboard/charts.ejs");
});


// con.end();

app.listen(port, function (err) {

    if (err)
        console.log("Error in connection " + err);
    else
<<<<<<< HEAD
        console.log("Listening on localhost:"+port);
});
=======
        console.log("Listening on localhost:" + port);
});
>>>>>>> 0b510870e7b9b5284a594cd047815a55da2c7814
