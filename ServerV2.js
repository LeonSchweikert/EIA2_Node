"use strict";
const Http = require("http");
const Url = require("url");
const Database = require("./Database");
let port = process.env.PORT;
if (port == undefined)
    port = 8200;
let server = Http.createServer();
server.addListener("request", handleRequest);
server.listen(port);
function handleRequest(_request, _response) {
    console.log("Ich h�re Stimmen!");
    let query = Url.parse(_request.url, true).query;
    console.log(query["command"]);
    if (query["command"]) {
        switch (query["command"]) {
            case "insert":
                insert(query, _response);
                break;
            case "refresh":
                refresh(_response);
                break;
            case "search":
                search(query, _response);
                break;
            default:
                error();
        }
    }
}
function insert(query, _response) {
    let obj = JSON.parse(query["data"]);
    let _name = obj.name;
    let _firstname = obj.firstname;
    let matrikel = obj.matrikel.toString();
    let _age = obj.age;
    let _gender = obj.gender;
    let _studiengang = obj.studiengang;
    let studi;
    studi = {
        name: _name,
        firstname: _firstname,
        matrikel: parseInt(matrikel),
        age: _age,
        gender: _gender,
        studiengang: _studiengang
    };
    Database.insert(studi);
    respond(_response, "Daten empfangen");
}
function refresh(_response) {
    Database.findAll(function (json) {
        respond(_response, json);
    });
}
function search(query, _response) {
    let searchedMatrikel = parseInt(query["searchFor"]);
    Database.findStudent(searchedMatrikel, function (json) {
        respond(_response, json);
    });
}
function error() {
    alert("Error");
}
function respond(_response, _text) {
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    _response.write(_text);
    _response.end();
}
//# sourceMappingURL=ServerV2.js.map