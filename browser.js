const execFile = require('child_process').execFile;
const http = require('http');
const WebSocket = require('ws');
const gpm = require('./gpm.js');
const loaded = require('./loaded.js');
var kill = false;
function keepAlive(kill) {
    console.log('------------');
}
//setInterval(keepAlive(kill), 10000);
process.stdin.resume();
process.on('exit', function (code) {
    console.log(code);
});
process.on('uncaughtException', function (err) {
    console.log(err);
});
// TODO: fix module export error in loaded

console.log('-----------------------------------------');
console.log(process.argv);

var uid = process.argv[2];
var port = process.argv[3];

function launchChrome(url, callback) {
    // TODO: specify chrome path
    const CHROME = 'E:\\downloads\\chrome\\chrome-win32\\chrome.exe';
    var user_data_dir = '--user-data-dir=E:\\Devtools\\' + uid;
    var remote_debugging_port = '--remote-debugging-port=' + port;
    var gpu = '--disable-gpu';
    var first_run = '--no-first-run';
    var default_browser_check = '--no-default-browser-check';

    var args = [
        gpu, 
        remote_debugging_port,
        user_data_dir,
        first_run, default_browser_check, 
        url
    ];
    var _cp = execFile(CHROME, args, callback);
    process.stdin.resume();
}

function launch() {
    console.log('Launching chrome...');
    launchChrome('https://www.google.com', function (err, stdout, stderr) {
        if (err) {
            console.log('***********************');
            console.log('err:', err);
            //process.exit(0);
        }
        if (stdout) {
            console.log('term-out: ' + stdout);
        }
        if (stderr) {
            console.log('term-err' + stderr);
        }
        
        console.log('chrome instance at '+String(port)+' closed!');
        // TODO: release port & end process
    });
    console.log('chrome running at '+String(port)+'...');
}

launch();



var domains = [// if 'events' include 'callbacks'
    {
        'name': 'Runtime',
        'commands': [
            {
                'id': 1,
                'method': 'Runtime.runIfWaitingForDebugger'
            }
        ]
    }, {
        'name': 'Debugger',
        'commands': [
            {
                'id': 1,
                'method': 'Debugger.setPauseOnExceptions',
                'params': {
                    'state': 'none'
                }
            }
        ]
    }, {
        'name': 'DOM'
    }, {
        'name': 'Security'
    }, {
        'name': 'Network',
        'params': { 'maxPostDataSize': 65536 }
    }, {
        'name': 'Page',
        'commands': [
            {
                'id': 1,
                'method': 'Page.startScreencast',
                'params': {
                    'format': 'jpeg',
                    'maxHeight': 808,
                    'maxWidth': 293,
                    'quality': 80
                }
            }
        ]
    }, {
        'name': 'Profiler'
    }, {
        'name': 'CSS'
    }, {
        'name': 'Overlay'
    }, {
        'name': 'Log'
    }, {
        'name': 'ServiceWorker'
    }, {
        'name': 'Inspector'
    }
];

var socket;
global.id = 1;
global.execContextId = 1;

var evaluator = new loaded.evaluator(); console.log('evaluator:', evaluator);
var apps = new apps();
apps.add(gpm.app); console.log(apps);

global.listeners = {
    event: [],
    result: [],
    /*
    @param {String} type
    @param {Object} listener
    */
    add: function (type, listener) {
        var e;

        if (type != 'result') {
            if (this.event[type]) {
                e = this.event[type];
            } else {
                this.event[type] = [];
                this.add(type, listener);
                return;
            }
        } else {
            e = this.result;
        }

        if (listener.name) {
            e[listener.name] = listener;
        } else {
            e.push(listener);
        }
    },
    /*
    @param {String} type
    @param {String} listener
    */
    remove: function (type, listener) {
        var e;

        if (type != 'result') {
            e = this.event[type];
        } else {
            e = this.result;
        }

        if (listener) {
            return delete e[listener];
        } else {
            var keys = Object.keys(e);

            for (i = 0; i < keys.length; i++) {
                var listener = keys[i];
                delete e[listener];
            }
            return true;
        }
    },
    /*
    @param {Object} frame
    */
    emit: function (frame) {
        if (frame.method) {
            var type = frame.method;
            var e = this.event[type];

            if (e) {
                var keys = Object.keys(e);

                for (i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var _listener = e[key];

                    if (_listener.event == frame.method) {
                        _listener.callback(frame);
                    }
                }
            }
        }

        if (frame.result) {
            var keys = Object.keys(this.result);
            
            for (i = 0; i < keys.length; i++) {
                var key = keys[i];
                var _listener = this.result[key];
                
                if (_listener.id == frame.id) {
                    _listener.callback(frame);
                }
            }
        }
    }
}; // {'id': 0, 'event': 'Page.loadEventFired', 'callback': function(frame) {}}
global.templates = {
    request: [],
    response: []
}

var loadDetector = new loadDetector();


// TODO: get ws address
var addr = 'http://localhost:'+String(port)+'/json'; console.log(addr);
var tabs = '';

