// Load the http module to create an http server.
var http = require('http');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World\n");
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(3025);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:3025/");


// Checks the FTP server version file against the locally installed version.
function CheckForNewVersion() {
    console.log("Oh boy, this worked!");
}

setInterval(CheckForNewVersion, 60000);
