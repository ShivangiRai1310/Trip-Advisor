const mysql = require('mysql');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config({ path: '../.env'}); 

// MYSQL CONNECTION
// const con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '12345',
//     database: 'dbms'
// });

//Remote database connection
const con = mysql.createConnection({
    host: 'freedb.tech',
    user: 'freedbtech_rootuser',
    password: '12345',
    database: 'freedbtech_dbms'
});

con.connect(function (err) {
    if (err)
        console.log("Error in connection " + err);
    else
        console.log("Connected to dbms again");
});

exports.isLoggedIn =  async function(req, res, next) {
    // req.message = "inside middleware";                                     //these declared can be accessed wherever this middleware func is being called, n after next() the later part of the get route in other file is executed
    
    // console.log(req.cookies);
    if(req.cookies.jwt) {
        try{
            //step1) verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
            // console.log(decoded);    //can get the user_id from this of the user loggedin

            //step2) check if user still exists
            let sql = "SELECT * FROM user WHERE user_id = '" + decoded.user_id +"'";
            con.query(sql, function(err, rows) {
                // console.log(rows);

                if(!rows){
                    return next();
                }

                req.user = rows[0];
                return next();
            });

        } catch(error){
            console.log(error);
            return next();
        }
    }else{
        next();
    }    
    
}