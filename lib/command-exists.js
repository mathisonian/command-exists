'use strict';

const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const access = fs.access;
const accessSync = fs.accessSync;
const constants = fs.constants || fs;

const isUsingWindows = process.platform === 'win32';

const fileNotExists = function (commandName, callback) {
    access(commandName, constants.F_OK,
        function (err) {
            callback(!err);
        });
};

const fileExistsSync = function (commandName) {
    try {
        accessSync(commandName, constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const localExecutable = function (commandName, callback) {
    access(commandName, constants.F_OK | constants.X_OK,
        function (err) {
            callback(null, !err);
        });
};

const localExecutableSync = function (commandName) {
    try {
        accessSync(commandName, constants.F_OK | constants.X_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const commandExistsUnix = function (commandName, cleanedCommandName, callback) {

    fileNotExists(commandName, function (isFile) {

        if (isFile && localExecutableSync(commandName)) {
            localExecutable(commandName, callback);
            return;
        }
        exec('command -v ' + cleanedCommandName +
            ' 2>/dev/null' +
            ' && { echo >&1 ' + cleanedCommandName + '; exit 0; }',
            function (error, stdout) {
                callback(null, !!stdout);
            });
    });
};

const commandExistsWindows = function (commandName, cleanedCommandName, callback) {
    // Regex from Julio from: https://stackoverflow.com/questions/51494579/regex-windows-path-validator
    if (!(/^(?!(?:.*\s|.*\.|\W+)$)(?:[a-zA-Z]:)?(?:[^<>:"|?*\n]+(?:\/\/|\/|\\\\|\\)?)+$/m.test(commandName))) {
        callback(null, false);
        return;
    }
    exec('where ' + cleanedCommandName,
        function (error) {
            if (error !== null) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        }
    );
};

const commandExistsUnixSync = function (commandName, cleanedCommandName) {
    if (fileExistsSync(commandName) && localExecutableSync(commandName)) {
        return true;
    }
    try {
        const stdout = execSync('command -v ' + cleanedCommandName +
            ' 2>/dev/null' +
            ' && { echo >&1 ' + cleanedCommandName + '; exit 0; }'
        );
        return !!stdout;
    } catch (error) {
        return false;
    }
};

const commandExistsWindowsSync = function (commandName, cleanedCommandName) {
    // Regex from Julio from: https://stackoverflow.com/questions/51494579/regex-windows-path-validator
    if (!(/^(?!(?:.*\s|.*\.|\W+)$)(?:[a-zA-Z]:)?(?:[^<>:"|?*\n]+(?:\/\/|\/|\\\\|\\)?)+$/m.test(commandName))) {
        return false;
    }
    try {
        const stdout = execSync('where ' + cleanedCommandName, {stdio: []});
        return !!stdout;
    } catch (error) {
        return false;
    }
};

let cleanInput = function (s) {
    if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
        s = "'" + s.replace(/'/g, "'\\''") + "'";
        s = s.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
            .replace(/\\'''/g, "\\'"); // remove non-escaped single-quote if there are enclosed between 2 escaped
    }
    return s;
};

if (isUsingWindows) {
    cleanInput = function (s) {
        const isPathName = /[\\]/.test(s);
        if (isPathName) {
            const dirname = '"' + path.dirname(s) + '"';
            const basename = '"' + path.basename(s) + '"';
            return dirname + ':' + basename;
        }
        return '"' + s + '"';
    };
}

module.exports = function commandExists(commandName, callback) {
    const cleanedCommandName = cleanInput(commandName);
    if (!callback && typeof Promise !== 'undefined') {
        return new Promise(function (resolve, reject) {
            commandExists(commandName, function (error, output) {
                if (output) {
                    resolve(commandName);
                } else {
                    reject(error);
                }
            });
        });
    }
    if (isUsingWindows) {
        commandExistsWindows(commandName, cleanedCommandName, callback);
    } else {
        commandExistsUnix(commandName, cleanedCommandName, callback);
    }
};

module.exports.sync = function (commandName) {
    const cleanedCommandName = cleanInput(commandName);
    if (isUsingWindows) {
        return commandExistsWindowsSync(commandName, cleanedCommandName);
    } else {
        return commandExistsUnixSync(commandName, cleanedCommandName);
    }
};
