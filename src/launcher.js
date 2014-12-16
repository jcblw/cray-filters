var Guid = require( 'guid' ),
    launcher = require('browser-launcher'),
    toBuffer = require( 'data-uri-to-buffer' ),
    bus = require( './bus' )

module.exports = function( opts, callback ) {

    var guid = Guid.raw(),
        ts = +new Date(),
        _timer,
        timeout = opts.timeout || 10000

    launcher(function ( err, launch ) {
        if (err) return callback( err.message )

        var options = {
                headless: opts.headless,
                browser: opts.browser
            },
            url = 'http://localhost:' + opts.port + opts.endpoint + '?photo=' + opts.photo + '&guid=' + guid

        launch( url, options, function (err, ps) {
            if (err) return callback( err.message )
            
            function detach( ) {
                
                clearTimeout( _timer )
                bus.removeAllListeners( guid )
                try {
                    ps.kill( 'SIGKILL' )
                } catch ( e ) { }
            }


            bus.on( guid, function( datauri ) {

                callback( null, {
                    contentType: 'image/png',
                    timeSpent: (+new Date()) - ts,
                    data: toBuffer( datauri ) 
                } )
                detach()
            })

            ps.on( 'error', function( err ) {
                
                callback( err )
                detach()
            } )

            _timer = setTimeout( function( ) {

                callback( new Error( 'TIMEOUT: Browser exceeded to timeout of ' + timeout  ) )
                detach()
            }, timeout )
        })
    })

}