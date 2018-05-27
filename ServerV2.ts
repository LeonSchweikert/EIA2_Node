import * as Http from "http";
import * as Url from "url"; 


namespace ServerResponse {

    interface AssocStringString {       //Interface ist assoziatives Array, Schlüssel vom Typ string lässt auf Strings zugreifen
        [key: string]: string;
    }

    interface Student {
        name: string; 
        firstname: string;
        matrikel: number;
        age: number;
        gender: boolean;
        studiengang: string;
    }

    // assoziatives Array um eine Person mit Matrikel abzuspeichern
    interface Studis {
        [matrikel: string]: Student;
    }
    
    
    let studentAssoc: Studis = {};
    let port: number = process.env.PORT;
    if (port == undefined)
        port = 8100;

    let servererstellen: Http.Server = Http.createServer((_request: Http.IncomingMessage, _response: Http.ServerResponse) => {    //Server wird erstellt
       _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*"); 
    });
    
    servererstellen.addListener("request", handleRequest);
    servererstellen.listen(port);

    
    
    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        
        console.log("Hallo!");
        
        let query: AssocStringString = Url.parse(_request.url, true).query;
        console.log(query["command"]);
        
        if (query["command"] ) {
            switch (query["command"] ) {
                
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
        
        function insert(query: AssocStringString, _response: Http.ServerResponse): void {
            
            let obj: Student = JSON.parse(query["data"]);
            let _name: string = obj.name;
            let _firstname: string = obj.firstname;  
            let matrikel: string = obj.matrikel.toString(); 
            let _age: number = obj.age;
            let _gender: boolean = obj.gender;
            let _studiengang: string = obj.studiengang;  
            let studi: Student;
            
            studi = {
                name: _name,
                firstname: _firstname,
                matrikel: parseInt(matrikel),
                age: _age,
                gender: _gender,
                studiengang: _studiengang
            };  
            
            studentAssoc[matrikel] = studi;
            _response.write("transmission successfull");   //Bei erfolgreicher Datenübermittlung
            }

        function refresh(_response: Http.ServerResponse): void {
            console.log(studentAssoc);
            for (let matrikel in studentAssoc) {  
            let studi: Student = studentAssoc[matrikel];
            let line: string = matrikel + ": ";
            line += studi.studiengang + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Years ";       //Eingegebenen Daten im Feld anzeigen,werden zu vorhanden hinzugefügt
            line += studi.gender ? "(M)" : "(F)"; 
            _response.write(line + "\n");                                          
            }
        } 
        
        function search(query: AssocStringString, _response: Http.ServerResponse): void {              //Suchfunktion
            let studi: Student = studentAssoc[query["searchMat"]];  
                                                                                                //Suche nach Matrikelnummer
            if (studi) {
                let line: string = query["searchMat"] + ": ";
                line += studi.studiengang + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Years ";
                line += studi.gender ? "(M)" : "(F)";
                
                _response.write(line);
            } else {
                _response.write("Not found");    //Falls nicht zutreffende Mat nummer
            }    
        }
        
        function error(): void {
            alert("Something went wrong"); 
        }

        
    
}