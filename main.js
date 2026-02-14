var data;
var dataReady = false;
var domReady = false;

$.getJSON("data.json", function(d) {
  data = d;
  dataReady = true;
  if (domReady) {
    interpret();
  }
});

function SD_status(x) {
  dict = [-3, -2, -1, 0, 1, 2, 3, 4];
  // normal = -2 .. 1
  return dict[x];
}

function get_closest_wfl_key(length) {
  // wfl data has keys like "45", "45.5", "46", etc.
  // Find the closest key to the given length
  var keys = Object.keys(data.boys.wfl).map(parseFloat).sort(function(a, b) { return a - b; });
  
  // Find closest key
  var closest = keys[0];
  var minDiff = Math.abs(length - closest);
  
  for (var i = 1; i < keys.length; i++) {
    var diff = Math.abs(length - keys[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = keys[i];
    }
  }
  
  return closest.toString();
}

function get_prop(gender, v2, v1, value) {
  // For wfl, convert length to the correct key format
  if (v1 === "wfl" && !isNaN(parseFloat(v2))) {
    v2 = get_closest_wfl_key(parseFloat(v2));
  }
  
  var arr = data[gender][v1][v2];

  // Check if arr exists
  if (!arr) {
    console.error("Data not found for:", gender, v1, v2);
    return [0, SD_status(0)];
  }

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
function Gender() { return $("input[name='gender']:checked").val(); }

function buildSdLabel(sd) {
  return sd > 0 ? "+" + sd : sd.toString();
}

function buildTone(status) {
  if (status === "Normal") return "good";
  if (status === "Resiko Overweight") return "warn";
  if (status === "Overweight") return "warn";
  if (status === "Berat Lebih") return "warn";
  if (status === "Tinggi") return "warn";
  return status.indexOf("Normal") !== -1 ? "good" : "bad";
}

function renderResults(results) {
  var html = results.map(function(result) {
    return (
      "<div class=\"result-card\">" +
      "<div class=\"result-header\">" +
      "<h3>" + result.title + "</h3>" +
      "<span class=\"badge " + result.tone + "\">" + result.status + "</span>" +
      "</div>" +
      "<p class=\"result-meta\">Kategori SD: " + result.sdLabel + "</p>" +
      "<p class=\"result-detail\">" + result.detail + "</p>" +
      "<div class=\"result-advice\"><strong>Rekomendasi:</strong> " + result.advice + "</div>" +
      "</div>"
    );
  }).join("");

  $("#hasil").html(html);
}

function updateSummary(results) {
  var summary = results.map(function(result) {
    return result.shortLabel + ": " + result.status;
  }).join(" | ");

  $("#summaryText").text("Ringkasan cepat: " + summary + ".");
}

function interpret() {
  var umur = parseFloat(getUmur()),
      length = parseFloat(getLength()),
      weight = parseFloat(getWeight()),
      hc = getHc(),
      gender = Gender();

  // Validate inputs before proceeding
  if (isNaN(umur) || isNaN(length) || isNaN(weight) || !gender) {
    // Don't process if data is not valid
    return;
  }

  var results = [];

  /** LENGTH FOR AGE
   * below -2 = stunted
   * below -3 = severely stunted
   */
  var s = get_prop(gender, umur, "lfa", length);
  var sd = s[1], idx = s[0];
  var status = "Normal";
  var detail = "Panjang badan berada pada rentang normal berdasarkan umur.";
  var advice = "Pertahankan pola makan bergizi seimbang dan pemantauan rutin.";
  if (sd == -3) {
    status = "Sangat Pendek";
    detail = "Panjang badan jauh di bawah standar, mengindikasikan stunting berat.";
    advice = "Konsultasikan ke tenaga kesehatan untuk evaluasi pertumbuhan dan intervensi gizi.";
  } else if (sd == -2) {
    status = "Pendek";
    detail = "Panjang badan di bawah standar untuk usia anak.";
    advice = "Perhatikan asupan protein, mikronutrien, dan jadwal kontrol kesehatan.";
  } else if (sd >= 3) {
    status = "Tinggi";
    detail = "Panjang badan di atas rata-rata usia sebayanya.";
    advice = "Pastikan kebutuhan energi dan istirahat tercukupi agar pertumbuhan stabil.";
  }

  results.push({
    title: "Panjang/Tinggi Badan terhadap Umur",
    shortLabel: "PB/U",
    status: status,
    sdLabel: "SD " + buildSdLabel(sd),
    detail: detail,
    advice: advice,
    tone: buildTone(status)
  });
  draw_pos(document.getElementById("img1"), gender, "lfa", umur, length);

  /** WEIGHT FOR AGE
   * below -2 = underweight
   * below -3 = severely underweight
   */
  s = get_prop(gender, umur, "wfa", weight);
  sd = s[1], idx = s[0];
  status = "Normal";
  detail = "Berat badan sesuai dengan umur anak.";
  advice = "Lanjutkan variasi menu makanan agar asupan energi tetap terjaga.";
  if (sd == -3) {
    status = "Sangat Kurang";
    detail = "Berat badan jauh di bawah standar usia, mengarah pada gizi buruk.";
    advice = "Perlu penanganan segera dan pemantauan ketat dari tenaga kesehatan.";
  } else if (sd == -2) {
    status = "Kurang";
    detail = "Berat badan di bawah standar usia.";
    advice = "Tambahkan frekuensi makan, sumber protein, dan cek kesehatan rutin.";
  } else if (sd >= 3) {
    status = "Berat Lebih";
    detail = "Berat badan berada di atas rentang normal untuk usia.";
    advice = "Evaluasi pola makan dan aktivitas agar berat badan terkendali.";
  }

  results.push({
    title: "Berat Badan terhadap Umur",
    shortLabel: "BB/U",
    status: status,
    sdLabel: "SD " + buildSdLabel(sd),
    detail: detail,
    advice: advice,
    tone: buildTone(status)
  });
  draw_pos(document.getElementById("img2"), gender, "wfa", umur, weight);

  /* WEIGHT FOR LENGTH
   * above 3 = obese
   * above 2 = overweight
   * above 1 = risk
   * below -2 = wasted
   * below -3 = severely wasted
   */
  s = get_prop(gender, length, "wfl", weight);
  sd = s[1], idx = s[0];
  var wfl_d = ["Gizi kurang", "Gizi rendah", "Normal", "Normal", "Normal", "Resiko Overweight", "Overweight", "Obese"];
  status = wfl_d[idx];
  detail = "Proporsi berat badan terhadap panjang badan berada dalam batas wajar.";
  advice = "Pertahankan asupan makan seimbang dan aktivitas harian yang cukup.";
  if (status === "Gizi kurang") {
    detail = "Berat badan sangat rendah dibanding panjang badan.";
    advice = "Perlu tambahan energi, protein, dan pemantauan pertumbuhan lebih sering.";
  } else if (status === "Gizi rendah") {
    detail = "Berat badan lebih rendah dari yang diharapkan berdasarkan panjang badan.";
    advice = "Perbaiki pola makan dengan porsi lebih padat gizi dan evaluasi kesehatan.";
  } else if (status === "Resiko Overweight") {
    detail = "Berat badan mulai mendekati batas atas, risiko kelebihan berat badan.";
    advice = "Jaga komposisi makan, kurangi makanan tinggi gula/lemak, tetap aktif.";
  } else if (status === "Overweight") {
    detail = "Berat badan di atas standar untuk panjang badan.";
    advice = "Konsultasikan untuk pengaturan makan dan aktivitas agar berat seimbang.";
  } else if (status === "Obese") {
    detail = "Berat badan jauh di atas standar untuk panjang badan.";
    advice = "Segera evaluasi bersama tenaga kesehatan untuk rencana penanganan.";
  }

  results.push({
    title: "Berat Badan terhadap Panjang/Tinggi",
    shortLabel: "BB/PB",
    status: status,
    sdLabel: "SD " + buildSdLabel(sd),
    detail: detail,
    advice: advice,
    tone: buildTone(status)
  });
  draw_pos(document.getElementById("img3"), gender, "wfl", length, weight);

  renderResults(results);
  updateSummary(results);
}

$(document).ready(function() {
  domReady = true;
  for(var i = 0;i <= 60;++i) {
    $("#age").append( $("<option>").attr("value",i)
                      .text(i.toString() + " bulan") );
  }
  // Add 60+ option
  $("#age").append( $("<option>").attr("value",60)
                    .text("60+ bulan") );
  
  if (dataReady) {
    interpret();
  }
});
