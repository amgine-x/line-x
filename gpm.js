var _homepage = {
    cb: function cb(ml, o) {
        /*debugger;*/

        for (var m of ml) {

            if (m.type == 'childList' || m.type == 'attributes') {

                var ids = ['paper-button-2'];
                var match = false;

                for (var id of ids) {
                    if (
                        String(m.target.innerHTML).includes(id) ||
                        String(m.target.outerHTML).includes(id)
                    ) {
                        match = true;
                    }
                }

                if (match) {
                    /*debugger;*/

                    window._def = false;
                    setTimeout(_homepage, 100, window._def_urlId);
                    break;
                }
            }
        }
    },
    
    def: function _homepage(urlId) {
        /*var comp = [urlId, window.location.href];
        console.log('_hp-lineX:', comp);
        debugger;*/

        if (!window._def && window.location.href == urlId) {

            if (!window._cb) {
                _mutationObserver(document, cb);
                window._cb = true;
            }

            try {
                window._def = true;
                window._def_urlId = urlId;

                var col = document.getElementsByClassName('paper-button-2');

                if (col) {
                    console.log('line-x:', col);
                } else {
                    console.log("lineX-runtime-err: 'paper-button-2' not found!");
                }
                

                for (i = 0; i < col.length; i++) {
                    if (String(col[i].innerText).indexOf('SIGN IN') != -1) {
                        /*debugger;*/

                        console.log('_line-XEC');
                        window.o.disconnect();
                        col[i].click();
                        window._def = false;
                        window._cb = false;
                        
                        break;
                    } else {
                        if (i == col.length) {
                            window._def = false;
                            setTimeout(_homepage, 100, urlId);
                        } else {
                            continue;
                        }
                    }
                }
            } catch (err) {
                console.log('lineX-runtime-err:', err);
                window._def = false;
                setTimeout(_homepage, 100, urlId);
            }
        } else {
            if (window.location.href != urlId) {
                console.log('_line-XEI');
            }
        }
    },

    call: '_homepage("https://play.google.com/music/listen");'
}

var _signin_ident = {
    cb: function cb(ml, o) {
        /*debugger;*/

        for (var m of ml) {

            if (m.type == 'childList' || m.type == 'attributes') {

                var ids = ['identifierId', 'identifierNext'];
                var match = false;

                for (var id of ids) {
                    if (
                        String(m.target.innerHTML).includes(id) ||
                        String(m.target.outerHTML).includes(id)
                    ) {
                        match = true;
                    }
                }

                if (match) {

                    console.log('line-x:', document.getElementById('identifierId'));

                    if (window._def) {
                        window._def = false;
                        setTimeout(_signin_ident, 100, window._def_value, window._def_urlId);
                    } else {
                        console.log("lineX-runtime-err: 'window._def' not found or false!");
                    }
                }
            }
        }
    },

    def: function _signin_ident(value, urlId) {
        /*var comp = [urlId, window.location.href];
        console.log('lineX:', comp);*/


        if (!window._def && window.location.href.includes(urlId)) {

            if (!window._cb) {
                _mutationObserver(document, cb);
                window._cb = true;
            }

            try {
                window._def = true;
                window._def_value = value;
                window._def_urlId = urlId;

                var input = document.getElementById('identifierId');

                if (input) {
                    input.value = value;
                }

                var btn = document.getElementById('identifierNext');

                if (btn) {
                    btn.onmouseenter;
                    /*debugger;*/

                    console.log('_line-XEC');
                    window.o.disconnect();
                    btn.click();
                    window._def = false;
                    window._cb = false;
                }

            } catch (err) {
                console.log('exp-runtime-err:', err);
                window._def = false;
                /*TODO: get account value*/
                setTimeout(_signin_ident, 100, value, window._def_urlId);
            }
        } else {
            /*debugger;*/
            if (!window.location.href.includes(urlId)) {
                console.log('_line-XEI');
            }
        }
    },

    // TODO: get value
    call: "_signin_ident('success.irabor.26', 'https://accounts.google.com/signin/v2/identifier?');"
}

