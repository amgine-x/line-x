const port = 8080;
const execFile = require('child_process').execFile;

function launchChrome(url, callback) {
    // TODO: specify chrome path
    const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    var user_data_dir = '--user-data-dir=C:\\users\\Jon Doerian\\Documents\\untitled-user-data-dir\\line-x-rpc-test';
    var remote_debugging_port = '--remote-debugging-port=' + String(port);
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
    var _cp = execFile(CHROME, args, { maxBuffer: 1024 * 50000 }, callback);
    //process.stdin.resume();
    //return _cp;
}

function launch() {
    console.log('Launching chrome...');
    var result = launchChrome('https://www.google.com', function (err, stdout, stderr) {
        if (err) {
            //console.log('**********Chrome Launch Error*************');
            console.log('chrome-launch-err:', err);
            //process.exit(0);
        }
        if (stdout) {
            console.log('chrome-term-out: ' + stdout);
        }
        if (stderr) {
            console.log('chrome-term-err' + stderr);
        }

        console.log('chrome instance at ' + String(port) + ' closed!');
        // TODO: release port & kill process
    });
    //return result;
}

launch(); console.log('chrome running at ' + String(port) + '...');


result = {
    method: "runtime.consoleAPICalled",
    params: {
        args: [
            {
                type: "string",
                value: "_line-XEC"
            }
        ],
        executionContextId: 1,
        stackTrace: {},
        timestamp: 12345,
        type: "log"
    }
};