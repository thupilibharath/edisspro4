/**
 * Created by Bharath on 10/20/15.
 */


var fs = require('fs');
/*fs.readFile(filepath, 'utf8', function(err, data) {
    if(err) {
        console.error("Could not open file: %s", err);
        return;
    }
});
*/
var data = '\nHello';
fs.appendFile('test.sql', data, function(err) {
    if(err) {
        console.error("Could not write file: %s", err);
    }
});