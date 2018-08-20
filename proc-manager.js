const WebSocket = require('ws');
const cp = require('child_process');
const sockets = {
    auth: [], 
    unauth: []
};
 
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

wss.on('message', function (msg) {
    
});

wss.on('connection', function (ws) {
    var ident = {
        type: 'ident',
        uid: 'unique_id_1234'
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
                    console.log(this);
                    console.log(auth_obj);
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

function getBuffer(obj) {
    return Buffer.from(JSON.stringify(obj));
}

function getMsg(data) {
    return JSON.parse(data.toString('utf8'));
}

function createSubprocess(uid, services) {
    var args = [uid];
    services.forEach(function (val) {
        switch (val) {
            case 'Google Play Music':
                args.push('./gpm'); // TODO: move to main (browser.js)
                break;
            default:
                break;
        }
    });

    var proc = cp.fork('browser.js', args, {silent: true});
    proc.stdout.on('data', function (data) {
        console.log(String(proc.pid) + ':', data.toString('utf8'));
    });
    proc.uid = uid;
    return proc;
}