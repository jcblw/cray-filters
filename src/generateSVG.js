module.exports = function( bgImage, callback ) {
    var vsvg = require( 'vsvg' ),
        PerlinNoise = require( 'perlin-simplex' ),
        perlin = new PerlinNoise( ),
        Color = require( 'color' ),
        fs = require( 'fs' ),
        nRows = 20,
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
        });

    pattern.appendChild( image );
    defs.appendChild( pattern );
    svg.appendChild( defs );
    svg.appendChild( bg );


    var row, column, rect, red, green, blue, color, id;

    function rgbValue( n ) {
        return 255 * ( n / 2 + 0.5 );
    }

    for ( column = 0; column < nCols; column++) {

        for( row = 0; row < nRows; row ++ ) {

            var x = row / noiseDistance,
                y = column / noiseDistance,
                z = ( row * column ) / zNoiseDistance;

            red = rgbValue( perlin.noise3d( x, y, z + colorDistance ) );
            green = rgbValue( perlin.noise3d( x, y, z - colorDistance ) );
            blue = rgbValue( perlin.noise3d( x, y, z ) );

            id = 'filter-'+ row + '-' + column;

            color = Color( {
                r: 255 - red,
                g: 255 - green,
                b: 255 - blue
            } );

            var filter = vsvg.filter({
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
                });

            filter.appendChild( feFlood );
            filter.appendChild( feColorMatrix );
            filter.appendChild( feMerge );
            feMerge.appendChild( feMergeNode0 );
            feMerge.appendChild( feMergeNode1 );
            defs.appendChild( filter );

            svg.appendChild( rect );
        }
    };

    callback( null, '<!doctype html>' +
        '<html><body><style>*{ margin: 0; padding: 0;}</style>' + 
        svg.toHTML() +
        '<script src="/screenshot.js"></script></body></html>'  );
};