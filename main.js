// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var ftp = require('basic-ftp');
var path = require('path');
var appDir = path.dirname(require.main.filename);


CreateFileStructure();
let configs = [];
GetUpdaterConfigs();

// Configure our HTTP server to respond with Hello World to all requests.
/*var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end();
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(3025);*/

// Put a friendly message on the terminal
//console.log("Server running at http://127.0.0.1:3025/");
configs.forEach(c => {
    setInterval(CheckForNewVersion, c.UpdateIntervalMilliseconds, c)
})

//setInterval(CheckForNewVersions, 60000);

function CreateFileStructure()
{
    if(fs.existsSync(appDir + "/Data"))
    {
        return;
    }
    fs.mkdirSync(appDir + "/Data")
}

function GetUpdaterConfigs()
{
    var dirPath = appDir + "/Data/";
    //console.log(dirPath);
    fs.readdirSync(dirPath).forEach(file =>{
        if(file.includes('.json')) {
            //console.log(file);
           var currentConfig = fs.readFileSync(dirPath + file);
           //console.log(currentConfig.toString());
           configs.push(JSON.parse(currentConfig.toString()));
        }
    })

    configs.forEach(c =>{
        console.log(c);
    })


    /*fs.readFile('/home/pi/NAPS/UpdaterConfig.json', (err, data) => {
        if (err) throw err;
        //console.log(data.toString());
        config = JSON.parse(data.toString());
        //console.log(config);
    })*/
}

async function CheckForNewVersions()
{
    for (const c of configs) {
        //console.log(c)
        await CheckForNewVersion(c);
    }
}

// Checks the FTP server version file against the locally installed version.
async function CheckForNewVersion(config) {
    //config = GetUpdaterConfigs();

    console.log("Checking " + config.Application + " for updates...")
    await new Promise(r => setTimeout(r, 500));

    var currVersion = await GetFTPServerVersion(config);
    var installedVersion = await GetInstalledVersion(config);

    console.log('Latest version is ' + currVersion);
    console.log('Installed version is ' + installedVersion);

    if (currVersion == installedVersion) {
        console.log("Current version is latest.\n")
        return;
        }
    console.log("Version mismatch. Fetching newest version.\n")
    // If we got here, it's time to update.
    await GetUpdatedVersion(config);

}

async function GetFTPServerVersion(config) {
    var currentVersion = "";

    var Client = require('ftp');

    var content = '';

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

        responseStream.on('data', function (chunk)
        {
            content += chunk.toString();
            //console.log(content);
        });
        responseStream.on('end', function ()
        {
            //console.log(content);
        });
        //console.log(content.toString());

    })
    c.end();
    await new Promise(r => setTimeout(r, 500));

    JSON.parse(content, function(key, value){
        if(key == "Version")
            currentVersion = value;
    });

    return currentVersion;
}

async function GetInstalledVersion(config) {
    var installedVersion = "Not Found";

    //console.log("Got here");

    var path = "";
    path = path.concat(config.LocalDir, config.VersionFilePath);
    console.log("Path: " + path);

    try{
    fs.readFile(path, (err, data) => {
        //if (err) throw err;
        //console.log(data.toString());
        var versionJson = JSON.parse(data.toString(), function (key, value) {
            if (key == "Version")
                installedVersion = value;
        });
    });
}
catch(err){
    console.log(err);
        // Weep.
}

    await new Promise(r => setTimeout(r, 500));

    return installedVersion;
}

async function GetUpdatedVersion(config) {
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



