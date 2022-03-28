command-exists
==============

node module to check if a command-line command exists



## installation

```bash
npm install command-exists
```

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
### promise
```js
var commandExists = require('command-exists');

// invoked without a callback, it returns a promise
commandExists('ls')
.then(function(command){
    // proceed
}).catch(function(){
    // command doesn't exist
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


## changelog


### v1.2.9

Fix issue with absolute paths on Windows ([#24](https://github.com/mathisonian/command-exists/pull/24))

### v1.2.8

Fix issue with paths on Windows ([#21](https://github.com/mathisonian/command-exists/pull/21))

### v1.2.7

Removes unnecessary printed output on Windows.

### v1.2.6

Small bugfixes.

### v1.2.5

Fix windows bug introduced in 1.2.4.

### v1.2.4

Fix potential security issue.

### v1.2.0

Add support for promises

### v1.1.0

Add synchronous version

### v1.0.2

Support for windows
