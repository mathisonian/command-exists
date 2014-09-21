'use strict';

var exec = require('child_process').exec;

module.exports = function(commandName, callback) {
    var child = exec('which ' + commandName);
    var gotData = false;
    
    child.stdout.on('data', function() {
        gotData = true;
    });

    child.on('close', function() {
        callback(null, gotData);
    });
};