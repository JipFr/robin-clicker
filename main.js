// Init
let points = 0;
let highscore = Number(localStorage.getItem("highscore")) || 0;
const maxAge = 40;
let minSpeed = 5;
let doInit = true;

// Draw
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

// Generate sources
const imageCount = 21;
const sources = [];
for (let i = 1; i <= imageCount; i++) {
	sources.push(`hoofden/${i}.png`);
}

// Get images
const images = [];
for (let source of sources) {
	const img = new Image();
	img.src = source;
	images.push(img);
}

// Particles
let particles = [];

// Make heads
let heads = [];

function newHead() {
	heads.push({
		x: Math.floor(Math.random() * 2) === 0 ? -200 : canvas.width + 200,
		y: Math.random() * canvas.height,
		image: images[Math.floor(Math.random() * images.length)],
		direction: Math.random() * (Math.PI * 2),
		rotation: Math.random() * (Math.PI * 2),
		speed: Math.floor(Math.random() * 2) + minSpeed,
	});
}

function draw() {
	canvas.width = canvas.scrollWidth;
	canvas.height = canvas.scrollHeight;
	// ctx.drawImage(images[0], 100, 100);

	for (let head of heads) {
		ctx.save();

		ctx.translate(head.x, head.y);
		ctx.rotate(head.rotation);
		ctx.drawImage(head.image, -50, -head.image.height / 2);

		ctx.restore();
	}

	particles = particles.filter((particle) => maxAge > particle.age);
	for (let particle of particles) {
		ctx.save();

		ctx.translate(particle.x, particle.y);
		ctx.rotate(particle.rotation);

		ctx.globalAlpha = Math.max(1 - particle.age / maxAge, 0);
		ctx.strokeStyle = "orange";
		ctx.strokeRect(-8, -8, 16, 16);

		ctx.restore();
	}
}

function update() {
	for (let head of heads) {
		const newX = head.speed * Math.cos(head.direction);
		const newY = head.speed * Math.sin(head.direction);

		head.x += newX;
		head.y += newY;

		head.rotation += 0.01;

		if (head.x > canvas.width + 200) {
			head.x = -200;
		} else if (head.x < -200) {
			head.x = canvas.width + 200;
		}

		if (head.y > canvas.height + 200) {
			head.y = -200;
		} else if (head.y < -200) {
			head.y = canvas.height + 200;
		}
	}

	for (let particle of particles) {
		const newX = particle.speed * Math.cos(particle.direction);
		const newY = particle.speed * Math.sin(particle.direction);

		particle.x += newX;
		particle.y += newY;

		particle.age++;
	}
}

function main() {
	update();
	draw();
}

function init() {
	heads = [];
	for (let i = 0; i < 50; i++) {
		newHead();
	}

	canvas.addEventListener("click", (evt) => {
		const { top, left } = canvas.getBoundingClientRect();
		const x = evt.clientX - left;
		const y = evt.clientY - top;

		const { data } = ctx.getImageData(x, y, 1, 1);
		let sum = 0;
		for (let n of data) {
			sum += n;
		}
		if (sum > 0) {
			// Success
			points++;

			for (let i = 0; i < Math.floor(Math.random() * 100) + 100; i++) {
				particles.push({
					x,
					y,
					rotation: Math.random() * (Math.PI * 2),
					direction: Math.random() * (Math.PI * 2),
					speed: Math.random() * 5 + 1,
					age: 0,
				});
			}

			const closest = heads
				.map((h) => {
					let difX = Math.abs(h.x - x);
					let difY = Math.abs(h.y - y);
					return {
						head: h,
						distance: Math.sqrt(difX * difX + difY * difY),
					};
				})
				.sort((a, b) => a.distance - b.distance)[0].head;

			heads = heads.filter((v) => v !== closest);

			minSpeed += 0.1;
			newHead();
		} else {
			// Fail

			minSpeed = 5;

			points = 0;

			document.querySelector("canvas").classList.add("shake");
			setTimeout(() => {
				document.querySelector("canvas").classList.remove("shake");
			}, 500);

			heads = [];
			for (let i = 0; i < 50; i++) {
				newHead();
			}
		}
		console.log(sum);

		updatePoints();
	});

	if (doInit) {
		doInit = false;
	}

	main();
	setInterval(main, 1e3 / 60);
	updatePoints();
}
init();

function updatePoints() {
	if (points > highscore) {
		highscore = points;
		localStorage.setItem("highscore", highscore);
	}
	document.querySelector(".points").innerText = `${points} punt${
		points !== 1 ? "en" : ""
	}`;
	document.querySelector(".highscore").innerText = `${highscore} punt${
		highscore !== 1 ? "en" : ""
	}`;
}
