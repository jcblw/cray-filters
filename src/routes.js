var merge = require( 'merge' ),
    Guid = require( 'guid' ),
    fs = require( 'fs' ),
    html = require( './html'),
    bus = require( './bus' ),
    launcher = require( './launcher' )


function errorRes ( res, err, code ) {
    res.writeHead( code || 500, {
        'Content-Type': 'text/plain',
    })
    res.end( err.message )
}

module.exports = function ( options ) {
    var hook = new RegExp( '^' + options.endpoint );
    return [
        [
            /^\/~DONE/, 
            function( req, res ){    
                var value = ''
                req.on( 'data', function( data ) {
                    value += data.toString('utf8')
                } )
                req.on( 'end', function( ) {
                    bus.emit( req.query.guid, value )
                    res.end( "GOOD JOB" )
                } )
                return
            }
        ],
        [
            /^\/bundle\.js$/, 
            function( req, res ){    
                fs.createReadStream( 'client/bundle.js')
                    .on( 'error', function( err ) {
                        errorRes( res, err )
                    })
                    .pipe( res )
            }
        ],
        [
            /^\/favicon\.ico$/, 
            function( req, res ){    
                fs.createReadStream( 'client/favicon.ico')
                    .on( 'error', function( err ) {
                        errorRes( res, err )
                    })
                    .pipe( res )
            }
        ],
        [
            hook, 
            function( req, res ){  
                var guid = Guid.raw() 
                if ( req.query.photo && /:\/\//.test( req.query.photo ) && /\.(gif|jpg|jpeg|png)$/.test( req.query.photo ) ) {
                    html.render( {
                        guid: guid,
                        photo: req.query.photo
                    }, function( err, html ) {
                        if ( err ) return errorRes( res, err )
                        res.writeHead( 200, {
                            'Content-Type': 'text/html',
                        })
                        res.end( html )
                    } )
                    return
                }
                errorRes( res, new Error( 'Invalid Image' ), 400 )
            }
        ],
        [
            /.*/, 
            function( req, res ) {
                if ( req.query.photo && /:\/\//.test( req.query.photo ) && /\.(gif|jpg|jpeg|png)$/.test( req.query.photo ) ) {
                    launcher( merge( true, {}, {
                        photo: req.query.photo
                    }, options ), function( err, resp ) {
                        if ( err ) return errorRes( res, err )
                        res.writeHead(200, {
                                'Cache-Control': 'public, max-age=604800000', // one week
                                'Content-Type': resp.contentType,
                                'Time Spent': resp.timeSpent 
                            })
                        res.end( resp.data )
                    } )
                    return
                }
                errorRes( res, new Error( 'Not Found' ), 404 )
            }
        ]
    ]
}