// Anemia Screening and Management Module
// Hb-based anemia classification and iron supplementation calculator

const ANEMIA_DATA = {
  // WHO Hb thresholds (g/dL) for children 6-59 months
  thresholds: {
    6: { normal: 11.0, mild: 10.0, moderate: 7.0, severe: 0 },
    12: { normal: 11.0, mild: 10.0, moderate: 7.0, severe: 0 },
    24: { normal: 11.0, mild: 10.0, moderate: 7.0, severe: 0 },
    36: { normal: 11.5, mild: 10.5, moderate: 7.0, severe: 0 },
    48: { normal: 11.5, mild: 10.5, moderate: 7.0, severe: 0 },
    59: { normal: 11.5, mild: 10.5, moderate: 7.0, severe: 0 }
  },

  // Iron supplementation guidelines (elemental iron mg/kg/day)
  ironDosing: {
    treatment: 3, // mg/kg/day for treatment
    prevention: 1, // mg/kg/day for prevention
    maxDose: 60 // mg/day maximum
  },

  // Classification based on Hb levels
  classify: function(hb, age) {
    if (!hb || !age) return null;
    
    const threshold = this.getThreshold(age);
    if (!threshold) return null;

    if (hb >= threshold.normal) {
      return {
        status: 'Normal',
        severity: 'normal',
        color: 'good',
        description: ' kadar Hb normal untuk usia',
        advice: 'Lanjutkan pola makan seimbang dengan zat besi cukup (daging, hati, sayuran hijau).'
      };
    } else if (hb >= threshold.mild) {
      return {
        status: 'Anemia Ringan',
        severity: 'mild',
        color: 'warn',
        description: ' anemia ringan - perlu peningkatan makanan tinggi zat besi',
        advice: 'Tingkatkan konsumsi makanan kaya zat besi, pertimbangkan suplementasi zat besi sesuai anjuran dokter.'
      };
    } else if (hb >= threshold.moderate) {
      return {
        status: 'Anemia Sedang',
        severity: 'moderate',
        color: 'warn',
        description: ' anemia sedang - memerlukan suplementasi zat besi',
        advice: 'Konsultasi ke dokter untuk suplementasi zat besi dan evaluasi penyebab anemia.'
      };
    } else {
      return {
        status: 'Anemia Berat',
        severity: 'severe',
        color: 'bad',
        description: ' anemia berat - memerlukan penanganan segera',
        advice: 'Segera ke fasilitas kesehatan untuk penanganan dan transfusi bila diperlukan.'
      };
    }
  },

  // Get age-appropriate Hb threshold
  getThreshold: function(age) {
    if (age <= 12) return this.thresholds[12];
    if (age <= 24) return this.thresholds[24];
    if (age <= 36) return this.thresholds[36];
    if (age <= 48) return this.thresholds[48];
    if (age <= 59) return this.thresholds[59];
    return this.thresholds[59];
  },

  // Calculate iron supplementation dose
  calculateIronDose: function(weight, age, severity) {
    if (!weight || !age) return null;

    const isTreatment = severity === 'moderate' || severity === 'severe';
    const dosePerKg = isTreatment ? this.ironDosing.treatment : this.ironDosing.prevention;
    
    let totalDose = weight * dosePerKg;
    totalDose = Math.min(totalDose, this.ironDosing.maxDose);

    return {
      dosePerKg: dosePerKg,
      totalDose: Math.round(totalDose * 10) / 10,
      frequency: '1x sehari',
      duration: isTreatment ? '3 bulan' : '1-2 bulan',
      isTreatment: isTreatment
    };
  },

  // Follow-up recommendations
  getFollowUp: function(severity) {
    switch (severity) {
      case 'normal':
        return {
          timeframe: '6-12 bulan',
          action: 'Pemeriksaan rutin'
        };
      case 'mild':
        return {
          timeframe: '1-2 bulan',
          action: 'Kontrol Hb dan evaluasi dietary'
        };
      case 'moderate':
        return {
          timeframe: '2-4 minggu',
          action: 'Kontrol ketat selama suplementasi'
        };
      case 'severe':
        return {
          timeframe: 'Segera',
          action: 'Rujuk ke spesialis anak'
        };
      default:
        return {
          timeframe: '-',
          action: '-'
        };
    }
  }
};

