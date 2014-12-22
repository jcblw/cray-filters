
var
svg = require( './svg'),
bus = require( './bus' ),
toBuffer = require( 'data-uri-to-buffer' )

module.exports.make = function( options, callback ) {

    var browser = options.browser;

    svg.render( options, function( err, image ) {
        if ( err || !image ) return callback( err || new Error( 'Could not create svg' ) )

        browser.emit( 'image:start', {
            session: options.session,
            image: image
        })

        bus.once( options.session + ':done', function( err, resp ) {
            if ( err ) return callback( err )

            resp.image = toBuffer( resp.data );

            callback( err, resp );
        } )

        // timeout would be good to add back
    } )
}