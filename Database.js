"use strict";
const Mongo = require("mongodb"); //Daten von MongoDB empfangen
console.log("Database starting");
let databaseURL = "mongodb://localhost:27017"; //local host port
let databaseName = "Test";
let db;
let accounts; //neue Datens�tze in Form von Accounts werden Collection hinzugef�gt
if (process.env.NODE_ENV == "production") {
    databaseURL = "mongodb://testuser:testpasswort1@ds141720.mlab.com:41720/leoneia"; //url mlab mit Passwort und Benutzername
    databaseName = "leoneia"; //name der Database auf Mlab
}
Mongo.MongoClient.connect(databaseURL, handleConnect); //connection zu Database erstellen
function handleConnect(_e, _db) {
    if (_e)
        console.log("Unable to connect to database, error: ", _e);
    else {
        console.log("Connected to database!");
        db = _db.db(databaseName);
        accounts = db.collection("students");
    }
}
function insert(_doc) {
    accounts.insertOne(_doc, handleInsert);
}
exports.insert = insert;
function handleInsert(_e) {
    console.log("Database insertion returned -> " + _e);
}
function findAll(_callback) {
    var cursor = accounts.find();
    cursor.toArray(prepareAnswer);
    function prepareAnswer(_e, studentArray) {
        if (_e) {
            _callback("Error" + _e);
        }
        else {
            let line = "";
            for (let i = 0; i < studentArray.length; i++) {
                line += studentArray[i].matrikel + ": " + studentArray[i].studiengang + ", " + studentArray[i].name + ", " + studentArray[i].firstname + ", " + studentArray[i].age + ", ";
                line += studentArray[i].gender ? "(M)" : "(F)";
                line += "\n";
            }
            _callback(line);
        }
    }
}
exports.findAll = findAll;
function findStudent(searchedMatrikel, _callback) {
    var myCursor = accounts.find({ "matrikel": searchedMatrikel }).limit(1);
    myCursor.next(prepareStudent);
    function prepareStudent(_e, studi) {
        if (_e) {
            _callback("Error" + _e);
        }
        if (studi) {
            let line = studi.matrikel + ": " + studi.studiengang + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + ", ";
            line += studi.gender ? "(M)" : "(F)";
            _callback(line);
        }
        else {
            _callback("No Match"); //falls gesuchte Matrikel und Datensatz nicht �bereinstimmen
        }
    }
}
exports.findStudent = findStudent;
//# sourceMappingURL=Database.js.map