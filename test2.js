var scene = null;
var obj = null;
var thingjson = {
	"name": "warrior",
	"scale": 0.2,
	"above": [
		{
			"name": "body",
			"image": "image/body.png",
			"pivot": {
				"x": 298,
				"y": 708
			},
			"rotate": 0,
			"scale": 1,
			"alpha": 1,
			"offset": {
				"x": 35,
				"y": -505
			},
			"above": [],
			"below": [
				{
					"name": "arm",
					"image": "image/arm.png",
					"pivot": {
						"x": 593,
						"y": 697
					},
					"rotate": 0,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 230,
						"y": 595
					},
					"above": [],
					"below": []
				},
				{
					"name": "legs",
					"image": "image/legs.png",
					"pivot": {
						"x": 640,
						"y": 289
					},
					"rotate": 0,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 350,
						"y": 660
					},
					"above": [],
					"below": []
				}
			]
		}
	],
	"below": [],
	"pose": {
		"step": {
			"body": {
				"alpha": 1,
				"scale": 1,
				"rotate": -4,
				"offset": {
					"x": 35,
					"y": -505
				}
			},
			"arm": {
				"alpha": 1,
				"scale": 1,
				"rotate": -5,
				"offset": {
					"x": 230,
					"y": 595
				}
			},
			"legs": {
				"alpha": 1,
				"scale": 1,
				"rotate": -91,
				"offset": {
					"x": 350,
					"y": 660
				}
			}
		},
		"backswing": {
			"body": {
				"alpha": 1,
				"scale": 1,
				"rotate": 25,
				"offset": {
					"x": 35,
					"y": -505
				}
			},
			"arm": {
				"alpha": 1,
				"scale": 1,
				"rotate": 120,
				"offset": {
					"x": 230,
					"y": 595
				}
			},
			"legs": {
				"alpha": 1,
				"scale": 1,
				"rotate": -17,
				"offset": {
					"x": 350,
					"y": 660
				}
			}
		},
		"stab": {
			"body": {
				"alpha": 1,
				"scale": 1,
				"rotate": -9,
				"offset": {
					"x": 35,
					"y": -505
				}
			},
			"arm": {
				"alpha": 1,
				"scale": 1.6,
				"rotate": -38,
				"offset": {
					"x": 230,
					"y": 595
				}
			},
			"legs": {
				"alpha": 1,
				"scale": 1,
				"rotate": 8,
				"offset": {
					"x": 350,
					"y": 660
				}
			}
		},
		"fall": {
			"body": {
				"alpha": 1,
				"scale": 1,
				"rotate": 89,
				"offset": {
					"x": -5,
					"y": -250
				}
			},
			"arm": {
				"alpha": 1,
				"scale": 1,
				"rotate": -161,
				"offset": {
					"x": 230,
					"y": 595
				}
			},
			"legs": {
				"alpha": 1,
				"scale": 1,
				"rotate": 20,
				"offset": {
					"x": 310,
					"y": 685
				}
			}
		}
	}
};

window.addEventListener("load", function() {
	var canv = document.getElementById("display");
	scene = new penduinSCENE(canv, canv.width, canv.height);
	obj = new penduinOBJ(thingjson, function loaded() {
		scene.setBG("#444");
		scene.addOBJ(obj);
		obj.x = canv.width / 2;
		obj.y = canv.height * 5 / 6;
		var btns = document.querySelectorAll("input[type=button]");
		var i = 0;
		for(i = 0; i < btns.length; i++) {
			btns.item(i).addEventListener("click", function(e) {
				var time = document.getElementById("time").value;
				var pose = (this.value === "default") ? null : this.value;
				obj.setPose(pose, parseInt(time, null));
			});
		}
	});
});
