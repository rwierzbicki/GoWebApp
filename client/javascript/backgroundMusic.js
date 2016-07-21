/*
Background Music Reference: https://youtu.be/G_h17RhIzbc
							https://youtu.be/P_xFh7XFC_w
Code Reference: Development Technology Training Center: https://www.developphp.com/video/JavaScript/Audio-Seek-and-Volume-Range-Slider-Tutorial
*/
var audio, playbtn, mutebtn, volumeslider, seeking=false, seekto;
var lastValue;
var musicList = ["assets/Love Yourself.mp3", "assets/River Flow in You.mp3"];
window.onload = function(){

	audio = new Audio();
	audio.src = musicList[Math.floor(Math.random() * 1024 % musicList.length)];
	audio.loop = true;
	audio.play();

	playbtn = document.getElementById("playButton");
	mutebtn = document.getElementById("muteButton");
	volumeslider = document.getElementById("volumeslider");

	lastValue = volumeslider.value;

	mutebtn.onclick = function() {
		audio.muted = !audio.muted;
		mutebtn.src = !audio.muted?'volume.png':'volume_mute.png';
		volumeslider.value = audio.muted?0:lastValue;
	}

	playbtn.onclick = function(){
		audio.paused?audio.play():audio.pause();
		playbtn.src = audio.paused?'player.png':'pause.png';
	}

	volumeslider.onchange = function(){
	    audio.volume = volumeslider.value / 100;
	    lastValue = volumeslider.value;
	};
}
//window.addEventListener("load", initMusic);
