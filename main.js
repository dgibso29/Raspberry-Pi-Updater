// Load the http module to create an http server.
var http = require('http');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end();
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(3025);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:3025/");
setInterval(CheckForNewVersion, 60000);


// Checks the FTP server version file against the locally installed version.
function CheckForNewVersion() {

    var currVersion = GetFTPServerVersion();
    var installedVersion = GetInstalledVersion();

    if(currVersion == installedVersion)
    {
        return;
    }
    // If we got here, it's time to update.
}

function GetFTPServerVersion()
{
    var currentVersion = "";

    var Client = require('ftp');

    var c = new Client();
    c.on('ready', function() {
        c.list(function(err, list) {
            if (err) throw err;
            console.dir(list);
            c.end();
        });
    });
    // connect to localhost:21 as anonymous
    c.connect('10.146.0.110', 21, 'Fluid', 'Password1!');
    c.get()
    c.end();

    return currentVersion;
}

function GetInstalledVersion()
{
    var installedVersion = "";

    return installedVersion;
}

function GetUpdatedVersion()
{
    var Client = require('ftp');

    var c = new Client();
    c.on('ready', function() {
        c.list(function(err, list) {
            if (err) throw err;
            console.dir(list);
            c.end();
        });
    });
    // connect to localhost:21 as anonymous
    c.connect();

    c.end();
}

