

const size = 65;

const moves = ["🤷", "🤦", "🙇", "🧏", "🙋", "💁", "🙆", "🙅", "🙎", "🙍"];
const not = ["🧘", "🤸", "🧍", "🚶", "🧎", "🏃", "🕺"];
const possibleSkinColors = ["🏻", "🏼", "🏽", "🏾", "🏿"];
const possibleGenders = ["♂️", "♀️"];

let x;
let y;

var skinColor;
var gender;

function setup() {
	createCanvas(windowWidth, windowHeight);
	x = size + ((width % size) / 2);
	y = size + ((height % size) / 2);
	background(0);
	noStroke();
	fill(0);
	textSize(size * 0.75);
	//frameRate(15);
	textAlign(CENTER, CENTER);
	rectMode(CENTER);
	skinColor = possibleSkinColors[floor(random(possibleSkinColors.length))];
	gender = possibleGenders[floor(random(possibleGenders.length))];
}

function draw() {
	translate(x, y);

	rect(0, 0, size, size);

	scale(random() > 0.5 ? -1 : 1, 1);
	rotate(randomGaussian() * 0.8);
	translate(random(-0.03 * size, 0.03 * size), random(-0.07 * size, 0.07 * size));
	rect(0, 0, size * 0.8, size * 0.8);

	text(moves[floor(random(moves.length))] + skinColor + "\u200D" + gender, 0, 0);

	x += size;

	if (x > width - size / 2) {
		y += size;
		x = size + ((width % size) / 2);
		skinColor = possibleSkinColors[floor(random(possibleSkinColors.length))];
		gender = possibleGenders[floor(random(possibleGenders.length))];
	}

	if (y > height - size / 2) {
		y = size + ((height % size) / 2);
	}
}