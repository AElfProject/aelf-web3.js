// browser
if (typeof window !== 'undefined' && window.XMLHttpRequest) {
    XMLHttpRequest = window.XMLHttpRequest; // jshint ignore: line
// node
} else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest; // jshint ignore: line
}

var XHR2 = require('xhr2-cookies').XMLHttpRequest;


var data = JSON.stringify({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "connect_chain",
    "params": {}
});

// var xhr = new XMLHttpRequest();
var xhr = new XHR2();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        console.log('this.responseText: ', this.responseText);
    }
});

xhr.open("POST", "http://localhost:1234/chain");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "application/json", true);

xhr.send(data);


var http = require("http");

var options = {
    "method": "POST",
    "hostname": "localhost",
    "port": "1234",
    "path": "/chain",
    "headers": {
        "content-type": "application/json",
        "accept": "application/json"
    }
};

var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log('????', body.toString());
    });
});
req.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'connect_chain', params: {} }));
req.end();