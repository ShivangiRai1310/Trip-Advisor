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

// function DMY() {
//         var year, month, day;
//         var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//         year = String(this.getFullYear());
//         month = String(this.getMonth());
//         // if (month.length == 1) {
//         //     month = "0" + month;
//         // }
//         day = String(this.getDate());
//         if (day.length == 1) {
//             day = "0" + day;
//         }
//         return day + " " + monthShortNames[month] + " " + year;
// };

// INDEX PAGE
app.get("/", authController.isLoggedIn, function (req, res) {
    res.render("index.ejs", { user: req.user });
});

// LOGIN REGISTER
app.get("/login", function (req, res) {
    app.use(express.static('./login signup'));

    res.render(__dirname + "/login signup/login.ejs", { msg: "" });
});

app.post("/login", async function (req, res) {
    app.use(express.static('./login signup'));

    try {
        let { user_name, password } = req.body;
        // console.log(req.body);
        if (!user_name || !password) {
            return res.status(400).render(__dirname + "/login signup/login.ejs", { msg: "Please provide username and password" });
        }

        let sql = "SELECT * FROM user WHERE user_name = '" + user_name + "'";
        con.query(sql, async function (err, rows) {
            if (err)
                console.log(err);

            // console.log(rows);
            if (!rows || !(await bcrypt.compare(password, rows[0].password))) {
                res.status(401).render(__dirname + "/login signup/login.ejs", { msg: "Username or password is incorrect" });
            }
            else {
                const user_id = rows[0].user_id;

                const token = jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET, {    //creates jwt token
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                // console.log("The token is " + token);

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

//forgot passwords

app.get("/forgot-password", function(req, res) {
    app.use(express.static("./login signup"));
  
    res.render(__dirname + "/login signup/forgot-password.ejs", { msg: "" });
  });
  
  app.post("/forgot-password", function(req, res) {
    app.use(express.static("./login signup"));
  
    let { user_name, contact, password, confirm_password, email } = req.body; //SHORTCUT IF NAMES R SAME
    let updation_date = date.currentDate();
    // console.log(user_type);
    // console.log(req.body);
    // console.log(user_name +" "+ contact +" " + password +" " + confirm_password +" " + email +" " + user_type +" " + reg_date +" " + updation_date);
  
    let sql =
      "SELECT user_name FROM user WHERE user_name = '" +
      user_name +
      "' AND email = '" +
      email +
      "' AND contact = '" +
      contact +
      "'";
    con.query(sql, async function(err, rows) {
      if (err) console.log(err);
  
      // console.log(rows);
      if (rows.length == 0) {
        res.render(__dirname + "/login signup/forgot-password.ejs", {
          msg: "User with the entered credentials does not exist!! "
        });
      } else if (password != confirm_password) {
        res.render(__dirname + "/login signup/forgot-password.ejs", {
          msg: "Passwords do not match, Enter again!! "
        });
      } else {
        let hashed_password = await bcrypt.hash(password, 8); //8 pased as no of rounds for encrypting, by default it takes salt (additional val added) so that even if a person who gets access to db n hacks one password, wont be able to hack others with same tech vuz of diff salt
        //  console.log(hashed_password);
  
        let sql =
          "UPDATE user SET password = '" +
          hashed_password +
          "' , updation_date = '" +
          updation_date +
          "' WHERE user_name = '" +
          user_name +
          "'";
        con.query(sql, function(err, rows) {
          if (err) console.log(err);
          else {
            // console.log(rows);
            res.render(__dirname + "/login signup/forgot-password.ejs", {
              msg: "Password Updated!!"
            });
          }
        });
      }
    });
  
    // res.send("submitted");
  });

//ABOUT US
app.get("/about-us", function (req, res) {
    app.use(express.static('./about us'));

    res.sendFile(__dirname + "/about us/about.html");
});

//GENERAL USER PROFILE
app.get("/user-profile", authController.isLoggedIn, function (req, res) {    //the page to be hidden n visible only if it matches current token, for such authentication we create a middleware
    app.use(express.static('./login signup'));
    // console.log(req.message);                                          //we include the authController middleware's isLoggedIn func first in which the defined variables can be accessed here

    if (req.user) {
        // console.log(req.user.user_id);
        let sql = "SELECT r.*, p.place_name, u.user_name FROM reviews AS r, places AS p, user AS u WHERE r.places_id = p.place_id AND r.users_id = u.user_id AND r.users_id = '" + req.user.user_id + "';";
        sql += "SELECT p.place_name,p.address,c.name FROM places AS p,bookmarks AS b,cities AS c WHERE b.userid = '" + req.user.user_id + "' AND p.place_id = b.place_id AND p.city_id = c.city_id;";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows[0]);
                // console.log(rows[1]);
                res.render(__dirname + "/login signup/user-profile.ejs", { user: req.user, reviews: rows[0], places: rows[1] });
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/user-profile-update", async function (req, res) {
    app.use(express.static('./login signup'));

    let { user_name, contact, email, password } = req.body;
    let updation_date = date.currentDate();
    let hashed_password = await bcrypt.hash(password, 8);
    // console.log(req.body);

    let sql = "UPDATE user SET contact = '" + contact + "' , email = '" + email + "' , password = '" + hashed_password + "' , updation_date = '" + updation_date + "' WHERE user_name = '" + user_name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
        }
    });

    let msg = "Congratulations!!  User " + user_name + " has been successfully updated with values <br> "
    let m1 = "<br>User Name : " + user_name;
    let m2 = "<br>Email : " + email;
    let m3 = "<br>Contact : " + contact;
    let m4 = "<br>Password : " + password;

    msg = msg + m1 + m2 + m3 + m4;

    res.render(__dirname + "/pop-up.ejs", { title: "User Updated", msg: msg });

});

//CITIES
app.get("/explore-cities", function (req, res) {
    app.use(express.static('./cities'));

    res.sendFile(__dirname + "/cities/cities.html");
});

app.get("/varanasi", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./cities/places'));
    let city_name = req.url.slice(1);

    if (req.user) {
        let sql = "SELECT city_id FROM cities WHERE name = '" + city_name + "'";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                let city_id = rows[0].city_id;
                let sql = "SELECT r.*,u.user_name,p.place_name FROM reviews AS r,places AS p,cities AS c,user AS u WHERE p.city_id = '"+ city_id +"' AND r.places_id = p.place_id AND r.users_id = u.user_id";
                con.query(sql, function (err, rows) {
                    if (err)
                        console.log(err);
                    else {
                        // console.log(rows);
                        res.render(__dirname + "/cities/places/varanasi.ejs", { user: req.user, reviews: rows });
                    }
                });
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.get("/kolkata", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./cities/places'));
    let city_name = req.url.slice(1);

    if (req.user) {
        let sql = "SELECT city_id FROM cities WHERE name = '" + city_name + "'";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                let city_id = rows[0].city_id;
                let sql = "SELECT r.*,u.user_name,p.place_name FROM reviews AS r,places AS p,cities AS c,user AS u WHERE p.city_id = '"+ city_id +"' AND r.places_id = p.place_id AND r.users_id = u.user_id";
                con.query(sql, function (err, rows) {
                    if (err)
                        console.log(err);
                    else {
                        // console.log(rows);
                        res.render(__dirname + "/cities/places/kolkata.ejs", { user: req.user, reviews: rows });
                    }
                });
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/add-bookmark", function (req, res) {
    app.use(express.static('./cities/places'));

    let { user_id, place_name, cityname } = req.body;
    console.log(req.body);

    let sql = "SELECT place_id FROM places WHERE place_name = '" + place_name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            let place_id = rows[0].place_id;
            // console.log(place_id);
            let sql = "SELECT * FROM bookmarks WHERE place_id = '" + place_id + "' AND userid = '" + user_id + "'";
            con.query(sql, function (err, rows) {
                if (err)
                    console.log(err);
                else if (rows.length > 0) {
                    console.log("Already bookmarked");
                }
                else {
                    let sql = "INSERT INTO bookmarks VALUES(null, '" + user_id + "', '" + place_id + "')";
                    con.query(sql);
                }
            });
        }
    });
    res.redirect("/" + cityname);
});

//PACKAGES
app.get("/varanasi-package", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./packages'));

    if (req.user) {
        let sql = "SELECT * FROM packages WHERE cityid = '1'";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows);
                res.render(__dirname + "/packages/varanasi-package.ejs", { user: req.user, package: rows[0] });
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.get("/kolkata-package", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./packages'));

    if (req.user) {
        let sql = "SELECT * FROM packages WHERE cityid = '2'";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows);
                res.render(__dirname + "/packages/kolkata-package.ejs", { user: req.user, package: rows[0] });
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/confirm-booking", function (req, res) {

    let { name, user_name, contact, email, count, total_price, travel_date } = req.body;
    let booking_date = date.currentDate();
    let status = "pending";
    // console.log(req.body);

    let sql = "SELECT p.package_id, u.user_id FROM packages AS p, user AS u WHERE p.name = '" + name + "' AND u.user_name = '" + user_name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            let package_id = rows[0].package_id;
            let user_id = rows[0].user_id;
            let sql = "INSERT INTO bookings VALUES(null, '" + package_id + "', '" + user_id + "', '" + count + "', '" + total_price + "', '" + booking_date + "', '" + travel_date + "', '" + status + "')";
            con.query(sql, function (err, rows) {
                if (err)
                    console.log(err);
                else {
                    // console.log(rows);
                    let msg = "Congratulations!!  Booking for " + user_name + " has been successfully completed. <br>"
                    let m1 = "<br>User Name : " + user_name + "<br>Contact : " + contact + "<br>Email : " + email;
                    let m2 = "<br><br>Package Name : " + name + "<br>Count : " + count + "<br>Total Price : " + total_price + "<br>Travel Date : " + travel_date + "<br>Booking Date : " + booking_date;
                    let m3 = "<br> <br> <br>Payment can be done on the first day of tour.<br> <i>Thank you for booking with us.</i>"
                    msg = msg + m1 + m2 + m3;
                    res.render(__dirname + "/pop-up.ejs", { title: "Package Booking Completed", msg: msg });
                }
            });
        }
    });
});

