/*
 lineReader will extract the records from amazon-meta.txt one at a time as
 file is too large to read all at once.  In order to add records to a database you need to add code below to insert records

 This code depnds on "line-reader"

 You need to install line-reader by using the following command:
 npm install line-reader

 */
var lineReader = require('line-reader');
var mysql      = require('mysql');
var squel = require('squel');
var newId,newstr,titile,subStr,newcat, query;

var connection = mysql.createConnection({
    host     : 'project4.crbxasmdgbrq.us-east-1.rds.amazonaws.com',
    user     : 'root',
    password : 'Pop123465.',
    database : 'Project4'
});

//Create Appropriate Databases
connection.query('use Project4', function (err, rows) {
    if(err){
        console.log('DB not created');
    }

});

connection.query('create table if not exists user_details(email varchar(100),fname varchar(100),lname varchar(100),address varchar(500),city varchar(100),state varchar(10),zip varchar(100),uname varchar(100) primary key,pwd varchar(100),role varchar(100))', function (err, rows) {
    if(err){
        console.log('Table 1 not created');
    }

});

connection.query('create table if not exists product_details(description text,id varchar(100) primary key,ASIN varchar(100),title text,groups varchar(50),categories text)', function (err, rows) {
    if(err){
        console.log('Table 2 not created');
    }

});


connection.query('insert into user_details values ("hsmith@gmail.com", "Henry", "Smith", "sample", "Pitt", "AL", "15206", "hsmith", "smith", "normal")', function (err, rows) {
    if(err){
        console.log('DB not created');
    }

});

connection.query('insert into user_details values ("tbucktoo@gmail.com", "Tim", "Bucktoo", "sample", "Pitt", "PA", "15206", "tbucktoo", "bucktoo", "normal");', function (err, rows) {
    if(err){
        console.log('DB not created');
    }

});

connection.query('insert into user_details values ("jadmin@gmail.com", "Jenny", "Admin", "sample", "Pitt", "PA", "15206", "jadmin", "admin", "admin");', function (err, rows) {
    if(err){
        console.log('DB not created');
    }

});

console.log('****CREATED SCHEMA******* ');
//Read data and populate product_details one by one
var record = new Object();
record.categories = [];
//var jsonRecord;
var already = false;
var categories = false;
var stop = 0;
lineReader.eachLine('amazon-meta.txt', function(line, last) {
    if(line.indexOf("Id:")>=0){
         subStr = line.substring(line.indexOf("Id:")+3,line.indexOf("\r")).trim();
        record.Id = subStr;

        if(already){

            //create JSON object for complete record
            //jsonRecord = JSON.stringify(record);
            //console.log('****-----');
            //console.log(record.Id);
            //console.log(record.ASIN);
            //console.log(record.title);
            //console.log(record.group);
            //console.log(record.categories);
            //console.log('----******');

             newcat = record.categories.toString();
            if(typeof record.Id=='undefined')
                record.Id = '';
            else
            {
                newId = record.Id -1;
                //console.log('newID -------> '+newId);
                record.Id = newId;
            }
            if(typeof record.ASIN=='undefined')
                record.ASIN = '';
            if(typeof record.title=='undefined')
                record.title = '';
            if(typeof record.group=='undefined')
                record.group = '';
            if(typeof newcat=='undefined')
                newcat = '';

            newstr = newcat.replace(/'/g, '');
            titile = record.title.replace(/'/g, '');

            query = squel.insert().into("product_details")
                .set("description","")
                .set("id",newId)
                .set("ASIN",record.ASIN)
                .set("title",titile)
                .set("groups",record.group)
                .set("categories",newstr);
            //console.log('----------->>>>>>>>>>>>');
            //console.log(query.toString());

            connection.query(query.toString(), function (err, rows) {
                //reinitialize record and add Id value
                //record.Id = '';
                record.categories = [];
                record.Id = subStr;
                record.group = '';
                record.title='';
                record.ASIN='';
                if(err) {
                    console.log('error occured while inserting'+err);
                    //res.json('Error Occured');
                }

            });

            stop++;

            /****************************************
             *****************************************
             add code to insert record in your db here
             *****************************************
             ****************************************/





        } else {
            //For the first record read Id and record it
            subStr = line.substring(line.indexOf("Id:")+3,line.indexOf("\r")).trim();
            record.Id = subStr;

            //inidicate that the Id value has been captured so that the next Id value indicates end of current record
            already = true;
            //console.log(record.Id);
        }

    }

    if(line.indexOf("ASIN:")>=0){
        //record the ASIN
         subStr = line.substring(line.indexOf("ASIN:")+5,line.indexOf("\r")).trim();
        record.ASIN = subStr;
        //console.log(record.ASIN);
    }

    if(line.indexOf("title:")>=0){
        //record the title
         subStr = line.substring(line.indexOf("title:")+6,line.indexOf("\r")).trim();
        record.title = subStr;
    }

    if(line.indexOf("group:")>=0){
        //record the group
         subStr = line.substring(line.indexOf("group:")+6,line.indexOf("\r")).trim();
        record.group = subStr;
    }

    if(line.indexOf("categories:")>=0 || line.indexOf("reviews:")>0 || categories) {
        //Check if there are more categories to record and make sure we haven't started reading reviews
        if ((line.indexOf("categories:") >= 0 || categories) && !(line.indexOf("reviews:") > 0)) {
            //record the categories -- there might be more than one category so have to continue reading until we get to "reviews"
             subStr = line.substring(line.indexOf("categories:") + 11, line.indexOf("\r")).trim();
            record.categories.push(subStr);
            categories = true;
        } else {
            categories = false;
        }

        // already=true;
        if (last) {
            return false; // stop reading
        }}
});
/**
 * Created by Bharath on 10/20/15.
 */
