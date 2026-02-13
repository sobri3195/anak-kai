var data;
$.getJSON("data copy.json", function(d) {
  data = d;
});

function SD_status(x) {
  dict = [-3, -2, -1, 0, 1, 2, 3, 4];
  // normal = -2 .. 1
  return dict[x];
}

function get_prop(gender, v2, v1, value) {
  var arr = data[gender][v1][v2];

  // set ub as upper bound di SD (nilai terkecil yang lebih besar dari value)
  var ub = 0
  while(ub < arr.length && value >= arr[ub]) {
    ++ub;
  }

  // console.log("VALUE = " + value + "; UB = " + ub + ", " + arr[ub])
  // console.log("COMPARE " + (value < arr[ub]))
  status = SD_status(ub);
  return [ub, status];
}

function getUmur() {  return $("#age").val(); }
function getLength() {  return $("#tb").val(); }
function getWeight() {  return $("#bb").val(); }
function getHc() {  return 50; }
function Gender() { return $("#gender").val(); }

function interpret() {
  var umur = getUmur(),
      length = getLength(),
      weight = getWeight(),
      hc = getHc(),
      gender = Gender();

  /** LENGTH FOR AGE
   * below -2 = stunted
   * below -3 = severely stunted
   */
  // console.log("L = ", length)
  var s = get_prop(gender, umur, "lfa", length);
  var sd = s[1], idx = s[0];
  var txt = "Normal";
  if(sd == -3) txt = "Severely Stunted";
  else if(sd == -2) txt = "Stunted";
  updateText("Panjang badan terhadap umur: " + txt);
  draw_pos(document.getElementById("img1"), gender, "lfa", umur, length);

  /** WEIGHT FOR AGE
   * below -2 = underweight
   * below -3 = severely underweight
   */
  s = get_prop(gender, umur, "wfa", weight);
  sd = s[1], idx = s[0];
  txt = "Normal";
  if (sd == -3) txt = "Severely Underweight";
  else if(sd == -2) txt = "Underweight";
  updateText("Berat badan terhadap umur: " + txt, true);
  draw_pos(document.getElementById("img2"), gender, "wfa", umur, weight);

  /* WEIGHT FOR LENGTH
   * above 3 = obese
   * above 2 = overweight
   * above 1 = risk
   * below -2 = wasted
   * below -3 = severely wasted
   */
  s = get_prop(gender, (length-40)*2, "wfl", weight);
  sd = s[1], idx = s[0];
  txt = "Normal";
  wfl_d = ["Gizi kurang", "Gizi rendah", "Normal", "Normal", "Normal", "Resiko Overweight", "Overweight", "Obese"];
  txt = wfl_d[idx];
  updateText("PB terhadap BB: " + txt, true);
  draw_pos(document.getElementById("img3"), gender, "wfl", length, weight);
}

$(document).ready(function() {
  for(var i = 0;i <= 24;++i) {
    $("#age").append( $("<option>").attr("value",i)
                      .text(i.toString() + " bulan") );
  }
  $("#but").click(function() {
    interpret();
  });
});

// functions to modify display
function updateText(txt, append) {
  append = append || false;
  if(!append)
    $("#hasil").text(txt);
  else {
    $("#hasil").append("<br/>" + txt);
  }
}
