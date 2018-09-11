console.log(global);

exports.y = function () {
    this.a = 1;
    this.b = 'efgh';

    this.print = function () {
        console.log('Spawn print:', a, b);
    };

    this.mod = function () {
        other(temp);
    };
}

var temp = 'Spawn temp.';

function other(msg) {
    g.push('Global...');
    console.log('Spawn other!', msg);
}