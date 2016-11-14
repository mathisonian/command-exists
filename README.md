command-exists
==============

node module to check if a command-line command exists



## installation

npm install command-exists

## usage

### async

```js
var commandExists = require('command-exists');

commandExists('ls', function(err, commandExists) {

    if(commandExists) {
        // proceed confidently knowing this command is available
    }

});

```
### sync
```js
var commandExistsSync = require('command-exists').sync;
// returns true/false; doesn't throw
if (commandExistsSync('ls')) {
    // proceed
} else {
    // ...
}

```
