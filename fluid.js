// Maintenance Fluids Calculator Module (Holliday-Segar Method)
// Calculate daily fluid requirements and clinical guidelines

const FLUID_DATA = {
  // Holliday-Segar maintenance formula
  calculateMaintenance: function(weight, hasFever, isNPO) {
    let baseMaintenance = 0;
    
    // Base maintenance calculation
    if (weight <= 10) {
      baseMaintenance = weight * 100; // 100 ml/kg for first 10kg
    } else if (weight <= 20) {
      baseMaintenance = 1000 + (weight - 10) * 50; // 1000ml + 50ml/kg for next 10kg
    } else {
      baseMaintenance = 1500 + (weight - 20) * 20; // 1500ml + 20ml/kg above 20kg
    }

    // Apply fever factor
    if (hasFever) {
      baseMaintenance *= 1.2; // 20% increase for fever
    }

    // Apply NPO factor (reduce by 25-50% if nothing by mouth)
    if (isNPO) {
      baseMaintenance *= 0.75; // 25% reduction for NPO
    }

    const perDay = Math.round(baseMaintenance);
    const perHour = Math.round(perDay / 24);
    const perMinute = Math.round(perHour / 60);

    return {
      perDay: perDay,
      perHour: perHour,
      perMinute: perMinute,
      baseMaintenance: Math.round(baseMaintenance / (hasFever ? 1.2 : 1) / (isNPO ? 0.75 : 1)),
      feverAdjustment: hasFever,
      npoAdjustment: isNPO
    };
  },

  // Fluid types and compositions
  fluidTypes: {
    d5w: {
      name: 'Dextrose 5% in Water',
      composition: '5% dextrose',
      calories: '170 cal/L',
      indication: 'Kebutuhan cairan dasar tanpa elektrolit spesifik',
      warnings: []
    },
    normalSaline: {
      name: 'Normal Saline (0.9% NaCl)',
      composition: '154 mEq/L Na+, 154 mEq/L Cl-',
      calories: '0 cal/L',
      indication: 'Rehidrasi, deficit elektrolit',
      warnings: ['Risiko hipernatremia', 'Hindari pada gagal jantung']
    },
    d5ns: {
      name: 'Dextrose 5% in Normal Saline',
      composition: '5% dextrose + 154 mEq/L NaCl',
      calories: '170 cal/L',
      indication: 'Kebutuhan cairan dengan natrium',
      warnings: ['Pantau fungsi jantung dan ginjal']
    },
    d5half: {
      name: 'Dextrose 5% in 1/2 Normal Saline',
      composition: '5% dextrose + 77 mEq/L NaCl',
      calories: '170 cal/L',
      indication: 'Kebutuhan cairan dengan natrium moderat',
      warnings: ['Monitor elektrolit serum']
    },
    rl: {
      name: 'Ringer\'s Lactate',
      composition: '130 mEq/L Na+, 4 mEq/L K+, 3 mEq/L Ca2+, 109 mEq/L Cl-, 28 mEq/L lactate',
      calories: '9 cal/L',
      indication: 'Rehidrasi, asidosis metabolic',
      warnings: ['Hindari pada hiperkalemia', 'Monitor funkcуй jantung']
    }
  },

  // Clinical guidelines
  getClinicalNotes: function(maintenance, weight, age) {
    const notes = [];

    // Age-specific notes
    if (age < 12) {
      notes.push('Monitor ketat untuk neonatus dan bayi - risiko hipoglikemia dan elektrolit imbalance');
    }
    if (age < 60) {
      notes.push('Hindari pemberian cairan berlebihan - risiko intoksikasi air');
    }

    // Volume-based warnings
    if (maintenance.perHour < 10) {
      notes.push('Kebutuhan sangat rendah - periksa apakah ada kontraindikasi');
    }
    if (maintenance.perHour > 200) {
      notes.push('Kebutuhan tinggi - evaluasi kembali faktor fever/NPO');
    }

    // General guidelines
    notes.push('Pantau balance input-output setiap 8 jam');
    notes.push('Monitor berat jenis urine (target: 1.010-1.025)');
    notes.push('Adjust berdasarkan klinis dan laboratorium');

    return notes;
  },

  // Contraindications for IV fluids
  getContraindications: function(weight, age, hasHeartFailure, hasRenalFailure) {
    const contraindications = [];

    if (hasHeartFailure) {
      contraindications.push('Gagal jantung - restrict fluid dan monitor ketat');
    }
    if (hasRenalFailure) {
      contraindications.push('Gagal ginjal - risk overload volume');
    }
    if (age < 7 && maintenance.perDay > 1000) {
      contraindications.push('Kebutuhan tinggi pada bayi - evaluasi kebutuhan kalori');
    }

    return contraindications;
  },

  // Red flags for fluid therapy
  getRedFlags: function(maintenance, currentIntake, weight, hasEdema) {
    const flags = [];

    if (currentIntake > maintenance.perDay * 1.5) {
      flags.push('Intake berlebihan (>150% maintenance) - risk overload');
    }
    if (currentIntake < maintenance.perDay * 0.5) {
      flags.push('Intake kurang (<50% maintenance) - risk dehidrasi');
    }
    if (hasEdema) {
      flags.push('Edema - evaluate volume status dan cardiac function');
    }

    return flags;
  },

  // Calculate fluid rate adjustments
  calculateRateAdjustment: function(baseMaintenance, currentBalance) {
    // Positive balance = overload, Negative balance = deficit
    if (currentBalance > 0) {
      const reduction = Math.min(currentBalance / 24, baseMaintenance * 0.25); // Max 25% reduction
      return {
        type: 'reduce',
        amount: Math.round(reduction),
        newRate: Math.round(baseMaintenance - reduction),
        reason: 'Volume overload detected'
      };
    } else if (currentBalance < -500) {
      const increase = Math.min(Math.abs(currentBalance) / 24, baseMaintenance * 0.25); // Max 25% increase
      return {
        type: 'increase',
        amount: Math.round(increase),
        newRate: Math.round(baseMaintenance + increase),
        reason: 'Volume deficit detected'
      };
    }

    return {
      type: 'maintain',
      amount: 0,
      newRate: baseMaintenance,
      reason: 'Volume status appropriate'
    };
  }
};

