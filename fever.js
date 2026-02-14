// Fever Status Calculator Module
// Fever management based on age, temperature, duration, and red flags

const FEVER_DATA = {
  // Fever thresholds (rectal temperature)
  thresholds: {
    neonate: { ageMin: 0, ageMax: 28, fever: 38.0, highFever: 39.0 },
    infant: { ageMin: 29, ageMax: 90, fever: 38.0, highFever: 39.0 },
    older: { ageMin: 91, ageMax: 2159, fever: 38.0, highFever: 39.5 }
  },

  // Fever severity classification
  classifyFever: function(temperature, age) {
    const threshold = this.getThreshold(age);
    if (!threshold) return null;

    if (temperature >= threshold.highFever) {
      return {
        level: 'Demam Tinggi',
        color: 'bad',
        description: 'Demam tinggi memerlukan perhatian khusus dan可能的 penanganan segera.'
      };
    } else if (temperature >= threshold.fever) {
      return {
        level: 'Demam',
        color: 'warn',
        description: 'Demam ringan-sedang, pantau kondisi anak dan berikan antipiretik jika perlu.'
      };
    } else {
      return {
        level: 'Normal',
        color: 'good',
        description: 'Suhu tubuh normal untuk usia ini.'
      };
    }
  },

  getThreshold: function(age) {
    if (age <= 28) return this.thresholds.neonate;
    if (age <= 90) return this.thresholds.infant;
    return this.thresholds.older;
  },

  // Red flags that require immediate attention
  redFlags: [
    { id: 'lethargy', text: 'Letargis/kesulitan bangun', severity: 'immediate' },
    { id: 'seizure', text: 'Kejang', severity: 'immediate' },
    { id: 'notDrinking', text: 'Tidak bisa minum/menyusu', severity: 'immediate' },
    { id: 'vomiting', text: 'Muntah المستمر', severity: 'immediate' },
    { id: 'bulgingFontanelle', text: 'Ubun-ubun mencembung', severity: 'immediate' },
    { id: 'neckStiffness', text: 'Leher kaku', severity: 'immediate' },
    { id: 'persistentCrying', text: 'Menangis terus (tidak berhenti)', severity: 'immediate' },
    { id: 'skinRash', text: 'Ruam kulit yang tidak hilang', severity: 'high' },
    { id: 'difficultyBreathing', text: 'Kesulitan bernapas', severity: 'immediate' },
    { id: 'blueLips', text: 'Bibir kebiruan', severity: 'immediate' },
    { id: 'fever3Days', text: 'Demam > 3 hari', severity: 'high' },
    { id: 'feverReturn', text: 'Demam kembali setelah membaik', severity: 'high' },
    { id: 'urineDecreased', text: 'Urine berkurang', severity: 'medium' },
    { id: 'coldExtremities', text: 'Tangan/kaki dingin', severity: 'medium' }
  ],

  // Determine action based on age, temperature, duration, and red flags
  determineAction: function(age, temperature, duration, redFlagsPresent) {
    const threshold = this.getThreshold(age);
    const hasImmediateRedFlags = redFlagsPresent.some(rf => rf.severity === 'immediate');
    const hasHighRedFlags = redFlagsPresent.some(rf => rf.severity === 'high');

    // Immediate actions
    if (hasImmediateRedFlags || age <= 28) {
      return {
        action: 'Segera ke Faskes (IGD)',
        urgency: 'immediate',
        color: 'bad',
        reason: 'Red flag teridentifikasi atau usia < 1 bulan',
        details: 'Anak memerlukan evaluasi segera oleh tenaga medis.'
      };
    }

    // High fever with other risk factors
    if (temperature >= threshold.highFever || hasHighRedFlags) {
      return {
        action: 'Segera ke Faskes',
        urgency: 'high',
        color: 'bad',
        reason: 'Demam tinggi atau red flag tinggi',
        details: 'Segera bawa ke fasilitas kesehatan untuk evaluasi lebih lanjut.'
      };
    }

    // Moderate fever duration
    if (duration >= 3) {
      return {
        action: 'Kontrol ke Faskes',
        urgency: 'medium',
        color: 'warn',
        reason: 'Demam lebih dari 3 hari',
        details: 'Perlu evaluasi untuk menentukan penyebab demam.'
      };
    }

    // Standard home care
    return {
      action: 'Observasi di Rumah',
      urgency: 'low',
      color: 'good',
      reason: 'Demam tanpa tanda bahaya',
      details: 'Pantau suhu, berikan cairan cukup, dan antipiretik jika diperlukan.'
    };
  },

  // Home care recommendations
  getHomeCare: function(temperature, age) {
    const recommendations = [];

    // Fluid intake
    recommendations.push({
      title: 'Cairan',
      text: age > 6 ? 
        'Berikan cairan lebih sering (air putih, sup, ORS)' : 
        'Tingkatkan frekuensi menyusui atau berikan ASI lebih sering'
    });

    // Clothing
    recommendations.push({
      title: 'Pakaian',
      text: 'Pakai pakaian tipis, jangan membungkus anak terlalu ketat. Hindari ruangan terlalu panas.'
    });

    // Bathing
    recommendations.push({
      title: 'Mandi',
      text: 'Mandi dengan air hangat (suhu ruang), bukan air dingin. Kompres dahi dengan kain basah hangat.'
    });

    // Antipyretic
    recommendations.push({
      title: 'Obat Antipiretik',
      text: temperature >= 38.5 ? 
        'Parasetamol 15mg/kg/kali setiap 4-6 jam jika perlu. Tidak boleh lebih dari 4 dosis/hari.' : 
        'Parasetamol dapat diberikan jika anak tidak nyaman. Ikuti dosis sesuai berat badan.'
    });

    // Monitoring
    recommendations.push({
      title: 'Pemantauan',
      text: 'Catat suhu setiap 4 jam. Segera ke dokter jika demam tidak turun setelah 48 jam atau ada tanda bahaya.'
    });

    return recommendations;
  },

  // Calculate antipyretic dose
  calculateAntipyreticDose: function(weight, medication) {
    if (medication === 'paracetamol') {
      const dose = weight * 15; // 15 mg/kg
      const maxDose = Math.min(dose, 500); // Cap at 500mg for practical dosing
      return {
        medication: 'Parasetamol',
        dose: Math.round(maxDose),
        unit: 'mg',
        volume120: Math.round((maxDose / 120) * 50), // for 120mg/5ml syrup
        volume250: Math.round((maxDose / 250) * 50), // for 250mg/5ml syrup
        frequency: 'Setiap 4-6 jam jika perlu',
        maxPerDay: 'Maksimal 4 dosis/hari',
        maxDaily: weight * 75 // 75 mg/kg/day max
      };
    } else if (medication === 'ibuprofen') {
      const dose = weight * 10; // 10 mg/kg
      const maxDose = Math.min(dose, 400);
      return {
        medication: 'Ibuprofen',
        dose: Math.round(maxDose),
        unit: 'mg',
        volume100: Math.round((maxDose / 100) * 50), // for 100mg/5ml syrup
        frequency: 'Setiap 6-8 jam jika perlu',
        maxPerDay: 'Maksimal 4 dosis/hari',
        maxDaily: weight * 40 // 40 mg/kg/day max
      };
    }

    return null;
  }
};

