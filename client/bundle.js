(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
    error.innerText = 'Could not load image. \nTry an image with a file extension';
    addResults( error )
}


form.addEventListener( 'submit', onFormSubmit )
},{}]},{},[1]);
