exports.evaluator = function evaluator() {
    // set listener
    this.location = null;
    this.active = false;

    this.init = function (apps) {
        var app = apps.getCurrentApp();

        if (app) {
            this.continue(this._default(), app.sequence);
        } else {
            if (apps.next()) {
                var msg = {
                    'id': id++,
                    'method': 'Page.navigate',
                    'params': { 'url': apps.getCurrentApp().sequence[0].url }
                };

                sendCommand(msg);
            } else {
                console.log('Could not set next application.');
            }
        }
    };

    this.continue = function (state, sequence) {
        if (state) {
            var page;
            var _id = id++;

            for (i = 0; i < sequence.length; i++) {
                var seq = sequence[i];
                var url = seq.url;

                if (state.indexOf(url) != -1) {
                    if (seq.name == 'homepage') {
                        if (url.length == state.length) {
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

            switch (page.phase) {
                case -1:
                    // TODO: next
                    var msg = {
                        'id': 1,
                        'method': 'Network.getCookies'
                    };
                    sendCommand(msg);
                    break;
                default:
                    if (page.listener) {
                        page.listener.id = _id;
                        listeners.add(page.listener.event, page.listener);
                    }
            }

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

            sendCommand(msg);
        }
    };

    this._default = function () {
        if (this.location) {
            return this.location;
        } else {
            var _id = id++;

            listeners.add('result', {
                'id': _id,
                'event': 'result',
                'callback': function (frame) {
                    if (frame.result.result.type == 'string') {
                        loaded.location = frame.result.result.value;
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

            sendCommand(msg);
        }
    };
}