// Initialize fever module
function initFeverModule() {
  const feverContent = document.createElement('div');
  feverContent.className = 'fever-content';
  feverContent.style.display = 'none';
  
  feverContent.innerHTML = `
    <!-- Fever Calculator Card -->
    <section class="input-card">
      <div class="input-card-header">
        <h2 class="input-card-title">Kalkulator Status Demam</h2>
        <p class="input-card-desc">Penilaian demam berdasarkan usia, suhu, durasi, dan tanda bahaya (red flags) untuk menentukan tindakan yang tepat.</p>
      </div>

      <div class="form-grid">
        <div class="form-field">
          <label for="fever-age">Umur</label>
          <div class="age-input-group">
            <input type="number" id="fever-age" min="0" max="2159" step="1" placeholder="18">
            <select id="fever-age-unit">
              <option value="days">Hari</option>
              <option value="months" selected>Bulan</option>
            </select>
          </div>
          <div class="error-message" id="fever-age-error"></div>
        </div>

        <div class="form-field">
          <label for="fever-temp">Suhu tubuh (°C)</label>
          <input type="number" id="fever-temp" min="35" max="42" step="0.1" placeholder="38.5">
          <div class="error-message" id="fever-temp-error"></div>
        </div>

        <div class="form-field">
          <label for="fever-duration">Durasi demam (jam)</label>
          <input type="number" id="fever-duration" min="0" max="720" step="1" placeholder="24">
          <div class="error-message" id="fever-duration-error"></div>
        </div>

        <div class="form-field">
          <label for="fever-method">Cara pengukuran</label>
          <select id="fever-method">
            <option value="rectal">Rektal (paling akurat)</option>
            <option value="axillary">Ketiak</option>
            <option value="oral">Mulut</option>
            <option value="ear">Telinga (timpanik)</option>
            <option value="forehead">Dahi</option>
          </select>
        </div>
      </div>

      <!-- Red Flags Section -->
      <div class="red-flags-section">
        <h3>Tanda Bahaya (Red Flags)</h3>
        <p class="section-desc">Pilih semua tanda yang ada pada anak:</p>
        
        <div class="red-flags-grid" id="red-flags-grid">
          <!-- Red flags will be populated by JS -->
        </div>
      </div>

      <div class="form-actions">
        <button id="fever-analyze">Analisis Demam</button>
        <p class="form-note">Penilaian ini bukan pengganti pemeriksaan dokter. Jika khawatir, segera ke fasilitas kesehatan.</p>
      </div>
    </section>

    <!-- Summary Card -->
    <section class="summary-card">
      <h2>Hasil Analisis Demam</h2>
      <p id="fever-summary">Masukkan data untuk melihat rekomendasi penanganan.</p>
    </section>

    <!-- Results -->
    <section id="fever-results" style="display: none;">
      <!-- Main Result Card -->
      <div class="result-card">
        <div class="result-header">
          <h3>Status Demam</h3>
          <span class="badge" id="fever-status-badge">-</span>
        </div>
        <p class="result-meta" id="fever-temp-info">Suhu: - °C</p>
        <p class="result-detail" id="fever-description">-</p>
        <div class="result-advice" id="fever-action">
          <!-- Action will be populated here -->
        </div>
      </div>

      <!-- Red Flags Result -->
      <div class="result-card" id="red-flags-result" style="display: none;">
        <div class="result-header">
          <h3>Tanda Bahaya Teridentifikasi</h3>
          <span class="badge bad">Peringatan</span>
        </div>
        <div id="red-flags-identified">
          <!-- Red flags will be listed here -->
        </div>
      </div>

      <!-- Home Care Card -->
      <div class="result-card" id="home-care-card">
        <div class="result-header">
          <h3>Perawatan di Rumah</h3>
          <span class="badge">Panduan</span>
        </div>
        <div id="home-care-recommendations">
          <!-- Home care will be populated here -->
        </div>
      </div>

      <!-- Antipyretic Calculator -->
      <div class="result-card" id="antipyretic-card">
        <div class="result-header">
          <h3>Kalkulator Dosis Antipiretik</h3>
          <span class="badge">Opsional</span>
        </div>
        <div class="antipyretic-calculator">
          <div class="form-field" style="margin-bottom: 16px;">
            <label for="antipyretic-weight">Berat badan (kg)</label>
            <input type="number" id="antipyretic-weight" min="2" max="30" step="0.1" placeholder="8.5">
          </div>
          <div class="form-field" style="margin-bottom: 16px;">
            <label for="antipyretic-drug">Pilih obat</label>
            <select id="antipyretic-drug">
              <option value="paracetamol">Parasetamol</option>
              <option value="ibuprofen">Ibuprofen</option>
            </select>
          </div>
          <button id="calculate-antipyretic" class="calc-btn">Hitung Dosis</button>
        </div>
        <div id="antipyretic-result" style="display: none; margin-top: 16px;">
          <!-- Antipyretic result will be populated here -->
        </div>
      </div>
    </section>

    <!-- Info Box -->
    <section class="kpsp-info-box">
      <h4>ℹ️ Panduan Demam pada Anak</h4>
      <ul>
        <li><strong>Definisi demam:</strong> Suhu > 38°C (rektal) atau > 37.5°C (ketiak)</li>
        <li><strong>Penurunan demam:</strong> Kompres hangat, pakaian tipis, cairan cukup</li>
        <li><strong>Kapan ke IGD:</strong> Bayi < 3 bulan dengan demam, kejang, tidak sadar, biru</li>
        <li><strong>Kapan kontrol:</strong> Demam > 48 jam tanpa perbaikan, frequent vomiting</li>
        <li><strong>Obat:</strong> Parasetamol 15mg/kg atau Ibuprofen 10mg/kg (usia > 6 bulan)</li>
        <li><strong>Tip:</strong> Hindari aspirin pada anak (risiko Reye syndrome)</li>
      </ul>
    </section>
  `;

  document.querySelector('.main-content').appendChild(feverContent);

  // Populate red flags
  function populateRedFlags() {
    const grid = feverContent.querySelector('#red-flags-grid');
    
    FEVER_DATA.redFlags.forEach(flag => {
      const item = document.createElement('div');
      item.className = 'red-flag-item';
      item.innerHTML = `
        <input type="checkbox" id="rf-${flag.id}" value="${flag.id}">
        <label for="rf-${flag.id}">${flag.text}</label>
      `;
      grid.appendChild(item);
    });
  }

  populateRedFlags();

  // Get selected red flags
  function getSelectedRedFlags() {
    const selected = [];
    feverContent.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      const flag = FEVER_DATA.redFlags.find(f => f.id === cb.value);
      if (flag) selected.push(flag);
    });
    return selected;
  }

  // Get age in days
  function getAgeInDays(age, unit) {
    if (unit === 'days') return parseInt(age);
    if (unit === 'months') return parseInt(age) * 30;
    return 0;
  }

  // Form validation
  function validateFeverForm() {
    const age = parseInt(feverContent.querySelector('#fever-age').value);
    const unit = feverContent.querySelector('#fever-age-unit').value;
    const temperature = parseFloat(feverContent.querySelector('#fever-temp').value);
    const duration = parseInt(feverContent.querySelector('#fever-duration').value);

    let isValid = true;

    // Reset errors
    feverContent.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));
    feverContent.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));

    // Validate age
    if (age === '' || age < 0 || age > 2159) {
      feverContent.querySelector('#fever-age').classList.add('error');
      const ageError = feverContent.querySelector('#fever-age-error');
      ageError.textContent = 'Masukkan umur yang valid';
      ageError.classList.add('visible');
      isValid = false;
    }

    // Validate temperature
    if (!temperature || temperature < 35 || temperature > 42) {
      feverContent.querySelector('#fever-temp').classList.add('error');
      const tempError = feverContent.querySelector('#fever-temp-error');
      tempError.textContent = 'Masukkan suhu yang valid (35-42°C)';
      tempError.classList.add('visible');
      isValid = false;
    }

    // Validate duration
    if (duration === '' || duration < 0 || duration > 720) {
      feverContent.querySelector('#fever-duration').classList.add('error');
      const durationError = feverContent.querySelector('#fever-duration-error');
      durationError.textContent = 'Masukkan durasi yang valid';
      durationError.classList.add('visible');
      isValid = false;
    }

    return isValid;
  }

  // Analyze fever
  feverContent.querySelector('#fever-analyze').addEventListener('click', function() {
    if (!validateFeverForm()) return;

    const age = getAgeInDays(
      parseInt(feverContent.querySelector('#fever-age').value),
      feverContent.querySelector('#fever-age-unit').value
    );
    const temperature = parseFloat(feverContent.querySelector('#fever-temp').value);
    const duration = parseInt(feverContent.querySelector('#fever-duration').value);
    const redFlagsPresent = getSelectedRedFlags();

    // Classify fever
    const classification = FEVER_DATA.classifyFever(temperature, age);
    if (!classification) return;

    // Determine action
    const action = FEVER_DATA.determineAction(age, temperature, duration, redFlagsPresent);

    // Get home care
    const homeCare = FEVER_DATA.getHomeCare(temperature, age);

    // Update display
    updateFeverResults(classification, action, homeCare, redFlagsPresent, age, temperature, duration);
  });

  // Calculate antipyretic dose
  feverContent.querySelector('#calculate-antipyretic').addEventListener('click', function() {
    const weight = parseFloat(feverContent.querySelector('#antipyretic-weight').value);
    const drug = feverContent.querySelector('#antipyretic-drug').value;

    if (!weight || weight < 2 || weight > 30) {
      alert('Masukkan berat badan yang valid (2-30 kg)');
      return;
    }

    const dose = FEVER_DATA.calculateAntipyreticDose(weight, drug);
    if (!dose) return;

    const resultDiv = feverContent.querySelector('#antipyretic-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <div class="dose-result">
        <div class="dose-item">
          <strong>Obat:</strong>
          <span>${dose.medication}</span>
        </div>
        <div class="dose-item">
          <strong>Dosis per kali:</strong>
          <span>${dose.dose} ${dose.unit}</span>
        </div>
        ${drug === 'paracetamol' ? `
          <div class="dose-item">
            <strong>Volume (sirup 120mg/5ml):</strong>
            <span>${dose.volume120} ml</span>
          </div>
          <div class="dose-item">
            <strong>Volume (sirup 250mg/5ml):</strong>
            <span>${dose.volume250} ml</span>
          </div>
        ` : `
          <div class="dose-item">
            <strong>Volume (sirup 100mg/5ml):</strong>
            <span>${dose.volume100} ml</span>
          </div>
        `}
        <div class="dose-item">
          <strong>Frekuensi:</strong>
          <span>${dose.frequency}</span>
        </div>
        <div class="dose-item">
          <strong>Maksimal per hari:</strong>
          <span>${dose.maxPerDay}</span>
        </div>
      </div>
    `;
  });

  // Update results display
  function updateFeverResults(classification, action, homeCare, redFlagsPresent, age, temperature, duration) {
    // Show results section
    feverContent.querySelector('#fever-results').style.display = 'block';

    // Convert age to readable format
    const ageDisplay = age < 30 ? `${age} hari` : 
                      age < 365 ? `${Math.round(age/30)} bulan` : 
                      `${Math.round(age/365)} tahun`;

    // Update summary
    feverContent.querySelector('#fever-summary').textContent = 
      `Usia: ${ageDisplay}, Suhu: ${temperature}°C, Durasi: ${duration} jam`;

    // Update status badge
    const badge = feverContent.querySelector('#fever-status-badge');
    badge.className = 'badge ' + classification.color;
    badge.textContent = classification.level;

    // Update temp info
    feverContent.querySelector('#fever-temp-info').textContent = 
      `Suhu: ${temperature}°C | Usia: ${ageDisplay} | Durasi: ${duration} jam`;

    // Update description
    feverContent.querySelector('#fever-description').textContent = classification.description;

    // Update action
    feverContent.querySelector('#fever-action').innerHTML = `
      <strong>Tindakan:</strong> ${action.action}<br>
      <span style="font-size: 12px; color: #64748b;">${action.details}</span>
    `;

    // Update red flags result
    const rfCard = feverContent.querySelector('#red-flags-result');
    const rfList = feverContent.querySelector('#red-flags-identified');
    if (redFlagsPresent.length > 0) {
      rfCard.style.display = 'block';
      rfList.innerHTML = redFlagsPresent.map(rf => `
        <div class="rf-item ${rf.severity === 'immediate' ? 'immediate' : ''}">
          ${rf.text} ${rf.severity === 'immediate' ? '🚨' : '⚠️'}
        </div>
      `).join('');
    } else {
      rfCard.style.display = 'none';
    }

    // Update home care
    feverContent.querySelector('#home-care-recommendations').innerHTML = homeCare.map(rec => `
      <div class="home-care-item">
        <strong>${rec.title}</strong>
        <p>${rec.text}</p>
      </div>
    `).join('');

    // Scroll to results
    feverContent.querySelector('#fever-results').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  return feverContent;
}

// Add CSS for fever-specific styles
function addFeverStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .age-input-group {
      display: flex;
      gap: 8px;
    }
    .age-input-group input {
      flex: 1;
    }
    .age-input-group select {
      width: 100px;
    }
    .red-flags-section {
      margin: 24px 0;
      padding: 20px;
      background: #fef2f2;
      border-radius: 16px;
      border: 1px solid #fecaca;
    }
    .red-flags-section h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #dc2626;
    }
    .section-desc {
      margin: 0 0 16px 0;
      font-size: 13px;
      color: #64748b;
    }
    .red-flags-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .red-flag-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .red-flag-item input[type="checkbox"] {
      margin: 0;
    }
    .red-flag-item label {
      font-size: 13px;
      margin: 0;
      cursor: pointer;
    }
    .rf-item {
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px;
      color: #dc2626;
    }
    .rf-item:last-child {
      border-bottom: none;
    }
    .rf-item.immediate {
      font-weight: 600;
    }
    .home-care-item {
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .home-care-item:last-child {
      border-bottom: none;
    }
    .home-care-item strong {
      display: block;
      margin-bottom: 4px;
      color: #1e293b;
    }
    .home-care-item p {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }
    .antipyretic-calculator {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: flex-end;
    }
    .antipyretic-calculator .form-field {
      flex: 1;
      min-width: 150px;
      margin-bottom: 0;
    }
    .calc-btn {
      padding: 14px 24px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .calc-btn:hover {
      background: var(--primary-dark);
    }
    .dose-result {
      background: #f8fafc;
      border-radius: 12px;
      padding: 16px;
    }
    .dose-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
    }
    @media (max-width: 767px) {
      .red-flags-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles
addFeverStyles();