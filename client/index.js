
var svg = document.getElementsByTagName( 'svg' )[ 0 ],
    imageToDataURI = require( 'image-to-data-uri' ),
    xhr = require( 'xhr' ),
    qs = require( 'querystring' ),
    DOMURL = window.URL || window.webkitURL || window,
    data = svg.outerHTML,
    svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'}),
    url = DOMURL.createObjectURL(svg),
    query = qs.parse( window.location.search )

imageToDataURI( url, function( err, uri ) {
    xhr({
        method: "POST",
        body: uri,
        uri: '/~DONE?guid=' +  query.guid 
    }, function( err ) {
        console.log( 'success' )
    });
})