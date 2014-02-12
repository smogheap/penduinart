if(!console) {
	console = {
		log: function(str) {
		}
	};
}

function penduinOBJ(obj, cb) {
	this.load = function load(obj, cb) {
		this.obj = obj || {};
		this.obj._$ = {};
		this.obj._img = {};
		this.obj._imgLoaded = 0;
		this.loadPart([this.obj], cb);
	},
	this.loadPart = function loadPart(part, cb) {
		var img;
		var i = 0;
		for(i = 0; i < part.length; i++) {
			if(part[i].image && part[i].name) {
				console.log("loading '" + part[i].name + "' (" + part[i].image + ")");
				this.obj._$[part[i].name] = part[i];

				if(this.obj._img[part[i].image] === undefined) {
					this.obj._img[part[i].image] = null;

					img = document.createElement("img");
					img.src = part[i].image;
					img.style.display = "none";
					this.obj._img[part[i].image] = img;
					img.addEventListener("load", function() {
						this.obj._imgLoaded++;
						if(this.loadedAll() && cb) {
							console.log("all done");
							cb();
						}
					}.bind(this), false);
					document.body.appendChild(img); //todo: somewhere tidier
				}
			}

			this.loadPart([].concat(part[i].above || [],
									part[i].below || []), cb);
		}
	},
	this.loadedAll = function loadedAll() {
		var total = 0;
		for(i in this.obj._img) {
			total++;
		}
		return total === this.obj._imgLoaded;
	},
	this.draw = function draw(ctx, scale, x, y) {
		this.drawPart(ctx, this.obj, scale, x, y);
	},
	this.drawPart = function drawPart(ctx, part, scale, x, y) {
		var TO_RADIANS = Math.PI/180;
		var offx = 0;
		var offy = 0;
		ctx.save();

		ctx.translate(x, y);
		if(part.offset) {
			ctx.translate(part.offset.x, part.offset.y);
		}
		if(part._offset) {
			ctx.translate(part._offset.x, part._offset.y);
		}

		if(part.alpha !== undefined) {
			ctx.globalAlpha = part.alpha;
		}
		if(part.alpha !== undefined) {
			ctx.globalAlpha = part._alpha;
		}

		ctx.scale(scale || 1, scale || 1);
		if(part.scale) {
			ctx.scale(part.scale, part.scale);
		}
		if(part._scale) {
			ctx.scale(part._scale, part._scale);
		}

		if(part.pivot) {
			offx = -part.pivot.x
			offy = -part.pivot.y
		}

		if(part.rotate) {
			ctx.rotate(part.rotate * TO_RADIANS);
		}
		if(part._rotate) {
			ctx.rotate(part._rotate * TO_RADIANS);
		}

		if(part.below) {
			for(i in part.below) {
				this.drawPart(ctx, part.below[i], 1, offx, offy);
			}
		}

		if(part.image) {
			var img = this.obj._img[part.image];
			if(part.pivot) {
				ctx.drawImage(img, -part.pivot.x, -part.pivot.y);
			} else {
				console.log("no pivot for " + part.name);
				ctx.drawImage(img, -(img.width / 2), -(img.height / 2));
			}
		}

		if(part.above) {
			for(i in part.above) {
				this.drawPart(ctx, part.above[i], 1, offx, offy);
			}
		}

		ctx.restore();
	};

	this.load(obj, cb);
};

function penduinART(game) {
	this.game = {};
	this.scene = {};
	this.state = {};
	this.blankgame = {
		"title": "sample penduinART game",
		"width": 320,
		"height": 240
	};

	this.init = function init(game) {
		this.canvas = document.querySelector("canvas");
		this.ctx = this.canvas.getContext("2d");

		if(this.initialized) {
			this.load(game);
			return;
		}

		window.addEventListener("resize", this.resize.bind(this), false);
		var requestAnimationFrame = (window.requestAnimationFrame ||
									 window.mozRequestAnimationFrame ||
									 window.webkitRequestAnimationFrame ||
									 window.msRequestAnimationFrame);
		window.requestAnimationFrame = requestAnimationFrame;

		this.load(game);
		this.initialized = true;
	};

	this.resize = function resize() {
		this.canvas.width = 0;
		this.canvas.height = 0;

		var parent = this.canvas.parentElement;
		var ratio = this.game.width / this.game.height;
		var toowide = (parent.clientWidth / parent.clientHeight) > ratio;

		if(toowide) {
			this.canvas.width = parent.clientHeight * ratio;
			this.canvas.height = parent.clientHeight;
		} else {
			this.canvas.width = parent.clientWidth;
			this.canvas.height = parent.clientWidth / ratio;
		}

		this.render();
	};

	this.load = function load(game) {
		if(game) {
			this.game = game;
		} else {
			this.game = this.blankgame;
		}
		window.document.title = this.game.title;
		if(this.game.custom && typeof(this.game.custom) === "function") {
			this.game.custom();
		}
		if(this.game.animation && this.game.animation.load) {
			var l = this.game.animation.load;

			if(l.custom && typeof(l.custom) === "function") {
				l.custom();
			}
		}
	};


	this.init(game);
};
