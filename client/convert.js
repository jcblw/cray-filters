
var 
imageToDataURI = require( 'image-to-data-uri' ),
DOMURL = window.URL || window.webkitURL || window


module.exports = function( svg, callback ) {
    var 
    data = svg.outerHTML,
    blob = new Blob( [ data ], { type: 'image/svg+xml;charset=utf-8' } ),
    url = DOMURL.createObjectURL( blob )

    imageToDataURI( url, callback );
}