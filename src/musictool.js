var MT = {
	tracks: []
};


function updateData() {
}

function buildTrackUI(track) {
	var dom = document.createElement("div");
	dom.className = "trackUI";

	var elm = document.createElement("h2");
	elm.appendChild(document.createTextNode(track.name));
	dom.appendChild(elm);

	var rewind = null;
	rewind = function() {
		track.element.currentTime = track.loopstart / 1000;
		track.element.volume = 1;
		track.element.play();
		track.timer = window.setTimeout(rewind,
										track.loopend - track.loopstart);
	};

	elm = document.createElement("button");
	elm.appendChild(document.createTextNode("play"));
	elm.addEventListener("click", function(evt) {
		track.element.pause();
		track.element.currentTime = track.start / 1000;
		track.element.play();
		if(track.loop && track.loopend) {
			track.timer = window.setTimeout(rewind,
											track.loopend - track.start);
		} else if(track.end) {
			track.timer = window.setTimeout(function() {
				track.element.pause();
			}, track.loopend - track.start);
		}
	});
	dom.appendChild(elm);

	elm = document.createElement("button");
	elm.appendChild(document.createTextNode("stop"));
	elm.addEventListener("click", function(evt) {
		track.element.pause();
		window.clearTimeout(track.timer);
		track.timer = null;
	});
	dom.appendChild(elm);

	track.element.controls = true;
	track.element.addEventListener("ended", function() {
		if(track.loop) {
			track.element.currentTime = track.loopstart / 1000;
			track.element.play();
		}
	});

	var fadeout = null;
	fadeout = function() {
		if(track.element.volume < 0.1) {
			track.element.pause();
			track.element.volume = 1.0;
			return;
		}
		track.element.volume -= 0.1;
		track.timer = window.setTimeout(fadeout, 100);
	};

	elm = document.createElement("button");
	elm.appendChild(document.createTextNode("fadeout"));
	elm.addEventListener("click", function(evt) {
		window.clearTimeout(track.timer);
		track.timer = window.setTimeout(fadeout, 100);
	});
	dom.appendChild(elm);

	track.element.controls = true;
	track.element.addEventListener("ended", function() {
		if(track.loop) {
			track.element.currentTime = track.loopstart / 1000;
			track.element.play();
		}
	});

	var info = document.createElement("div");
	var input = null;
	info.appendChild(document.createTextNode("start:"));
	input = document.createElement("input");
	input.className = "start";
	input.value = track.start;
	input.addEventListener("change", function(evt) {
		track.start = parseInt(this.value, null);
		updateData();
	});
	info.appendChild(input);
	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("end:"));
	input = document.createElement("input");
	input.className = "end";
	input.value = track.end;
	input.addEventListener("change", function(evt) {
		track.end = parseInt(this.value, null);
		updateData();
	});
	info.appendChild(input);
	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("loop:"));
	input = document.createElement("input");
	input.type = "checkbox";
	input.className = "loop";
	input.checked = track.loop;
	input.addEventListener("change", function(evt) {
		track.loop = this.checked;
		updateData();
	});
	info.appendChild(input);
	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("loop start:"));
	input = document.createElement("input");
	input.className = "loopstart";
	input.value = track.loopstart;
	input.addEventListener("change", function(evt) {
		track.loopstart = parseInt(this.value, null);
		updateData();
	});
	info.appendChild(input);
	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("loop end:"));
	input = document.createElement("input");
	input.className = "loopend";
	input.value = track.loopend;
	input.addEventListener("change", function(evt) {
		track.loopend = parseInt(this.value, null);
		updateData();
	});
	info.appendChild(input);

	dom.appendChild(info);
	return dom;
}


window.addEventListener("load", function() {
	// build up data and UI for tracks
	var elems = document.querySelectorAll("#resources audio");
	var i = 0;
	var audio = null;
	var name = null;
	var track = null;
	for(i = 0; i < elems.length; i++) {
		audio = elems[i];
		name = audio.src.substring(0, audio.src.lastIndexOf("."));
		name = name.substring(audio.src.lastIndexOf("/") + 1);
		name = name.substring(audio.src.lastIndexOf("\\") + 1);
		track = {
			name: name,
			element: audio,
			start: 0,
			end: 0,
			loop: true,
			loopstart: 2000,
			loopend: 10000,
			timer: null
		};
		MT.tracks.push(track);
	}
	var ui = null;
	var element = null;
	for(i = 0; i < MT.tracks.length; i++) {
		ui = buildTrackUI(MT.tracks[i]);
		element = MT.tracks[i].element;
		document.querySelector("#resources").insertBefore(ui, element);
	}
});
