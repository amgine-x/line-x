const execFile = require('child_process').execFile;

function launchChrome(url, callback) {
    // TODO: specify chrome path
    const CHROME = 'C:\\Program\ Files\ (x86)\\Google\\Chrome\\Application\\chrome.exe';
    var user_data_dir = '--user-data-dir=E:\\Devtools\\test';
    var remote_debugging_port = '--remote-debugging-port=9222';
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
    
    if (_cp.stdout) {
        _cp.stdout.on('data', function (data) {
            console.log('output:', data.toString('utf8'));
        });
    }
    if (_cp.stderr) {
        _cp.stderr.on('data', function (data) {
            var e = data.toString('utf8');
            /* for (i = 0; i < errors.length; i++) {
                if (errors[i] == e) {
                    break;
                } else if (i == errors.length - 1) {
                    console.log('err:', e);
                    errors.push(e);
                }
            } */
        });
    }
}

function launch() {
    console.log('Launching chrome...');
    launchChrome('https://www.google.com', function (err, stdout, stderr) {
        if (err) {
            //console.log('***********************');
            console.error('err:', err);
            //process.exit(0);
        }
        /* if (stdout) {
            console.log('term-out: ' + stdout);
        } */
        if (stderr) {
            console.log('term-err' + stderr);
        }
        
        console.log('chrome running at '+String(port)+'...');
    });
}

launch();