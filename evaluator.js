exports.evaluator = function evaluator() {
    // set listener
    this.location = null;
    this.locationLast = null;
    this.active = false;
    this.urlIdentifiers = [];

    this.init = function (apps) {
        var app = apps.getCurrentApp();
        //console.log('Evaluator:', apps);

        if (app) {
            this.continue(this._default(), app.sequence, apps);
        } else {
            if (apps.next()) {
                var msg = {
                    'id': id++,
                    'method': 'Page.navigate',
                    'params': { 'url': apps.getCurrentApp().sequence[0].url }
                };

                global.sendCommand(msg);
            } else {
                console.log('Could not set next application.');
            }
        }
    };

    this.continue = function (browserLoc, sequence, apps) {
        if (browserLoc) {
            var page;
            var _id = global.id++;

            for (i = 0; i < sequence.length; i++) {
                var seq = sequence[i];
                //var url = seq.url;

                if (browserLoc.indexOf(seq.url) != -1) {
                    if (seq.name == 'homepage') {
                        if (seq.url.length == browserLoc.length) {
                            page = seq;
                            break;
                        } else {
                            continue;
                        }
                    } else {
                        page = seq;
                        break;
                    }
                }
            }

            if (page) {
                /*debugger;*/
                switch (page.phase) {
                    case -1:
                        var msg = {
                            'id': 1,
                            'method': 'Network.getCookies'
                        };
                        global.sendCommand(msg);

                        //apps.next();
                        break;
                    default:
                        if (page.listener) {
                            page.listener.id = _id;
                            global.listeners.add(page.listener.event, page.listener);
                        }
                }

                this.locationLast = this.location;
                this.location = null;

                msg = {
                    'id': _id,
                    'method': 'Runtime.evaluate',
                    'params': {
                        'expression': page.exp,
                        'awaitPromise': false,
                        'generatePreview': true,
                        'includeCommandLineAPI': true,
                        'objectGroup': 'console',
                        'returnByValue': false,
                        'silent': false,
                        'userGesture': true
                    }
                };

                
                /*debugger;*/
                global.browserActive = true;
                console.log('global.browserActive:', global.browserActive);

                console.log('Runtime.evaluate:', page, 'at', this.locationLast, Date.now());
                global.sendCommand(msg);
            } else {
                this.location = null;
                this._default();
            }
        }
    };

    this._default = function () {
        if (this.location) {
            return this.location;
        } else {
            var _id = global.id++;

            global.listeners.add('result', {
                'id': _id,
                'event': 'result',
                'callback': function (frame) {
                    if (frame.result.result.type == 'string') {
                        var _url = frame.result.result.value;
                        //console.log(_url, Date.now());

                        if (_url == 'about:blank' || 
                            _url.includes('https://www.google.com/' || 
                            _url == this.locationLast)
                        ) {
                            global.evaluator._default();
                        } else {
                            console.log(_url, Date.now());
                            global.evaluator.location = frame.result.result.value;
                        }
                    }
                }
            });

            var msg = {
                'id': _id,
                'method': 'Runtime.evaluate',
                'params': {
                    'expression': 'window.location.href',
                    'awaitPromise': false,
                    'generatePreview': true,
                    'includeCommandLineAPI': true,
                    'objectGroup': 'console',
                    'returnByValue': false,
                    'silent': false,
                    'userGesture': true
                }
            };

            global.sendCommand(msg);
        }
    };
}