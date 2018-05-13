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
        var query = Url.parse(_request.url, true).query;
        var a = parseInt(query["a"]);
        var b = parseInt(query["b"]);
        for (var key in query)
            console.log(query[key]);
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.write("Ich habe dich gehört<br/>");
        _response.write("Query1:3<br/>");
        _response.write("Query1:5<br/>");
        _response.write("Das Ergebnis ist: " + (a + b));
        _response.end();
    }
})(Server || (Server = {}));
//# sourceMappingURL=Server.js.map