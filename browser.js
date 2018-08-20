const execFile = require('child_process').execFile;
console.log(process);
var uid = 'unique_id_1234';

function launchChrome(url, callback) {
    // TODO: specify chrome path
    const CHROME = 'C:\\Program\ Files\ (x86)\\Google\\Chrome\\Application\\chrome.exe';
    var user_data_dir = '--user-data-dir=E:\\Devtools\\' + uid;
    var remote_debugging_port = 9222;
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
    execFile(CHROME, args, callback);
}

function launch() {
    console.log('Launching chrome...');
    launchChrome('https://www.google.com', function (err, stdout, stderr) {
        if (err) {
            console.log('*********error*********');
            console.error(err);
            process.exit(0);
        }
        console.log('stdout: ' + stdout);
        if (stderr) {
            console.log('stderr' + stderr);
        }
        
        console.log('chrome running...');
    });
}

launch();

// TODO: get env variables and include _websocket
