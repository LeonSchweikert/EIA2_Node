"use strict";
var Http = require("http");
var Url = require("url");
var Server;
(function (Server) {
    var port = process.env.PORT;
    if (port == undefined)
        port = 8100;
    var server = Http.createServer();
    server.addListener("listening", handleListen);
    server.addListener("request", handleRequest);
    server.listen(port);
    function handleListen() {
        console.log("Ich höre?");
    }
    function handleRequest(_request, _response) {
        console.log("Ich höre Stimmen!");
        let query = Url.parse(_request.url, true).query;
        let a = parseInt(query["a"]);
        let b = parseInt(query["b"]);
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.write("Ich habe dich gehört<br/>");
        for (let key in query)
            _response.write("Query-Informationen: " + (query[key]) + "</br>");
        _response.write("Das Ergebnis ist: " + (a + b));
_response.end();
    }
})(Server || (Server = {}));
//# sourceMappingURL=Server.js.map