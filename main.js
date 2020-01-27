// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var ftp = require('basic-ftp');

let config;

// Configure our HTTP server to respond with Hello World to all requests.
/*var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end();
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(3025);*/

// Put a friendly message on the terminal
//console.log("Server running at http://127.0.0.1:3025/");
setInterval(CheckForNewVersion, 5000);

function GetUpdaterConfig()
{
    fs.readFile('/home/pi/NAPS/UpdaterConfig.json', (err, data) => {
        if (err) throw err;
        //console.log(data.toString());
        config = JSON.parse(data.toString());
        //console.log(config);
    })
}

// Checks the FTP server version file against the locally installed version.
async function CheckForNewVersion() {
    config = GetUpdaterConfig();
    await new Promise(r => setTimeout(r, 500));

    var currVersion = await GetFTPServerVersion();
    var installedVersion = await GetInstalledVersion();

    console.log('Latest version is ' + currVersion);
    console.log('Installed version is ' + installedVersion);

    if (currVersion == installedVersion) {
        return;
        }
    // If we got here, it's time to update.
    await GetUpdatedVersion();

}

async function GetFTPServerVersion() {
    var currentVersion = "";

    var Client = require('ftp');

    var c = new Client();
    var clientConfig = {
        host: config.FtpHost,
        port: config.FtpPort,
        user: config.User,
        password: config.Password
    };

    c.connect(clientConfig);
    var path = "";
    path = path.concat(config.RemoteDir, config.VersionFilePath);
    c.get(path, false, function (err, responseStream) {
        if (err) throw err;

        var content = '';
        responseStream.on('data', function (chunk)
        {
            content += chunk.toString();
            //console.log(content);
        });
        responseStream.on('end', function ()
        {
            //console.log(content);

             JSON.parse(content, function(key, value){
                 if(key == "Version")
                     currentVersion = value;
             });
        });
        //console.log(content.toString());

    })
    c.end();
    await new Promise(r => setTimeout(r, 500));

    return currentVersion;
}

async function GetInstalledVersion() {
    var installedVersion = "Not Found";

    console.log("Got here");

    var path = "";
    path = path.concat(config.LocalDir, config.VersionFilePath);

    try{
    fs.readFile(path, (err, data) => {
        if (err) throw err;
        //console.log(data.toString());
        var versionJson = JSON.parse(data.toString(), function (key, value) {
            if (key == "Version")
                installedVersion = value;
        });
    });
}
catch{
        // Weep.
}

    await new Promise(r => setTimeout(r, 500));

    return installedVersion;
}

async function GetUpdatedVersion() {
    var client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: config.FtpHost,
            port: config.FtpPort,
            user: config.User,
            password: config.Password
        })

        console.log(await client.list())
        await client.downloadToDir(config.LocalDir, config.RemoteDir)
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}