// Initialize fluid module
function initFluidModule() {
  const fluidContent = document.createElement('div');
  fluidContent.className = 'fluid-content';
  fluidContent.style.display = 'none';
  
  fluidContent.innerHTML = `
    <!-- Maintenance Fluids Card -->
    <section class="input-card">
      <div class="input-card-header">
        <h2 class="input-card-title">Cairan Maintenance (Holliday–Segar)</h2>
        <p class="input-card-desc">Kalkulasi kebutuhan cairan harian berdasarkan berat badan dengan faktor koreksi untuk demam dan NPO.</p>
      </div>

      <div class="form-grid">
        <div class="form-field">
          <label for="fluid-weight">Berat badan (kg)</label>
          <input type="number" id="fluid-weight" min="2" max="50" step="0.1" placeholder="8.5">
          <div class="error-message" id="fluid-weight-error"></div>
        </div>

        <div class="form-field">
          <label for="fluid-age">Umur (bulan)</label>
          <input type="number" id="fluid-age" min="0" max="2159" step="1" placeholder="18">
          <div class="error-message" id="fluid-age-error"></div>
        </div>

        <div class="form-field">
          <label>Faktor koreksi</label>
          <div class="correction-factors">
            <label class="checkbox-item">
              <input type="checkbox" id="fluid-fever">
              <span>Demam (>38.5°C)</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" id="fluid-npo">
              <span>Tidak ada intake (NPO)</span>
            </label>
          </div>
        </div>

        <div class="form-field">
          <label for="fluid-intake">Intake saat ini (ml/jam) - Opsional</label>
          <input type="number" id="fluid-intake" min="0" max="500" step="1" placeholder="50">
          <div class="error-message" id="fluid-intake-error"></div>
        </div>

        <div class="form-field full-width">
          <label for="fluid-type">Jenis cairan (untuk IV)</label>
          <select id="fluid-type">
            <option value="">Pilih jenis cairan</option>
            <option value="d5w">Dextrose 5% in Water (D5W)</option>
            <option value="normalSaline">Normal Saline (0.9% NaCl)</option>
            <option value="d5ns">D5% in Normal Saline (D5NS)</option>
            <option value="d5half">D5% in 1/2 Normal Saline (D5 1/2NS)</option>
            <option value="rl">Ringer's Lactate (RL)</option>
          </select>
        </div>

        <div class="form-field full-width">
          <div class="comorbidities-section">
            <label>Kondisi komorbid (centang jika ada)</label>
            <div class="comorbidity-checkboxes">
              <label class="checkbox-item">
                <input type="checkbox" id="fluid-heart-failure">
                <span>Gagal jantung</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" id="fluid-renal-failure">
                <span>Gagal ginjal</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" id="fluid-edema">
                <span>Edema</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button id="fluid-calculate">Hitung Kebutuhan Cairan</button>
        <p class="form-note">Perhitungan ini adalah panduan. Selalu evaluasi secara klinis dan laboratorik.</p>
      </div>
    </section>

    <!-- Summary Card -->
    <section class="summary-card">
      <h2>Hasil Kalkulasi Cairan</h2>
      <p id="fluid-summary">Masukkan data untuk melihat kebutuhan cairan maintenance.</p>
    </section>

    <!-- Results -->
    <section id="fluid-results" style="display: none;">
      <!-- Main Calculation Card -->
      <div class="result-card">
        <div class="result-header">
          <h3>Kebutuhan Cairan Maintenance</h3>
          <span class="badge good">Perhitungan</span>
        </div>
        <div id="maintenance-calculations">
          <!-- Main calculations will be populated here -->
        </div>
        <div class="result-advice" id="fluid-advice">
          <!-- Clinical notes will be populated here -->
        </div>
      </div>

      <!-- Fluid Type Information -->
      <div class="result-card" id="fluid-type-card" style="display: none;">
        <div class="result-header">
          <h3>Informasi Cairan Terpilih</h3>
          <span class="badge">Panduan</span>
        </div>
        <div id="fluid-type-info">
          <!-- Fluid type information will be populated here -->
        </div>
      </div>

      <!-- Clinical Guidelines -->
      <div class="result-card" id="clinical-guidelines-card">
        <div class="result-header">
          <h3>Catatan Klinis</h3>
          <span class="badge warn">Penting</span>
        </div>
        <div id="clinical-notes">
          <!-- Clinical notes will be populated here -->
        </div>
      </div>

      <!-- Red Flags -->
      <div class="result-card" id="red-flags-card" style="display: none;">
        <div class="result-header">
          <h3>Tanda Bahaya</h3>
          <span class="badge bad">Monitoring</span>
        </div>
        <div id="fluid-red-flags">
          <!-- Red flags will be populated here -->
        </div>
      </div>

      <!-- Contraindications -->
      <div class="result-card" id="contraindications-card" style="display: none;">
        <div class="result-header">
          <h3>Kontraindikasi & Peringatan</h3>
          <span class="badge bad">Keamanan</span>
        </div>
        <div id="fluid-contraindications">
          <!-- Contraindications will be populated here -->
        </div>
      </div>
    </section>

    <!-- Info Box -->
    <section class="kpsp-info-box">
      <h4>ℹ️ Panduan Cairan Maintenance (Holliday-Segar)</h4>
      <ul>
        <li><strong>Formula dasar:</strong> 100ml/kg untuk 10kg pertama, 50ml/kg untuk 10kg kedua, 20ml/kg untuk berat >20kg</li>
        <li><strong>Faktor koreksi:</strong> +20% untuk demam, -25% untuk NPO</li>
        <li><strong>Monitoring:</strong> Balance input-output, berat jenis urine, elektrolit serum</li>
        <li><strong>Red flags:</strong> Overload (>150% maintenance), deficit (<50%), edema</li>
        <li><strong>Adjustments:</strong> Berdasarkan kondisi klinis, lab results, dan response therapy</li>
        <li><strong>Komplikasi:</strong> Hiponatremia, hiperglikemia, overload volume</li>
      </ul>
    </section>
  `;

  document.querySelector('.main-content').appendChild(fluidContent);

  // Form validation
  function validateFluidForm() {
    const weight = parseFloat(fluidContent.querySelector('#fluid-weight').value);
    const age = parseInt(fluidContent.querySelector('#fluid-age').value);
    const intake = fluidContent.querySelector('#fluid-intake').value ? 
      parseFloat(fluidContent.querySelector('#fluid-intake').value) : null;

    let isValid = true;

    // Reset errors
    fluidContent.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));
    fluidContent.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));

    // Validate weight
    if (!weight || weight < 2 || weight > 50) {
      fluidContent.querySelector('#fluid-weight').classList.add('error');
      fluidContent.querySelector('#fluid-weight-error').textContent = 'Masukkan berat badan yang valid (2-50 kg)'.addClass('visible');
      isValid = false;
    }

    // Validate age
    if (age === '' || age < 0 || age > 2159) {
      fluidContent.querySelector('#fluid-age').classList.add('error');
      fluidContent.querySelector('#fluid-age-error').textContent = 'Masukkan umur yang valid'.addClass('visible');
      isValid = false;
    }

    // Validate intake if provided
    if (intake !== null && (intake < 0 || intake > 500)) {
      fluidContent.querySelector('#fluid-intake').classList.add('error');
      fluidContent.querySelector('#fluid-intake-error').textContent = 'Intake harus antara 0-500 ml/jam'.addClass('visible');
      isValid = false;
    }

    return isValid;
  }

  // Calculate fluids
  fluidContent.querySelector('#fluid-calculate').addEventListener('click', function() {
    if (!validateFluidForm()) return;

    const weight = parseFloat(fluidContent.querySelector('#fluid-weight').value);
    const age = parseInt(fluidContent.querySelector('#fluid-age').value);
    const hasFever = fluidContent.querySelector('#fluid-fever').checked;
    const isNPO = fluidContent.querySelector('#fluid-npo').checked;
    const intake = fluidContent.querySelector('#fluid-intake').value ? 
      parseFloat(fluidContent.querySelector('#fluid-intake').value) : null;
    const fluidType = fluidContent.querySelector('#fluid-type').value;
    const hasHeartFailure = fluidContent.querySelector('#fluid-heart-failure').checked;
    const hasRenalFailure = fluidContent.querySelector('#fluid-renal-failure').checked;
    const hasEdema = fluidContent.querySelector('#fluid-edema').checked;

    // Calculate maintenance
    const maintenance = FLUID_DATA.calculateMaintenance(weight, hasFever, isNPO);

    // Calculate rate adjustment if intake provided
    let adjustment = null;
    if (intake !== null) {
      const currentBalance = (intake * 24) - maintenance.perDay;
      adjustment = FLUID_DATA.calculateRateAdjustment(maintenance.perHour, currentBalance);
    }

    // Get clinical notes
    const clinicalNotes = FLUID_DATA.getClinicalNotes(maintenance, weight, age);

    // Get contraindications
    const contraindications = FLUID_DATA.getContraindications(weight, age, hasHeartFailure, hasRenalFailure);

    // Get red flags
    const redFlags = FLUID_DATA.getRedFlags(maintenance, intake ? intake * 24 : null, weight, hasEdema);

    // Update display
    updateFluidResults(maintenance, clinicalNotes, contraindications, redFlags, fluidType, adjustment, weight, age);
  });

  // Update results display
  function updateFluidResults(maintenance, clinicalNotes, contraindications, redFlags, fluidType, adjustment, weight, age) {
    // Show results section
    fluidContent.querySelector('#fluid-results').style.display = 'block';

    // Update summary
    fluidContent.querySelector('#fluid-summary').textContent = 
      `Kebutuhan harian: ${maintenance.perDay} ml | Per jam: ${maintenance.perHour} ml/jam`;

    // Update maintenance calculations
    const calcDiv = fluidContent.querySelector('#maintenance-calculations');
    let calcHtml = `
      <div class="calc-item">
        <strong>Kebutuhan per 24 jam:</strong>
        <span>${maintenance.perDay} ml</span>
      </div>
      <div class="calc-item">
        <strong>Kebutuhan per jam:</strong>
        <span>${maintenance.perHour} ml/jam</span>
      </div>
      <div class="calc-item">
        <strong>Kebutuhan per menit:</strong>
        <span>${maintenance.perMinute} ml/menit</span>
      </div>
      <div class="calc-item">
        <strong>Maintenance dasar:</strong>
        <span>${maintenance.baseMaintenance} ml/24 jam</span>
      </div>
    `;

    if (maintenance.feverAdjustment || maintenance.npoAdjustment) {
      calcHtml += '<div class="calc-breakdown"><em>Faktor koreksi:';
      if (maintenance.feverAdjustment) calcHtml += ' +20% (demam)';
      if (maintenance.npoAdjustment) calcHtml += ' -25% (NPO)';
      calcHtml += '</em></div>';
    }

    if (adjustment) {
      calcHtml += `
        <div class="calc-item adjustment">
          <strong>Adjust rate (berdasarkan intake):</strong>
          <span>${adjustment.newRate} ml/jam ${adjustment.type !== 'maintain' ? `(${adjustment.type} ${adjustment.amount} ml/jam)` : ''}</span>
        </div>
      `;
    }

    calcDiv.innerHTML = calcHtml;

    // Update fluid type info
    const typeCard = fluidContent.querySelector('#fluid-type-card');
    if (fluidType && FLUID_DATA.fluidTypes[fluidType]) {
      typeCard.style.display = 'block';
      const fluidInfo = FLUID_DATA.fluidTypes[fluidType];
      fluidContent.querySelector('#fluid-type-info').innerHTML = `
        <div class="fluid-info-item">
          <strong>Nama:</strong>
          <span>${fluidInfo.name}</span>
        </div>
        <div class="fluid-info-item">
          <strong>Komposisi:</strong>
          <span>${fluidInfo.composition}</span>
        </div>
        <div class="fluid-info-item">
          <strong>Kalori:</strong>
          <span>${fluidInfo.calories}</span>
        </div>
        <div class="fluid-info-item">
          <strong>Indikasi:</strong>
          <span>${fluidInfo.indication}</span>
        </div>
        ${fluidInfo.warnings.length > 0 ? `
          <div class="fluid-warnings">
            <strong>Peringatan:</strong>
            <ul>
              ${fluidInfo.warnings.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      `;
    } else {
      typeCard.style.display = 'none';
    }

    // Update clinical notes
    fluidContent.querySelector('#clinical-notes').innerHTML = clinicalNotes
      .map(note => `<div class="clinical-note">• ${note}</div>`)
      .join('');

    // Update red flags
    const redCard = fluidContent.querySelector('#red-flags-card');
    if (redFlags.length > 0) {
      redCard.style.display = 'block';
      fluidContent.querySelector('#fluid-red-flags').innerHTML = redFlags
        .map(flag => `<div class="red-flag-item">⚠️ ${flag}</div>`)
        .join('');
    } else {
      redCard.style.display = 'none';
    }

    // Update contraindications
    const contraCard = fluidContent.querySelector('#contraindications-card');
    if (contraindications.length > 0) {
      contraCard.style.display = 'block';
      fluidContent.querySelector('#fluid-contraindications').innerHTML = contraindications
        .map(contra => `<div class="contra-item">🚨 ${contra}</div>`)
        .join('');
    } else {
      contraCard.style.display = 'none';
    }

    // Update fluid advice
    let advice = 'Monitor balance input-output dan Elektrolit secara berkala. ';
    if (contraindications.length > 0) {
      advice += 'Ada kontraindikasi - evaluasi ulang sebelum memulai terapi cairan.';
    } else {
      advice += 'Lanjutkan evaluasi klinis dan laboratorio secara rutin.';
    }
    fluidContent.querySelector('#fluid-advice').innerHTML = `<strong>Catatan:</strong> ${advice}`;

    // Scroll to results
    fluidContent.querySelector('#fluid-results').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  return fluidContent;
}

// Add CSS for fluid-specific styles
function addFluidStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .correction-factors, .comorbidity-checkboxes {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      margin: 0;
    }
    .checkbox-item input[type="checkbox"] {
      margin: 0;
    }
    .calc-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .calc-item:last-child {
      border-bottom: none;
    }
    .calc-item.adjustment {
      background: #fef3c7;
      margin: 8px -12px;
      padding: 12px;
      border-radius: 8px;
    }
    .calc-breakdown {
      margin-top: 8px;
      font-size: 12px;
      color: #64748b;
    }
    .fluid-info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .fluid-info-item:last-child {
      border-bottom: none;
    }
    .fluid-warnings {
      margin-top: 12px;
      padding: 12px;
      background: #fef2f2;
      border-radius: 8px;
    }
    .fluid-warnings ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }
    .fluid-warnings li {
      margin-bottom: 4px;
      font-size: 12px;
      color: #dc2626;
    }
    .clinical-note {
      padding: 6px 0;
      font-size: 13px;
      color: #475569;
    }
    .red-flag-item {
      padding: 8px 0;
      font-size: 13px;
      color: #dc2626;
      font-weight: 500;
    }
    .contra-item {
      padding: 8px 0;
      font-size: 13px;
      color: #dc2626;
      font-weight: 600;
    }
    .comorbidities-section {
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    .comorbidities-section label {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 12px;
      display: block;
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles
addFluidStyles();