//TRIP-PLAN PAGE
app.get("/trip-plan", function (req, res) {
    app.use(express.static('./map'));

    let sql = "SELECT * FROM cities";
    // sql += "SELECT * FROM places ";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            // console.log(rows[1]);
            res.render(__dirname + "/map/trip.ejs", { cities: rows, places: "" });
        }
    });

});

app.post("/get-location", function (req, res) {
    app.use(express.static('./map'));

    let city_id = req.body.city_id;
    let sql = "SELECT * FROM places WHERE city_id = '" + city_id + "';";
    sql += "SELECT * FROM cities;";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            res.render(__dirname + "/map/trip.ejs", { cities: rows[1], places: rows[0] });
        }
    });
});


// DASHBOARD PAGE
app.get("/dashboard", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));   //change static folder since earlier wasnt rendering css

    if (req.user && req.user.user_type == "admin") {
        let sql = "SELECT (SELECT COUNT(*) FROM user) as userCount ,(SELECT COUNT(*) FROM cities) as cityCount ,(SELECT COUNT(*) FROM places) as placesCount ,(SELECT COUNT(*) FROM packages) as packagesCount ,(SELECT COUNT(*) FROM reviews) as reviewsCount ,(SELECT COUNT(*) FROM bookings) as bookingsCount ,(SELECT COUNT(*) FROM enquiries) as enquiriesCount ";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows);
                res.render(__dirname + "/admin dashboard/admin.ejs", { user: req.user, total: rows[0] });
            }
        });
    }
    else {
        res.redirect("/login");
    }

});

