/*
A html canvas application showing fireworks.
Related files: index.html, style.css
*/

// Canvas settings
const CANVAS = document.getElementById("mainCanvas");
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;
let context = CANVAS.getContext("2d");
let animationFrameId;

// Logo
let devLogo = document.getElementById("devKarinLogo");

// All the stars in the nightsky
let allStars = [];
const STARCOUNT = 800;
const MINRADIUS = 0.2;
const MAXRADIUS = 1.7;

// Firework variables
let shootingstars = [];
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

// Stars proximity range in px. This value is used to make the stars move faster when the mouse is in the proximity range.
const PROXIMITY = 65;

// Stars touch range in px to init fireworks. This value is used to make the stars to burst fireworks when the mouse is in the touch range.
const TOUCHRANGE = 15;
const MINOPACITY = 0.5;
const MAXOPACITY = 0.2;

// Opacity for stars to create sparkling effect
const SPARKLE = 1;

function generateColor() {
    return Math.floor(Math.random() * 256);
}


function playCanvas() {

    // Resize the canvas dynamically
    const resize = function () {
        CANVAS.width = window.innerWidth;
        CANVAS.height = window.innerHeight;
        initialize();
    }

    // Listen for mousemoves
    const mousemove = function (event) {
        MOUSE.x = event.x;
        MOUSE.y = event.y;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', mousemove);

    // Init the starry nightsky
    function initialize() {

        // Clean up previous stars
        allStars = [];

        // Generate for every star object its own properties
        for (let i = 0; i < STARCOUNT; i++) {
            let initialCoordinates = {
                x: Math.random() * CANVAS.width,
                y: Math.random() * CANVAS.height
            }

            let velocity = (Math.random() - Math.random() * 0.5) * 8;
            let radius = (Math.random() * MAXRADIUS) + MINRADIUS;
            let rgbSet = {
                colorR: generateColor(),
                colorG: generateColor(),
                colorB: generateColor(),
                opacity: (Math.random() * MINOPACITY) + MAXOPACITY
            }
            let angle = 0;

            // The center of the simplified orbit
            let circleCenter = {
                circleCenterX: initialCoordinates.x,
                circleCenterY: initialCoordinates.y
            }

            // Transform angle into radians, calculate necessary ratios and multiply with radius (hypotenuse)
            let newCoordinates = {
                newX: radius * Math.cos(angle * (Math.PI / 180)),
                newY: radius * Math.sin(angle * (Math.PI / 180))
            }

            allStars.push(new Star(initialCoordinates, velocity, radius, rgbSet, angle, circleCenter, newCoordinates));

        }
    }

    // Create starry nightsky by defining a Star object
    function Star(initialCoordinates, velocity, radius, rgbSet, angle, circleCenter, newCoordinates) {
        this.x = initialCoordinates.x;
        this.y = initialCoordinates.y;
        this.velocity = velocity;
        this.radius = radius;
        this.color = `rgb(${rgbSet.colorR}, ${rgbSet.colorG}, ${rgbSet.colorB}, ${rgbSet.opacity})`;
        this.angle = angle;
        this.circleCenterX = circleCenter.circleCenterX;
        this.circleCenterY = circleCenter.circleCenterY;
        this.newX = newCoordinates.newX;
        this.newY = newCoordinates.newY;

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
            if ((MOUSE.x - this.x < TOUCHRANGE) && (MOUSE.x - this.x > -TOUCHRANGE) && (MOUSE.y - this.y < TOUCHRANGE) && (MOUSE.y - this.y > -TOUCHRANGE)) {

                if (this.velocity > -4 && this.velocity < 8) {
                    this.velocity = this.velocity * 10;
                }

                // For every n-th star in a touch range a firework object is created 
                if (countForDisperse === DISPERSION) {
                    context.beginPath();
                    const newShootingStar = new ShootingStar(this.x, this.y, radius, this.color);
                    newShootingStar.initShooting();
                    shootingstars.push(newShootingStar);

                    countForDisperse = 0;

                } else if (countForDisperse < DISPERSION) {
                    countForDisperse++;

                }

            } else if ((MOUSE.x - this.x < PROXIMITY) && (MOUSE.x - this.x > -PROXIMITY) && (MOUSE.y - this.y < PROXIMITY) && (MOUSE.y - this.y > -PROXIMITY)) {

                // If the mouse is in the certain range from stars centre, increase the orbiting velocity AND make stars sparkle brighter
                if (this.velocity > -4 && this.velocity < 8) {
                    this.velocity = this.velocity * 10;
                }

                this.color = `rgb(${rgbSet.colorR}, ${rgbSet.colorG}, ${rgbSet.colorB}, ${SPARKLE})`;


            } else if (this.velocity >= 8 || this.velocity <= -4) {

                // Reset the velocity and opacity
                this.velocity = (Math.random() - Math.random() * 0.5) * 8;
                this.color = `rgb(${rgbSet.colorR}, ${rgbSet.colorG}, ${rgbSet.colorB}, ${Math.random() * (MAXOPACITY - MINOPACITY) + MINOPACITY})`;
            }

            this.create();
            return countForDisperse;
        }
    }

    function ShootingStar(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        //this.radius = 2;
        this.acceleration = 6;
        this.velocity = Math.random() * 2 * this.acceleration;

        this.initShooting = function () {
            context.beginPath();

            // Choose the range of the shooting angle
            this.shootingAngle = (Math.random() * Math.PI / 2) + Math.PI / 4;
            this.newX = Math.cos(this.shootingAngle) * this.velocity;
            this.newY = -(Math.sin(this.shootingAngle) * this.velocity);
        }

        this.shoot = function () {

            // Keep the shooting stars array clean and remove the stars when they exit the screen
            if (this.x < 0 || this.y < 0 || this.x > CANVAS.width || this.y > CANVAS.height) {
                shootingstars.splice(shootingstars.indexOf(this), 1);
            }

            context.beginPath();
            this.x += this.newX;
            this.y += this.newY;
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            context.fillStyle = this.color;
            context.fill();
            this.newY += 0.01 * this.acceleration;

            // If the shooting star hits the random path in certain range, initialize explosion
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
                        const boomText = new Boom(this.newX, this.newY, this.radius, this.color, this.zeroDistX, this.zeroDistY, this.maxDist);
                        burstnumbers.push(boomText);
                        boomText.x = this.x;
                        boomText.y = this.y;
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

    // Text from explosion
    function Boom(x, y, radius, color, zeroDistX, zeroDistY, maxDist) {
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
            //context.drawImage(devLogo, this.x, this.y, 72.6, 109)
            context.strokeText("devKarin", this.x, this.y);

            // Taking advantage of the fall duration and of the amount fall function is fired - the more it is fired, the bolder the congratulation text is.
            // As the particles disappear - the text seems to be fading. 
            writeTheApplicationNameAndAuthor(this.color);
            this.y += 0.01 * this.acceleration;
            this.radius += 1.5;
        }
    }

    function writeTheApplicationNameAndAuthor(color) {
        this.color = color;
        context.font = "80px Lucida Handwriting";
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.strokeText("Fireworks by", (CANVAS.width / 2), (CANVAS.height / 6 * 4));

        devLogo.style.display = 'block';
        devLogo.style.position = 'absolute';
        devLogo.style.height = '300px';
        devLogo.style.width = '300px';
        devLogo.style.top = `${CANVAS.height - 310}px`;
        devLogo.style.left = `${(CANVAS.width / 2) - 150}px`;

        let glassesArray = devLogo.contentDocument.getElementsByClassName('st3');

        for (const element of glassesArray) {
            element.style.fill = this.color;
            element.style.stroke = this.color;
        }
    }



    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        devLogo.style.display = 'none';
        // Clears the whole canvas before next animation round
        context.clearRect(0, 0, innerWidth, innerHeight);

        shootingstars.forEach(star => star.shoot());
        burstparticles.forEach(burstparticle => burstparticle.fall());
        burstnumbers.forEach(burstnumber => burstnumber.rain());
        allStars.forEach(individualStar => individualStar.update());
    }

    // Make the resizing and animation happen
    initialize();
    animate();

    // Clean up
    return () => {
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', mousemove);
    }
}

playCanvas();