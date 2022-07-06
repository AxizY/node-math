const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var back = new grid();

scale(canvas, back);
window.addEventListener('resize', scale.bind(null, canvas, back));

back.draw(canvas, ctx);