// Where is the circle
var x, y, r, j;

var a, b, c;

var socket = io.connect(window.location.origin);

socket.on('data', function(data) {
    // console.log(data);
    a = data[0];
    b = map(data[1], 0, 1, 0, 100);
    c = map(data[2], 0, 1, 0, 100);

    console.log("Address is " + a + " X is " + Math.floor(b) + " Y is " + Math.floor(c));


});


function setup() {
    createCanvas(720, 400);
    // Starts in the middle
    x = width / 2;
    y = height;
}

function draw() {
    background(200);


    // Draw a circle
    stroke(50);
    fill(100);
    ellipse(x, y, r, r);

    // Jiggling randomly on the horizontal axis
    x = x + random(-1, 1);
    // Moving up at a constant speed
    y = y - 1;

    // Reset to the bottom
    if (y < 0) {
        y = height;
    }
}