var _signin_pwd = {
    cb: function cb(ml, o) {
        for (var m of ml) {
            if (m.type == 'childList' || m.type == 'attributes') {

                var ids = ['password', 'passwordNext'];
                var match = false;

                for (var id of ids) {
                    if (
                        String(m.target.innerHTML).includes(id) ||
                        String(m.target.outerHTML).includes(id)
                    ) {
                        match = true;
                    }
                }

                if (match) {
                    window._def = false;
                    setTimeout(_signin_pwd, 100, window._def_value, window._def_urlId);
                }
            }
        }
    },

    def: function _signin_pwd(value, urlId) {
        if (!window._def && window.location.href.includes(urlId)) {

            if (!window._cb) {
                _mutationObserver(document, cb);
                window._cb = true;
            }
            
            try {
                window._def = true;
                window._def_value = value;
                window._def_urlId = urlId;

                var div = document.getElementById('password');

                if (div) {
                    var input = div.getElementsByTagName('input')[0];
                } else {
                    console.log("lineX-runtime-err: 'password' not found!");
                }

                if (input) {
                    input.onmouseenter;
                    input.click();
                    input.value = value;

                    var btn = document.getElementById('passwordNext');

                    if (btn) {
                        if (btn.onmouseenter) {
                            btn.onmouseenter();
                        }

                        console.log('_line-XEC');
                        window.o.disconnect();
                        btn.click();
                        window._def = false;
                        window._cb = false;
                    }
                }

            } catch (err) {
                console.log('lineX-runtime-err:', err);
                window._def = false;
                setTimeout(_signin_pwd, 100, value, urlId);
            }
        } else {
            if (!window.location.href.includes(urlId)) {
                console.log('_line-XEI');
            }
        }
    }, // TODO: get value

    call: "_signin_pwd('GnssSbrr1I%', 'https://accounts.google.com/signin/v2/sl/pwd?');"
}

var _signin_chooser = {
    cb: function cb(ml, o) {
        for (var m of ml) {
            if (m.type == 'childList' || m.type == 'attributes') {

                var ids = ['TnvOCe'];
                var match = false;

                for (var id of ids) {
                    if (
                        String(m.target.innerHTML).includes(id) ||
                        String(m.target.outerHTML).includes(id)
                    ) {
                        match = true;
                    }
                }

                if (match) {
                    window._def = false;
                    setTimeout(_signin_chooser, 100, window._def_value, window._def_urlId);
                }
            }
        }
    },

    def: function _signin_chooser(text, urlId) {
        /*var comp = [urlId, window.location.href];
        console.log('lineX:', comp);
        debugger;*/


        if (!window._def && window.location.href.includes(urlId)) {

            if (!window._cb) {
                _mutationObserver(document, cb);
                window._cb = true;
            }

            try {
                window._def = true;
                window._def_value = text;
                window._def_urlId = urlId;

                var coll = document.getElementsByClassName('TnvOCe');

                for (i = 0; i < coll.length; i++) {
                    if (coll[i].innerText.indexOf(text) != -1) {
                        /*debugger;*/

                        console.log('_line-XEC');
                        window.o.disconnect();
                        coll[i].click();
                        window._def = false;
                        window._cb = false;
                        break;
                    }
                }
            } catch (err) {
                console.log('lineX-runtime-err:', err);
                window._def = false;
                setTimeout(_signin_chooser, 100, text, urlId);
            }
        } else {
            if (!window.location.href.includes(urlId)) {
                console.log('_line-XEI');
            }
        }
    },

    call: "_signin_chooser('@gmail.com', 'https://accounts.google.com/ServiceLogin/signinchooser?');"
}

var _signin_opt = {
    cb: function cb(ml, o) {
        for (var m of ml) {
            if (m.type == 'childList' || m.type == 'attributes') {

                var ids = ['O0WRkf'];
                var match = false;

                for (var id of ids) {
                    if (
                        String(m.target.innerHTML).includes(id) ||
                        String(m.target.outerHTML).includes(id)
                    ) {
                        match = true;
                    }
                }

                if (match) {
                    window._def = false;
                    setTimeout(_signin_opt, 100, window._def_urlId);
                }
            }
        }
    },

    def: function _signin_opt(urlId) {
        if (!window._def && window.location.href.includes(urlId)) {

            if (!window._cb) {
                _mutationObserver(document, cb);
                window._cb = true;
            }


            try {
                window._def = true;
                window._def_urlId = urlId;

                var x;
                var coll = document.getElementsByClassName('O0WRkf');

                for (i = 0; i < coll.length; i++) {
                    if (coll[i].innerText == 'DONE') {
                        x = coll[i];
                        break;
                    }
                }

                if (x) {
                    x.onclick;
                    console.log('_line-XEC');
                    window.o.disconnect();
                    x.click();
                    window._def = false;
                    window._cb = false;
                } else {
                    console.log("lineX-runtime-err: 'O0WRkf' not found!");
                }
                
            } catch (err) {
                console.log('lineX-runtime-err:', err);
                window._def = false;
                setTimeout(_signin_opt, 100, urlId);
            }
        } else {
            if (!window.location.href.includes(urlId)) {
                console.log('_line-XEI');
            }
        }
    },

    call: '_signin_opt("https://myaccount.google.com/signinoptions/recovery-options-collection?");'
}

