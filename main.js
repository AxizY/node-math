const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var back = new grid();
back.addNode(new node(100, 100, 'blue'));
scale(canvas, back);
window.addEventListener('resize', scale.bind(null, canvas, back));
canvas.addEventListener('mousedown', mouseClick);
canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mouseup', mouseUp);