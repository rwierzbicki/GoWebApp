/** 
 * This file contains functions for creating new SVG objects.
 * 
 * You must implement the required functions. 
 * 
 * You are encouraged to implement more helper functions here if you need to. 
 * 
 * You may find a tutorial on SVG at: http://www.w3schools.com/svg/ 
 */ 

//  Namespace for SVG elements, different than normal HTML element namespace.
var SVGNameSpace = "http://www.w3.org/2000/svg";

/**
 * Makes a new SVG line object and returns it. 
 *
 * @param x1 {number} 
 * @param y1 {number}
 * @param x2 {number}
 * @param y2 {number}
 * @param color {string} the color of the line
 * @param stroke {number} the thickness of the line.
 * @returns {object}
 *
 * This has been implemented to provide an example. 
 */
function makeLine(x1, y1, x2, y2, color, stroke) {

    var e = document.createElementNS(SVGNameSpace, "line");
    e.setAttribute("x1", x1);
    e.setAttribute("y1", y1);
    e.setAttribute("x2", x2);
    e.setAttribute("y2", y2);

    e.style.stroke      = color || "#000000";
    e.style.strokeWidth = stroke || 2;

    return e;

}

/**
* Makes and returns a new SVG square object. 
* 
* @param x {number} the x position of the square.
* @param y {number} the y position of the square.
* @param length {number} the side length of the square.
* 
* @return {object} 
*/ 
function makeSquare(x, y, length){
  var square = document.createElementNS(SVGNameSpace, "rect"); 

	square.setAttribute("x", x);
	square.setAttribute("y", y);
	square.setAttribute("width", length);
	square.setAttribute("height", length);
  //square.style.fill = "BurlyWood";
	square.style.fill = "#f5e3d6";
  // square.style.stroke = '#ce954b';
	square.style.stroke = '#eac8ae';
	square.style.strokeWidth = 2;

  	return square; 
}

/**
* Makes and returns a new SVG token object. 
* 
* @param x {number} the x position in pixels of the token.
* @param y {number} the y position in pixels of the token.
* @param X {number} the x coordinate of the token on the Go board.
* @param Y {number} the y coordinate of the token on the Go board.
* @param w {number} the width of the image (assumes a square image)
* @param src {number} the source of the image file for the token
* @param onClick {function} the function to call on a click event
* 
* @return {object} 
*/
function makeToken(x, y, X, Y, w, src, onClick){

  var token = document.createElementNS('http://www.w3.org/2000/svg','image');

  token.setAttributeNS('http://www.w3.org/1999/xlink','href', src);
  token.setAttributeNS(null, "x", x);
  token.setAttributeNS(null, "y", y);
  token.setAttributeNS(null, "X", X);
  token.setAttributeNS(null, "Y", Y);
  token.setAttributeNS(null, "width", w);
  token.setAttributeNS(null, "height", w);
  token.setAttributeNS(null, "class", "token-image unplaced");
  token.onclick = onClick;

  return token;

}

/**
* Makes an SVG element. 
* 
* @param w {number} the width
* @param h {number} the height 
* 
* @return {object} 
*/
function makeSVG(w, h){
    var s = document.createElementNS(SVGNameSpace, "svg"); 
    s.setAttribute("width", w); 
    s.setAttribute("height", w); 
    s.setAttribute('xmlns', SVGNameSpace);
    s.setAttribute('xmlns:xlink',"http://www.w3.org/1999/xlink");
    return s;
}
