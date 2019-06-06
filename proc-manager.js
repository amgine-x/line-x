const WebSocket = require('ws');
const cp = require('child_process');

var sockets = {
    auth: [], 
    unauth: []
};
var port = 49152;
var usedPorts = [];
var n_statResultPos = 0;
var n_statCount = 0;
var n_statResult = '';
var n_statDone = false;
var n_statUpdate = false;


/*
    starting port: 49152
    num of ports: 16384
*/
const startingPort = 49152;
const numOfPorts = 16384;

function setDynamic(ipVersion) {
    if (ipVersion == 4) {
        return "netsh int ipv4 set dynamicport tcp start="+String(startingPort + 1000)+" num="+String(numOfPorts - 1001);
    } else {
        return "netsh int ipv6 set dynamicport tcp start="+String(startingPort + 1000)+" num="+String(numOfPorts - 1001);
    }
    
}

var n_sh = cp.exec(setDynamic(4), function (e, o, se) {
    var result = o;
    console.log(result);
});
var n_sh = cp.exec(setDynamic(6), function (e, o, se) {
    var result = o;
    console.log(result);
});

var n_stat = cp.exec("netstat -a -p tcp", function (e, o, se) {
    var result = o;
    //getUsedPorts(result);
    //start();
});
n_stat.stdout.on('data', function (data) {
    if (!n_statDone) {
        n_statResult += data.toString('utf8');
        n_statCount++;
        
        console.log(data.toString('utf8'));
        if (n_statCount >= 10 && !n_statUpdate) {
            n_statUpdate = true;
            getUsedPorts(n_statResult);
            start();
        }
        if (n_statCount >= 10 && n_statUpdate) {
            if (usedPorts.length != 30) {
                getUsedPorts(n_statResult);
                if (usedPorts.length == 30) {
                    n_statDone = true;

                    console.log(usedPorts);
                    console.log('************************port updates complete***************************');
                }
            }
        }
    }
})
//n_stat.stdout.pipe(process.stdout);



function start() {
    const wss = new WebSocket.Server({
        port: 8080,
        perMessageDeflate: {
            zlibDeflateOptions: { // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
            },
            zlibInflateOptions: {
            chunkSize: 10 * 1024
            },
            // Other options settable:
            clientNoContextTakeover: true, // Defaults to negotiated value.
            serverNoContextTakeover: true, // Defaults to negotiated value.
            clientMaxWindowBits: 10,       // Defaults to negotiated value.
            serverMaxWindowBits: 10,       // Defaults to negotiated value.
            // Below options specified as default values.
            concurrencyLimit: 10,          // Limits zlib concurrency for perf.
            threshold: 1024,               // Size (in bytes) below which messages
                                        // should not be compressed.
        }
    });
    
    wss.on('error', function (err) {
        console.log(err);
    });
    
    wss.on('message', function (msg) {
        
    });
    
    wss.on('connection', function (ws) {
        var ident = {
            type: 'ident',
            // TODO: generate unique
            uid: 'unique_id_1234-x'
        };
        ws.uid = ident.uid;
        ws.send(getBuffer(ident));
        
        ws.on('message', function (data) {
            var msg = getMsg(data);
    
            if (msg.type) {
                switch (msg.type) {
                    case 'auth':
                        this.services = msg.services;
                        
                        var auth_obj = {
                            uid: msg.uid,
                            ws: this,
                            services: msg.services,
                            proc: createSubprocess(this.uid, this.services)
                        };
                        sockets.unauth.push(auth_obj);
                        //console.log(this);
                        //console.log(auth_obj);
                        break;
                    case 'refresh':
                        break;
                    default:
                        break;
                }
            }
        });
        ws.on('error', function (err) {
            console.log(err);
        });
    });
}

function getBuffer(obj) {
    return Buffer.from(JSON.stringify(obj));
}

function getMsg(data) {
    return JSON.parse(data.toString('utf8'));
}

function createSubprocess(uid, services) {
    // TODO: --inspect-brk
    // TODO: --inspect=127.0.0.1:8081
    /*
     * First 3 elem have to be debug:param, stack-size, script, uid, service-mod
     */
    var args = ['--inspect-brk', '--stack_size=500000', 'browser.js', uid];
    services.forEach(function (val) {
        switch (val) {
            case 'Google Play Music':
                do {
                    var inuse = false;
                    for (i = 0; i < usedPorts.length; i++) {
                        if (port == usedPorts[i]) {
                            inuse = true;
                            port++;
                            break;
                        }
                    }
                } while (inuse);
                args.push(port++, './gpm');
                break;
            default:
                break;
        }
    });

    // TODO: set command to var args
    var proc = cp.exec(
        `node ${args[0]} ${args[1]} ${args[2]}`, 
        { 
            maxBuffer: 1024 * 500000,
            env: {
                'uid': String(args[3]),
                'port': String(port++),
                'app': args[4]
            }
        }, 
        function (error, stdout, stderr) {
            if (error) {
                console.log('browser-error:', error.toString('utf8'));
            }
            if (stdout) {
                console.log('browser-stdout:', stdout.toString('utf8'));
            }
            if (stderr) {
                console.log('browser-stderr:', stderr.toString('utf8'));
            }
        }
    );
    proc.stdin.on('data', function (data) {
        console.log(String(proc.pid) + 'stdin:', data);
    });
    proc.stdout.on('data', function (data) {
        console.log(String(proc.pid) + 'stdout:', data.toString('utf8'));
    });
    proc.stdout.on('error', function (err) {
        console.log(err.toString('utf8'));
    });
    proc.stderr.on('data', function (data) {console.log(data.toString('utf8'));});
    proc.stderr.on('error', function (err) {console.log(err.toString('utf8'));});
    proc.on('error', function (err) {
        console.log(err.toString('utf8'));
    });
    proc.on('exit', function () {
        console.log('browser.js exit!');
    });
    proc.uid = uid;
    return proc;
}

function getUsedPorts(result) {
    const data = String(result.toString('utf8'));

    lines = data.split('\n');

    for (var line of lines) {
        if (line) {
            words = line.split(' ');
            empty = 0;

            do {
                empty = words.indexOf('');
                if (empty != -1) {
                    words.splice(empty, 1);
                }
            } while (empty != -1);

            if (words[1]) {
                words[1] = words[1].substr(words[1].lastIndexOf(':') + 1);
                var _port = Number(words[1]);

                if (!isNaN(_port)) {
                    var unique = true;
                    for (i = 0; i < usedPorts.length; i++) {
                        if (_port == usedPorts[i]) {
                            unique = false;
                            break;
                        }
                    }
                    if (unique) {
                        usedPorts.push(_port);
                    }
                }
            }
        }
    }
}