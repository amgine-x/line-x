const spawn = require('./spawn.js');
global.g = [];
var y = new spawn.y();
var a = new x();
console.log(a);

exports.z = new x();

function x() {
    this.a = 0;
    this.b = 'abcd';

    this.print = function () {
        console.log('Parent x print:', a, b);
    };
}

function other(msg) {
    console.log('Parent other!', msg);
}

y.mod();
console.log(g);