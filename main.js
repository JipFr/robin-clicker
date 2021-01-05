
// Init
let points = 0;
let highscore = Number(localStorage.getItem("highscore")) || 0

// Draw
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

// Generate sources
const imageCount = 11;
const sources = [];
for(let i = 1; i <= imageCount; i++) {
	sources.push(`hoofden/${i}.png`);
}

// Get images
const images = [];
for(let source of sources) {
	const img = new Image();
	img.src = source;
	images.push(img);	
}

// Make heads
const heads = [];
for(let i = 0; i < 50; i++) {
	heads.push({
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
		image: images[Math.floor(Math.random() * images.length)],
		direction: Math.random() * (Math.PI*2),
		rotation: Math.random() * (Math.PI*2),
		speed: Math.floor(Math.random() * 2) + 5
	});	
}


function draw() {
	canvas.width = canvas.scrollWidth;
	canvas.height = canvas.scrollHeight;
	// ctx.drawImage(images[0], 100, 100);

	for(let head of heads) {
		ctx.save();

		ctx.translate(head.x, head.y);
		ctx.rotate(head.rotation)
		ctx.drawImage(head.image, -50, -head.image.height / 2)

		ctx.restore();
	}

}

function update() {
	for(let head of heads) {
		const newX = head.speed * Math.cos(head.direction);
		const newY = head.speed * Math.sin(head.direction);

		head.x += newX;
		head.y += newY;

		head.rotation += 0.01;

		if(head.x > canvas.width + 200) {
			head.x = -200
		} else if(head.x < -200) {
			head.x = canvas.width + 200
		}

		if(head.y > canvas.height + 200) {
			head.y = -200
		} else if(head.y < -200) {
			head.y = canvas.height + 200
		}

	}
}

function main() {
	update();
	draw();
}

function init() {

	canvas.addEventListener("click", evt => {
		const { top, left } = canvas.getBoundingClientRect()
		const x = evt.clientX - left;
		const y = evt.clientY - top;
		
		const { data } = ctx.getImageData(x, y, 1, 1);
		let sum = 0;
		for(let n of data) {
			sum += n;
		}
		if(sum > 0) {
			// Success
			points++
		} else {
			// Fail
			points = 0;
			document.querySelector("canvas").classList.add("shake");
			setTimeout(() => {
				document.querySelector("canvas").classList.remove("shake");
			}, 500);
		}
		console.log(sum);

		updatePoints();

	});

	main();
	setInterval(main, 1e3 / 60);
	updatePoints();
}
init();

function updatePoints() {
	if(points > highscore) {
		highscore = points;
		localStorage.setItem("highscore", highscore);
	}
	document.querySelector(".points").innerText = `${points} punt${points !== 1 ? 'en' : ''}`
	document.querySelector(".highscore").innerText = `${highscore} punt${highscore !== 1 ? 'en' : ''}`
}