// Canvas settings
const CANVAS = document.getElementById("mainCanvas");
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;
let context = CANVAS.getContext("2d");

// Logo settings
let gotoLogo = new Image();
gotoLogo.crossOrigin = "Anonymous";
gotoLogo.src = './gotoAndPlay.svg';

// All the stars in the nightsky
let allStars = [];
const STARCOUNT = 800;
const MINRADIUS = 0.2;
const MAXRADIUS = 1.7;

// Firework variables
let fireworks = [];
let fireworksParticles = [];
let burstparticles = [];
let burstnumbers = [];
// Helpers
let countForDisperse = 0;
let countForParticleChange = 0;
const EXPLOSIONS = 40;
const DISPERSION = 3;

// For user interaction
const MOUSE = {
    x: undefined,
    y: undefined
}
const PROXIMITY = 65; // Stars proximity range in px to make them move faster
const TOUCHRANGE = 15; // Stars touch range in px to init fireworks
const MINOPACITY = 0.5;
const MAXOPACITY = 0.2;
const SPARKLE = 1; // Opacity for stars to create sparkling effect

// Resize the canvas dynamically
addEventListener("resize", function (event) {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    initialize();
});

// Listen for mousemoves
addEventListener("mousemove", function (event) {
    MOUSE.x = event.x;
    MOUSE.y = event.y;
});

// Init the starry nightsky
function initialize() {
    allStars = [];
    // Generate for every star object its own properties
    for (let i = 0; i < STARCOUNT; i++) {
        let x = Math.random() * CANVAS.width;
        let y = Math.random() * CANVAS.height;
        let velocity = (Math.random() - Math.random() * 0.5) * 8;
        let radius = (Math.random() * MAXRADIUS) + MINRADIUS;
        let rgbSet = {
            // TODO: DRY
            colorR: Math.floor(Math.random() * 256),
            colorG: Math.floor(Math.random() * 256),
            colorB: Math.floor(Math.random() * 256),
            opacity: (Math.random() * MINOPACITY) + MAXOPACITY
        }
        let angle = 0;
        // The center of the simplified orbit
        let circleCenterX = x;
        let circleCenterY = y;
        // Transform angle into radians, calculate necessary ratios and multiply with radius (hypotenuse)
        let newX = radius * Math.cos(angle * (Math.PI / 180));
        let newY = radius * Math.sin(angle * (Math.PI / 180));
        allStars.push(new Star(x, y, velocity, radius, rgbSet, angle, circleCenterX, circleCenterY, newX, newY));
    }
}

