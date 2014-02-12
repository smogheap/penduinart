function smogheapINPUT(actions) {
	this.actions = {};
	this.defaultActions = {
		// default directions, a/b/c buttons, start.  think sega genesis
		"p1": {
			"up": {
				"key": [
					38,  //up
					104, //numpad up
					87   //w
				]
			},
			"left": {
				"key": [
					37,  //left
					100, //numpad left
					65   //a
				]
			},
			"down": {
				"key": [
					40, //down
					98, //numpad down
					83  //s
				]
			},
			"right": {
				"key": [
					39,  //right
					102, //numpad right
					68   //d
				]
			},
			"a": {
				"key": [
					17, //ctrl
					16  //shift
				]
			},
			"b": {
				"key": [
					18, //alt
					90  //z
				]
			},
			"c": {
				"key": [
					32, //space
					88  //x
				]
			},
			"start": {
				"key": [
					27, //esc
					49, //1
					67, //c
					53, //5
				]
			}
		},
		"p2": {
			"up": {
				"key": [
					82 //r
				]
			},
			"left": {
				"key": [
					68 //d
				]
			},
			"down": {
				"key": [
					70 //f
				]
			},
			"right": {
				"key": [
					71 //g
				]
			},
			"a": {
				"key": [
					65, //a
					87  //w
				]
			},
			"b": {
				"key": [
					83, //s
					69  //e
				]
			},
			"c": {
				"key": [
					81, //q
					219 //[
				]
			},
			"start": {
				"key": [
					50,  //1
					221, //]
					54,  //6
				]
			}
		}
	};
	this.map = {};   // {"eventType":{"number": {"player": "p1", "action": "up"}, ...}}
	this.state = {}; // {"p1": {"up": false, ...}}
	this.configuring = false;
	this.dom = {};


	this.init = function init(actions) {
		if(!actions) {
			this.actions = this.defaultActions;
		}
		this.state = {};
		for(p in this.actions) {
			for(a in this.actions[p]) {
				// initialize state
				if(!this.state[p]) {
					this.state[p] = {};
				}
				this.state[p][a] = false;
				// set up mapping
				for(i in this.actions[p][a].key) {
					if(!this.map.key) {
						this.map.key = {};
					}
					if(!this.map.key[this.actions[p][a].key[i].toString()]) {
						this.map.key[this.actions[p][a].key[i].toString()] = {};
					}
//					alert(a);
					this.map.key[this.actions[p][a].key[i].toString()].player = p;
					this.map.key[this.actions[p][a].key[i].toString()].action = a;
//					alert(i.toString() + "/" + p + "/" + a);
				}
				// todo: more than keyboard
			}
		}
		console.log(JSON.stringify(this.map));
		console.log(JSON.stringify(this.state));

		if(this.initialized) {
			return;
		}

		window.addEventListener("keydown", this.handleInput.bind(this), false);
		window.addEventListener("keyup", this.handleInput.bind(this), false);
		// TODO: mouse support
		//window.addEventListener("click", this.handleinput.bind(this), false);
		// TODO: virtual gamepad
		window.addEventListener("gamepadconnected", function(e) {
			// TODO: gamepad support
			console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
						e.gamepad.index, e.gamepad.id,
						e.gamepad.buttons.length, e.gamepad.axes.length);
		});

		this.initialized = true;
	};

	this.showGUI = function showGUI() {
		var el = null;

		this.configuring = true;
		this.dom.cont = document.createElement("div");
		this.dom.cont.className = "smogheapINPUT";

		this.dom.close = document.createElement("button");
		this.dom.close.innerHTML = "X";
		this.dom.cont.appendChild(this.dom.close);

		this.dom.cont.appendChild(document.createTextNode("Controls"));
		this.dom.cont.appendChild(document.createElement("br"));

		for(p in this.actions) {
			var table =  document.createElement("table");
			el = document.createElement("caption");
			el.innerHTML = p;
			table.appendChild(el);
			var head = document.createElement("thead");
			table.appendChild(head);
			var row = document.createElement("tr");
			table.appendChild(row);
			el = document.createElement("th");
			el.innerHTML = "action";
			row.appendChild(el);
			el = document.createElement("th");
			el.innerHTML = "input";
			row.appendChild(el);
			var body = document.createElement("tbody");
			for(a in this.actions[p]) {
				row = document.createElement("tr");
				el = document.createElement("td");
				el.innerHTML = a;
				row.appendChild(el);
				el = document.createElement("td");
				el.innerHTML = this.actions[p][a].key;
				row.appendChild(el);
				body.appendChild(row);
			}
			table.appendChild(body);
			this.dom.cont.appendChild(table);
		}

		document.body.appendChild(this.dom.cont);
		this.dom.close.addEventListener("click", function() {
			document.body.removeChild(this.dom.cont);
			this.dom = {};
		}.bind(this));
	};

	this.getState = function getState(action) {
		if(action) {
			return this.state[action] || null;
		} else {
			return this.state;
		}
	},

	this.handleInput = function handleinput(e) {
		// quickly set state
		var map = null;
		try {
			switch(e.type) {
			case "keydown":
				map = this.map.key[e.key || e.keyCode];
				this.state[map.player][map.action] = true;
				break;
			case "keyup":
				map = this.map.key[e.key || e.keyCode];
				this.state[map.player][map.action] = false;
				break;
			default:
				break;
			}
		} catch(ignore) {}
		//console.log(JSON.stringify(this.state));

		if(!this.configuring) {
			return;
		}

		// we're configuring inputs, speed isn't important
		var name = "";
		switch(e.type) {
		case "keydown":
		case "keyup":
			var key = e.key || e.keyCode;

			name = String.fromCharCode(key);
			name = {
				"8": "backspace",
				"9": "tab",
				"13": "enter",
				"16": "shift",
				"17": "ctrl",
				"18": "alt",
				"19": "pause/break",
				"20": "caps lock",
				"27": "escape",
				"33": "page up",
				"34": "page down",
				"35": "end",
				"36": "home",
				"37": "left arrow",
				"38": "up arrow",
				"39": "right arrow",
				"40": "down arrow",
				"45": "insert",
				"46": "delete",
				"91": "left toyOS",
				"92": "right toyOS",
				"93": "select key",
				"96": "numpad 0",
				"97": "numpad 1",
				"98": "numpad 2",
				"99": "numpad 3",
				"100": "numpad 4",
				"101": "numpad 5",
				"102": "numpad 6",
				"103": "numpad 7",
				"104": "numpad 8",
				"105": "numpad 9",
				"106": "multiply",
				"107": "add",
				"109": "subtract",
				"110": "decimal point",
				"111": "divide",
				"112": "F1",
				"113": "F2",
				"114": "F3",
				"115": "F4",
				"116": "F5",
				"117": "F6",
				"118": "F7",
				"119": "F8",
				"120": "F9",
				"121": "F10",
				"122": "F11",
				"123": "F12",
				"144": "num lock",
				"145": "scroll lock",
				"186": ",",
				"187": "=",
				"188": ",",
				"189": "-",
				"190": ".",
				"191": "/",
				"192": "`", // backtick/tilde
				"219": "[",
				"220": "\\",
				"221": "]",
				"222": "'",
			}[key.toString()] || String.fromCharCode(key);

			console.log(name + ":" + key);
			break;
		}
	}


	this.init(actions);
};