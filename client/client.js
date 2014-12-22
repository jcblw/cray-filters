
var 
form = document.getElementById( 'form' ),
results = document.getElementById( 'results' ),
input = document.getElementById( 'url' )


function onFormSubmit ( e ) {
    e.preventDefault();

    var 
    img = document.createElement( 'img' )
    img.addEventListener( 'load', onImageLoad )
    img.addEventListener( 'error', onImageError )  

    img.src = '/?photo=' + input.value;   
}

function onImageLoad( ) {
    addResults( this )
}   

function addResults( node ) {
    results.innerHTML = ''
    results.appendChild( node )
}

function onImageError( err ) {
    var error = document.createElement( 'span' )

    error.classList.add( 'error' )
    error.innerText = 'Could not load image. \n Try an image with a file extension';
    addResults( error )
}


form.addEventListener( 'submit', onFormSubmit )