var _home = {
    cb: function cb(ml, o) {
        for (var m of ml) {
            if (m.type == 'childList' || m.type == 'attributes') {

                var ids = ['sj-search-box-1', 'input'];
                var match = false;

                for (var id of ids) {
                    if (
                        String(m.target.innerHTML).includes(id) ||
                        String(m.target.outerHTML).includes(id)
                    ) {
                        match = true;
                    }
                }

                if (match) {
                    window._def = false;
                    setTimeout(_home, 100, window._def_value, window._def_urlId);
                }
            }
        }
    },

    def: function _home(value, urlId) {
        /*debugger;*/
        if (!window._def && window.location.href.includes(urlId)) {

            if (!window._cb) {
                _mutationObserver(document, cb);
                window._cb = true;
            }

            try {
                window._def = true;
                window._def_value = value;
                window._def_urlId = urlId;

                var coll = document.getElementsByClassName('sj-search-box-1');

                if (coll.length) {
                    var search = coll[0];

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

                    if (input) {
                        input.value = value;
                        input.dispatchEvent(ie);

                        var ke = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            code: 'Enter',
                            charCode: 13,
                            keyCode: 13
                        });

                        console.log('_line-XEC');
                        window.o.disconnect();
                        search.dispatchEvent(ke);
                        window._def = false;
                        window._cb = false;
                    } else {
                        console.log("lineX-runtime-err: 'input' not found!");
                    }
                    
                } else {
                    console.log("lineX-runtime-err: 'sj-search-box-1' not found!");
                }

            } catch (err) {
                console.log('lineX-runtime-err:', err);
                window._def = false;
                setTimeout(_home, 100, value, urlId);
            }
        } else {
            if (!window.location.href.includes(urlId)) {
                console.log('_line-XEI');
            }
        }
    },

    call: "_home('sbtrkt', 'https://play.google.com/music/listen#/home');"
}

var _sr = {
    cb: function cb(ml, o) {
        for (var m of ml) {
            if (m.type == 'childList' || m.type == 'attributes') {

                var ids = ['material-card'];
                var match = false;

                for (var id of ids) {
                    if (
                        String(m.target.innerHTML).includes(id) ||
                        String(m.target.outerHTML).includes(id)
                    ) {
                        match = true;
                    }
                }

                if (match) {
                    window._def = false;
                    setTimeout(_sr, 100, window._def_value, window._def_urlId);
                }
            }
        }
    },

    def: function _sr(text, urlId) {
        /*debugger;*/
        if (!window._def && window.location.href.includes(urlId)) {

            if (!window._cb) {
                if (typeof (window.o) != 'undefined') {
                    delete window.o;
                }
                _mutationObserver(document, cb);
                window._cb = true;
            }

            try {
                window._def = true;
                window._def_value = text;
                window._def_urlId = urlId;

                var coll = document.getElementsByClassName('material-card');

                for (i = 0; i < coll.length; i++) {
                    if (coll[i].innerText.indexOf(text) != -1) {

                        console.log('_line-XEC');

                        window.o.disconnect();
                        coll[i].click();
                        window._def = false;
                        window._cb = false;
                        break;
                    }
                }
            } catch (err) {
                console.log('lineX-runtime-err:', err);
                window._def = false;
                setTimeout(_sr, 100, text, urlId);
            }
        } else {
            if (!window.location.href.includes(urlId)) {
                console.log('_line-XEI');
            }
        }
    },

    call: "_sr('SBTRKT', 'https://play.google.com/music/listen#/sr');"
}

var _artist = {
    cb: function cb(ml, o) {
        for (var m of ml) {
            if (m.type == 'childList' || m.type == 'attributes') {

                var ids = ['title'];
                var match = false;

                for (var id of ids) {
                    if (
                        String(m.target.innerHTML).includes(id) ||
                        String(m.target.outerHTML).includes(id)
                    ) {
                        match = true;
                    }
                }

                if (match) {
                    window._def = false;
                    setTimeout(_artist, 100, window._def_value, window._def_urlId);
                }
            }
        }
    },

    def: function _artist(album, urlId) {
        if (!window._def && window.location.href.includes(urlId)) {

            if (!window._cb) {
                _mutationObserver(document, cb);
                window._cb = true;
            }

            try {
                window._def = true;
                window._def_value = album;
                window._def_urlId = urlId;

                var coll = document.getElementsByClassName('title');

                for (i = 0; i < coll.length; i++) {
                    if (coll[i].innerText == album) {

                        console.log('_line-XEC');
                        window.o.disconnect();
                        coll[i].click();
                        window._def = false;
                        window._cb = false;
                        break;
                    }
                }
            } catch (err) {
                console.log('lineX-runtime-err:', err);
                window._def = false;
                setTimeout(_artist, 100, album, urlId);
            }
        } else {
            if (!window.location.href.includes(urlId)) {
                console.log('_line-XEI');
            }
        }
    },

    call: "_artist('Wonder Where We Land', 'https://play.google.com/music/listen#/artist');"
}

