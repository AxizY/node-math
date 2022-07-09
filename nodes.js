function scale(canvas, grid) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    canvas.getContext('2d').scale(dpr, dpr);   
    grid.draw();
}

class input {
    constructor(x, y, node) {
        this.x = x;
        this.y = y;
        this.node = node;
        this.connectedFrom = null;
    }
}

class output {
    constructor(x, y, node) {
        this.connectedTo = [];
        this.x = x;
        this.y = y;
        this.node = node;
    }

    connect(input) {
        if (input.node != this.node && input.connectedFrom == null) {
            this.connectedTo.push(input);
            input.connectedFrom = outputMouse;
            this.node.grid.draw(canvas);
        }
    }

    disconnect(input) {
        if (input.connectedFrom != null) {
            input.connectedFrom.connectedTo.splice(input.connectedFrom.connectedTo.indexOf(input), 1);
            input.connectedFrom = null;
            this.node.grid.draw();
        }
    }
}

class textField {
    constructor(x, y, width, height) {
        this.text = "";
        this.canvasInput = new CanvasInput({
            canvas: document.getElementById('canvas'),
            fontSize: 20,
            fontFamily: 'Serif',
            x: x,
            y: y,
            width: width,
            height: height
        });
    }

    draw() {
        this.canvasInput.render();
    }
}

class grid {
    constructor() {
        this.xscale = 50;
        this.yscale = 50;
        this.xoffset = 0;
        this.yoffset = 0;
        this.nodes = [];
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawLines();
        this.drawNodes();
        this.drawConnections();
    }

    drawLines() {
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;
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
    }

    drawNodes() {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw(this.xoffset, this.yoffset);
        }
    }

    drawOutcon(outputMouse, x, y) {
        ctx.fillStyle = 'black';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(outputMouse.x + this.xoffset, outputMouse.y + this.yoffset);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    drawConnections() {
        for (var k = 0; k < this.nodes.length; k++) {
            for (var i = 0; i < this.nodes[k].outputs.length; i++) {
                for (var j = 0; j < this.nodes[k].outputs[i].connectedTo.length; j++) {
                    ctx.strokeStyle = 'green';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(this.nodes[k].outputs[i].x + this.xoffset, this.nodes[k].outputs[i].y + this.yoffset);
                    ctx.lineTo(this.nodes[k].outputs[i].connectedTo[j].x + this.xoffset, this.nodes[k].outputs[i].connectedTo[j].y + this.yoffset);
                    ctx.stroke();
                }
            }
        }
    }

    addNode(node) {
        this.nodes.push(node);
        node.grid = this;
    }

    getNode(x, y) {
        x -= this.xoffset;
        y -= this.yoffset;
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].x <= x && this.nodes[i].x + this.nodes[i].xscale >= x && this.nodes[i].y <= y && this.nodes[i].y + this.nodes[i].yscale >= y) {
                return this.nodes[i];
            }
        }
    }

    getOutput(x, y) {
        for (var i = 0; i < this.nodes.length; i++) {
            for (var j = 0; j < this.nodes[i].outputs.length; j++) {
                if (Math.sqrt(Math.pow(x - (this.xoffset + this.nodes[i].outputs[j].x), 2) + Math.pow(y - (this.nodes[i].outputs[j].y + this.yoffset), 2)) <= 7) {
                    return this.nodes[i].outputs[j];
                }
            }
        }
    }

    getInput(x, y) {
        for (var i = 0; i < this.nodes.length; i++) {
            for (var j = 0; j < this.nodes[i].inputs.length; j++) {
                if (Math.sqrt(Math.pow(x - (this.xoffset + this.nodes[i].inputs[j].x), 2) + Math.pow(y - (this.nodes[i].inputs[j].y + this.yoffset), 2)) <= 7) {
                    return this.nodes[i].inputs[j];
                }
            }
        }
    }

    drag(x, y, mX, mY) {
        this.xoffset += x - mX;
        this.yoffset += y - mY;
        this.draw(canvas);
    }
}

class node {
    constructor(x, y, color, title, numInput, numOutput, _grid) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.xscale = 150;
        this.yscale = 150;
        this.title = title;
        this.inputs = [];
        this.outputs = [];
        this.textFields = [];
        this.numInput = numInput;
        this.numOutput = numOutput;
        this.generateInputs();
        this.generateOutputs();
        this.generateTextFields();
        this.grid = _grid;
    }

    generateInputs() {
        for (var i = 0; i < this.numInput; i++) {
            var x = this.x;
            var y = this.y + 12 + i * 28;
            this.inputs.push(new input(x, y, this));
        }
    }

    generateOutputs() {
        for (var i = 0; i < this.numOutput; i++) {
            var x = this.x + this.xscale;
            var y = this.y + 12 + i * 28;
            this.outputs.push(new output(x, y, this));
        }
    }

    generateTextFields() {
        for (var i = 0; i < this.numOutput; i++) {
            this.textFields.push(new textField(this.x+10, 50, 130, 20));
        }
    }

    drawInputs(xoffset, yoffset) {
        for (var i = 0; i < this.inputs.length; i++) {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x + xoffset, this.y + 12 + i * 28 + yoffset, 7, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    drawOutputs(xoffset, yoffset) {
        for (var i = 0; i < this.outputs.length; i++) {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x + this.xscale + xoffset, this.y + 12 + i * 28 + yoffset, 7, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    drawTextFields() {
        for (var i = 0; i < this.textFields.length; i++) {
            this.textFields[i].draw();
        }
    }

    draw(xoffset, yoffset) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + xoffset, this.y + yoffset, this.xscale, this.yscale);
        ctx.fillStyle = 'black';
        ctx.font = '20px serif';
        ctx.fillText(this.title, this.x + xoffset + 10, this.y + yoffset + 20);
        this.drawInputs(xoffset, yoffset);
        this.drawOutputs(xoffset, yoffset);
        this.drawTextFields();
    }

    move(dx, dy) {
        for (var i = 0; i < this.inputs.length; i++) {
            this.inputs[i].x += dx-this.x;
            this.inputs[i].y += dy-this.y;
        }
        for (var i = 0; i < this.outputs.length; i++) {
            this.outputs[i].x += dx-this.x;
            this.outputs[i].y += dy-this.y;
        }
        for(var i = 0; i < this.textFields.length; i++) {
            this.textFields[i].x += dx-this.x;
            this.textFields[i].y += dy-this.y;
        }
        this.x = dx;
        this.y = dy;
    }
}