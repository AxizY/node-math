var gridMouse = false;

var nodeMouse = null;
var outputMouse = null;

var mX = null;
var mY = null;
var relX = null;
var relY = null;

function mouseClick(e) {
    let input = back.getInput(e.clientX, e.clientY);
    if (input != null) {
        outputMouse = input.connectedFrom;
        outputMouse.disconnect(input);
    }
    outputMouse = back.getOutput(e.clientX, e.clientY);
    if (outputMouse != null) {
        return
    }
    nodeMouse = back.getNode(e.clientX, e.clientY);
    if(nodeMouse == null) {
        gridMouse = true;
    } else {
        relX = e.clientX - nodeMouse.x;
        relY = e.clientY - nodeMouse.y;
    }
    mX = e.clientX;
    mY = e.clientY;
}

function mouseMove(e) {
    if(outputMouse != null) {
        back.draw(canvas);
        back.drawOutcon(outputMouse, e.clientX, e.clientY);
    }
    if(gridMouse) {
        back.drag(e.clientX, e.clientY, mX, mY);
        mX = e.clientX;
        mY = e.clientY;
    }
    if(nodeMouse != null) {
        nodeMouse.move(e.clientX - relX, e.clientY - relY);
        back.draw(canvas);
    }
}

function mouseUp(e) {
    if (outputMouse != null) {
        var input = back.getInput(e.clientX, e.clientY);
        if (input != null) {
            outputMouse.connect(input);
        }
    }

    outputMouse = null;
    gridMouse = false;
    nodeMouse = null;
    relX = null;
    relY = null;
    back.draw(canvas);
}