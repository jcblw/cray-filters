
var 
server = require( 'server' ),
convert = require( './convert' )

server.on( 'image:start', function ( options ) {


    server.emit( 'debug', 'image request received ' + options.session );

    var 
    ts = +new Date()
    content = document.createElement( 'div' )

    content.innerHTML = options.image
    document.body.appendChild( content )

    convert( content.getElementsByTagName( 'svg' )[ 0 ], function( err, uri ) {

        content.remove()

        server.emit( 'debug', 'image converted ' + options.session );

        server.emit(  'image:done', {
            session: options.session, 
            error: err,
            image: {
                contentType: 'image/png',
                timeSpent: +new Date() - ts,
                data: uri
            } 
        } );
    } )
} )