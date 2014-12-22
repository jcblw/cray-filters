
var server = require( 'server' )

server.emit( 'debug', 'Client scripts started in debug mode' )

require( './' )

window.addEventListener( 'error', function( err ) {
    server.emit( 'debug', 'Error occured', err.message, err.stack );
} )