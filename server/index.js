const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const app = express();

app.use(cors());
app.use(express.json());



var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
    
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

var executeQuery = function (req, res) {
    mssql.connect(config, function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            res.send(err);
        }
        else {
            var request = new mssql.Request(); 
            request.query(req, function (err, response) { 
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.send(err);
                }
                else {
                    res.send(response);
                }
            });
        }
    });
}



function getUserRole(name) {
    let ce = "Chief Executive";
    let a = "Admin";
    let u = "User";
    let act = "Accountant";
    let sa = "Site Supervisor";

    if (name === ce) return 1;
    if (name === a) return 2;
    if (name === u) return 3;
    if (name === act) return 4;
    if (name === sa) return 5;
}





app.get(`/user-master`, verifyJWT, function (req, res) {
    var query = `SELECT id, user_name, email, user_role FROM react.dbo.users`;
    executeQuery(query, res);
});



app.post(`/user-master`, verifyJWT, (req, res) => {
    const userName = req.body.userName;
    const userId = req.body.userId;
    const password = req.body.password;
    const userRole = req.body.userRole;
    const first_name = "First";
    const last_name = "Last";

    var checkCEUserRole = `SELECT id, user_role FROM react.dbo.users WHERE user_role='${userRole}'`;

    mssql.connect(config).then(pool => {
        return pool.request().query(`${checkCEUserRole}`)
    }).then(sqlResults => {

       
        if (sqlResults.recordset[0].user_role == 'Chief Executive' || sqlResults.recordset == "") {
            res.send({ status: false, message: "Chief Executive role already exists." });
        } else if (sqlResults.recordset[0].user_role != 'Chief Executive') {
           
                    const addNewUserStmt = `INSERT INTO ${process.env.react}.dbo.users (user_name, first_name, last_name, email, password, user_role) VALUES ('${userName}', '${first_name}', '${last_name}', '${userId}', '${hash}', '${userRole}')`;
                    mssql.connect(config).then(pool => {
                        return pool.request().query(`${addNewUserStmt}`)
                    }).then(successResult => {
                        res.send({ status: true });
                    }).catch(err => {
                        console.log(err);
                    });
        };
            });
        

app.delete(`/user-master/:id`, verifyJWT, function (req, res) {
    var query = `DELETE FROM react.dbo.users WHERE id=${req.params.id}`;
    executeQuery(query, res);
});
});