// PROFILE PAGE
app.get("/profile", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user && req.user.user_type == "admin") {
        res.render(__dirname + "/admin dashboard/profile.ejs", { user: req.user });
    }
    else {
        res.redirect("/login");
    }

});

app.post("/profile", authController.isLoggedIn, async function (req, res) {
    app.use(express.static('./admin dashboard'));

    let { contact, email, password } = req.body;
    let hashed_password = await bcrypt.hash(password, 8);
    let updation_date = date.currentDate();
    // console.log(req.body);
    // console.log(user_name + contact + password + email + user_type + updation_date);

    if (req.user && req.user.user_type == "admin") {

        let sql = "UPDATE user SET contact = '" + contact + "' , email = '" + email + "' , password = '" + hashed_password + "' , updation_date = '" + updation_date + "' WHERE user_name = '" + req.user.user_name + "'";
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

// USERS PAGE
app.get("/users", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user && req.user.user_type == "admin") {
        let sql = "SELECT * FROM user";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows);
                res.render(__dirname + "/admin dashboard/users.ejs", { user: req.user, users: rows });
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/add-users", function (req, res) {

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

            let msg = "Congratulations!!  User " + user_name + " has been successfully added."
            res.render(__dirname + "/pop-up.ejs", { title: "User Added", msg: msg });
        }
    });
});

