
var 
server = require( 'server' ),
convert = require( './convert' )

function convertImage( content, session, ts ) {
    return function( ) {
        convert( content.getElementsByTagName( 'svg' )[ 0 ], function( err, uri ) {

            server.emit( 'debug', 'image converted ' + session );
            content.remove()

            server.emit(  'image:done', {
                session: session, 
                error: err,
                image: {
                    contentType: 'image/png',
                    timeSpent: +new Date() - ts,
                    data: uri
                } 
            } )
        } )        
    }
}   

function onImageStart( options ) {
    server.emit( 'debug', 'image request received ' + options.session );

    var 
    ts = +new Date(),
    content = document.createElement( 'div' )

    content.innerHTML = options.image
    document.body.appendChild( content )

    setTimeout( convertImage( content, options.session, ts ), 0 );
}

server.on( 'image:start', onImageStart )