// Dehydration and Diarrhea Screening Module
// Clinical assessment and fluid management for pediatric dehydration

const DEHYDRATION_DATA = {
  // Clinical signs and their weights for dehydration scoring
  clinicalSigns: {
    generalCondition: [
      { label: 'Normal/Alert', value: 0, points: 0 },
      { label: 'Thirsty/Restless', value: 1, points: 1 },
      { label: 'Lethargic/Unconscious', value: 2, points: 2 }
    ],
    eyes: [
      { label: 'Normal', value: 0, points: 0 },
      { label: 'Sunken', value: 1, points: 1 },
      { label: 'Very sunken', value: 2, points: 2 }
    ],
    tears: [
      { label: 'Tears present', value: 0, points: 0 },
      { label: 'Decreased tears', value: 1, points: 1 },
      { label: 'No tears', value: 2, points: 2 }
    ],
    mouthTongue: [
      { label: 'Moist', value: 0, points: 0 },
      { label: 'Sticky', value: 1, points: 1 },
      { label: 'Dry', value: 2, points: 2 }
    ],
    skinTurgor: [
      { label: 'Normal', value: 0, points: 0 },
      { label: 'Slow', value: 1, points: 1 },
      { label: 'Very slow', value: 2, points: 2 }
    ],
    breathing: [
      { label: 'Normal', value: 0, points: 0 },
      { label: 'Fast', value: 1, points: 1 },
      { label: 'Fast and deep', value: 2, points: 2 }
    ],
    heartRate: [
      { label: 'Normal', value: 0, points: 0 },
      { label: 'Increased', value: 1, points: 1 },
      { label: 'Very increased', value: 2, points: 2 }
    ]
  },

  // Dehydration classification based on total score
  classification: {
    noDehydration: {
      minScore: 0,
      maxScore: 4,
      label: 'Tanpa Dehidrasi',
      color: 'good',
      management: 'A',
      description: 'Anak terlihat aktif dan memiliki tanda dehidrasi minimal.',
      fluidRequirement: 'Continue normal feeding and increase fluid intake',
      orsVolume: '50-100 ml after each loose stool',
      dangerSigns: []
    },
    someDehydration: {
      minScore: 5,
      maxScore: 8,
      label: 'Dehidrasi Ringan-Sedang',
      color: 'warn',
      management: 'B',
      description: 'Anak memiliki beberapa tanda dehidrasi dan perlu penanganan dengan ORS.',
      fluidRequirement: 'ORS 75 ml/kg over 4 hours, then reassess',
      orsVolume: '75 ml/kg over 4 hours',
      dangerSigns: []
    },
    severeDehydration: {
      minScore: 9,
      maxScore: 14,
      label: 'Dehidrasi Berat',
      color: 'bad',
      management: 'C',
      description: 'Anak memiliki tanda dehidrasi berat dan memerlukan penanganan segera.',
      fluidRequirement: 'IV fluids immediately, then reassess',
      orsVolume: 'Not applicable - requires IV therapy',
      dangerSigns: ['Lethargy', 'Unable to drink', 'Convulsions']
    }
  },

  // ORS composition and preparation
  orsInfo: {
    composition: {
      sodium: '75 mEq/L',
      glucose: '75 mmol/L',
      potassium: '20 mEq/L',
      chloride: '65 mEq/L',
      citrate: '10 mmol/L'
    },
    preparation: 'Mix one packet with 200ml clean drinking water (not more, not less)',
    storage: 'Use within 24 hours if kept cool, within 6 hours if warm climate'
  },

  // Calculate total dehydration score
  calculateScore: function(responses) {
    let totalScore = 0;
    
    for (let key in responses) {
      if (this.clinicalSigns[key]) {
        const sign = this.clinicalSigns[key][responses[key]];
        if (sign) {
          totalScore += sign.points;
        }
      }
    }
    
    return totalScore;
  },

  // Get dehydration classification
  getClassification: function(score) {
    for (let key in this.classification) {
      const classification = this.classification[key];
      if (score >= classification.minScore && score <= classification.maxScore) {
        return classification;
      }
    }
    return null;
  },

  // Calculate ORS volume for Plan B
  calculateORSVolume: function(weight, classification) {
    if (classification.management !== 'B') return null;
    
    const totalVolume = weight * 75; // 75 ml/kg over 4 hours
    const perFeed = totalVolume / 4; // Divide by 4 (20 minutes intervals)
    
    return {
      totalVolume: Math.round(totalVolume),
      perFeed: Math.round(perFeed),
      timeFrame: '4 jam',
      interval: 'Setiap 20 menit'
    };
  },

  // IV fluid calculation for Plan C
  calculateIVFluids: function(weight, classification) {
    if (classification.management !== 'C') return null;
    
    // Initial bolus
    const bolusVolume = weight * 20; // 20 ml/kg
    const bolusTime = '30 minutes';
    
    // Maintenance fluids
    const maintenance = this.calculateMaintenanceFluids(weight);
    
    // Deficit correction (assuming moderate to severe dehydration)
    const deficit = weight * 100; // 100 ml/kg
    
    return {
      bolusVolume: Math.round(bolusVolume),
      bolusTime: bolusTime,
      deficitVolume: Math.round(deficit),
      maintenanceVolume: maintenance.perDay,
      totalFirstDay: Math.round(deficit + maintenance.perDay)
    };
  },

  // Calculate maintenance fluids (Holliday-Segar method)
  calculateMaintenanceFluids: function(weight) {
    let perDay;
    
    if (weight <= 10) {
      perDay = weight * 100; // 100 ml/kg for first 10kg
    } else if (weight <= 20) {
      perDay = 1000 + (weight - 10) * 50; // 1000ml + 50ml/kg for next 10kg
    } else {
      perDay = 1500 + (weight - 20) * 20; // 1500ml + 20ml/kg above 20kg
    }
    
    const perHour = Math.round(perDay / 24);
    
    return {
      perDay: Math.round(perDay),
      perHour: perHour
    };
  },

  // Get danger signs
  getDangerSigns: function(classification, age, temperature) {
    const dangerSigns = [];
    
    if (age < 3) dangerSigns.push('Usia < 3 bulan');
    if (temperature >= 38.5) dangerSigns.push('Demam tinggi (≥38.5°C)');
    if (classification.management === 'C') dangerSigns.push('Dehidrasi berat');
    
    // Add specific danger signs from classification
    if (classification.dangerSigns) {
      dangerSigns.push(...classification.dangerSigns);
    }
    
    return dangerSigns;
  }
};