// Create starry nightsky by defining a Star object
function Star(x, y, velocity, radius, rgbSet, angle, circleCenterX, circleCenterY, newX, newY) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.radius = radius;
    this.color = `rgb(${rgbSet.colorR}, ${rgbSet.colorG}, ${rgbSet.colorB}, ${rgbSet.opacity})`;
    this.angle = angle;
    this.circleCenterX = circleCenterX;
    this.circleCenterY = circleCenterY;
    this.newX = newX;
    this.newY = newY;

    // Create star
    this.create = function () {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    // Make the star circle on its orbit
    this.update = function () {
        this.newX = this.radius * Math.cos(this.angle * (Math.PI / 180));
        this.newY = this.radius * Math.sin(this.angle * (Math.PI / 180));
        // New x and y values to the orbit center.
        this.x = this.newX + this.circleCenterX;
        this.y = this.newY + this.circleCenterY;
        // In case sin and cos it is not necessary to reset the angle - works for > 360 also.
        this.angle += this.velocity;
        this.color = `rgb(${rgbSet.colorR}, ${rgbSet.colorG}, ${rgbSet.colorB}, ${Math.random() * (MAXOPACITY - MINOPACITY) + MINOPACITY})`;

        // Add user interactivity - if the mouse is in the certain range from stars centre, increase the orbiting velocity and create a new fireworks object
        if (MOUSE.x - this.x < TOUCHRANGE && MOUSE.x - this.x > -TOUCHRANGE && MOUSE.y - this.y < TOUCHRANGE && MOUSE.y - this.y > -TOUCHRANGE) {
            // For every certain number of events a firework object is created 
            if (countForDisperse === DISPERSION) {
                context.beginPath();
                const newFireworksStemElement = new Fireworks(this.x, this.y, radius, this.color);
                newFireworksStemElement.initFireworks();
                fireworks.push(newFireworksStemElement);
                // TODO: Consider to change this - get rid of hard-coded values and the bug 
                if (this.velocity < 8 || this.velocity > -4) {
                    this.velocity = this.velocity * 10;
                }
                countForDisperse = 0;
            } else if (countForDisperse < DISPERSION) {
                countForDisperse++;
            }
        }
        // If the mouse is in the certain range from stars centre, increase the orbiting velocity AND make stars sparkle brighter
        else if (MOUSE.x - this.x < PROXIMITY && MOUSE.x - this.x > -PROXIMITY && MOUSE.y - this.y < PROXIMITY && MOUSE.y - this.y > -PROXIMITY) {
            this.velocity = this.velocity * 10;
            this.color = `rgb(${rgbSet.colorR}, ${rgbSet.colorG}, ${rgbSet.colorB}, ${SPARKLE})`;

        // Reset the velocity and opacity
        } else if (this.velocity >= 8 || this.velocity <= -4) {
            this.velocity = (Math.random() - Math.random() * 0.5) * 8;
            this.color = `rgb(${rgbSet.colorR}, ${rgbSet.colorG}, ${rgbSet.colorB}, ${Math.random() * (MAXOPACITY - MINOPACITY) + MINOPACITY})`;
        }
        this.create();
        return countForDisperse;
    }
}

function Fireworks(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radius = 2;
    this.acceleration = 6;
    this.velocity = Math.random() * 2 * this.acceleration;

    this.initFireworks = function () {
        context.beginPath();
        // Choose the range of the shooting angle
        this.shootingAngle = (Math.random() * Math.PI / 2) + Math.PI / 4;
        this.newX = Math.cos(this.shootingAngle) * this.velocity;
        this.newY = -(Math.sin(this.shootingAngle) * this.velocity);
    }

    this.shoot = function () {
        // Keep the fireworks array clean and remove the particles / items when they exit the screen
        if (this.x < 0 || this.y < 0 || this.x > CANVAS.width || this.y > CANVAS.height) {
            fireworks.splice(fireworks.indexOf(this), 1);
        }
        context.beginPath();
        this.x += this.newX;
        this.y += this.newY;
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        this.newY += 0.01 * this.acceleration;

        // If the firework stem element hits the random path in certain range, initialize explosion
        // TODO: Replace hard-coded values with dynamic range
        if (context.isPointInPath(this.x, Math.random() * (350 - 50) + 50)) {
            const newFireworksElement = new FireworksElement(this.x, this.y, radius, this.color);
            fireworksParticles.push(newFireworksElement);
            newFireworksElement.explode();
        }
    }
}

