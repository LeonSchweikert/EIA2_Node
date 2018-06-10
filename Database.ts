
import * as Mongo from "mongodb";   //Daten von MongoDB empfangen
console.log("Database starting");

let databaseURL: string = "mongodb://localhost:27017";  //local host port
let databaseName: string = "Test";
let db: Mongo.Db;
let accounts: Mongo.Collection;   //neue Datensätze in Form von Accounts werden Collection hinzugefügt

if (process.env.NODE_ENV == "production") {
    
    databaseURL =  "mongodb://testuser:testpasswort1@ds141720.mlab.com:41720/leoneia";   //url mlab mit Passwort und Benutzername
 
    databaseName = "leoneia";   //name der Database auf Mlab
}


Mongo.MongoClient.connect(databaseURL, handleConnect);   //connection zu Database erstellen

function handleConnect(_e: Mongo.MongoError, _db: Mongo.Db): void {
    if (_e)
        console.log("Unable to connect to database, error: ", _e);
    else {
        console.log("Connected to database!");
        db = _db.db(databaseName);
        accounts = db.collection("students");
    }
}

export function insert(_doc: Studi): void {  //insert der Arrays mit Daten
    accounts.insertOne(_doc, handleInsert);
}

function handleInsert(_e: Mongo.MongoError): void {
    console.log("Database insertion returned -> " + _e);
}

export function findAll(_callback: Function): void {
    var cursor: Mongo.Cursor = accounts.find();
    cursor.toArray(prepareAnswer);

    function prepareAnswer(_e: Mongo.MongoError, studentArray: Studi[]): void {
        if (_e) {
            _callback("Error" + _e);
        } else {
            let line: string = "";
            for (let i: number = 0; i < studentArray.length; i++) {
                line += studentArray[i].matrikel + ": " + studentArray[i].studiengang + ", " + studentArray[i].name + ", " + studentArray[i].firstname + ", " + studentArray[i].age + ", ";
                line += studentArray[i].gender ? "(M)" : "(F)";
                line += "\n";
            }
            _callback(line);
        } 
    }
}

export function findStudent(searchedMatrikel: number, _callback: Function): void {
    
    
    var myCursor: Mongo.Cursor = accounts.find({ "matrikel": searchedMatrikel }).limit(1);
    myCursor.next(prepareStudent);

    
    function prepareStudent(_e: Mongo.MongoError, studi: Studi): void {
        if (_e) {
            _callback("Error" + _e);
        }

        if (studi) {
            let line: string = studi.matrikel + ": " + studi.studiengang + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + ", ";
            line += studi.gender ? "(M)" : "(F)";
            _callback(line);
        } else {
            _callback("No Match");   //falls gesuchte Matrikel und Datensatz nicht übereinstimmen
        }
    }
}