app.post("/update-users", function (req, res) {

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
            let msg = "Congratulations!!  User " + user_name + " has been updated successfully with values <br> "
            let m1 = "<br>User Name : " + user_name;
            let m2 = "<br>Email : " + email;
            let m3 = "<br>Password : " + password;
            let m4 = "<br>Contact : " + contact;
            let m5 = "<br>User Type : " + user_type;
            msg = msg + m1 + m2 + m3 + m4 + m5;

            res.render(__dirname + "/pop-up.ejs", { title: "User Updated", msg: msg });
        }
    });
});

app.post("/delete-user", function (req, res) {

    let user_name = req.body.user_name;

    console.log(req.body);
    let sql = "DELETE FROM user WHERE user_name = '" + user_name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            console.log(rows);
            let msg = "User " + user_name + " has been successfully removed from the database. "

            res.render(__dirname + "/pop-up.ejs", { title: "User Deleted", msg: msg });
        }
    });


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
// app.get("/category", function (req, res) {
//     app.use(express.static('./admin dashboard'));

//     res.render(__dirname + "/admin dashboard/category.ejs");
// });

// CITIES PAGE
app.get("/city", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user && req.user.user_type == "admin") {
        let sql = "SELECT * FROM cities;";
        sql += "SELECT city_id,COUNT(*) AS place_count FROM places GROUP BY city_id;  ";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows[0]);
                // console.log(rows[1]);
                res.render(__dirname + "/admin dashboard/cities.ejs", { user: req.user, cities: rows[0], places: rows[1] });
            }
        });
    }
    else {
        res.redirect("/login");
    }

});

app.post("/add-cities", function (req, res) {

    let name = req.body.name;
    let location = req.body.location;
    let description = req.body.description;

    console.log(req.body);
    let sql = "INSERT INTO cities VALUES(null, '" + name + "', '" + location + "', '" + description + "')";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            let msg = "Congratulations!!  City " + name + " has been successfully added."
            res.render(__dirname + "/pop-up.ejs", { title: "City Added", msg: msg });
        }
    });
});

app.post("/update-cities", function (req, res) {

    let name = req.body.name;
    let location = req.body.location;
    let description = req.body.description;
    let sql = "UPDATE cities SET location = '" + location + "' , description = '" + description + "' WHERE name = '" + name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            let msg = "Congratulations!!  City " + name + " has been updated successfully with values <br> "
            let m1 = "<br>Name : " + name;
            let m2 = "<br>location : " + location;
            let m3 = "<br>description : " + description;
            msg = msg + m1 + m2 + m3;
            res.render(__dirname + "/pop-up.ejs", { title: "City Updated", msg: msg });
        }
    });
});

app.post("/delete-city", function (req, res) {

    let name = req.body.name;

    console.log(req.body);
    let sql = "DELETE FROM cities WHERE name = '" + name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            let msg = "City " + name + " has been successfully removed from the database. "
            res.render(__dirname + "/pop-up.ejs", { title: "City Deleted", msg: msg });
        }
    });
});


// PLACES PAGE
app.get("/places", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user && req.user.user_type == "admin") {
        let sql = "SELECT p.*,c.name FROM places AS p, cities AS c WHERE p.city_id=c.city_id;";
        sql += "SELECT city_id,name FROM cities;"
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows);
                res.render(__dirname + "/admin dashboard/places.ejs", { user: req.user, places: rows[0], cities: rows[1] });
            }
        });
    }
    else {
        res.redirect("/login");
    }

});

