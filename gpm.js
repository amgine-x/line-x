var templates = {
    request: [],
    response: []
}


var _homepage = {
    def: function _homepage() {
        var col = document.getElementsByClassName('paper-button-2');
        for (i = 0; i < col.length; i++) {
            if (String(col[i].innerText).indexOf('SIGN IN') != -1) {
                col[i].click();
            } else {
                if (i == col.length) {
                    first();
                } else {
                    continue;
                }
            }
        }
    },
    call: ' _homepage();'
}

var _signin_ident = {
    def: function _signin_ident(value) {
        var input = document.getElementById('identifierId');

        input.value = value;
        var btn = document.getElementById('identifierNext');

        btn.onmouseenter;
        btn.click();
    }, // TODO: get value
    call: " _signin_ident('a.wilson.awe');"
}

var _signin_pwd = {
    def: function _signin_pwd(value) {
        var div = document.getElementById('password');
        var input = div.getElementsByTagName('input')[0];

        input.onmouseenter;
        input.click();
        input.value = value;

        var btn = document.getElementById('passwordNext');

        btn.onmouseenter;
        btn.click();
    }, // TODO: get value
    call: " _signin_pwd('Osasenaga1');"
}

var _signin_chooser = {
    def: function _signin_chooser(text) {
        var coll = document.getElementsByClassName('TnvOCe');

        for (i = 0; i < coll.length; i++) {
            if (coll[i].innerText.indexOf(text) != -1) {
                coll[i].click();
                break;
            }
        }
    },
    call: " _signin_chooser('@gmail.com');"
}

var _signin_opt = {
    def: function _signin_opt() {
        var x;
        var coll = document.getElementsByClassName('O0WRkf');

        for (i = 0; i < coll.length; i++) {
            if (coll[i].innerText == 'DONE') {
                x = coll[i];
                break;
            }
        }

        x.onclick;
        x.click();
    },
    call: ' _signin_opt();'
}

var _home = {
    def: function _home(value) {
        var search = document.getElementsByClassName('sj-search-box-1')[0];

        var ie = new Event('input', {
            bubbles: true,
            cancelable: false,
            composed: true,
            data: value,
            defaultPrevented: false,
            detail: 0,
            eventPhase: 0,
            inputType: "insertText",
            isComposing: false,
            isTrusted: true,
            srcElement: input,
            target: input,
            type: "input",
            which: 0
        });

        var input = document.getElementById('input');
        input.value = value;
        input.dispatchEvent(ie);

        var ke = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            charCode: 13,
            keyCode: 13
        });

        search.dispatchEvent(ke);
    },
    call: " _home('sbtrkt');"
}

var _sr = {
    def: function _sr(text) {
        var coll = document.getElementsByClassName('material-card');

        for (i = 0; i < coll.length; i++) {
            if (coll[i].innerText.indexOf(text) != -1) {
                coll[i].click();
                break;
            }
        }
    },
    call: " _sr('SBTRKT');"
}

var _artist = {
    def: function _artist(album) {
        var coll = document.getElementsByClassName('title');

        for (i = 0; i < coll.length; i++) {
            if (coll[i].innerText == album) {
                coll[i].click();
                break;
            }
        }
    },
    call: " _artist('Wonder Where We Land');"
}

var _album = {
    def: function _album(track) {
        var coll = document.getElementsByClassName('column-content');

        for (i = 0; i < coll.length; i++) {
            if (coll[i].innerText.indexOf(track) != -1) {
                coll[i].click();
                break;
            }
        }

        coll = document.getElementsByClassName('hover-button');
        coll[0].click();
    },
    call: " _album('NEW DORP. NEW YORK');"
}

function getExp(o) {
    return String(o.def) + o.call;
}


/*
    sequence definition:
        name: String,
        phase: Integer,
        url: String,
        exp: String,
        listener: Object*


// phase 1 homepage
// phase -1 end
*/

var app = {
    name: 'Google Play Music',
    sequence: [
        { //listener: {'id': 1, 'event': 'result', 'callback': function(e){}}
            name: 'homepage',
            phase: 1,
            url: 'https://play.google.com/music/listen',
            exp: getExp(_homepage)
        }, {
            name: 'signin_ident',
            phase: 2,
            url: 'https://accounts.google.com/signin/v2/identifier?',
            exp: getExp(_signin_ident)
        }, {
            name: 'signin_chooser',
            phase: 3,
            url: 'https://accounts.google.com/ServiceLogin/signinchooser?',
            exp: getExp(_signin_chooser)
        }, {
            name: 'signin_pwd',
            phase: 4,
            url: 'https://accounts.google.com/signin/v2/sl/pwd?',
            exp: getExp(_signin_pwd)
        }, {
            name: 'signin_opt',
            phase: 5,
            url: 'https://myaccount.google.com/signinoptions/recovery-options-collection?',
            exp: getExp(_signin_opt)
        }, {
            name: 'home',
            phase: 6,
            url: 'https://play.google.com/music/listen#/home',
            exp: getExp(_home),
            listener: {
                'id': 1,
                'event': 'Network.requestWillBeSent',
                'patterns': ['querysuggestions', 'search', 'artist', 'album', 'play'],
                'callback': function (frame) {
                    for (i = 0; i < this.patterns.length; i++) {
                        if (frame.params.request.url.indexOf(this.patterns[i] + '?') != -1) {
                            var service = this.patterns[i];
                            var requestId = frame.params.requestId;
                            templates.request[service] = frame.params.request;

                            var l = {
                                'id': id,
                                'event': 'Network.loadingFinished',
                                'service': service,
                                'requestId': requestId,
                                'callback': function (frame) {
                                    var service = this.service;

                                    if (frame.params.requestId == this.requestId) {
                                        var msg = {
                                            'id': id,
                                            'method': 'Network.getResponseBody',
                                            'params': {
                                                'requestId': this.requestId
                                            }
                                        };

                                        listeners.add('result', {
                                            'id': id++,
                                            'event': 'result',
                                            'service': service,
                                            'callback': function (frame) {
                                                if (frame.result) {
                                                    templates.response[this.service] = JSON.parse(String(frame.result.body).replace('\n', ''));
                                                    console.log(templates);
                                                } else {
                                                    console.log('error!', frame);
                                                }
                                            }
                                        });

                                        sendCommand(msg);
                                    }
                                }
                            }
                            listeners.add(l.event, l);
                        }
                    }
                }
            }
        }, {
            name: 'sr',
            phase: 7,
            url: 'https://play.google.com/music/listen#/sr',
            exp: getExp(_sr)
        }, {
            name: 'artist',
            phase: 8,
            url: 'https://play.google.com/music/listen#/artist',
            exp: getExp(_artist)
        }, {
            name: 'album',
            phase: -1,
            url: 'https://play.google.com/music/listen#/album',
            exp: getExp(_album)
        }
    ]
};

// TODO: uncomment
// apps.add(app);