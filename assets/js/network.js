
const canvas = document.getElementById("dataNetworkCanvas");
const hero = document.getElementById("hero");

if (canvas && hero) {
    const ctx = canvas.getContext("2d");
    let particlesArray;

    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;

    let mouse = {
        x: null,
        y: null,
        radius: 120
    }

    hero.addEventListener('mousemove', function(event) {
        const rect = hero.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', function() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        init();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            // Soft fade on the left text area to preserve crystal-clear text contrast
            let leftFade = 1;
            if (canvas.width > 768 && this.x < canvas.width * 0.44) {
                leftFade = Math.max(0, (this.x - 40) / (canvas.width * 0.44 - 40));
            }
            if (leftFade <= 0.04) return;

            ctx.save();
            ctx.globalAlpha = leftFade * 0.55;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            // Collision detection with mouse (dodging effect)
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 2;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 2;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 2;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 2;
                    }
                }
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 12500;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1.2) - 0.6;
            let directionY = (Math.random() * 1.2) - 0.6;
            let color = Math.random() > 0.5 ? '#1a5cff' : '#c8a96e'; // Blue or Gold
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                // Lines between nodes
                if (distance < (canvas.width / 8) * (canvas.height / 8)) {
                    opacityValue = 1 - (distance / 15000);
                    let lineFade = 1;
                    if (canvas.width > 768) {
                        let avgX = (particlesArray[a].x + particlesArray[b].x) / 2;
                        if (avgX < canvas.width * 0.44) {
                            lineFade = Math.max(0, (avgX - 40) / (canvas.width * 0.44 - 40));
                        }
                    }
                    if (lineFade > 0.04) {
                        ctx.strokeStyle = `rgba(138, 138, 154, ${opacityValue * 0.18 * lineFade})`; // Soft, elegant lines
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
            
            // Connect to mouse with gold line
            if (mouse.x != null && mouse.y != null) {
                let distanceToMouse = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x))
                + ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
                
                if (distanceToMouse < 20000) {
                    opacityValue = 1 - (distanceToMouse / 20000);
                    ctx.strokeStyle = `rgba(200, 169, 110, ${opacityValue * 0.7})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }
    
    init();
    animate();
}
