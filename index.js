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

browser.on( 'error', function( err ) {
    console.log( err );
} )

browser.once( 'connection', function( ) {
    process.stdout.write( 'browser connection established \r\n' )
    browser.browser.on( 'exit', process.exit.bind( process ) )
} )

if ( process.env.DEBUG ) {
    browser.on( 'debug', function( ) {
        console.log.apply( console, arguments );
    } )
    browser.require( './client/debug' );
    return
}

browser.require( './client' );