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
var test = GetFTPServerVersion();

console.log("Got here! Value is " + test);

// Checks the FTP server version file against the locally installed version.
async function CheckForNewVersion() {

    var currVersion = GetFTPServerVersion();
    var installedVersion = GetInstalledVersion();



    if (currVersion == installedVersion) {
        return;
    }
    // If we got here, it's time to update.
}

async function GetFTPServerVersion() {
    var currentVersion = "default value";

    var Client = require('ftp');

    var c = new Client();
    var config = {
        host: "10.146.0.110",
        user: "FCS-DEV02\\Fluid",
        password: "Password1!"
    };

    c.connect(config);
    console.log("huh");
    c.get('LatestProbeVersion/ProbeVersion.json', false, function (err, responseStream) {
        if (err) throw err;
        // console.log(err)
        //responseStream.setEncoding('utf8');
        //
        //console.log(responseStream);
        //
        //
        // console.log("ha ha loser");

        console.log("Okay...")
        var content = '';
        responseStream.on('data', function (chunk)
        {
            content += chunk.toString();
            console.log(content);
        });
        responseStream.on('end', function ()
        {
            console.log(content);

             JSON.parse(content, function(key, value){
                 if(key == "Version")
                     currentVersion == value;
             });

        });
        console.log(content.toString());

    })
    c.end();

    console.log("Wait time?");
    await new Promise(r => setTimeout(r, 2000));
console.log("???SIFJF");
    return currentVersion;
}

function GetInstalledVersion() {
    var installedVersion = "";

    return installedVersion;
}

function GetUpdatedVersion() {
    var Client = require('ftp');

    var c = new Client();
    c.on('ready', function () {
        c.list(function (err, list) {
            if (err) throw err;
            console.dir(list);
            c.end();
        });
    });
    // connect to localhost:21 as anonymous
    c.connect();

    c.end();
}

