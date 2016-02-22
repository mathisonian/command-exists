'use strict';

var expect = require('expect.js');
var commandExists = require('..');

describe('commandExists()', function(){

    it('it should find a command named ls', function(done){
        commandExists('ls', function(err, exists) {
            expect(err).to.be(null);
            expect(exists).to.be(true);
            done();
        });
    });

    it('it should not find a command named fdsafdsafdsafdsafdsa', function(done){
        commandExists('fdsafdsafdsafdsafdsa', function(err, exists) {
            expect(err).to.be(null);
            expect(exists).to.be(false);
            done();
        });
    });

});