// Fireworks object which explodes
function FireworksElement(x, y, radius, color) {
    this.x = x;
    this.y = y;
    // Enlarge the exploding particles
    this.radius = radius * 1.05;
    this.color = color;
    this.acceleration = 4;
    this.maxDist = Math.random() * (CANVAS.width - 30) + 30;
    // For explosions to look brighter
    let newOpacity = 0.7;
    // Extract rgb values
    let rgb = color.match(/[.?\d]+/g);
    // Set new opacity
    let newRGB = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${newOpacity})`
    this.color = newRGB;

    // TODO: Consider to add some halo-like effects. Shadow causes performance issues - do not use that
    this.explode = function () {
        // Keep the fireworks particles array clean
        fireworksParticles.splice(fireworksParticles.indexOf(this), 1);
        // Create two rounds of particles in explosion - looks more natural
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 16; j++) {
                // Make every particle to travel with random speed at a random angle
                context.beginPath();
                this.velocity = Math.random() * 2 * this.acceleration;
                this.explosionAngle = Math.random() * Math.PI * 2;
                this.newX = Math.cos(this.explosionAngle) * this.velocity;
                this.newY = -(Math.sin(this.explosionAngle) * this.velocity);
                this.zeroDistX = this.x;
                this.zeroDistY = this.y;
                // For every certain number of explosions make one different
                if (countForParticleChange === EXPLOSIONS) {
                    const age = new Age(this.newX, this.newY, this.radius, this.color, this.zeroDistX, this.zeroDistY, this.maxDist);
                    burstnumbers.push(age);
                    age.x = this.x;
                    age.y = this.y;
                } else if (countForParticleChange < EXPLOSIONS) {
                    const particle = new Particle(this.newX, this.newY, this.radius, this.color, this.zeroDistX, this.zeroDistY, this.maxDist);
                    particle.x = this.x;
                    particle.y = this.y;
                    burstparticles.push(particle);
                }
            }
        }
        if (countForParticleChange === EXPLOSIONS) {
            countForParticleChange = 0;
        } else if (countForParticleChange < EXPLOSIONS) {
            countForParticleChange++;
        }
        context.fill();
    }
}

// Particles from explosion
function Particle(x, y, radius, color, zeroDistX, zeroDistY, maxDist) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.acceleration = 3
    this.velocity = Math.random() * 2 * this.acceleration;
    this.zeroDistX = zeroDistX;
    this.zeroDistY = zeroDistY;
    this.maxDist = maxDist;

    this.fall = function () {
        // Keep the bursting particles array clean and remove them when they exit the screen or are at a certain distance from the explosion epicenter
        if (this.x < 0 || this.y < 0 || this.x > CANVAS.width || this.y > CANVAS.height || Math.hypot(Math.abs(this.x - zeroDistX), Math.abs(this.y - zeroDistY)) > Math.random() * maxDist) {
            burstparticles.splice(burstparticles.indexOf(this), 1);
        }
        context.beginPath();
        this.x += x;
        this.y += y;
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        this.y += 0.01 * this.acceleration;
    }
}

// Numbers from explosion
function Age(x, y, radius, color, zeroDistX, zeroDistY, maxDist) {
    this.x = x;
    this.y = y;
    this.radius = radius * 30;
    this.color = color;
    this.acceleration = 3
    this.velocity = Math.random() * 2 * this.acceleration;
    this.zeroDistX = zeroDistX;
    this.zeroDistY = zeroDistY;
    this.maxDist = maxDist;
    this.font = this.radius + "px monospace";

    this.rain = function () {
        // Keep the bursting number array clean
        if (this.x < 0 || this.y < 0 || this.x > CANVAS.width || this.y > CANVAS.height || Math.hypot(Math.abs(this.x - zeroDistX), Math.abs(this.y - zeroDistY)) > Math.random() * maxDist) {
            burstnumbers.splice(burstnumbers.indexOf(this), 1);
        }
        context.beginPath();
        this.x += x;
        this.y += y;
        context.font = this.font;
        context.strokeStyle = this.color;

        context.strokeText("10", this.x, this.y);
        // Taking advantage of the fall duration and of the amount fall function is fired - the more it is fired, the bolder the congratulation text is.
        // As the particles disappear - the text seems to be fading. 
        congratulate(this.color);
        this.y += 0.01 * this.acceleration;
        this.radius += 1.5;
    }
}

function congratulate(color) {
    this.color = color;
    context.font = "80px Lucida Handwriting";
    context.strokeStyle = this.color;
    context.textAlign = "start";
    context.strokeText("Palju õnne!", (CANVAS.width / 3.2), (CANVAS.height / 6 * 4));
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.drawImage(gotoLogo, (CANVAS.width / 2.98), (CANVAS.height / 6 * 4.5), 400, (400 * 29) / 170);
}

function animate() {
    requestAnimationFrame(animate);
    // Clears the whole canvas before next animation round
    context.clearRect(0, 0, innerWidth, innerHeight);
    fireworks.forEach(firework => firework.shoot());
    burstparticles.forEach(burstparticle => burstparticle.fall());
    burstnumbers.forEach(burstnumber => burstnumber.rain());
    allStars.forEach(individualStar => individualStar.update());
}

// Make the resizing and animation happen
initialize();
animate();