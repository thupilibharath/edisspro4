/**
 * Created by Bharath on 9/10/15.
 */

exports.register = function(req,res){

    console.log('*****REGISTER--------');
    var body = req.body;
    var data = body.number;
    //console.log('Received Data is'+ data);
    data = '';
    var squel = require("squel");
    var mysql      = require('mysql');

    var success = false;
    var success1 = false;

    var email = req.body.email;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var uname = req.body.username;
    var pwd = req.body.password;

    console.log(email);
    console.log(fname);
    console.log(lname);
    console.log(address);
    console.log(city);
    console.log(state);
    console.log(zip);
    console.log(uname);
    console.log(pwd);


    var error=false;

    var regex = require("regex");

    var emailvalidator = new regex(/\S+@\S+\.\S+/);
    var zipvalidator = new regex(/(^\d{5}$)|(^\d{5}-\d{4}$)/);





    //VALIDATION
    try{

    if(typeof email=='undefined'||email==''||emailvalidator.test(email)==true) {
        error=true;
        console.log('email error');
        console.log(emailvalidator.test(email));
    }

    if(typeof fname=='undefined'||fname==''||fname.length<2) {
        error=true;
        console.log('fname error');

    }

    if(typeof lname=='undefined'||lname==''||lname.length<2) {
        error=true;
        console.log('lname error');

    }

    if(typeof address=='undefined'||address==''||address.length<4) {
        error=true;
        console.log('address error');

    }

    if(typeof city=='undefined'||city==''||city.length<2) {
        error=true;
        console.log('city error');

    }

    if(typeof zip=='undefined'||zip==''||zipvalidator.test(zip)==true) {
        error=true;
        console.log('zip error');

    }

    if(typeof uname=='undefined'||uname=='') {
        error=true;
        console.log('uname error');

    }
    if(typeof pwd=='undefined'||pwd=='') {
        error=true;
        console.log('pwd error');

    }

    if(error==true){
        res.send(JSON.stringify({message:'there was a problem with your registration'}));
    }


    data = data+' '+email+' '+fname+' '+lname+' '+address+' '+city+' '+state+' '+zip+' '+uname+' '+pwd;
    console.log(data);


    //Check if user already exists
    if(error==false)
    {

        var connection = mysql.createConnection({
            host: 'project4.crbxasmdgbrq.us-east-1.rds.amazonaws.com',
            port: 3306,
            user: 'root',
            password: 'Pop123465.',
            database: 'Project4'
        });



        connection.connect(function (err) {
            if (!err) {
                console.log("Database1 is connected ... \n\n");
            } else {
                console.log("Error connecting database 1 ... \n\n");
            }
        });

        var newuname = '\''+uname+'\'';
        var newfname = '\''+fname+'\'';
        var newlname = '\''+lname+'\'';
        var newpwd = '\''+pwd+'\'';

        var query = 'select * from user_details where (uname = '+newuname+') or (fname = '+newfname+' and lname ='+newlname+') or (uname ='+newuname+' and pwd ='+newpwd+')';
        console.log(query);
        connection.query(query, function (err, rows) {
            var exists = false;
            if(err){

            }
            else  {
                console.log('No error');
            }
            if (!err && rows.length > 0) {
                exists = true;
                console.log('User Exists');
                res.send(JSON.stringify({message:'there was a problem with your registration'}));
            }

            if (!err && exists == false && rows.length == 0) {
                //Create SQL query;
                var ins = squel.insert();
                ins.into('user_details').set('email', email).set('fname', fname).set('lname', lname).set('address', address)
                    .set('city', city).set('state', state).set('zip', zip).set('uname', uname).set('pwd', pwd).set('role', 'normal');
                console.log(ins.toString());

                //Connect to Database

                var connection1 = mysql.createConnection({
                    host: 'project4.crbxasmdgbrq.us-east-1.rds.amazonaws.com',
                    port: 3306,
                    user: 'root',
                    password: 'Pop123465.',
                    database: 'Project4'
                });

                connection1.connect(function (err) {
                    if (!err) {
                        console.log("Database1 is connected again... \n\n");
                        connection1.query(ins.toString(), function (err, rows) {
                            if (!err) {
                                console.log('Insert Success');
                                success=true;
                                res.send(JSON.stringify({message:'Your account has been registered '}));

                            }

                            else {
                                console.log('Error while performing Insert' + err);
                                success=false;
                                res.send(JSON.stringify({message:'there was a problem with your registration'}));
                            }



                            console.log('success here is '+success);



                        });

                        //res.render('error', {error:'Registration was  successful  !!'});

                        connection1.end();
                    } else {
                        console.log("Error connecting database ... \n\n");
                    }
                });




            }
            else if (exists == true) {
                console.log('User Already Exists');
                success=false;
                //res.send(JSON.stringify({message:'there was a problem with your registration'}));
            }
            else
                success=false;

        });

        console.log('success is '+success);

        connection.end();

    }

    }

    catch(ex){

        res.send(JSON.stringify({message:'there was a problem with your registration'}));
        //callback(ex);

    }
        //res.render('responsesuccess');
};