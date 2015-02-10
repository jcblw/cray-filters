var
request = require( 'request' ),
fs = require( 'fs' ),
datauri = require( 'datauri' )

module.exports.render = function( content, callback ) {
    getSVG( content, function( err, svg ) {
        if ( err ) callback ( err )
        //console.log( svg.toHTML() );
        callback( null, svg ? svg.toHTML() : null );
        //fs.writeFileSync( __dirname + '/../tmp/sample.svg', svg.toHTML() );
    })
}

function getSVG( content, callback ) {
    var file = 'tmp/' + content.session + '.jpg'

    // downloads photo
    request( content.photo )
        .on( 'error', callback )
        .pipe( fs.createWriteStream( file ) )
        .on( 'error', callback )
        .on( 'close', function() {
            
            generateURI( file, function( err, data ) {
                if ( err ) return callback( err );
                hexFilter( data, callback )
                //multicolorFilter( data, callback )
            } )

            
        } )
}

function generateURI( file, callback ) {
    datauri( file, function( err, content ) {
        if ( err ) return callback( err )
        callback( null, content )
        fs.unlink( file )
    } )
}

function hexFilter( bgImage, callback ) {
    var
    vsvg = require( 'vsvg' ),
    paths = require( 'vsvg-paths' ),
    size = 400,
    svg = vsvg.svg,
    path = vsvg.path,
    defs = vsvg.defs,
    pattern = vsvg.pattern,
    image = vsvg.image,
    rect = vsvg.rect,
    filter = vsvg.filter,
    feMerge = vsvg.feMerge,
    feMergeNode = vsvg.feMergeNode,
    feFlood = vsvg.feFlood,
    feColorMatrix = vsvg.feColorMatrix,
    clipPath = vsvg.clipPath,
    hexPath = [
        // { x: 0, y: 200 },
        // { x: 100, y: 25 },
        // { x: 300, y: 25 },
        // { x: 400, y: 200 },
        // { x: 300, y: 375 },
        // { x: 100, y: 375 },
        // {}
        { x: 20, y: 200 },
        { x: 115, y: 45 },
        { x: 285, y: 45 },
        { x: 380, y: 200 },
        { x: 285, y: 355 },
        { x: 115, y: 355 },
        { x: 20, y: 200 },
        {}
    ],
    insideHexPath = [
        { x: 40, y: 200 },// inside hex
        { x: 125, y: 65 },
        { x: 275, y: 65 },
        { x: 360, y: 200 },
        { x: 275, y: 335 },
        { x: 125, y: 335 },
        { x: 40, y: 200 },
        {}
    ];
    callback( null, (
        svg( { xmlns: 'http://www.w3.org/2000/svg', version: '1.1', width: size, height: size, 'shape-rendering': 'crispEdges', 'xmlns:xlink': 'http://www.w3.org/1999/xlink' },
            defs( {},
                pattern( { id: 'bg-image', patternUnits: 'userSpaceOnUse', width: '100%', height: '100%' },
                    image( { 'xlink:href': bgImage, width: '100%', height: '100%', x: 0, y: 0 } )
                ),
                clipPath( { id: 'hex-clip' },
                    path( { d: paths.encode( hexPath ) } )
                ),
                clipPath( { id: 'inside-hex-clip' },
                    path( { d: paths.encode( insideHexPath ) } )
                ),
                filter( { className: 'colorFlood', id: 'hex-filter', x: '0%', y: '0%', width: '100%', height: '100%' },
                    feFlood( { 'flood-color': 'black', result: 'A' } ),
                    feColorMatrix( { type: 'matrix', in: 'SourceGraphic', result: 'B', values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 1 1 0 0' } ),
                    feMerge( {},
                        feMergeNode( { in: 'A' } ),
                        feMergeNode( { in: 'B' } )
                    )
                ),
                filter( { className: 'colorFlood', id: 'hex-filter2', x: '0%', y: '0%', width: '100%', height: '100%' },
                    feFlood( { 'flood-color': '#9ea6ab', result: 'A' } ),
                    feColorMatrix( { type: 'matrix', in: 'SourceGraphic', result: 'B', values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 1 1 0 0' } ),
                    feMerge( {},
                        feMergeNode( { in: 'A' } ),
                        feMergeNode( { in: 'B' } )
                    )
                ),
                filter( { className: 'colorFlood', id: 'hex-filter3', x: '0%', y: '0%', width: '100%', height: '100%' },
                    feFlood( { 'flood-color': 'black', result: 'A' } ),
                    feColorMatrix( { type: 'matrix', in: 'SourceGraphic', result: 'B', values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 1 1 0 0' } ),
                    feMerge( {},
                        feMergeNode( { in: 'A' } ),
                        feMergeNode( { in: 'B' } )
                    )
                )
            ),
            rect( { width: '100%', height: '100%', x: 0, y: 0, fill: 'url(#bg-image)', filter: 'url(#hex-filter)' } ),
            rect( { width: '100%', height: '100%', x: 0, y: 0, fill: 'url(#bg-image)', filter: 'url(#hex-filter2)', style: { 
                'clip-path': 'url(#hex-clip)' 
            } } ),
            rect( { width: '100%', height: '100%', x: 0, y: 0, fill: 'url(#bg-image)' , filter: 'url(#hex-filter3)', style: { 
                'clip-path': 'url(#inside-hex-clip)' 
            } } )
        )
    ) )
}

function multicolorFilter( bgImage, callback ) {
    var
    vsvg = require( 'vsvg' ),
    PerlinNoise = require( 'perlin-simplex' ),
    perlin = new PerlinNoise( ),
    Color = require( 'color' ),
    fs = require( 'fs' ),
    nRows = 15,
    nCols = nRows,
    size = 400,
    noiseDistance = 20,
    zNoiseDistance = 1000,
    colorDistance = 0.5,
    ratio = size / nRows,
    svg = vsvg.svg({
        xmlns: 'http://www.w3.org/2000/svg',
        version: '1.1',
        width: size,
        height: size,
        'shape-rendering': 'crispEdges'
    }),
    defs = vsvg.defs( ),
    pattern = vsvg.pattern({
        id: 'bg-image',
        patternUnits: 'userSpaceOnUse',
        width: '100%',
        height: '100%',
    })
    image = vsvg.image({
        'xlink:href': bgImage,
        width: '100%',
        height: '100%',
        x: 0,
        y: 0
    }),
    bg = vsvg.rect({
        x: 0,
        y: 0,
        width: size,
        height: size,
        fill: 'url(#bg-image)'
    })

    pattern.appendChild( image )
    defs.appendChild( pattern )
    svg.appendChild( defs )
    svg.appendChild( bg )


    var row, column, rect, red, green, blue, color, id

    function rgbValue( n ) {
        return 255 * ( n / 2 + 0.5 )
    }

    for ( column = 0; column < nCols; column++) {

        for( row = 0; row < nRows; row ++ ) {

            var
            x = row / noiseDistance,
            y = column / noiseDistance,
            z = ( row * column ) / zNoiseDistance

            red = rgbValue( perlin.noise3d( x, y, z + colorDistance ) )
            green = rgbValue( perlin.noise3d( x, y, z - colorDistance ) )
            blue = rgbValue( perlin.noise3d( x, y, z ) )

            id = 'filter-'+ row + '-' + column

            color = Color( {
                r: 255 - red,
                g: 255 - green,
                b: 255 - blue
            } )

            var
            filter = vsvg.filter({
                class: 'colorFlood',
                x: '0%',
                y: '0%',
                width: '100%',
                height: '100%',
                id: id
            }),
            feFlood = vsvg.feFlood({
                'flood-color': color.hexString(),
                result: 'A'
            }),
            feColorMatrix = vsvg.feColorMatrix({
                type: 'matrix',
                in: 'SourceGraphic',
                result: 'B',
                values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 1 1 0 0'
            }),
            feMerge = vsvg.feMerge({}),
            feMergeNode0 = vsvg.feMergeNode({
                in: 'A'
            }),
            feMergeNode1 = vsvg.feMergeNode({
                in: 'B'
            }),
            rect = vsvg.rect({
                x: ( column * ratio ),
                y: ( row * ratio ),
                width: ratio,
                height: ratio,
                filter: 'url(#' + id + ')',
                fill: 'url(#bg-image)'
            })

            filter.appendChild( feFlood )
            filter.appendChild( feColorMatrix )
            filter.appendChild( feMerge )
            feMerge.appendChild( feMergeNode0 )
            feMerge.appendChild( feMergeNode1 )
            defs.appendChild( filter )

            svg.appendChild( rect )
        }
    }

    callback( null, svg )
}
