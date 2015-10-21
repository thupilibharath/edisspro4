/**
 * Created by Bharath on 9/11/15.
 */
exports.updateitems=function(req,res){

    try{
        console.log('*******UPDATE PRODUCTS---------');
    var sess = req.session;
    var id = '\''+req.body.productId+'\'';
    var groups = '\''+req.body.productDescription+'\'';
    var title = '\''+req.body.productTitle+'\'';
    var mysql = require('mysql');

    var success = false;
        var success1 = false;
    console.log('id is '+id);

    var connection = mysql.createConnection({
        host: 'project4.crbxasmdgbrq.us-east-1.rds.amazonaws.com',
        port: 3306,
        user: 'root',
        password: 'Pop123465.',
        database: 'Project4'
    });


        connection.connect(function(err){
        if(!err) {
            console.log("Database is connected ... \n\n");
        } else {
            console.log("Error connecting database ... \n\n");
        }
    });


    if(id=='\'\''&&sess.role=='admin'||groups=='\'\''&&sess.role=='admin'||title=='\'\''&&sess.role=='admin'){
        res.send(JSON.stringify({message:'There was a problem with this action'}));
    }
    else if(sess.username&&sess.role=='admin') {
        connection.query('update product_details set description=' + groups + ',title=' + title + 'where id=' + id, function (err, rows) {
            if(err){

            }
            if (!err) {

                success = true;
                console.log('updated items');
                res.send(JSON.stringify({message:'The product information has been updated'}));
            }
            else {
               res.send(JSON.stringify({message:'There was a problem with this action'}));

            }
            connection.end();
        });
    }

    else{
        res.send(JSON.stringify({message:'There was a problem with this action'}));

    }}
    catch(ex){
        res.send(JSON.stringify({message: 'Error ccured'}));
    }
};