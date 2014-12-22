var 
merge = require( 'merge' ),
Guid = require( 'guid' ),
fs = require( 'fs' ),
photo = require( './photo' )

function errorRes ( res, err, code ) {
    res.writeHead( code || 500, {
        'Content-Type': 'text/plain',
    })
    res.end( err.message )
}

module.exports = function ( options ) {
    var browser = options.browser;
    return [
        [
            /.*/, 
            function( req, res ) {
                var 
                session = Guid.raw(), 
                ts = +new Date()

                if ( req.query.photo && /:\/\//.test( req.query.photo ) && /\.(gif|jpg|jpeg|png)$/.test( req.query.photo ) ) {    
                    
                    // should abstract this
                    photo.make( {
                        session: session,
                        photo: req.query.photo,
                        browser: browser 
                    }, function( err, resp ) {
                        if ( err ) return errorRes( res, err );

                        res.writeHead(200, {
                            'Cache-Control': 'public, max-age=604800000', // one week
                            'Content-Type': resp.contentType,
                            'Time Spent Browser': resp.timeSpent,
                            'Time Spent Total': +new Date() - ts
                        } )
                        res.end( resp.image )
                    } )
                    return
                }

                if ( req.url === '/' ) {
                    req.url = '/index.html';
                }

                fs.exists( process.cwd() + '/client/' + req.url, function( exist ) {
                    if ( !exist ) return errorRes( res, new Error( 'Not Found' ), 404 )
                    fs.createReadStream( 'client/' + req.url )
                        .on( 'error', function( err ) {
                            errorRes( res, err )
                        })
                        .pipe( res )

                } )
                
            }
        ]
    ]
}