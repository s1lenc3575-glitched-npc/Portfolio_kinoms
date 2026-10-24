document.addEventListener("DOMContentLoaded", () => {
    

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });
    }

   
    const canvas = document.createElement("canvas");
    canvas.id = "fireflies-canvas";
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext("2d");
    let width, height;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

 
    const pointer = { x: null, y: null };

    window.addEventListener("mousemove", (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
    });
    window.addEventListener("mouseout", () => {
        pointer.x = null;
        pointer.y = null;
    });
    window.addEventListener("touchstart", (e) => {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
    });
    window.addEventListener("touchmove", (e) => {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
    });
    window.addEventListener("touchend", () => {
        pointer.x = null;
        pointer.y = null;
    });

    class Firefly {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
       
            this.baseRadius = Math.random() * 1.5 + 0.5;
            this.baseAlpha = Math.random() * 0.4 + 0.3; 
            
           
            this.currentAlpha = this.baseAlpha;
            this.currentRadiusMult = 1;
            
           
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = (Math.random() - 0.5) * 0.02; 
            
            this.pulseCounter = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            
            this.angle += this.angleSpeed;
            this.x += this.vx + Math.cos(this.angle) * 0.3;
            this.y += this.vy + Math.sin(this.angle) * 0.3;

          
            if (this.x < -20) this.x = width + 20;
            if (this.x > width + 20) this.x = -20;
            if (this.y < -20) this.y = height + 20;
            if (this.y > height + 20) this.y = -20;

            let targetAlpha = this.baseAlpha;
            let targetRadiusMult = 1;

            if (pointer.x !== null && pointer.y !== null) {
                const dx = this.x - pointer.x;
                const dy = this.y - pointer.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const repelRadius = 160;

                if (distance < repelRadius) {
                    const force = (repelRadius - distance) / repelRadius;
                    
                    this.x += (dx / distance) * force * 1.2;
                    this.y += (dy / distance) * force * 1.2;
                   
                    targetAlpha = Math.min(this.baseAlpha * 2, 1);
                    targetRadiusMult = 1.3;
                }
            }

            
            this.currentAlpha += (targetAlpha - this.currentAlpha) * 0.08;
            this.currentRadiusMult += (targetRadiusMult - this.currentRadiusMult) * 0.08;

         
            this.pulseCounter += this.pulseSpeed;
            
            const breathingModifier = (Math.sin(this.pulseCounter) * 0.3) + 0.7; 
            
            const finalAlpha = this.currentAlpha * breathingModifier;
            const finalRadiusMult = this.currentRadiusMult * breathingModifier;

            this.draw(finalAlpha, finalRadiusMult);
        }

        draw(alpha, radiusMult) {
            const coreRadius = this.baseRadius * radiusMult;
            const outerRadius = coreRadius * 8;


            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, outerRadius);
            
           
            gradient.addColorStop(0, `rgba(255, 250, 240, ${alpha})`);
           
            gradient.addColorStop(0.15, `rgba(245, 222, 179, ${alpha * 0.7})`);
           
            gradient.addColorStop(0.5, `rgba(245, 222, 179, ${alpha * 0.15})`);
           
            gradient.addColorStop(1, `rgba(245, 222, 179, 0)`);

            ctx.beginPath();
            ctx.arc(this.x, this.y, outerRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

   
    const particles = [];
    const numParticles = window.innerWidth < 768 ? 25 : 55;
    
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Firefly());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => p.update());
        requestAnimationFrame(animate);
    }
    animate();
});