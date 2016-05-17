'use strict';

var exec = require('child_process').exec;

module.exports = function(commandName, callback) {

    var child = exec('command -v ' + commandName +
        ' 2>/dev/null' +
        ' && { echo >&1 \'' + commandName + ' found\'; exit 0; }',
        function (error, stdout, stderr) {
            callback(null, !!stdout);
        });

};
