
var 
imageToDataURI = require( './toDataURI' ),
server = require( 'server' ),
DOMURL = window.URL || window.webkitURL || window


module.exports = function( svg, callback ) {
    var 
    data = svg.outerHTML,
    blob = new Blob( [ data ], { type: 'image/svg+xml;charset=utf-8' } ),
    url = DOMURL.createObjectURL( blob )

    server.emit( 'debug', 'image turned into blob' );

    imageToDataURI( url, callback )

    svg = null
    data = null
    blob = null
    url = null // try to free up some memory
}