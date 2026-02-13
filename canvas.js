
function draw_pos(canvas, gender, prop, val1, val2) {
  var umur = val1, val = val2;
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.src = "charts/" + prop + "_" + gender + ".jpeg";
  img.onload = function() {
    ctx.drawImage(img, 0, 0, 800, 800 * img.height / img.width);

    /* SECTION LEFT OUT, THIS IS FOR OBTAINING PRECISION ON OUR DRAWING
    // dapatkan warna non-putih pertama
    */

    var xstart = 105, ystart = 105; // TOPLEFT-MOST
    var xend = 680, yend = 465; // BOTTOMRIGHT
    var x = xstart, y = ystart;
    // X --> umur
    // Y --> length
    if(prop == "lfa") {
      ystart = 139; yend = 348+140;
      // SCALE = 15 cm untuk 97 px
      // YS = 95, YEND = 40

      x = xstart + (umur/24)*(xend-xstart); // x coordinate
      y = ystart + (95-val)*(97/15); // y coordinate
      // y = 236;
    } else if (prop == "wfa") {
      // YSTART --> 17, YEND --> 1,
      ystart = 130; yend = 490;

      x = xstart + (umur/24)*(xend-xstart);
      y = yend - (val-1)/16*(yend-ystart);
    } else if (prop == "wfl") {
      ystart = 130; yend = 435;
      // YS = 24, YE = 4
      l = val1, w = val2;

      x = xstart + (l-45)/65*(xend-xstart);
      y = yend+61 - w/24*(yend+61-ystart);
    }
    // y = yend;
    console.log(x + " " + y + ": X Y");
    var radius = 4; // Arc radius
    var startAngle = 0; // Starting point on circle
    var endAngle = Math.PI*2; // End point on circle

    draw_circle(ctx, x, y, radius, startAngle, endAngle)
  }
}

function draw_circle(ctx, x, y, radius, startAngle, endAngle) {
  // DRAW CIRCLE!
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, true);
  ctx.fill();
}

$(document).ready(function(){
  canvas = $("canvas#img1")[0];
})
