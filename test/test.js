'use strict';

const expect = require('expect.js');
const commandExists = require('..');
const fs = require('fs');
const commandExistsSync = commandExists.sync;
const resolve = require('path').resolve;
const isUsingWindows = process.platform === 'win32';

describe('commandExists', function () {
    describe('async - callback', function () {
        it('it should find a command named ls or xcopy', function (done) {
            let commandToUse = 'ls';
            if (isUsingWindows) {
                commandToUse = 'xcopy';
            }

            commandExists(commandToUse, function (err, exists) {
                expect(err).to.be(null);
                expect(exists).to.be(true);
                done();
            });
        });

        it('it should not find a command named fdsafdsafdsafdsafdsa', function (done) {
            commandExists('fdsafdsafdsafdsafdsa', function (err, exists) {
                expect(err).to.be(null);
                expect(exists).to.be(false);
                done();
            });
        });
    });

    describe('async - promise', function () {
        it('it should find a command named ls or xcopy', function (done) {
            let commandToUse = 'ls';
            if (isUsingWindows) {
                commandToUse = 'xcopy';
            }

            commandExists(commandToUse)
                .then(function (command) {
                    expect(command).to.be(commandToUse);
                    done();
                });
        });

        it('it should not find a command named fdsafdsafdsafdsafdsa', function (done) {
            commandExists('fdsafdsafdsafdsafdsa')
                .then(function () {
                    // We should not execute this line.
                    expect(true).to.be(false);
                })
                .catch(function () {
                    done();
                });
        });
    });

    describe('sync', function () {
        it('it should find a command named ls or xcopy', function () {
            let commandToUse = 'ls';
            if (isUsingWindows) {
                commandToUse = 'xcopy';
            }
            expect(commandExistsSync(commandToUse)).to.be(true);
        });

        it('it should not find a command named fdsafdsafdsafdsafdsa', function () {
            expect(commandExistsSync('fdsafdsafdsafdsafdsa')).to.be(false);
        });

        it('it should not find a command named ls or xcopy prefixed with some nonsense', function () {
            let commandToUse = 'fdsafdsa ls';
            if (isUsingWindows) {
                commandToUse = 'fdsafdsaf xcopy';
            }
            expect(commandExistsSync(commandToUse)).to.be(false);
        });

        it('it should not execute some nefarious code', function () {
            expect(commandExistsSync('ls; touch /tmp/foo0')).to.be(false);
        });

        it('it should not execute some nefarious code', function () {
            expect(commandExistsSync('ls touch /tmp/foo0')).to.be(false);
        });
    });

    describe('local file', function () {
        it('it should report false if there is a non-executable file with that name', function (done) {
            const commandToUse = 'test/non-executable-script.js';
            commandExists(commandToUse)
                .then(function () {
                    // We should not execute this line.
                    expect(true).to.be(false);
                }).catch(function (err) {
                expect(err).to.be(null);
                done();
            });
        });


        if (!isUsingWindows) {
            it('it should report true if there is an executable file with that name', function (done) {
                const commandToUse = 'test/executable-script.js';
                commandExists(commandToUse)
                    .then(function (command) {
                        expect(command).to.be(commandToUse);
                        done();
                    });
            });
        }

        if (isUsingWindows) {
            it('it should report true if there is an executable file with that name', function (done) {
                const commandToUse = 'test\\executable-script.cmd';
                commandExists(commandToUse)
                    .then(function (command) {
                        expect(command).to.be(commandToUse);
                        done();
                    });
            });

            it('it should report false if there is a double quotation mark in the file path', function () {
                const commandToUse = 'test\\"executable-script.cmd';
                expect(commandExists.sync(commandToUse)).to.be(false);
            });
        }
    });

    describe('folder', function () {
        const randomDirName = 'asdauwhbfuk';
        before(function (){
           fs.mkdirSync(randomDirName);
        });

        describe('sync', function () {
            it('should return false cause its just a folder', function () {
                expect(commandExistsSync(randomDirName)).to.be(false);
            });
        });

        describe('async', function () {
            it('should return false cause its just a folder', function (done) {
                commandExists(randomDirName, function (command) {
                    expect(command).to.be(null);
                    done();
                });
            });
        });

        after(function (){
           fs.rmdirSync(randomDirName);
        });
    });

    describe('absolute path', function () {
        it('it should report true if there is a command with that name in absolute path', function (done) {
            const commandToUse = resolve('test/executable-script.js');
            commandExists(commandToUse)
                .then(function (command) {
                    expect(command).to.be(commandToUse);
                    done();
                });
        });

        it('it should report false if there is not a command with that name in absolute path', function () {
            const commandToUse = resolve('executable-script.js');
            expect(commandExists.sync(commandToUse)).to.be(false);
        });
    });

    describe('local file "conflicting" with env', function () {
        before(function () {
            fs.copyFileSync('test/non-executable-shell-script', 'executable-shell-script');
            process.env['PATH'] = resolve('test/');
        });

        describe('sync', function () {
            it('it should report true if there is a command with that name in env but the absolut path is not executable', function () {
                expect(commandExistsSync('executable-shell-script')).to.be(true);
            });
        });

        describe('async', function () {
            it('it should report the command if it is in the env but the absolut path is not executable', function (done) {
                const commandToUse = 'executable-shell-script';
                commandExists(commandToUse)
                    .then(function (command) {
                        expect(command).to.be(commandToUse);
                        done();
                    }).catch(function (reason) {
                        console.log(reason);
                    }
                );
            });
        });

        after(function () {
            fs.unlinkSync('executable-shell-script');
        });
    });
});
