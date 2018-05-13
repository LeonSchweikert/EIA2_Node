import * as Http from "http";
import * as Url from "url";

namespace Server {
    interface AssocStringString {
        [key: string]: string;
    }

    let port: number = process.env.PORT;
    if (port == undefined)
        port = 8200;

    let server: Http.Server = Http.createServer();
    server.addListener("listening", handleListen);
    server.addListener("request", handleRequest);
    server.listen(port);

    function handleListen(): void {
        console.log("Ich höre?");
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        console.log("Ich höre Stimmen!");

        let query: AssocStringString = Url.parse(_request.url, true).query;
        let a: number = parseInt(query["a"]);
        let b: number = parseInt(query["b"]);   


        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        _response.write("Ich habe dich gehört<br/>");
        for (let key in query) 
        _response.write("Query-Informationen: " + (query[key]) + "</br>");
        _response.write("Das Ergebnis ist: " + (a + b));

        _response.end();
    }
}