app.post("/add-places", function (req, res) {
    let place_name = req.body.place_name;
    let city_id = req.body.city_id;
    let address = req.body.address;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let description = req.body.description;
    console.log(req.body);

    let sql = "INSERT INTO places VALUES(null, '" + city_id + "', '" + place_name + "', '" + address + "', '" + latitude + "', '" + longitude + "', '" + description + "')";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            console.log(rows);
            let msg = "Congratulations!! Place " + place_name + " has been successfully added."
            res.render(__dirname + "/pop-up.ejs", { title: "Place Added", msg: msg });
        }
    });
});

app.post("/update-places", function (req, res) {

    let place_name = req.body.place_name;
    let address = req.body.address;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let description = req.body.description;


    let sql = "UPDATE places SET address = '" + address + "', latitude = '" + latitude + "', longitude = '" + longitude + "', description = '" + description + "' WHERE place_name = '" + place_name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            console.log(rows);
            let msg = "Congratulations!!  Place " + place_name + " has been updated successfully with values <br> "
            let m1 = "<br>Place Name : " + place_name;
            let m3 = "<br>Address : " + address;
            let m4 = "<br>Latitude : " + latitude;
            let m5 = "<br>Longitude : " + longitude;
            let m6 = "<br>Description : " + description;
            msg = msg + m1 + m3 + m4 + m5 + m6;

            res.render(__dirname + "/pop-up.ejs", { title: "Place Updated", msg: msg });
        }
    });
});

app.post("/delete-places", function (req, res) {

    let place_name = req.body.place_name;

    console.log(req.body);
    let sql = "DELETE FROM places WHERE place_name = '" + place_name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            console.log(rows);
            let msg = "Place " + place_name + " has been successfully removed from the database. "
            res.render(__dirname + "/pop-up.ejs", { title: "Place Deleted", msg: msg });
        }
    });
});

// PACKAGES PAGE
app.get("/package", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user && req.user.user_type == "admin") {
        let sql = "SELECT * FROM packages;";
        sql += "SELECT city_id,name FROM cities;"
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows);
                res.render(__dirname + "/admin dashboard/packages.ejs", { user: req.user, packages: rows[0], cities: rows[1] });
            }
        });
    }
    else {
        res.redirect("/login");
    }

});

app.post("/add-packages", function (req, res) {
    let name = req.body.name;
    let cityid = req.body.city_id;
    let location = req.body.location;
    let price = req.body.price;
    let duration = req.body.duration;
    let description = req.body.description;
    // console.log(req.body);

    let sql = "INSERT INTO packages VALUES(null, '" + cityid + "','" + name + "','" + location + "', '" + duration + "', '" + price + "', '" + description + "')";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            let msg = "Congratulations!!  Package " + name + " has been successfully added."
            res.render(__dirname + "/pop-up.ejs", { title: "Package Added", msg: msg });
        }
    });
});

app.post("/update-packages", function (req, res) {

    let name = req.body.name;
    let cityid = req.body.city_id;
    let location = req.body.location;
    let price = req.body.price;
    let duration = req.body.duration;
    let description = req.body.description;
    // console.log(req.body);

    let sql = "UPDATE packages SET cityid = '" + cityid + "', location = '" + location + "', price = '" + price + "', duration = '" + duration + "', description = '" + duration + "' WHERE name = '" + name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            let msg = "Congratulations!!  Package " + name + " has been successfully updated with values <br> "
            let m1 = "<br>Package Name : " + name;
            let m2 = "<br>Location : " + location;
            let m3 = "<br>Price : " + price;
            let m4 = "<br>Duration : " + duration;
            let m5 = "<br>Description : " + description;
            msg = msg + m1 + m2 + m3 + m4 + m5;

            res.render(__dirname + "/pop-up.ejs", { title: "Package Updated", msg: msg });
        }
    });

});