// Initialize dehydration module
function initDehydrationModule() {
  const dehydrationContent = document.createElement('div');
  dehydrationContent.className = 'dehydration-content';
  dehydrationContent.style.display = 'none';
  
  dehydrationContent.innerHTML = `
    <!-- Dehydration Screening Card -->
    <section class="input-card">
      <div class="input-card-header">
        <h2 class="input-card-title">Skrining Dehidrasi & Diare</h2>
        <p class="input-card-desc">Penilaian klinis dehidrasi berdasarkan tanda-tanda fisik dan rencana penatalaksanaan A/B/C.</p>
      </div>

      <div class="form-grid">
        <div class="form-field">
          <label for="dehydration-age">Umur (bulan)</label>
          <input type="number" id="dehydration-age" min="0" max="71" step="1" placeholder="18">
          <div class="error-message" id="dehydration-age-error"></div>
        </div>

        <div class="form-field">
          <label for="dehydration-weight">Berat badan (kg)</label>
          <input type="number" id="dehydration-weight" min="2" max="30" step="0.1" placeholder="8.5">
          <div class="error-message" id="dehydration-weight-error"></div>
        </div>

        <div class="form-field">
          <label for="dehydration-temp">Suhu tubuh (°C) - Opsional</label>
          <input type="number" id="dehydration-temp" min="35" max="42" step="0.1" placeholder="37.5">
          <div class="error-message" id="dehydration-temp-error"></div>
        </div>

        <div class="form-field">
          <label for="dehydration-stools">Frekuensi diare (hari ini)</label>
          <input type="number" id="dehydration-stools" min="0" max="20" step="1" placeholder="5">
          <div class="error-message" id="dehydration-stools-error"></div>
        </div>
      </div>

      <!-- Clinical Assessment -->
      <div class="clinical-assessment">
        <h3>Penilaian Klinis</h3>
        <p class="assessment-desc">Pilih tanda klinis yang paling sesuai dengan kondisi anak saat ini:</p>

        <div class="assessment-grid">
          <!-- General Condition -->
          <div class="assessment-field">
            <label>Kondisi umum</label>
            <div class="radio-group" data-field="generalCondition">
              <div class="radio-option">
                <input type="radio" id="gc-normal" name="generalCondition" value="0">
                <label for="gc-normal">Normal/Siap</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="gc-thirsty" name="generalCondition" value="1">
                <label for="gc-thirsty">Haus/Gelisah</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="gc-lethargic" name="generalCondition" value="2">
                <label for="gc-lethargic">Letargis/Tidak sadar</label>
              </div>
            </div>
          </div>

          <!-- Eyes -->
          <div class="assessment-field">
            <label>Mata</label>
            <div class="radio-group" data-field="eyes">
              <div class="radio-option">
                <input type="radio" id="eyes-normal" name="eyes" value="0">
                <label for="eyes-normal">Normal</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="eyes-sunken" name="eyes" value="1">
                <label for="eyes-sunken"> Cekung</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="eyes-very-sunken" name="eyes" value="2">
                <label for="eyes-very-sunken">Sangat cekung</label>
              </div>
            </div>
          </div>

          <!-- Tears -->
          <div class="assessment-field">
            <label>Air mata</label>
            <div class="radio-group" data-field="tears">
              <div class="radio-option">
                <input type="radio" id="tears-present" name="tears" value="0">
                <label for="tears-present">Ada</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="tears-decreased" name="tears" value="1">
                <label for="tears-decreased">Berkurang</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="tears-none" name="tears" value="2">
                <label for="tears-none">Tidak ada</label>
              </div>
            </div>
          </div>

          <!-- Mouth and Tongue -->
          <div class="assessment-field">
            <label>Mulut & lidah</label>
            <div class="radio-group" data-field="mouthTongue">
              <div class="radio-option">
                <input type="radio" id="mouth-moist" name="mouthTongue" value="0">
                <label for="mouth-moist">Lembab</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="mouth-sticky" name="mouthTongue" value="1">
                <label for="mouth-sticky">Lengket</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="mouth-dry" name="mouthTongue" value="2">
                <label for="mouth-dry">Kering</label>
              </div>
            </div>
          </div>

          <!-- Skin Turgor -->
          <div class="assessment-field">
            <label>Turgor kulit</label>
            <div class="radio-group" data-field="skinTurgor">
              <div class="radio-option">
                <input type="radio" id="turgor-normal" name="skinTurgor" value="0">
                <label for="turgor-normal">Normal</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="turgor-slow" name="skinTurgor" value="1">
                <label for="turgor-slow">Lambat</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="turgor-very-slow" name="skinTurgor" value="2">
                <label for="turgor-very-slow">Sangat lambat</label>
              </div>
            </div>
          </div>

          <!-- Breathing -->
          <div class="assessment-field">
            <label>Pernapasan</label>
            <div class="radio-group" data-field="breathing">
              <div class="radio-option">
                <input type="radio" id="breathing-normal" name="breathing" value="0">
                <label for="breathing-normal">Normal</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="breathing-fast" name="breathing" value="1">
                <label for="breathing-fast">Cepat</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="breathing-fast-deep" name="breathing" value="2">
                <label for="breathing-fast-deep">Cepat & dalam</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button id="dehydration-analyze">Analisis Dehidrasi</button>
        <p class="form-note">Penilaian ini berdasarkan kriteria WHO untuk dehidrasi pada anak.</p>
      </div>
    </section>

    <!-- Dehydration Results -->
    <section id="dehydration-results" style="display: none;">
      <!-- Main Result Card -->
      <div class="result-card">
        <div class="result-header">
          <h3>Derajat Dehidrasi</h3>
          <span class="badge" id="dehydration-status-badge">-</span>
        </div>
        <p class="result-meta" id="dehydration-score">Skor: -/14</p>
        <p class="result-detail" id="dehydration-description">-</p>
        <div class="result-advice" id="dehydration-plan">-</div>
      </div>

      <!-- Fluid Management Card -->
      <div class="result-card" id="fluid-management-card">
        <div class="result-header">
          <h3>Manajemen Cairan</h3>
          <span class="badge good">Perhitungan</span>
        </div>
        <div id="fluid-management-details">
          <!-- Fluid management details will be populated here -->
        </div>
      </div>

      <!-- Danger Signs Card -->
      <div class="result-card" id="danger-signs-card" style="display: none;">
        <div class="result-header">
          <h3>Tanda Bahaya</h3>
          <span class="badge bad">Rujuk Segera</span>
        </div>
        <div id="danger-signs-list">
          <!-- Danger signs will be populated here -->
        </div>
      </div>

      <!-- ORS Information Card -->
      <div class="result-card" id="ors-info-card" style="display: none;">
        <div class="result-header">
          <h3>Informasi ORS</h3>
          <span class="badge">Panduan</span>
        </div>
        <div id="ors-details">
          <!-- ORS information will be populated here -->
        </div>
      </div>
    </section>

    <!-- Info Box -->
    <section class="kpsp-info-box">
      <h4>ℹ️ Panduan Dehidrasi & Diare</h4>
      <ul>
        <li><strong>Plan A (Tanpa Dehidrasi):</strong> Lanjutkan ASI/makanan,增加 Cairan rumah (ORS, air matang, sup)</li>
        <li><strong>Plan B (Dehidrasi Ringan-Sedang):</strong> ORS 75 ml/kg dalam 4 jam, evaluasi ulang</li>
        <li><strong>Plan C (Dehidrasi Berat):</strong> Cairan IV segera, rujuk ke fasilitas kesehatan</li>
        <li><strong>Zinc supplementation:</strong> 10mg/hari untuk anak 6 bulan-5 tahun selama 10-14 hari</li>
        <li><strong>Kapan rujuk:</strong> Tidak bisa minum, kesadaran menurun, demam tinggi, darah dalam tinja</li>
        <li><strong>Pencegahan:</strong> Cuci tangan, air bersih, ASI eksklusif, imunisasi lengkap</li>
      </ul>
    </section>
  `;

  document.querySelector('.main-content').appendChild(dehydrationContent);

  // Get clinical assessment responses
  function getClinicalResponses() {
    const responses = {};
    
    ['generalCondition', 'eyes', 'tears', 'mouthTongue', 'skinTurgor', 'breathing'].forEach(field => {
      const selected = dehydrationContent.querySelector(`input[name="${field}"]:checked`);
      if (selected) {
        responses[field] = parseInt(selected.value);
      }
    });
    
    return responses;
  }

  // Form validation
  function validateDehydrationForm() {
    const age = parseInt(dehydrationContent.querySelector('#dehydration-age').value);
    const weight = parseFloat(dehydrationContent.querySelector('#dehydration-weight').value);
    const stools = parseInt(dehydrationContent.querySelector('#dehydration-stools').value);

    let isValid = true;

    // Reset errors
    dehydrationContent.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));
    dehydrationContent.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));

    // Validate age
    if (age === '' || age < 0 || age > 71) {
      dehydrationContent.querySelector('#dehydration-age').classList.add('error');
      const ageError = dehydrationContent.querySelector('#dehydration-age-error');
      ageError.textContent = 'Masukkan umur yang valid (0-71 bulan)';
      ageError.classList.add('visible');
      isValid = false;
    }

    // Validate weight
    if (!weight || weight < 2 || weight > 30) {
      dehydrationContent.querySelector('#dehydration-weight').classList.add('error');
      const weightError = dehydrationContent.querySelector('#dehydration-weight-error');
      weightError.textContent = 'Masukkan berat badan yang valid (2-30 kg)';
      weightError.classList.add('visible');
      isValid = false;
    }

    // Validate stools
    if (stools === '' || stools < 0 || stools > 20) {
      dehydrationContent.querySelector('#dehydration-stools').classList.add('error');
      const stoolError = dehydrationContent.querySelector('#dehydration-stools-error');
      stoolError.textContent = 'Masukkan frekuensi diare yang valid (0-20 kali)';
      stoolError.classList.add('visible');
      isValid = false;
    }

    // Check if all clinical assessments are completed
    const responses = getClinicalResponses();
    const expectedFields = ['generalCondition', 'eyes', 'tears', 'mouthTongue', 'skinTurgor', 'breathing'];
    const missingFields = expectedFields.filter(field => !(field in responses));
    
    if (missingFields.length > 0) {
      alert('Silakan lengkapi semua penilaian klinis terlebih dahulu.');
      isValid = false;
    }

    return isValid;
  }

  // Analyze dehydration
  dehydrationContent.querySelector('#dehydration-analyze').addEventListener('click', function() {
    if (!validateDehydrationForm()) return;

    const age = parseInt(dehydrationContent.querySelector('#dehydration-age').value);
    const weight = parseFloat(dehydrationContent.querySelector('#dehydration-weight').value);
    const temperature = dehydrationContent.querySelector('#dehydration-temp').value ? 
      parseFloat(dehydrationContent.querySelector('#dehydration-temp').value) : null;
    const responses = getClinicalResponses();

    // Calculate dehydration score
    const score = DEHYDRATION_DATA.calculateScore(responses);
    const classification = DEHYDRATION_DATA.getClassification(score);
    
    if (!classification) return;

    // Calculate fluid requirements
    let fluidDetails = null;
    if (classification.management === 'B') {
      fluidDetails = DEHYDRATION_DATA.calculateORSVolume(weight, classification);
    } else if (classification.management === 'C') {
      fluidDetails = DEHYDRATION_DATA.calculateIVFluids(weight, classification);
    }

    // Get danger signs
    const dangerSigns = DEHYDRATION_DATA.getDangerSigns(classification, age, temperature);

    // Update display
    updateDehydrationResults(score, classification, fluidDetails, dangerSigns, age, weight, temperature);
  });

  // Update results display
  function updateDehydrationResults(score, classification, fluidDetails, dangerSigns, age, weight, temperature) {
    // Show results section
    dehydrationContent.querySelector('#dehydration-results').style.display = 'block';

    // Update status badge
    const badge = dehydrationContent.querySelector('#dehydration-status-badge');
    badge.className = 'badge ' + classification.color;
    badge.textContent = classification.label;

    // Update score
    dehydrationContent.querySelector('#dehydration-score').textContent = `Skor: ${score}/14`;

    // Update description
    dehydrationContent.querySelector('#dehydration-description').textContent = 
      `${classification.description} Plan ${classification.management} diperlukan.`;

    // Update plan
    dehydrationContent.querySelector('#dehydration-plan').innerHTML = 
      `<strong>Rencana:</strong> ${classification.fluidRequirement}`;

    // Update fluid management
    const fluidCard = dehydrationContent.querySelector('#fluid-management-card');
    const fluidDetailsDiv = dehydrationContent.querySelector('#fluid-management-details');
    
    if (fluidDetails) {
      let fluidHtml = '';
      
      if (classification.management === 'B') {
        fluidHtml = `
          <div class="fluid-item">
            <strong>Total ORS:</strong>
            <span>${fluidDetails.totalVolume} ml dalam ${fluidDetails.timeFrame}</span>
          </div>
          <div class="fluid-item">
            <strong>Per pemberian:</strong>
            <span>${fluidDetails.perFeed} ml setiap ${fluidDetails.interval}</span>
          </div>
          <div class="fluid-item">
            <strong>Evaluasi:</strong>
            <span>Reassess setelah 4 jam</span>
          </div>
        `;
      } else if (classification.management === 'C') {
        fluidHtml = `
          <div class="fluid-item">
            <strong>Bolus awal:</strong>
            <span>${fluidDetails.bolusVolume} ml dalam ${fluidDetails.bolusTime}</span>
          </div>
          <div class="fluid-item">
            <strong>Koreksi defisit:</strong>
            <span>${fluidDetails.deficitVolume} ml (24 jam)</span>
          </div>
          <div class="fluid-item">
            <strong>Maintenance:</strong>
            <span>${fluidDetails.maintenanceVolume} ml/hari</span>
          </div>
          <div class="fluid-item">
            <strong>Total hari pertama:</strong>
            <span>${fluidDetails.totalFirstDay} ml</span>
          </div>
        `;
      }
      
      fluidDetailsDiv.innerHTML = fluidHtml;
      fluidCard.style.display = 'block';
    } else {
      fluidCard.style.display = 'none';
    }

    // Update danger signs
    const dangerCard = dehydrationContent.querySelector('#danger-signs-card');
    const dangerList = dehydrationContent.querySelector('#danger-signs-list');
    
    if (dangerSigns.length > 0) {
      dangerCard.style.display = 'block';
      dangerList.innerHTML = dangerSigns
        .map(sign => `<div class="danger-item">⚠️ ${sign}</div>`)
        .join('');
    } else {
      dangerCard.style.display = 'none';
    }

    // Update ORS information for Plan B
    const orsCard = dehydrationContent.querySelector('#ors-info-card');
    const orsDetails = dehydrationContent.querySelector('#ors-details');
    
    if (classification.management === 'B') {
      orsCard.style.display = 'block';
      orsDetails.innerHTML = `
        <div class="ors-item">
          <strong>Komposisi:</strong>
          <span>Na ${DEHYDRATION_DATA.orsInfo.composition.sodium}, Glukosa ${DEHYDRATION_DATA.orsInfo.composition.glucose}</span>
        </div>
        <div class="ors-item">
          <strong>Cara buat:</strong>
          <span>${DEHYDRATION_DATA.orsInfo.preparation}</span>
        </div>
        <div class="ors-item">
          <strong>Penyimpanan:</strong>
          <span>${DEHYDRATION_DATA.orsInfo.storage}</span>
        </div>
      `;
    } else {
      orsCard.style.display = 'none';
    }

    // Scroll to results
    dehydrationContent.querySelector('#dehydration-results').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  return dehydrationContent;
}

// Add CSS for dehydration-specific styles
function addDehydrationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .clinical-assessment {
      margin: 32px 0;
      padding: 24px;
      background: #f8fafc;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    .clinical-assessment h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }
    .assessment-desc {
      margin: 0 0 20px 0;
      font-size: 14px;
      color: #64748b;
    }
    .assessment-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .assessment-field {
      background: white;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    .assessment-field label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 12px;
    }
    .fluid-item, .ors-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .fluid-item:last-child, .ors-item:last-child {
      border-bottom: none;
    }
    .danger-item {
      padding: 8px 0;
      font-size: 13px;
      color: #dc2626;
      font-weight: 500;
    }
    @media (max-width: 767px) {
      .assessment-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles
addDehydrationStyles();