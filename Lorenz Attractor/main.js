// init
const form = document.forms.toolbox;
const CANVAS = document.getElementById("screen");
const ctx = CANVAS.getContext("2d");
const width = CANVAS.width;
const height = CANVAS.height;

const RHO = 28;
const SIGMA = 10;
const BETA = 8/3;

let scale = 15;
let points = [];
let amount = 15;
let dt = 0.01;
let lines = false;

ctx.translate(width/2, height/2);

form.onchange = () => {
    lines = form.elements["lines"].checked;
    amount = form.elements["amount"].value;
    scale = form.elements["scale"].value;
    start();
};

function start() {
    ctx.clearRect(-width/2, -height/2, width, height);
    points = [];
    for (let i = 1; i <= amount; i++) {
        points.push({
            x: i,
            y: i,
            z: i,
            dx: 0,
            dy: 0,
            dz: 0,
            color: i * (360 / amount)
        });
    }
}
start();

function update() {
    points.forEach(p => calc(p));
    requestAnimationFrame(update);
}
update();

function calc(p) {
    p.dx = (SIGMA * (p.y - p.x)) * dt;
    p.dy = (p.x * (RHO - p.z) - p.y) * dt;
    p.dz = (p.x * p.y - BETA * p.z) * dt;

    draw(p);
}

function draw(p) {
    ctx.beginPath();
    ctx.strokeStyle = `hsl(${p.color}, 100%, 50%)`;
    if (lines) ctx.moveTo(p.x * scale, p.y * scale);

    p.x += p.dx;
    p.y += p.dy;
    p.z += p.dz;

    if (lines) ctx.lineTo(p.x * scale, p.y * scale);
    else ctx.arc(p.x * scale, p.y * scale, 0.1, 0, Math.PI * 2);
    ctx.stroke();
}