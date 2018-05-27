"use strict";
const Http = require("http");
const Url = require("url");
var ServerResponse;
(function (ServerResponse) {
    let studentAssoc = {};
    let port = process.env.PORT;
    if (port == undefined)
        port = 8100;
    let servererstellen = Http.createServer((_request, _response) => {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
    });
    servererstellen.addListener("request", handleRequest);
    servererstellen.listen(port);
    function handleRequest(_request, _response) {
        console.log("Hallo!");
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
        _response.end();
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
        studentAssoc[matrikel] = studi;
        _response.write("transmission successfull"); //Bei erfolgreicher Daten�bermittlung
    }
    function refresh(_response) {
        console.log(studentAssoc);
        for (let matrikel in studentAssoc) {
            let studi = studentAssoc[matrikel];
            let line = matrikel + ": ";
            line += studi.studiengang + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Years "; //Eingegebenen Daten im Feld anzeigen,werden zu vorhanden hinzugef�gt
            line += studi.gender ? "(M)" : "(F)";
            _response.write(line + "\n");
        }
    }
    function search(query, _response) {
        let studi = studentAssoc[query["searchMat"]];
        //Suche nach Matrikelnummer
        if (studi) {
            let line = query["searchMat"] + ": ";
            line += studi.studiengang + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Years ";
            line += studi.gender ? "(M)" : "(F)";
            _response.write(line);
        }
        else {
            _response.write("Not found"); //Falls nicht zutreffende Mat nummer
        }
    }
    function error() {
        alert("Something went wrong");
    }
})(ServerResponse || (ServerResponse = {}));
//# sourceMappingURL=ServerV2.js.map