
var server = require( 'server' );

// converts a URL of an image into a dataURI
module.exports = function (url, mimeType, cb) {
    // Create an empty canvas and image elements
    var canvas = document.createElement('canvas'),
        img = document.createElement('img');

    if ( typeof mimeType === 'function' ) {
        cb = mimeType;
        mimeType = null;
    }

    mimeType = mimeType || 'image/png';

    // allow for cross origin that has correct headers
    img.crossOrigin = "Anonymous"; 

    img.onload = function () {
        
        server.emit( 'debug', 'image loaded' );
        var ctx = canvas.getContext('2d');
        // match size of image
        canvas.width = img.width;
        canvas.height = img.height;

        // Copy the image contents to the canvas
        ctx.drawImage(img, 0, 0);

        // Get the data-URI formatted image
        cb( null, canvas.toDataURL( mimeType ) );
    };

    img.onerror = function ( err ) {
        server.emit( 'debug', err );
        cb(new Error('FailedToLoadImage'));
    };

    // canvas is not supported
    if (!canvas.getContext) {
        cb(new Error('CanvasIsNotSupported'));
    } else {
        server.emit( 'debug', 'loading image' );
        img.src = url;
    }
};
