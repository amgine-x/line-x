function lx() {
    var WebSocket = require('ws');
    var ws = new WebSocket('ws://localhost:8080');

    ws.on('open', function () {
        var msg = {
            type: 'auth',
            uid: 'unique_id_1234',
            services: [
                'Google Play Music'
            ]
        };
        ws.send(Buffer.from(JSON.stringify(msg)));
    });

    ws.on('message', function (msg) {
        console.log(JSON.parse(msg.toString('utf8')));
    });
}

function cb(ml, o) {
    for (var m of ml) {
        if (m.type == 'type') {
            // types in config
            // enumerated type obj 
            - attributes
            ""
                - childList
            ""
                - subtree
            ""
                - addedNodes
                - attributeName
                - attributeNamespace
                - nextSibling
                - oldValue
                - previousSibling
                - removedNodes
                - target
                - type
                - __proto__(MutationRecord)
            // rest of code here
        }
    }
}


function mutationObserver(t, cb) {
    var target = t;

    var config = {
        attributes: true,
        childList: true,
        subtree: true
    };

	/**
		cb example

		var mocb = function (ml, o) {
			for (var m of ml) {
				if (m.type == 'type') {
					// types in config
					// enumerated type obj 
						- attributes
						""
						- childList
						""
						- subtree
						""
							- addedNodes
							- attributeName
							- attributeNamespace
							- nextSibling
							- oldValue
							- previousSibling
							- removedNodes
							- target
							- type
							- __proto__ (MutationRecord)
					// rest of code here
				}
			}
		} 
	*/
    var callback = cb;

    var observer = new mutationObserver(cb);
    observer.observe(target, config);
}


function addForeach(o) {
    o.foreach = function (cb) {
        var keys = Object.keys(this)

        if (keys.length) {
            for (i = 0; i < keys.length; i++) {
                cb(this[keys[i]]);
            }
        }
    }
}