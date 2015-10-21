/**
 * Created by Bharath on 9/4/15.
 */

exports.updatedetails = function(req, res){

    //var data = body.number;
    //console.log('Received Data is'+ data);
    console.log('*******UPDATE USER DETAILS-------');
    var sess = req.session;
    data = '';
    var squel = require("squel");
    var mysql = require('mysql');

    var success = false;
    var success1 = false;

    //data = data+' '+email+' '+fname+' '+lname+' '+address+' '+city+' '+state+' '+zip+' '+uname+' '+pwd;
    //console.log(data);

    var connection1 = mysql.createConnection({
        host: 'project4.crbxasmdgbrq.us-east-1.rds.amazonaws.com',
        port: 3306,
        user: 'root',
        password: 'Pop123465.',
        database: 'Project4'
    });



    connection1.connect(function(err){

        if(err){
            //Update DB2 if DB1 fails


        }
        if(!err) {
            console.log("Database1 is connected ... \n\n");
            //Prepare update statement

            if(!sess.username){
                console.log('Unauthorized user');
                res.send(JSON.stringify({message:'There was a problem with this action'}));
            }

            else {
                var temp = '\''+sess.username+'\'';
                console.log('User is '+sess.username);
                connection1.query('select email, fname, lname, address, city, state, zip, uname, pwd from user_details where uname = '+temp, function(err, rows) {
                    if(!err){
                        var email = rows[0].email;
                        var fname = rows[0].fname;
                        var lname = rows[0].lname;
                        var address = rows[0].address;
                        var city = rows[0].city;
                        var state = rows[0].state;
                        var zip = rows[0].zip;
                        var uname = rows[0].uname;
                        var pwd = rows[0].pwd;

                        //Update content based on existing details
                        var connection = mysql.createConnection({
                            host: 'project4.crbxasmdgbrq.us-east-1.rds.amazonaws.com',
                            port: 3306,
                            user: 'root',
                            password: 'Pop123465.',
                            database: 'Project4'
                        });


                        connection.connect(function(err){
                            if(!err) {
                                console.log("Database1 is connected ... \n\n");
                                if(!sess.username){
                                    console.log('Unauthorized user');
                                    res.send(JSON.stringify({message:'There was a problem with this action'}))
                                }

                                else {

                                    if(typeof req.body.email!='undefined')
                                        email = req.body.email;
                                    if(typeof req.body.fname!='undefined')
                                        fname = req.body.fname;
                                    if(typeof req.body.lname!='undefined')
                                        lname = req.body.lname;
                                    if(typeof req.body.address!='undefined')
                                        address = req.body.address;
                                    if(typeof req.body.city!='undefined')
                                        city = req.body.city;
                                    if(typeof req.body.state!='undefined')
                                        state = req.body.state;
                                    if(typeof req.body.zip!='undefined')
                                        zip = req.body.zip;
                                    if(typeof req.body.username!='undefined')
                                        uname = req.body.username;
                                    if(typeof req.body.password!='undefined')
                                        pwd = req.body.password;


                                    var upd = squel.update();
                                    upd.table('user_details').set('email', email).set('fname', fname).set('lname', lname).set('address', address)
                                        .set('city', city).set('state', state).set('zip', zip).set('uname', uname).set('pwd', pwd).set('role', 'normal').where('uname =' + '\'' + sess.username + '\'');
                                    console.log(upd.toString());

                                    connection.query(upd.toString(), function(err, rows) {
                                        if(!err){
                                            console.log('Update Success');
                                            success=true;
                                            res.send(JSON.stringify({message:'Your information has been updated'}));
                                        }
                                        else
                                            res.send(JSON.stringify({message:'There was a problem with this action'}));


                                    });


                                }

                                connection.end();
                                sess.username = uname;

                            } else {
                                console.log("Error connecting to database ... \n\n");
                            }
                        });

                        //Prepare update statement



                    }
                    else{
                        console.log('Error while fetching existing records');
                    res.send(JSON.stringify({message:'There was a problem with this action'}));
                    }

                });


            }

            connection1.end();

        } else {
            console.log("Error connecting to database ... \n\n");
            res.send(JSON.stringify({message:'There was a problem with this action'}));

        }
    });




};


