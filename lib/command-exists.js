'use strict';

var exec = require('child_process').exec;

var isUsingWindows = process.platform == 'win32'

var commandExistsUnix = function(commandName, callback) {
  var child = exec('command -v ' + commandName +
        ' 2>/dev/null' +
        ' && { echo >&1 \'' + commandName + ' found\'; exit 0; }',
        function (error, stdout, stderr) {
            callback(null, !!stdout);
        });
}

var commandExistsWindows = function function_name(commandName, callback) {
  var child = exec('where ' + commandName,
    function (error) {
      if (error !== null){
        callback(null, false);
      } else {
        callback(null, true);
      }
    }
  )
}

module.exports = function(commandName, callback) {
  if (isUsingWindows) {
    commandExistsWindows(commandName, callback)
  } else {
    commandExistsUnix(commandName, callback)
  }
};
