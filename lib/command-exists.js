'use strict';

var exec = require('child_process').exec;

module.exports = function(commandName, callback) {
    var child = exec('command -v ' + commandName + 
        ' >/dev/null 2>&1' +
        ' || { echo >&2 \'' + commandName + ' not found\'; exit 1; }');
    // exits too early
    var gotData = true;
    
    child.stderr.on('data', function(data) {
        gotData = false;
    });

    child.on('close', function() {
        callback(null, gotData);
    });
};