http.get(addr, function (resp) {
    resp.on('data', function (chunk) {
        tabs += chunk;
    });
    
    resp.on('end', function () {
        tabs = JSON.parse(tabs); console.log('inspectable pages:', tabs);
        var ws;

        for (i = 0; i < tabs.length; i++) {
            if (tabs[i].url == 'https://www.google.com/') {
                // TODO: get socket addr
                ws = tabs[i].webSocketDebuggerUrl;
                break;
            }
        }

        // Create Websocket connection.
        socket = new WebSocket(ws);

        // Connection opened
        socket.addEventListener('open', function open() {
            console.log('initialization!');
            _init(domains);
        });

        // Listen for messages
        socket.addEventListener('message', function msg(data) {
            console.log(data.data);
            var frame = JSON.parse(data.data.toString('utf8')); // {"id":1,"result":{..},"method":"abcd","params":{..}}
            
            // TODO: emit event for executionContextCreated
            if (frame.method == 'Runtime.executionContextCreated') {
                execContextId = Number(frame.params.context.id);
            };

            listeners.emit(frame);

            var msg = {
                timeStamp: Date.now()
            };
            loadDetector.send(msg);
        });
    });
}).on('error', function (err) {
    console.log('Error connecting to chrome instance:', err);
});

function _init(domains) {
    for (i = 0; i < domains.length; i++) {
        var domain = domains[i];
        var _id = id++;
        var msg = {
            'id': _id, 
            'method': String(domain.name) + '.enable'
        };

        if (domain.hasOwnProperty('params')) {
            msg.params = domain.params;
        }

        if (domain.hasOwnProperty('events')) {
            domain.events.forEach(function (e) {
                var l = {
                    'id': _id,
                    'event': String(domain.name) + '.' + e
                };
                
                if (domain.hasOwnProperty('callbacks')) {
                    l.callback = domain.callbacks[e];
                }

                listeners.add(l.event, l);
            });
        }

        if (domain.hasOwnProperty('results')) {
            var nan = Number('abc');
            var keys = Object.keys(domain.results);

            for (i = 0; i < keys.length; i++) {
                var key = keys[i];
                var l = {
                    'id': _id,
                    'event': 'result'
                };

                if (Number(key) === nan) {
                    l.name = key;
                }

                l.callback = domain.result[key];
                listeners.add(l.event, l);
            }
        }

        sendCommand(msg);

        if (domain.hasOwnProperty('commands')) {
            domain.commands.forEach(function (cmd) {
                sendCommand(cmd);
            });
        }
    }
}

global.sendCommand = function (msg) {
    socket.send(JSON.stringify(msg));
}

function apps() {
    this.apps = [];
    this.currentApp = '';
    this.evaluated = [];

    this.getCurrentApp = function () {
        var err = {method: 'apps.getCurrentApp'};

        if (this.currentApp) {
            return {name: this.currentApp, sequence: this.apps[this.currentApp]};
        }
    };

    this.setCurrentApp = function (name) {
        var err = {method: 'apps.setCurrentApp'};

        if (!name) {
            err.message = "Application's name must be specified.";
            console.log(err);
        }

        var keys = this.getApps();

        for (var key in keys) {
            if (name == keys[key]) {
                this.currentApp = keys[key];
                return;
            }
        }

        err.message = name+" was not found in apps collection. ";
        console.log(err);
    };

    this.add = function (app) {
        var err = {method: 'apps.add'};

        if (!app.name) {
            err.message = "Application property 'name' must be specified.";
            console.log(err);
        }

        if (!app.sequence) {
            err.message = "Application navigation 'sequence' property must be included. See docs for help.";
            console.log(err);
        }

        this.apps[app.name] = app.sequence;
    };

    this.remove = function (name) {
        var err = {method: 'apps.remove'};

        if (!name) {
            err.message = "Application name must be specified.";
            console.log(err);
        }

        var keys = this.getApps();

        for (var key in keys) {
            if (key == name) {
                return delete this.apps[key];
            }
        }

        err.message = name+" was not found in apps collection.";
        console.log(err);
    };

    this.next = function () {
        var keys = this.getApps();
        var x;

        for (i = 0; i < keys.length; i++) {
            var key = keys[i];

            if (this.evaluated.length == 0) {
                x = true;
            } else {
                for (var val in this.evaluated) {
                    if (key == this.evaluated[val]) {
                        x = false;
                        break;
                    } else {
                        x = true;
                    }
                }
            }

            if (x) {
                this.setCurrentApp(key);
                this.evaluated.push(key);
                return x;
            }

            if (i == keys.length - 1 && !x) {
                // TODO: send message to queue
                this.currentApp = null;
                console.log('Done!');
                return x;
            }
        }
    };

    this.getApps = function () {
        return Object.keys(this.apps);
    };
}

function loadDetector() {
    this.timeStamp = null;
    this.time = null;
    this.active = false;

    this.send = function (msg = null) {
        if (!this.active) {
            this.active = true;
            this.timeStamp = msg.timeStamp;
            this.send(msg);
        } else {
            if (msg) {
                this.timeStamp = msg.timeStamp;
            }

            var now = Date.now();
            var t = (now - this.timeStamp) / 1000;
            
            if (t >= 0.5) {
                this.time = t;
                console.log('Page loaded in', this.time);
                
                if (this.active) {
                    evaluator.init(apps);
                    this.disable();
                }
            }
        }
    };

    this._metric = function () {
        if (this.active) {
            var now = Date.now();
            var t = (now - this.timeStamp) / 1000;

            if (t >= 0.5) {
                this.time = t
                console.log('Page loaded in', this.time);
                
                if (this.active) {
                    evaluator.init(apps);
                    this.disable();
                }
            } else {
                setTimeout(this._metric, 1000);
            }
        }
    };

    this.disable = function () {
        if (this.active) {
            this.active = false;
        }
    };
}





































































// TODO: get env variables and include _websocket
// TODO: send auth frame

