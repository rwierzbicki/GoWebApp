/*
Background Music Reference: https://youtu.be/G_h17RhIzbc
							https://youtu.be/P_xFh7XFC_w

*/

function play(){
	var a = Math.random()*2;
	a = Math.floor(a);
	if(a==1){
		document.getElementById("music").innerHTML= "<audio id = 'music' loop autoplay><source src='assets/Love Yourself.mp3' type='audio/ogg'></audio>";
	}
	if(a==0){
	    document.getElementById('music').innerHTML="<audio id='music' loop autoplay><source src='assets/River Flow in You.mp3' type='audio/ogg'></audio>";
	}
}
