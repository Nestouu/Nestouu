class Noise {
    constructor(seed = Math.random()) {
      this.seed = seed;
    }
  
    perlin2(x, y) {
      return Math.sin(x * this.seed + y * this.seed);
    }
  }
  

class AWaves extends HTMLElement {
    /**
     * Init
     */
    connectedCallback() {
      // Elements
      this.canvas = this.querySelector(".js-canvas");
      this.ctx = this.canvas.getContext("2d");
  
      // Properties
      this.mouse = {
        x: -10,
        y: 0,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        v: 0,
        vs: 0,
        a: 0,
        set: false
      };
  
      this.lines = [];
      this.noise = new Noise(Math.random());
  
      // Init
      this.setSize();
      this.setLines();
  
      this.bindEvents();
  
      // RAF
      requestAnimationFrame(this.tick.bind(this));
    }
  
    /**
     * Bind events
     */
    bindEvents() {
      window.addEventListener("resize", this.onResize.bind(this));
      window.addEventListener("mousemove", this.onMouseMove.bind(this));
      this.addEventListener("touchmove", this.onTouchMove.bind(this));
    }
  
    /**
     * Resize handler
     */
    onResize() {
      this.setSize();
      this.setLines();
    }
  
    /**
     * Mouse handler
     */
    onMouseMove(e) {
      this.updateMousePosition(e.pageX, e.pageY);
    }
  
    /**
     * Touch handler
     */
    onTouchMove(e) {
      e.preventDefault();
  
      const touch = e.touches[0];
      this.updateMousePosition(touch.clientX, touch.clientY);
    }
  
    /**
     * Update mouse position
     */
    updateMousePosition(x, y) {
      const { mouse } = this;
  
      mouse.x = x - this.bounding.left;
      mouse.y = y - this.bounding.top + window.scrollY;
  
      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
  
        mouse.set = true;
      }
    }
  
    /**
     * Set size
     */
    setSize() {
      this.bounding = this.getBoundingClientRect();
  
      this.canvas.width = this.bounding.width;
      this.canvas.height = this.bounding.height;
    }
  
    /**
     * Set lines
     */
    setLines() {
        const { width, height } = this.bounding;
    
        this.lines = [];
    
        const xGap = 50; // Distance entre les lignes horizontales (augmenté à 50)
        const yGap = 50; // Distance entre les lignes verticales (augmenté à 50)
    
        const oWidth = width + 200;
        const oHeight = height + 30;
    
        const totalLines = Math.ceil(oWidth / xGap);
        const totalPoints = Math.ceil(oHeight / yGap);
    
        const xStart = (width - xGap * totalLines) / 2;
        const yStart = (height - yGap * totalPoints) / 2;
    
        for (let i = 0; i <= totalLines; i++) {
            const points = [];
    
            for (let j = 0; j <= totalPoints; j++) {
                const point = {
                    x: xStart + xGap * i,
                    y: yStart + yGap * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                    shape: Math.floor(Math.random() * 3) // 0: cercle, 1: carré, 2: triangle
                };
    
                points.push(point);
            }
    
            // Add points
            this.lines.push(points);
        }
    }
    
    
    
  
    /**
     * Move points
     */
    movePoints(time) {
      const { lines, mouse, noise } = this;
  
      lines.forEach((points) => {
        points.forEach((p) => {
          // Wave movement
          const move =
            noise.perlin2(
              (p.x + time * 0.0125) * 0.002,
              (p.y + time * 0.005) * 0.0015
            ) * 12;
          p.wave.x = Math.cos(move) * 32;
          p.wave.y = Math.sin(move) * 16;
  
          // Mouse effect
          const dx = p.x - mouse.sx;
          const dy = p.y - mouse.sy;
          const d = Math.hypot(dx, dy);
          const l = Math.max(175, mouse.vs);
  
          if (d < l) {
            const s = 1 - d / l;
            const f = Math.cos(d * 0.001) * s;
  
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
          }
  
          p.cursor.vx += (0 - p.cursor.x) * 0.005; // String tension
          p.cursor.vy += (0 - p.cursor.y) * 0.005;
  
          p.cursor.vx *= 0.925; // Friction/duration
          p.cursor.vy *= 0.925;
  
          p.cursor.x += p.cursor.vx * 2; // Strength
          p.cursor.y += p.cursor.vy * 2;
  
          p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x)); // Clamp movement
          p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y));
        });
      });
    }
  
    /**
     * Get point coordinates with movement added
     */
    moved(point, withCursorForce = true) {
      const coords = {
        x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
        y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0)
      };
  
      // Round to 2 decimals
      coords.x = Math.round(coords.x * 10) / 10;
      coords.y = Math.round(coords.y * 10) / 10;
  
      return coords;
    }
  
    /**
     * Draw lines
     */
    drawLines() {
        const { lines, moved, ctx, bounding } = this;
    
        ctx.clearRect(0, 0, bounding.width, bounding.height);
    
        // Remplit le canvas avec un fond rouge
        ctx.fillStyle = "#ff0056"; // Nouvelle couleur de fond
        ctx.fillRect(0, 0, bounding.width, bounding.height);
    
        // Dessine des formes
        lines.forEach((points) => {
            points.forEach((p1) => {
                const position = moved(p1, true);
                const shape = p1.shape; // Type de forme assigné
    
                if (shape === 0) {
                    // Dessiner un cercle
                    ctx.beginPath();
                    ctx.arc(position.x, position.y, 15, 0, Math.PI * 2); // Rayon augmenté à 15
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 3; // Augmenter l'épaisseur des traits
                    ctx.stroke();
                } else if (shape === 1) {
                    // Dessiner un carré
                    const size = 30; // Taille augmentée à 30
                    ctx.beginPath();
                    ctx.rect(position.x - size / 2, position.y - size / 2, size, size);
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 3; // Augmenter l'épaisseur des traits
                    ctx.stroke();
                } else if (shape === 2) {
                    // Dessiner un triangle
                    const size = 30; // Taille augmentée à 30
                    ctx.beginPath();
                    ctx.moveTo(position.x, position.y - size / 2); // Sommet supérieur
                    ctx.lineTo(position.x - size / 2, position.y + size / 2); // Bas gauche
                    ctx.lineTo(position.x + size / 2, position.y + size / 2); // Bas droit
                    ctx.closePath();
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 3; // Augmenter l'épaisseur des traits
                    ctx.stroke();
                }
            });
        });
    }
    
    
    
    
    
  
    /**
     * Tick
     */
    tick(time) {
      const { mouse } = this;
  
      // Smooth mouse movement
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
  
      // Mouse velocity
      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);
  
      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
  
      // Mouse last position
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
  
      // Mouse angle
      mouse.a = Math.atan2(dy, dx);
  
      // Animation
      this.style.setProperty("--x", `${mouse.sx}px`);
      this.style.setProperty("--y", `${mouse.sy}px`);
  
      this.movePoints(time);
      this.drawLines();
  
      requestAnimationFrame(this.tick.bind(this));
    }
  }
  
  customElements.define("a-waves", AWaves);
  