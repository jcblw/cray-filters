var generate = require( './src/generateSVG'),
    http = require( 'http' ),
    qs = require( 'querystring' ),
    datauri = require( 'datauri' ),
    request = require( 'request' ),
    fs = require( 'fs' ),
    launcher = require('browser-launcher'),
    port = process.env.PORT || 3000,
    bus = new (require( 'events').EventEmitter )(),
    Guid = require( 'guid' ),
    toBuffer = require('data-uri-to-buffer');

var server = http.createServer( function( req, res ) {

    var query = qs.parse( ( req.url ).split( '?' ).pop() ),
        ts = Math.floor( ( Math.random() * new Date() ) * 10000 );

    process.stdout.write( req.url + '\n\r' );

    if ( /^\/BOTDONEPROCESSING/.test( req.url ) ) {
        if ( query.guid ) {
            var value = '';
            req.on( 'data', function( data ) {
                value += data.toString('utf8');
            } )
            req.on( 'end', function( ) {
                bus.emit( query.guid, value );
                res.end( "BOOP" );
            } )
            return;
        }
    }

    if ( /^\/bundle\.js$/.test( req.url ) ) {
        fs.createReadStream( 'client/bundle.js')
            .on( 'error', function( err ) {
                res.end( err.message );
            })
            .pipe( res );
        return;
    }

    if ( /^\/generate/.test( req.url ) ) {

        if ( query.photo && /:\/\//.test( query.photo ) && /\.(gif|jpg|jpeg|png)$/.test( query.photo ) ) {

            request( query.photo )
                .pipe( fs.createWriteStream( 'tmp/' + ts + '.png' ) )
                .on( 'close', function() {
                    datauri( 'tmp/' + ts + '.png', function( err, content ) {
                        if ( err ) return res.end( err.message );
                        generate( content, function( err, html ) {
                            if ( err ) return res.end( err.message );
                            res.writeHead(200, {
                                'Content-Type': 'text/html',
                            });
                            res.end( html );
                        } )                
                        
                    } );
                } )
            return;
        }
        res.end( 'Not a valid image' );
        return;
    }

    if ( query.photo && /:\/\//.test( query.photo ) && /\.(gif|jpg|jpeg|png)$/.test( query.photo ) ) {

        var _guid = Guid.raw();
        var ts = +new Date()

        launcher(function (err, launch) {
            if (err) return res.end( err.message );

            var opts = {
                headless: false,
                browser: 'firefox'
            };
            launch('http://localhost:' + port + '/generate?photo=' + query.photo + '&guid=' + _guid, opts, function (err, ps) {
                if (err) return res.end( err.message );

                ps.stdout.pipe( process.stdout );

                bus.on( _guid, function( datauri ) {
                    res.writeHead(200, {
                            'Content-Type': 'image/png',
                            'Time Spent': (+new Date()) - ts 
                        });
                    res.end( toBuffer( datauri ) );
                    ps.kill( 'SIGKILL' );
                });
            });
        });
        return;
    }
    res.end( 'NO NOT GOOD' );
} );

server.listen( port );
console.log( 'Server listening on port ' + port )
