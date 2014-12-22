
var 
server = require( 'server' ),
convert = require( './convert' )

server.on( 'image:start', function ( options ) {

    var 
    ts = +new Date()
    content = document.createElement( 'div' )

    content.innerHTML = options.image
    document.body.appendChild( content )

    convert( content.getElementsByTagName( 'svg' )[ 0 ], function( err, uri ) {

        content.remove()

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