app.post("/delete-packages", function (req, res) {

    let name = req.body.name;

    console.log(req.body);
    let sql = "DELETE FROM packages WHERE name = '" + name + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            let msg = "Package " + name + " has been successfully removed from the database. "
            res.render(__dirname + "/pop-up.ejs", { title: "Package Deleted", msg: msg });
        }
    });

});


// REVIEWS PAGE
app.get("/reviews", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user && req.user.user_type == "admin") {
        let sql = "SELECT r.*, p.place_name, u.user_name FROM reviews AS r, places AS p, user AS u WHERE r.places_id = p.place_id AND r.users_id = u.user_id;";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows);
                res.render(__dirname + "/admin dashboard/reviews.ejs", { user: req.user, reviews: rows });
            }
        });
    }
    else {
        res.redirect("/login");
    }

});

// BOOKINGS PAGE
app.get("/bookings", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user && req.user.user_type == "admin") {
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
                res.render(__dirname + "/admin dashboard/bookings.ejs", { user: req.user, bookings: rows[0], packages: rows[1], users: rows[2] });
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/approve-booking", function (req, res) {
    app.use(express.static('./admin dashboard'));
    let { booking_id } = req.body;
    let sql = "UPDATE bookings SET status = 'approved' WHERE booking_id = '" + booking_id + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            res.redirect("/bookings");
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
                    // console.log(rows);
                    let msg = "Congratulations!! Package booking for User " + user_name + " has been updated successfully with values <br> "
                    let m1 = "<br>User Name : " + user_name;
                    let m2 = "<br>Package Name : " + package_name;
                    let m3 = "<br>People Count : " + count;
                    let m4 = "<br>Total Amount : " + total_price;
                    let m5 = "<br>Travel Date : " + travel_date;
                    msg = msg + m1 + m2 + m3 + m4 + m5;

                    res.render(__dirname + "/pop-up.ejs", { title: "Package Booking Updated", msg: msg });
                }
            });
        }
    });

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
app.get("/enquiries", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user && req.user.user_type == "admin") {
        let sql = "SELECT * FROM enquiries";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows);
                res.render(__dirname + "/admin dashboard/enquiries.ejs", { user: req.user, enquiries: rows });
            }
        });
    }
    else {
        res.redirect("/login");
    }

});

app.post("/review-enquiry", function (req, res) {
    app.use(express.static('./admin dashboard'));
    let { enquiry_id } = req.body;
    let sql = "UPDATE enquiries SET status = 'reviewed' WHERE enquiry_id = '" + enquiry_id + "'";
    con.query(sql, function (err, rows) {
        if (err)
            console.log(err);
        else {
            // console.log(rows);
            res.redirect("/enquiries");
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
app.get("/analytics", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user && req.user.user_type == "admin") {
        let sql="SELECT reg_date, COUNT(*) AS count FROM user GROUP BY reg_date;";
        sql+= "SELECT booking_date, COUNT(*) AS count FROM bookings GROUP BY booking_date;";
        sql+= "SELECT u.user_name AS name, COUNT(*) AS count FROM bookings AS b, user AS u WHERE u.user_id=b.user_id GROUP BY u.user_id;";
        sql+= "SELECT u.user_name AS name, COUNT(*) AS count FROM reviews AS r, user AS u WHERE u.user_id=r.users_id GROUP BY u.user_id;";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                //console.log(rows);
                // console.log(rows[1]);
                //console.log(rows[3]);
                 var reg_dates=[], reg_count=[], booking_dates=[], booking_count=[], user_name=[], user_booking_count=[], ruser_name=[], user_review_count=[];
                for(var i=0;i<rows[0].length; i++)
                {
                    reg_dates.push(date.DMY.call(rows[0][i].reg_date));
                    reg_count.push(rows[0][i].count);
                }
                for(var i=0;i<rows[1].length; i++)
                {
                    booking_dates.push(date.DMY.call(rows[1][i].booking_date));
                    booking_count.push(rows[1][i].count);
                }
                for(var i=0;i<rows[2].length; i++)
                {
                    user_name.push(rows[2][i].name);
                    user_booking_count.push(rows[2][i].count);
                }
                for(var i=0;i<rows[3].length; i++)
                {
                    ruser_name.push(rows[3][i].name);
                    user_review_count.push(rows[3][i].count);
                }

                res.render(__dirname + "/admin dashboard/analytics.ejs", { user: req.user, reg_dates, reg_count,  booking_dates,  booking_count, user_name, user_booking_count, ruser_name ,user_review_count });
            }
        }); 
    }
    else {
        res.redirect("/login");
    }
});

