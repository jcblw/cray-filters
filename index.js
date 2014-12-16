var http = require( 'http' ),
    requests = require( './src/request' ),
    routes = require( './src/routes' ),
    port = process.env.PORT || 3000,
    options = {
        port: process.env.PORT || 3000,
        endpoint: process.env.HOOK || '/~PROCESS',
        headless: true,
        browser: 'chrome',
        timeout: 7000
    },
    server = http.createServer( requests( options ) );

requests.routes( routes( options ) );

server.listen( options.port );
console.log( 'Server listening on port ' + options.port )
