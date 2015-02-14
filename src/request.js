var 
paths = [],
qs = require( 'querystring' )
    
module.exports = function( options ) {

    return function ( req, res ) {

        var 
        query = qs.parse( ( req.url ).split( '?' ).pop() ),
        ts = Math.floor( ( Math.random() * new Date() ) * 10000 ),
        patharr

        req.query = query
        process.stdout.write( req.method + ' ' + req.url + ' :: ' + req.headers[ 'user-agent' ] + ' \n\r' )

        for( var i = 0; i < paths.length; i++ ) {
            patharr = paths[ i ]
            if ( patharr[ 0 ].test( req.url ) ) {
                patharr[ 1 ]( req,  res )
                return
            }
        }

        res.end( 'NO NOT GOOD' )
    }
}

module.exports.routes = function ( arr ) {
    paths = arr
}