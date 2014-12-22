var 
http = require( 'http' ),
RunInBrowser = require( 'run-in-browser' ),
requests = require( './src/request' ),
routes = require( './src/routes' ),
bus = require( './src/bus' ),
port = process.env.PORT || 3000,
options = {
    port: process.env.PORT || 3000,
    timeout: 7000
},
server = http.createServer( requests( options ) ),
browser = new RunInBrowser( {
    port: 4000,
    headless: true,
    browser: 'chrome'
} )

options.browser = browser

requests.routes( routes( options ) )
server.listen( options.port )
console.log( 'Server listening on port ' + options.port )

browser.on( 'image:done', function( data ) {
    
    var session = data.session,
        err = data.error

    bus.emit( session + ':done' , data.error, data.image );
} )

browser.once( 'connection', function( ) {
    browser.browser.on( 'exit', process.exit.bind( process ) )
} )

browser.require( './client' );