// Getting the canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Resize canvas to fit screen
function resizeCanvas() {
  canvas.width = window.innerWidth;   
  canvas.height = window.innerHeight;
}

// Resize the canvas when the window is resized
window.addEventListener('resize', resizeCanvas);

// Initial canvas size setup
resizeCanvas();

// https://stackoverflow.com/questions/21788608/draw-overlap-of-3-circles-on-a-canvas
var ct = [
    'source-over',         //  0 The new drawing is placed on top of existing content.
    'source-in',           //  1 The new drawing only appears where it overlaps existing content. Everything else becomes transparent.
    'source-out',          //  2 The new drawing only appears where it does NOT overlap existing content.
    'source-atop',         //  3 The new drawing appears on top but only in overlapping areas.
    'destination-over',    //  4 The new drawing is placed behind existing content.
    'destination-in',      //  5 The existing content remains only where it overlaps the new drawing.
    'destination-out',     //  6 The existing content is erased where it overlaps the new drawing.
    'destination-atop',    //  7 The new drawing appears below but only in overlapping areas.
    'lighter',             //  8 Colors are added together, resulting in a brighter effect.
    'darker',              //  9 Used to create a darkening effect by multiplying colors.
    'copy',                // 10 Replaces everything with the new drawing, removing existing content.
    'xor'                  // 11 Overlapping areas become transparent, while non-overlapping areas remain visible.
];

// function draw rectangle
var drawRectangle = function(c, operation, color) {
    ctx.beginPath();
    ctx.globalCompositeOperation = ct[operation];
    ctx.fillStyle = color;
    ctx.rect(c.x, c.y,c.width, c.height);
    ctx.fill();
  }

// Define rectangle properties
var rectHeight = canvas.height / 4;  // Adjust height
var rectWidth = canvas.width / 4;   // Adjust width to take more space
var centerY = canvas.height / 2 ; // Center vertically

const original_rectHeight = rectHeight;
// Rectangle objects
var rec1 = { x: canvas.width/2 - 5 - rectWidth, y: centerY/2, width: rectWidth, height: rectWidth, color: 'red' };
var rec2 = { x: canvas.width/2 +10, y: centerY/2, width: rectWidth, height: rectWidth, color: 'cyan' };



// draw background
ctx.beginPath();
ctx.globalCompositeOperation = ct[4];
ctx.fill();

// draw circles
drawScene()

// Listen for keyboard events to change position
document.addEventListener('keydown', function(event) {
    const moveSpeed = 10;

    if (event.key === 'ArrowUp') {
      rec2.y -= moveSpeed;
    } else if (event.key === 'ArrowDown') {
      rec2.y += moveSpeed;
    } else if (event.key === 'ArrowLeft') {
      rec2.x -= moveSpeed;
    } else if (event.key === 'ArrowRight') {
      rec2.x += moveSpeed; 
    }
  
    drawScene();
});

// Liste for mouse click in each side of the screen
document.addEventListener('mousedown', function(event) {
  const screenMiddle = window.innerWidth / 2;
  let newWidth = rec2.width;
  let newHeight = rec2.height;
  
  if (event.clientX > screenMiddle) {
      newHeight += 10;
  } else {
      newHeight = Math.max(10, rec2.height - 10);
  }
  
  rec2.x -= (newWidth - rec2.width) / 2;
  rec2.y -= (newHeight - rec2.height) / 2;

  rec2.width = Math.max(1, newWidth);
  rec2.height = Math.max(1, newHeight);
  drawScene();
});

// Liste for touch in each side of the screen
document.addEventListener('touchstart', function(event) {
  const screenMiddle = window.innerWidth / 2;
  let newWidth = rec2.width;
  let newHeight = rec2.height;
  
  let clientX = event.touches[0].clientX;
  
  if (clientX > screenMiddle) {
      newHeight += 10;
  } else {
      newHeight = Math.max(10, rec2.height - 10);
  }
  
  rec2.x -= (newWidth - rec2.width) / 2;
  rec2.y -= (newHeight - rec2.height) / 2;

  rec2.width = Math.max(1, newWidth);
  rec2.height = Math.max(1, newHeight);
  drawScene();
  setTimeout(() => {}, 1500);
});

// Mouse scroll event (Zoom in/out) to change scale
document.addEventListener('wheel', function(event) {
  let scaleFactor = event.deltaY < 0 ? 10 : -10;

  let newWidth = rec2.width;
  let newHeight = rec2.height + scaleFactor;

  rec2.x -= (newWidth - rec2.width) / 2;
  rec2.y -= (newHeight - rec2.height) / 2;

  rec2.width = Math.max(1, newWidth);
  rec2.height = Math.max(1, newHeight);

  drawScene();
});

// // Mouse scroll event (Zoom in/out) to change scale
// document.addEventListener('wheel', function(event) {
//   let scaleFactor = event.deltaY < 0 ? 10 : -10;

//   let newWidth = rec2.width + scaleFactor;
//   let newHeight = rec2.height + scaleFactor;

//   rec2.x -= (newWidth - rec2.width) / 2;
//   rec2.y -= (newHeight - rec2.height) / 2;

//   rec2.width = Math.max(1, newWidth);
//   rec2.height = Math.max(1, newHeight);

//   drawScene();
// });

// Function to draw the scene
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.globalCompositeOperation = ct[4];
  ctx.fill();

  drawRectangle(rec2, 4, 'cyan');
  drawRectangle(rec1, 3, 'white');
  drawRectangle(rec1, 4, 'red');
  drawStaticText()
}

// Function to draw "L" and "R" and "%" text
function drawStaticText() {
  ctx.fillStyle = "black";
  ctx.font = "bold 50px Arial";
  ctx.fillText("L", canvas.width*0.1, canvas.height - 50);
  ctx.fillText("R", canvas.width*0.9, canvas.height - 50);

  ctx.font = "bold 25px Arial";
  ctx.fillText("+",canvas.width / 2 - 5, canvas.height / 2);

  ctx.font = "bold 20px Arial";
  ctx.fillText("Porcentagem de Aniseiconia", canvas.width*0.02, canvas.height*0.1);
  ctx.fillText(`% ${(Math.abs(rec2.height - rec1.height) / rec1.height * 100).toFixed(2)}`, canvas.width * 0.07, canvas.height * 0.1 + 30);
}