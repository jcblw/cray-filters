
var 
server = require( 'server' ),
convert = require( './convert' )

function convertImage( content, session, ts ) {
    return function( ) {

        server.emit( 'debug', 'converting image' );

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

            uri = null
            content = null // try to free up some memory
            document.location.reload()
        } )        

        content.innerHTML = '' // clear content out
    }
}   

function onImageStart( options ) {

    server.emit( 'debug', 'image request received ' + options.session );

    var 
    ts = +new Date(),
    content = document.createElement( 'div' )

    content.innerHTML = options.image
    document.body.appendChild( content )

    setTimeout( convertImage( content, options.session, ts ), 0 )

    options = null // try to free up some memory
}

server.on( 'image:start', onImageStart )
server.emit( 'ready' );
