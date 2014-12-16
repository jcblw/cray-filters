
var svg = document.getElementsByTagName( 'svg' )[ 0 ],
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    xhr = require( 'xhr' ),
    qs = require( 'querystring' ),
    DOMURL = window.URL || window.webkitURL || window,
    data = svg.outerHTML,
    img = new Image(),
    svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'}),
    url = DOMURL.createObjectURL(svg),
    query = qs.parse( window.location.search )

function ready() {
    ctx.drawImage(img, 0, 0)
    xhr({
        method: "POST",
        body: canvas.toDataURL("image/png"),
        uri: '/~DONE?guid=' +  query.guid 
    }, function( err ) {
        console.log( 'success' )
    })
}

function fileReady( e ) {
    img.src = e.target.result
}

canvas.width = 400
canvas.height = 400
img.onload = ready
img.onerror = function( err ){
    console.error( err )
}
img.src = url