// Initialize anemia module
function initAnemiaModule() {
  const anemiaContent = document.createElement('div');
  anemiaContent.className = 'anemia-content';
  anemiaContent.style.display = 'none';
  
  anemiaContent.innerHTML = `
    <!-- Anemia Screening Card -->
    <section class="input-card">
      <div class="input-card-header">
        <h2 class="input-card-title">Skrining Anemia (Hb)</h2>
        <p class="input-card-desc">Klasifikasi anemia berdasarkan kadar Hb dan kalkulator dosis suplementasi zat besi untuk anak.</p>
      </div>

      <div class="form-grid">
        <div class="form-field">
          <label for="anemia-age">Umur (bulan)</label>
          <select id="anemia-age">
            <option value="">Pilih umur</option>
          </select>
          <div class="error-message" id="anemia-age-error"></div>
        </div>

        <div class="form-field">
          <label for="anemia-weight">Berat badan (kg)</label>
          <input type="number" id="anemia-weight" min="2" max="30" step="0.1" placeholder="8.5">
          <div class="error-message" id="anemia-weight-error"></div>
        </div>

        <div class="form-field full-width">
          <label for="anemia-hb">Kadar Hb (g/dL)</label>
          <input type="number" id="anemia-hb" min="4" max="20" step="0.1" placeholder="10.5">
          <div class="error-message" id="anemia-hb-error"></div>
        </div>

        <div class="form-field full-width">
          <div class="toggle-container">
            <span class="toggle-label">Hitung dosis Fe (opsional)</span>
            <div class="toggle-switch" id="anemia-calc-toggle"></div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button id="anemia-analyze">Analisis Anemia</button>
        <p class="form-note">Threshold Hb berdasarkan standar WHO untuk anak 6-59 bulan.</p>
      </div>
    </section>

    <!-- Anemia Summary -->
    <section class="summary-card">
      <h2>Hasil Skrining Anemia</h2>
      <p id="anemia-summary">Masukkan data untuk melihat klasifikasi anemia.</p>
    </section>

    <!-- Anemia Results -->
    <section id="anemia-results" style="display: none;">
      <!-- Main Result Card -->
      <div class="result-card">
        <div class="result-header">
          <h3>Status Anemia</h3>
          <span class="badge" id="anemia-status-badge">-</span>
        </div>
        <p class="result-meta" id="anemia-hb-info">Hb: - g/dL</p>
        <p class="result-detail" id="anemia-description">-</p>
        <div class="result-advice" id="anemia-advice">-</div>
      </div>

      <!-- Iron Dosing Card (if enabled) -->
      <div class="result-card" id="iron-dosing-card" style="display: none;">
        <div class="result-header">
          <h3>Suplementasi Zat Besi</h3>
          <span class="badge warn">Kalkulasi</span>
        </div>
        <div class="iron-dosing-details">
          <div class="dosing-item">
            <strong>Dosis elemental Fe:</strong>
            <span id="iron-dose-total">-</span>
          </div>
          <div class="dosing-item">
            <strong>Dosis per kg:</strong>
            <span id="iron-dose-perkg">-</span>
          </div>
          <div class="dosing-item">
            <strong>Frekuensi:</strong>
            <span id="iron-frequency">-</span>
          </div>
          <div class="dosing-item">
            <strong>Durasi:</strong>
            <span id="iron-duration">-</span>
          </div>
        </div>
        <div class="result-advice" id="iron-advice">Minum Fe saat perut kosong atau dengan sedikit makanan. Bisa menyebabkan tinja hitam - normal.</div>
      </div>

      <!-- Follow-up Card -->
      <div class="result-card">
        <div class="result-header">
          <h3>Rekomendasi Follow-up</h3>
          <span class="badge good">Jadwal</span>
        </div>
        <div class="follow-up-details">
          <div class="follow-up-item">
            <strong>Waktu kontrol:</strong>
            <span id="follow-up-time">-</span>
          </div>
          <div class="follow-up-item">
            <strong>Tindakan:</strong>
            <span id="follow-up-action">-</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Info Box -->
    <section class="kpsp-info-box">
      <h4>ℹ️ Panduan Skrining Anemia</h4>
      <ul>
        <li><strong>Klasifikasi WHO (6-59 bulan):</strong>
          <ul style="margin-top: 8px;">
            <li><strong>Normal:</strong> Hb ≥ 11.0-11.5 g/dL (selon umur)</li>
            <li><strong>Anemia ringan:</strong> Hb 10.0-10.9 g/dL</li>
            <li><strong>Anemia sedang:</strong> Hb 7.0-9.9 g/dL</li>
            <li><strong>Anemia berat:</strong> Hb < 7.0 g/dL</li>
          </ul>
        </li>
        <li><strong>Suplementasi zat besi:</strong> 3 mg/kg/hari untuk terapi, 1 mg/kg/hari untuk pencegahan</li>
        <li><strong>Makanan tinggi zat besi:</strong> Daging merah, hati, ikan, sayuran hijau, kacang-kacangan</li>
        <li><strong>Asupan enhancers:</strong> Vitamin C (jeruk, tomat) meningkatkan penyerapan zat besi</li>
      </ul>
    </section>
  `;

  document.querySelector('.main-content').appendChild(anemiaContent);

  // Populate age dropdown
  const ageSelect = anemiaContent.querySelector('#anemia-age');
  for (let i = 6; i <= 59; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i + ' bulan';
    ageSelect.appendChild(option);
  }

  // Iron dosing toggle
  let ironCalcEnabled = false;
  const toggle = anemiaContent.querySelector('#anemia-calc-toggle');
  toggle.addEventListener('click', function() {
    ironCalcEnabled = !ironCalcEnabled;
    this.classList.toggle('active');
  });

  // Form validation
  function validateAnemiaForm() {
    const age = parseInt(ageSelect.value);
    const weight = parseFloat(anemiaContent.querySelector('#anemia-weight').value);
    const hb = parseFloat(anemiaContent.querySelector('#anemia-hb').value);

    let isValid = true;

    // Reset errors
    anemiaContent.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));
    anemiaContent.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));

    // Validate age
    if (!age || age < 6 || age > 59) {
      anemiaContent.querySelector('#anemia-age').classList.add('error');
      anemiaContent.querySelector('#anemia-age-error').textContent = 'Umur harus antara 6-59 bulan'.addClass('visible');
      isValid = false;
    }

    // Validate weight
    if (!weight || weight < 2 || weight > 30) {
      anemiaContent.querySelector('#anemia-weight').classList.add('error');
      anemiaContent.querySelector('#anemia-weight-error').textContent = 'Masukkan berat badan yang valid (2-30 kg)'.addClass('visible');
      isValid = false;
    }

    // Validate Hb
    if (!hb || hb < 4 || hb > 20) {
      anemiaContent.querySelector('#anemia-hb').classList.add('error');
      anemiaContent.querySelector('#anemia-hb-error').textContent = 'Masukkan kadar Hb yang valid (4-20 g/dL)'.addClass('visible');
      isValid = false;
    }

    return isValid;
  }

  // Analyze anemia
  anemiaContent.querySelector('#anemia-analyze').addEventListener('click', function() {
    if (!validateAnemiaForm()) return;

    const age = parseInt(ageSelect.value);
    const weight = parseFloat(anemiaContent.querySelector('#anemia-weight').value);
    const hb = parseFloat(anemiaContent.querySelector('#anemia-hb').value);

    // Classify anemia
    const classification = ANEMIA_DATA.classify(hb, age);
    if (!classification) return;

    // Calculate iron dose if enabled
    let ironDose = null;
    if (ironCalcEnabled) {
      ironDose = ANEMIA_DATA.calculateIronDose(weight, age, classification.severity);
    }

    // Get follow-up recommendations
    const followUp = ANEMIA_DATA.getFollowUp(classification.severity);

    // Update display
    updateAnemiaResults(classification, ironDose, followUp, age, hb);
  });

  // Update results display
  function updateAnemiaResults(classification, ironDose, followUp, age, hb) {
    // Update summary
    anemiaContent.querySelector('#anemia-summary').textContent = 
      `Hb: ${hb} g/dL (${age} bulan) - ${classification.status}`;

    // Show results section
    anemiaContent.querySelector('#anemia-results').style.display = 'block';

    // Update status badge
    const badge = anemiaContent.querySelector('#anemia-status-badge');
    badge.className = 'badge ' + classification.color;
    badge.textContent = classification.status;

    // Update Hb info
    anemiaContent.querySelector('#anemia-hb-info').textContent = `Hb: ${hb} g/dL (usia ${age} bulan)`;

    // Update description and advice
    anemiaContent.querySelector('#anemia-description').textContent = 
      `Klasifikasi: ${classification.status} - ${classification.description}.`;
    anemiaContent.querySelector('#anemia-advice').textContent = 
      `<strong>Rekomendasi:</strong> ${classification.advice}`;

    // Update iron dosing if enabled
    const ironCard = anemiaContent.querySelector('#iron-dosing-card');
    if (ironDose) {
      ironCard.style.display = 'block';
      anemiaContent.querySelector('#iron-dose-total').textContent = `${ironDose.totalDose} mg/hari`;
      anemiaContent.querySelector('#iron-dose-perkg').textContent = `${ironDose.dosePerKg} mg/kg/hari`;
      anemiaContent.querySelector('#iron-frequency').textContent = ironDose.frequency;
      anemiaContent.querySelector('#iron-duration').textContent = ironDose.duration;
    } else {
      ironCard.style.display = 'none';
    }

    // Update follow-up
    anemiaContent.querySelector('#follow-up-time').textContent = followUp.timeframe;
    anemiaContent.querySelector('#follow-up-action').textContent = followUp.action;

    // Scroll to results
    anemiaContent.querySelector('#anemia-results').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  return anemiaContent;
}

// Add CSS for anemia-specific styles
function addAnemiaStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .iron-dosing-details, .follow-up-details {
      margin: 16px 0;
    }
    .dosing-item, .follow-up-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .dosing-item:last-child, .follow-up-item:last-child {
      border-bottom: none;
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles
addAnemiaStyles();