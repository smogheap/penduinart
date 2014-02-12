var canv = null;
var ctx = null;
var warrior = null;
var warriorJSON = {
	"above": [
		{
			"name": "body",
			"image": "image/body.png",
			"pivot": {
				"x": 364,
				"y": 750
			},
			"rotate": 359,
			"scale": 1,
			"alpha": 1,
			"offset": {
				"x": 130,
				"y": -570
			},
			"above": [],
			"below": [
				{
					"name": "arm",
					"image": "image/arm.png",
					"pivot": {
						"x": 589,
						"y": 705
					},
					"rotate": 354,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 225,
						"y": 605
					},
					"above": [],
					"below": []
				},
				{
					"name": "legs",
					"image": "image/legs.png",
					"pivot": {
						"x": 638,
						"y": 290
					},
					"rotate": 269,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 320,
						"y": 750
					},
					"above": [],
					"below": []
				}
			]
		}
	],
	"below": []
};

function render() {
	ctx.fillStyle = "#444";
	ctx.fillRect(0, 0, canv.width, canv.height);
	//warrior.draw(ctx, 0.1, 160, 160);
	//warrior.draw(ctx, -0.1, 320+160, 160);
	warrior.draw(ctx, 0.2, 320, 320);
}

var start = 0;
var stop = false;

function walk(timestamp) {
	if(stop) {
		stop = false;
		return;
	}
	window.requestAnimationFrame(walk);

	var prog = (timestamp - start) / 500;
	if(prog > 1) {
		prog %= 1;
	}
	if(prog < 0.25) {
		warrior.obj._$.legs._rotate = ((prog * 4) * 95) - 5;
		warrior.obj._$.arm._rotate = (prog * 4) * 15;
		warrior.obj._$.body._rotate = (prog * 4) * 5;
	} else if(prog < 0.5) {
		warrior.obj._$.legs._rotate = 90;
		warrior.obj._$.arm._rotate = 15;
		warrior.obj._$.body._rotate = 5;
	} else if(prog < 0.75) {
		warrior.obj._$.legs._rotate = (-(((prog - 0.75) * 4) * 95)) - 5;
		warrior.obj._$.arm._rotate = -((prog - 0.75) * 4) * 15;
		warrior.obj._$.body._rotate = -((prog - 0.75) * 4) * 5;
	} else {
		warrior.obj._$.legs._rotate = -5;
		warrior.obj._$.arm._rotate = 0;
		warrior.obj._$.body._rotate = 0;
	}

	render();
}

window.addEventListener("load", function() {
	window.requestAnimationFrame = (window.requestAnimationFrame ||
									window.mozRequestAnimationFrame ||
									window.webkitRequestAnimationFrame ||
									window.msRequestAnimationFrame);
	canv = document.querySelector("#display");
	ctx = canv.getContext("2d");

	warrior = new penduinOBJ(warriorJSON, render);

	document.querySelector("#stop").addEventListener("click", function() {
		stop = true;
	});
	document.querySelector("#walk").addEventListener("click", function() {
		start = Date.now();
		window.requestAnimationFrame(walk);
	});
});