// CHARTS PAGE
app.get("/charts", authController.isLoggedIn, function (req, res) {
    app.use(express.static('./admin dashboard'));

    if (req.user && req.user.user_type == "admin") {

        let sql="SELECT c.name, COUNT(*) AS count FROM cities AS c, places AS p WHERE c.city_id=p.city_id GROUP BY c.city_id;";
        sql+= "SELECT p.name, COUNT(*) AS count FROM bookings AS b, packages AS p WHERE b.package_id=p.package_id GROUP BY p.package_id;";
        sql+= "SELECT p.place_name AS name, COUNT(*) AS count FROM bookmarks AS b, places AS p WHERE b.place_id=p.place_id GROUP BY p.place_id;";
        con.query(sql, function (err, rows) {
            if (err)
                console.log(err);
            else {
                // console.log(rows[0]);
                // console.log(rows[1]);
                // console.log(rows[2]);
                var city_name=[], city_count=[], package_name=[], package_count=[], place_name=[], place_count=[];
                for(var i=0;i<rows[0].length; i++)
                {
                    city_name.push(rows[0][i].name);
                    city_count.push(rows[0][i].count);
                }
                for(var i=0;i<rows[1].length; i++)
                {
                    package_name.push(rows[1][i].name);
                    package_count.push(rows[1][i].count);
                }
                for(var i=0;i<rows[2].length; i++)
                {
                    place_name.push(rows[2][i].name);
                    place_count.push(rows[2][i].count);
                }

                res.render(__dirname + "/admin dashboard/charts.ejs", { user: req.user, city_name, city_count, package_name, package_count, place_name, place_count});
            }
        });   
    }
    else {
        res.redirect("/login");
    }
});


// con.end();

app.listen(port, function (err) {

    if (err) {

    }
    else
        console.log("Listening on localhost:" + port);
});

//forgot passwords

app.get("/forgot-password", function(req, res) {
  app.use(express.static("./login signup"));

  res.render(__dirname + "/login signup/forgot-password.ejs", { msg: "" });
});

app.post("/forgot-password", function(req, res) {
  app.use(express.static("./login signup"));

  let { user_name, contact, password, confirm_password, email } = req.body; //SHORTCUT IF NAMES R SAME
  let updation_date = date.currentDate();
  // console.log(user_type);
  // console.log(req.body);
  // console.log(user_name +" "+ contact +" " + password +" " + confirm_password +" " + email +" " + user_type +" " + reg_date +" " + updation_date);

  let sql =
    "SELECT user_name FROM user WHERE user_name = '" +
    user_name +
    "' AND email = '" +
    email +
    "' AND contact = '" +
    contact +
    "'";
  con.query(sql, async function(err, rows) {
    if (err) console.log(err);

    // console.log(rows);
    if (rows.length == 0) {
      res.render(__dirname + "/login signup/forgot-password.ejs", {
        msg: "User with the entered credentials does not exist!! "
      });
    } else if (password != confirm_password) {
      res.render(__dirname + "/login signup/forgot-password.ejs", {
        msg: "Passwords do not match, Enter again!! "
      });
    } else {
      let hashed_password = await bcrypt.hash(password, 8); //8 pased as no of rounds for encrypting, by default it takes salt (additional val added) so that even if a person who gets access to db n hacks one password, wont be able to hack others with same tech vuz of diff salt
      //  console.log(hashed_password);

      let sql =
        "UPDATE user SET password = '" +
        hashed_password +
        "' , updation_date = '" +
        updation_date +
        "' WHERE user_name = '" +
        user_name +
        "'";
      con.query(sql, function(err, rows) {
        if (err) console.log(err);
        else {
          // console.log(rows);
          res.render(__dirname + "/login signup/forgot-password.ejs", {
            msg: "Password Updated!!"
          });
        }
      });
    }
  });

  // res.send("submitted");
});
