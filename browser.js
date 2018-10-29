const execFile = require('child_process').execFile;
const http = require('http');
const WebSocket = require('ws');
const gpm = require('./gpm.js');
const eval = require('./evaluator.js');

//setInterval(keepAlive(kill), 10000);
process.stdin.resume();
process.on('exit', function (code) {
    console.log(code);
});
process.on('uncaughtException', function (err) {
    console.log(err);
});
// TODO: fix module export error in loaded

console.log('----------------browser.js-------------------------');
console.log(process.argv);

var uid = process.argv[2];
var port = process.argv[3];

function launchChrome(url, callback) {
    // TODO: specify chrome path
    const CHROME = 'C:\\users\\user\\documents\\chrome\\chrome.exe';
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
    return _cp;
}

function launch() {
    console.log('Launching chrome...');
    var result = launchChrome('https://www.google.com', function (err, stdout, stderr) {
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
    return result;
}

// TODO: post-launch promises... also, BWAHHHHHHHH
launch(); console.log('chrome running at '+String(port)+'...');

/* var postLaunchPromise = new Promise(function (resolve, reject) {
    var result = launch();

    if (result) {
        resolve('chrome running at '+String(port)+'...');
    } else {
        reject(Error('chrome failed to launch'));
    }
}); */

global.domains = [// if 'events' include 'callbacks'
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

global.socket;
global.id = 1;
global.execContextId = 1;

global.evaluator = new eval.evaluator(); console.log('evaluator:', evaluator);
global.apps = new apps(); console.log(global.apps);

global.gplaymusic = gpm.app;
console.log(global.gplaymusic);
if (global.gplaymusic) {
    global.apps.add(global.gplaymusic);
}

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
};
global.loadDetector = new loadDetector();
global.sendCommand = function (msg) {
    global.socket.send(JSON.stringify(msg));
    
    global.loadDetector.activate();
};


// TODO: get ws address
var addr = 'http://localhost:'+String(port)+'/json'; console.log(addr);
var tabs = '';

http.get({method: 'GET', path: '/json', port: Number(port)}, function (resp) {
    resp.on('data', function (chunk) {
        tabs += chunk;
    });
    
    resp.on('end', function () {
        tabs = JSON.parse(tabs); console.log('inspectable pages:', tabs);
        var wsAddr;

        for (i = 0; i < tabs.length; i++) {
            if (tabs[i].url == 'https://www.google.com/') {
                // TODO: get socket addr
                wsAddr = tabs[i].webSocketDebuggerUrl;
                break;
            }
        }

        wsConn(wsAddr); console.log('current tab:', wsAddr);
    });
}).on('error', function (err) {
    console.log('Error connecting to chrome instance:', err);
});

function wsConn(addr) {
    // Create Websocket connection.
    if (global.socket) {
        if (global.socket.readyState !== 0 && global.socket.readyState !== 1) {
            global.socket = new WebSocket(addr);
            addWsListeners();
        }
    } else {
        global.socket = new WebSocket(addr);
        addWsListeners();
    }
}

function addWsListeners () {
    // Connection opened
    global.socket.addEventListener('open', function open() {
        console.log('initialization!');
        _init(global.domains);
    });
    global.socket.on('close', function (e) {
        setTimeout(wsConn(global.socket), 5000);
    });

    global.socket.on('error', function (err) {
        console.log('ws-conn-err:', err);
        console.log('*********Reconnecting**************')
        setTimeout(wsConn(global.socket), 5000);
    });

    // Listen for messages
    global.socket.addEventListener('message', function msg(data) {
        var frame = JSON.parse(data.data.toString('utf8')); // {"id":1,"result":{..},"method":"abcd","params":{..}}
        //console.log();

        // TODO: emit event for executionContextCreated
        if (frame.method == 'Runtime.executionContextCreated') {
            global.execContextId = Number(frame.params.context.id);
        };

        global.listeners.emit(frame);

        var msg = {
            timeStamp: Date.now()
        };
        global.loadDetector.send(msg);
    });
}

function _init(domains) {
    for (i = 0; i < domains.length; i++) {
        var domain = domains[i];
        var _id = global.id++;
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

                global.listeners.add(l.event, l);
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
                global.listeners.add(l.event, l);
            }
        }

        global.sendCommand(msg);

        if (domain.hasOwnProperty('commands')) {
            domain.commands.forEach(function (cmd) {
                global.sendCommand(cmd);
            });
        }
    }
}

function apps() {
    this.apps = [];
    this.currentApp = '';
    this.evaluated = [];

    this.getCurrentApp = function () {
        if (this.currentApp) {
            return {name: this.currentApp, sequence: this.apps[this.currentApp]};
        }
    };

    this.setCurrentApp = function (name) {
        var keys = this.getApps();

        for (var key in keys) {
            if (name == keys[key]) {
                this.currentApp = keys[key];
                return;
            }
        }

        var err = name+" was not found in apps collection.";
        console.log(err);
    };

    this.add = function (app) {
        var err = {method: 'apps.add'};

        if (!app.name) {
            err.message = "Application property 'name' must be specified.";
            console.log(err);
            return;
        }

        if (!app.sequence) {
            err.message = "Application navigation 'sequence' property must be included. See docs for help.";
            console.log(err);
            return;
        }

        this.apps[app.name] = app.sequence;
    };

    this.remove = function (name) {
        var err = {method: 'apps.remove'};

        if (!name) {
            err.message = "Application name must be specified.";
            console.log(err);
            return;
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
    this.msgCount = 0;

    this.send = function (msg) {
        if (this.active) {
            this.timeStamp = msg.timeStamp;

            if (!this.msgCount) {
                this._metric();
            }

            this.msgCount++;
        }
    };

    this._metric = function () {
        console.log('_metric active:', this.active, this);
        if (this.active) {
            var now = Date.now();
            var t = (now - this.timeStamp) / 1000;

            if (t >= 0.5) {
                this.disable();

                this.time = t
                console.log('Page loaded in', this.time, this.active, this);
                
                global.evaluator.init(global.apps);
            } else {
                try {
                    //this._metric();
                    console.log('_metric active:', t, this.timeStamp, this);
                    setTimeout(function () {
                        global.loadDetector._metric
                    }, 5000);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    this.activate = function () {
        if (!this.active) {
            this.active = true;
            console.log('loadDetector active:', this.active);
        }
    };

    this.disable = function () {
        if (this.active) {
            this.active = false;
            console.log('loadDetector active:', this.active);
        }
    };
}