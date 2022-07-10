function scale(canvas, grid) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    canvas.getContext('2d').scale(dpr, dpr);   
    grid.draw();
}

const variableList = ['x', 'y', 'z', 'w'];
const inputRadius = 7;
const outputRadius = 7;

class input {
    constructor(x, y, node) {
        this.x = x;
        this.y = y;
        this.node = node;
        this.connectedFrom = null;
    }

    draw(xoffset, yoffset, index) {
        ctx.fillStyle = 'white';
        ctx.font = '16px serif';
        ctx.fillText(variableList[index], this.x + xoffset-10, this.y + yoffset-10);
        ctx.beginPath();
        ctx.arc(this.x + xoffset, this.y + yoffset, inputRadius, 0, 2 * Math.PI);
        ctx.fill();
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
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
            this.node.grid.draw();
        }
    }

    disconnect(input) {
        if (input.connectedFrom != null) {
            input.connectedFrom.connectedTo.splice(input.connectedFrom.connectedTo.indexOf(input), 1);
            input.connectedFrom = null;
            this.node.grid.draw();
        }
    }

    draw(xoffset, yoffset) {
        ctx.fillStyle = '#5c5c5c';
        ctx.beginPath();
        ctx.arc(this.x + xoffset, this.y + yoffset, outputRadius , 0, 2 * Math.PI);
        ctx.fill();
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

class textField {
    constructor(x, y, width, height, node) {
        this.text = "";
        this.x = x;
        this.y = y;
        this.canvasInput = new CanvasInput({
            canvas: document.getElementById('canvas'),
            fontSize: 15,
            fontFamily: 'Serif',
            x: x,
            y: y,
            width: width,
            height: height,
            placeHolder: '0',
            onkeydown: function() {
                node.grid.draw();
            }
        });
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    draw(xoffset, yoffset) {
        this.canvasInput._x = this.x + xoffset;
        this.canvasInput._y = this.y + yoffset;
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
        this.firstNodes = [];
    }

    draw() {
        ctx.fillStyle = '#202124';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.drawLines();
        this.drawNodes();
        this.drawConnections();
        this.calculate();
    }

    calculate() {
        this.calculateFirst();
        for (var i = 0; i < this.firstNodes.length; i++) {
            this.firstNodes[i].calculate();
        }
    }

    calculateFirst() {
        var self = this;
        this.firstNodes = [];
        this.nodes.forEach(function(node) {
            self.recurseCalculate(node);
        });
    }

    recurseCalculate(node) {
        var self = this;
        if(node.emptyInputs() == 0 && this.firstNodes.indexOf(node) == -1) {
            this.firstNodes.push(node);
        }
        if(node.emptyInputs() != 0) {
            node.inputs.forEach(function(input) {
                if(input.connectedFrom != null) {
                    self.recurseCalculate(input.connectedFrom.node);
                }
            });
        }
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
        ctx.strokeStyle = '#f21b2d';
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
                    ctx.strokeStyle = '#0099ff';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(this.nodes[k].outputs[i].x + this.xoffset, this.nodes[k].outputs[i].y + this.yoffset);
                    ctx.lineTo(this.nodes[k].outputs[i].connectedTo[j].x + this.xoffset, this.nodes[k].outputs[i].connectedTo[j].y + this.yoffset);
                    ctx.stroke();
                    ctx.fillStyle = 'white';
                    ctx.fillText(this.nodes[k].outs[i], (this.nodes[k].outputs[i].x + 2*this.xoffset + this.nodes[k].outputs[i].connectedTo[j].x)/2, (this.nodes[k].outputs[i].y + 2*this.yoffset + this.nodes[k].outputs[i].connectedTo[j].y)/2);
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
        this.yscale = 200;
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
        this.ins = [];
        this.outs = [];
    }

    generateInputs() {
        for (var i = 0; i < this.numInput; i++) {
            var x = this.x;
            var y = this.y + 48 + i * 40;
            this.inputs.push(new input(x, y, this));
        }
    }

    generateOutputs() {
        for (var i = 0; i < this.numOutput; i++) {
            var x = this.x + this.xscale;
            var y = this.y + 48 + i * 40;
            this.outputs.push(new output(x, y, this));
        }
    }

    generateTextFields() {
        for (var i = 0; i < this.numOutput; i++) {
            this.textFields.push(new textField(this.x+10, this.y+33+40*i, this.xscale-(14+20), 20, this));
        }
    }

    calculate() {
        for (var i = 0; i < 4; i++) {
            if (this.ins[i] == undefined) {
                this.ins[i] = 0;
            }
        }
        for (var i = 0; i < this.outputs.length; i++) {
            this.outs[i] = nerdamer(this.textFields[i].canvasInput._value, {x: this.ins[0], y: this.ins[1], z: this.ins[2], w: this.ins[3]});
            for (var j = 0; j < this.outputs[i].connectedTo.length; j++) {
                var input = this.outputs[i].connectedTo[j];
                var conIndex = input.node.inputs.indexOf(input);
                input.node.ins[conIndex] = this.outs[i];
                input.node.calculate();
            }
        }
    }

    drawInputs(xoffset, yoffset) {
        this.inputs.forEach(function(input, index) {
            input.draw(xoffset, yoffset, index);
        });
    }

    drawOutputs(xoffset, yoffset) {
        this.outputs.forEach(function(output) {
            output.draw(xoffset, yoffset);
        });
    }

    drawTextFields(xoffset, yoffset) {
        this.textFields.forEach(function(textField) {
            textField.draw(xoffset, yoffset);
        });
    }

    draw(xoffset, yoffset) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + xoffset, this.y + yoffset, this.xscale, this.yscale);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(this.x + xoffset, this.y + yoffset, this.xscale, 27);
        ctx.fillStyle = 'black';
        ctx.font = '20px serif';
        ctx.fillText(this.title, this.x + xoffset + 10, this.y + yoffset + 18);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + xoffset, this.y + yoffset + 27);
        ctx.lineTo(this.x + xoffset + this.xscale, this.y + yoffset + 27);
        ctx.stroke();
        this.drawInputs(xoffset, yoffset);
        this.drawOutputs(xoffset, yoffset);
        this.drawTextFields(xoffset, yoffset);
    }

    move(dx, dy) {
        var x = dx-this.x;
        var y = dy-this.y;
        this.inputs.forEach(function(input) {
            input.move(x, y);
        });
        this.outputs.forEach(function(output) {
            output.move(x, y);
        });
        this.textFields.forEach(function(textField) {
            textField.move(x, y);
        });
        this.x = dx;
        this.y = dy;
    }

    emptyInputs() {
        var count = 0;
        this.inputs.forEach(function(input) {
            if (input.connectedFrom == null) {
                count++;
            }
        });
        return count;
    }
}