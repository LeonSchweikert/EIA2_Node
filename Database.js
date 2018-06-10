"use strict";
const Mongo = require("mongodb");
console.log("Database starting");
let databaseURL = "mongodb://localhost:27017";
let databaseName = "Test";
let db;
let students;
// wenn wir auf heroku sind...
if (process.env.NODE_ENV == "production") {
    //    databaseURL = "mongodb://username:password@hostname:port/database";
    databaseURL = "mongodb://testuser:testpasswort1@ds141720.mlab.com:41720/leoneia";
    databaseName = "leoneia";
}
// handleConnect wird aufgerufen wenn der Versuch, die Connection zur Datenbank herzustellen, erfolgte
Mongo.MongoClient.connect(databaseURL, handleConnect);
function handleConnect(_e, _db) {
    if (_e)
        console.log("Unable to connect to database, error: ", _e);
    else {
        console.log("Connected to database!");
        db = _db.db(databaseName);
        students = db.collection("students");
    }
}
function insert(_doc) {
    students.insertOne(_doc, handleInsert);
}
exports.insert = insert;
function handleInsert(_e) {
    console.log("Database insertion returned -> " + _e);
}
function findAll(_callback) {
    var cursor = students.find();
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
    var myCursor = students.find({ "matrikel": searchedMatrikel }).limit(1);
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
            _callback("No Match");
        }
    }
}
exports.findStudent = findStudent;
//# sourceMappingURL=Database.js.map