// check when mouse is first down
var mouseDown = false;
var mX = null;
var mY = null;
function mouseClick(e) {
    mouseDown = true;
    mX = e.clientX;
    mY = e.clientY;
}

function mouseMove(e) {
    if (mouseDown) {
        var x = e.clientX;
        var y = e.clientY;
        var dx = x - mX;
        var dy = y - mY;
        mX = x;
        mY = y;
        back.move(dx, dy);
    }
}

function mouseUp() {
    mouseDown = false;
}