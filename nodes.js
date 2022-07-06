function scale(canvas, grid) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    canvas.getContext('2d').scale(dpr, dpr);   
    grid.draw();
}

class grid {
    constructor() {
        this.xscale = 10;
        this.yscale = 10;
        this.xoffset = 0;
        this.yoffset = 0;
        this.nodes = [];
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < window.innerWidth; i += this.xscale) {
            ctx.beginPath();
            ctx.moveTo(i + this.xoffset, 0);
            ctx.lineTo(i + this.xoffset, window.innerHeight);
            ctx.stroke();
        }
        for (var i = 0; i < window.innerHeight; i += this.yscale) {
            ctx.beginPath();
            ctx.moveTo(0, i + this.yoffset);
            ctx.lineTo(window.innerWidth, i + this.yoffset);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(window.innerWidth / 2 + this.xoffset, 0);
        ctx.lineTo(window.innerWidth / 2 + this.xoffset, window.innerHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, window.innerHeight / 2 + this.yoffset);
        ctx.lineTo(window.innerWidth, window.innerHeight / 2 + this.yoffset);
        ctx.stroke();

        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw(canvas);
        }
    }

    addNode(node) {
        this.nodes.push(node);
    }

    move(dx, dy) {
        this.xoffset += dx;
        this.yoffset += dy;
        this.draw(canvas);
    }
}

class node {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.xscale = 10;
        this.yscale = 10;
    }

    draw(canvas) {
        // each node is a rectangle
        // the rectangle should be this.color
        canvas.getContext('2d').fillStyle = this.color;
        canvas.getContext('2d').fillRect(this.x, this.y, this.xscale, this.yscale);
    }
}