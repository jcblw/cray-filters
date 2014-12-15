(function(){
    setTimeout(function(){
        var svg = document.getElementsByTagName( 'svg' )[ 0 ];
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        canvas.width = 400
        canvas.height = 400

        var DOMURL = window.URL || window.webkitURL || window;

        var data = svg.outerHTML;
        var img = new Image();
        var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        var url = DOMURL.createObjectURL(svg);

        img.onload = function () {
            var png = document.createElement( 'img' );
            ctx.drawImage(img, 0, 0);
            png.src = canvas.toDataURL("image/png");
            document.body.appendChild( png )

            console.log( 'sweet' );
        }

        img.src = url;
    }, 5000 );
}())