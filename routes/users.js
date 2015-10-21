

/* GET users listing. */
exports.list = function(req, res){
  try {
    var sess = req.session;

    var fname, lname;

    console.log(req.query.fname);
    console.log(req.query.lname);


    if (typeof req.query.fname == 'undefined')
      fname = '\'\%\'';
    else
      fname = '\'\%' + req.query.fname + '\%\'';

    if (typeof req.query.lname == 'undefined')
      lname = '\'\%\'';
    else
      lname = '\'\%' + req.query.lname + '\%\'';

    console.log('fname is ' + fname);
    console.log('lname is ' + lname);
    var mysql = require('mysql');
    var connection = mysql.createConnection({
      host: 'project4.crbxasmdgbrq.us-east-1.rds.amazonaws.com',
      port: 3306,
      user: 'root',
      password: 'Pop123465.',
      database: 'Project4'
    });


    connection.connect(function (err) {
      if (!err) {
        console.log("Database is connected ... \n\n");
      } else {
        console.log("Error connecting database ... \n\n");
      }
    });


    if (sess.username && sess.role == 'admin') {
      connection.query('SELECT uname, fname, lname from user_details where fname like ' + fname + ' and lname like ' + lname, function (err, rows) {
            if(!err)
            res.send(JSON.stringify({user_list: rows}));
            else
            {

              }
            connection.end();
          }

      );
    }
    else
      res.send(JSON.stringify({message: 'You are not authorized to perform this operation'}));
  }
  catch(ex){
    res.send(JSON.stringify({message: 'Error occured'}));
  }

};