var _album = {
    cb: function cb(ml, o) {
        if (!window._eval_end) {
            for (var m of ml) {
                if (m.type == 'childList' || m.type == 'attributes') {

                    var ids = ['column-content', 'hover-button'];
                    var match = false;

                    for (var id of ids) {
                        if (
                            String(m.target.innerHTML).includes(id) ||
                            String(m.target.outerHTML).includes(id)
                        ) {
                            match = true;
                            if (!window._eval_end) {
                                break;
                            }
                        }
                    }

                    if (match) {
                        if (!window._eval_end) {
                            window._def = false;
                            setTimeout(_album, 100, window._def_value, window._def_urlId);
                        }
                    }
                }
            }
        }
    },

    def: function _album(track, urlId) {
        window._eval_end = false;
        /*debugger;*/
        if (!window._def && window.location.href.includes(urlId)) {

            if (!window._cb) {
                _mutationObserver(document, cb);
                window._cb = true;
            }

            try {
                window._def = true;
                window._def_value = track;
                window._def_urlId = urlId;


                var coll = document.getElementsByClassName('column-content');

                for (i = 0; i < coll.length; i++) {
                    if (coll[i].innerText.indexOf(track) != -1) {
                        coll[i].click();
                        coll[i].click();

                        coll = document.getElementsByClassName('hover-button');

                        if (coll.length) {

                            window._eval_end = true;
                            coll[0].click();
                            coll[0].click();

                            console.log('_line-XEC');
                            /*window._def = false;
                            window._cb = false;*/
                            window.o.disconnect();
                            break;
                        } else {
                            console.log("lineX-runtime-err: 'hover-button' not found!");
                        }

                        break;
                    }
                }
            } catch (err) {
                console.log('lineX-runtime-err:', err);
                window._def = false;
                setTimeout(_album, 100, track, urlId);
            }
        } else {
            if (!window.location.href.includes(urlId)) {
                console.log('_line-XEI');
            }
        }
    },

    call: "_album('NEW DORP. NEW YORK', 'https://play.google.com/music/listen#/album');"
}


function _mutationObserver(t, cb) {
    // cb takes ml, o
    var target = t;

    var config = {
        attributes: true,
        childList: true,
        subtree: true
    };

    var callback = cb;

    var observer = new MutationObserver(cb);
    /*debugger;*/
    if (typeof(window.o) == 'undefined') {
        window.o = observer;
        observer.observe(target, config);
    }
}

function _addForeach(o) {
    o.foreach = function (cb) {
        var keys = Object.keys(this)

        if (keys.length) {
            for (i = 0; i < keys.length; i++) {
                cb(this[keys[i]]);
            }
        }
    }
}



function getExp(o) {
    comps = [];

    if (o.cb) {
        //o.call = "_mutationObserver(document, cb); " + o.call;

        comps = [
            String(o.def),
            String(o.cb),
            String(_mutationObserver),
            String(_addForeach),
            //"_mutationObserver(document, cb);",
            o.call
        ];
        
    } else {
        comps = [
            String(o.def),
            String(o.call)
        ];
    }

    script = '';

    for (var c of comps) {
        script += c + ' ';
    }

    return script;
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

exports.app = {
    name: 'Google Play Music',
    /*
     * include url identifiers in evaluator array
     */
    init: function () {
        var listener = {
            'name': 'init',
            'event': 'Network.responseReceived',
            'callback': function (frame) {
                var seq = global.apps.getCurrentApp();
                var url = frame.response.url;

                for (var i = 0; i < seq.length; i++) {
                    if (seq[i].url == url) {
                        
                    }
                }
            }
        }
        global.listeners.add(listener.event, listener);
    },
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
                            global.templates.request[service] = frame.params.request;

                            var l = {
                                'id': id, //global
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

                                        global.listeners.add('result', {
                                            'id': id++,
                                            'event': 'result',
                                            'service': service,
                                            'callback': function (frame) {
                                                if (frame.result) {
                                                    templates.response[this.service] = JSON.parse(String(frame.result.body).replace('\n', ''));
                                                    console.log(templates);
                                                } else {
                                                    console.log('getResponseBody-error:', frame);
                                                }
                                            }
                                        });

                                        sendCommand(msg);
                                    }
                                }
                            }
                            global.listeners.add(l.event, l);
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


//apps.add(app);

// TODO: clear listeners and load next app sequence