function scale(canvas, grid) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    grid.draw(canvas);
}

class grid {
    constructor() {
        this.xscale = 10;
        this.yscale = 10;
        this.xoffset = 0;
        this.yoffset = 0;
    }

    draw(canvas) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        for (let i = 0; i < canvas.width; i += this.xscale) {
            ctx.moveTo(i + this.xoffset, 0 + this.yoffset);
            ctx.lineTo(i + this.xoffset, canvas.height + this.yoffset);
        }
        for (let i = 0; i < canvas.height; i += this.yscale) {
            ctx.moveTo(0 + this.xoffset, i + this.yoffset);
            ctx.lineTo(canvas.width + this.xoffset, i + this.yoffset);
        }
        ctx.stroke();
    }
}
