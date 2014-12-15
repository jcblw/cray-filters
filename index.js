var generate = require( './src/generateSVG');
var http = require( 'http' );
var qs = require( 'querystring' );
var webshot = require('webshot');
var datauri = require( 'datauri' );
var request = require( 'request' );
var fs = require( 'fs' );
var launcher = require('browser-launcher');
var port = process.env.PORT || 3000;

var options = {
  screenSize: {
    width: 400, 
    height: 400
  }, 
  shotSize: {
    width: 400, 
    height: 400
  },
  siteType: 'html',
  renderDelay: 100
};


var server = http.createServer( function( req, res ) {

    var query = qs.parse( ( req.url ).split( '?' ).pop() );
    var ts = Math.floor( ( Math.random() * new Date() ) * 10000 );
    process.stdout.write( req.url );
    if ( /^\/screenshot\.js$/.test( req.url ) ) {
        fs.createReadStream( 'src/screenshot.js')
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

        launcher(function (err, launch) {
            if (err) return res.end( err.message );

            var opts = {
                headless: true,
                browser: 'chrome'
            };
            launch('http://localhost:' + port + '/generate?photo=' + query.photo, opts, function (err, ps) {
                if (err) return res.end( err.message );

                ps.stdout.pipe( process.stdout );
                res.end( 'So eventually you get an image')
            });
        });
        return;
    }
    res.end( 'Not a valid image' );
} );

server.listen( process.env.PORT || 3000 );
