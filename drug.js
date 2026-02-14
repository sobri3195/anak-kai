// Pediatric Drug Dose Calculator Module
// Calculates drug dosages for common pediatric medications

const DRUG_DATA = {
  medications: {
    paracetamol: {
      name: 'Parasetamol',
      nameEn: 'Paracetamol',
      unit: 'mg',
      maxDaily: 75, // mg/kg/day
      maxSingle: 15, // mg/kg/dose
      maxDailyAbsolute: 4000, // mg/day
      dosing: [
        { ageMin: 0, ageMax: 3, dose: 40, frequency: '4-6 jam jika perlu' },
        { ageMin: 4, ageMax: 11, dose: 80, frequency: '4-6 jam jika perlu' },
        { ageMin: 12, ageMax: 23, dose: 120, frequency: '4-6 jam jika perlu' },
        { ageMin: 24, ageMax: 71, dose: 240, frequency: '4-6 jam jika perlu' }
      ],
      contraindications: ['Alergi parasetamol', 'Gangguan hati berat'],
      notes: 'Dosis maksimal 4g/hari untuk dewasa. Jangan melebihi 5 dosis/hari.'
    },
    ibuprofen: {
      name: 'Ibuprofen',
      nameEn: 'Ibuprofen',
      unit: 'mg',
      maxDaily: 40, // mg/kg/day
      maxSingle: 10, // mg/kg/dose
      maxDailyAbsolute: 2400, // mg/day
      dosing: [
        { ageMin: 6, ageMax: 11, dose: 50, frequency: '6-8 jam jika perlu' },
        { ageMin: 12, ageMax: 23, dose: 100, frequency: '6-8 jam jika perlu' },
        { ageMin: 24, ageMax: 71, dose: 200, frequency: '6-8 jam jika perlu' }
      ],
      contraindications: ['Usia < 6 bulan', 'Alergi NSAID', 'Dehidrasi', 'Gangguan ginjal'],
      notes: 'Jangan berikan pada bayi < 6 bulan tanpa anjuran dokter.'
    },
    amoxicillin: {
      name: 'Amoksisilin',
      nameEn: 'Amoxicillin',
      unit: 'mg',
      maxDaily: 90, // mg/kg/day
      maxSingle: 45, // mg/kg/dose
      dosing: [
        { ageMin: 0, ageMax: 71, dose: 25, frequency: '12 jam' },
        { ageMin: 0, ageMax: 71, dose: 20, frequency: '8 jam' }
      ],
      contraindications: ['Alergi penisilin'],
      notes: 'Untuk infeksi bakteri. Selaluhabiskan antibiotik sesuai anjuran.'
    },
    ors: {
      name: 'Oral Rehydration Salt (ORS)',
      nameEn: 'ORS',
      unit: 'ml',
      maxDaily: null, // Calculated based on condition
      dosing: [
        { ageMin: 0, ageMax: 2, dose: 50, frequency: 'setelah diare' },
        { ageMin: 3, ageMax: 11, dose: 100, frequency: 'setelah diare' },
        { ageMin: 12, ageMax: 71, dose: 100, frequency: 'setelah diare' }
      ],
      contraindications: ['Muntah مستمر', 'Usia < 1 bulan (konsultasi)'],
      notes: 'Untuk menggantikan cairan yang hilang karena diare/muntah.'
    },
    zinc: {
      name: 'Zinc',
      nameEn: 'Zinc',
      unit: 'mg',
      maxDaily: 20, // mg/day
      dosing: [
        { ageMin: 6, ageMax: 71, dose: 10, frequency: '1x sehari selama 10-14 hari' }
      ],
      contraindications: [],
      notes: 'Untuk diare akut. Berikan 10-14 hari meskipun diare sudah berhenti.'
    }
  },

  // Calculate dose based on weight and medication
  calculateDose: function(medicationKey, weight) {
    const med = this.medications[medicationKey];
    if (!med || !weight) return null;

    // For ORS and Zinc, use age-based dosing
    if (medicationKey === 'ors' || medicationKey === 'zinc') {
      return this.calculateORSZincDose(medicationKey, weight);
    }

    // For other medications, use weight-based dosing
    return this.calculateWeightBasedDose(med, weight);
  },

  // Calculate weight-based dose
  calculateWeightBasedDose: function(med, weight) {
    const maxSingle = med.maxSingle ? weight * med.maxSingle : null;
    const maxDaily = med.maxDaily ? weight * med.maxDaily : null;
    
    // Use the most common dosing (every 8 hours for antibiotics, as needed for fever meds)
    let singleDose = maxSingle;
    if (medicationKey === 'amoxicillin') {
      singleDose = weight * 25; // 25 mg/kg every 12 hours
    } else if (medicationKey === 'paracetamol' || medicationKey === 'ibuprofen') {
      singleDose = Math.min(maxSingle, 500); // Cap at 500mg for practical dosing
    }

    const dailyDose = maxDaily ? Math.min(maxDaily, med.maxDailyAbsolute || maxDaily) : null;

    return {
      medication: med,
      weight: weight,
      singleDose: Math.round(singleDose),
      singleDoseDisplay: Math.round(singleDose) + ' ' + med.unit,
      dailyDose: dailyDose ? Math.round(dailyDose) : null,
      dailyDoseDisplay: dailyDose ? Math.round(dailyDose) + ' ' + med.unit + '/hari' : null,
      maxSingle: Math.round(maxSingle),
      maxDaily: maxDaily ? Math.round(maxDaily) : null
    };
  },

  // Calculate ORS/Zinc dose based on age
  calculateORSZincDose: function(medicationKey, age) {
    const med = this.medications[medicationKey];
    const dosing = med.dosing.find(d => age >= d.ageMin && age <= d.ageMax);
    
    if (!dosing) return null;

    return {
      medication: med,
      age: age,
      dose: dosing.dose,
      doseDisplay: dosing.dose + ' ' + med.unit,
      frequency: dosing.frequency,
      maxDaily: med.maxDaily
    };
  },

  // Get common formulations
  getFormulations: function(medicationKey) {
    const formulations = {
      paracetamol: [
        { name: 'Sirup 120mg/5ml', concentration: 24 },
        { name: 'Sirup 250mg/5ml', concentration: 50 },
        { name: 'Tablet 500mg', concentration: 500 }
      ],
      ibuprofen: [
        { name: 'Sirup 100mg/5ml', concentration: 20 },
        { name: 'Tablet 200mg', concentration: 200 }
      ],
      amoxicillin: [
        { name: 'Sirup 125mg/5ml', concentration: 25 },
        { name: 'Sirup 250mg/5ml', concentration: 50 },
        { name: 'Kapsul 250mg', concentration: 250 }
      ],
      zinc: [
        { name: 'Sirup 10mg/5ml', concentration: 2 },
        { name: 'Tablet kunyah 10mg', concentration: 10 }
      ]
    };
    return formulations[medicationKey] || [];
  },

  // Calculate volume for liquid formulations
  calculateVolume: function(doseMg, concentration) {
    if (!doseMg || !concentration) return null;
    const volume = doseMg / concentration;
    return Math.round(volume * 10) / 10; // Round to 1 decimal
  }
};

// Initialize drug calculator module
function initDrugModule() {
  const drugContent = document.createElement('div');
  drugContent.className = 'drug-content';
  drugContent.style.display = 'none';
  
  drugContent.innerHTML = `
    <!-- Drug Calculator Card -->
    <section class="input-card">
      <div class="input-card-header">
        <h2 class="input-card-title">Kalkulator Dosis Obat Anak</h2>
        <p class="input-card-desc">Hitung dosis obat berdasarkan berat badan untuk parasetamol, ibuprofen, amoksisilin, ORS, dan zinc.</p>
      </div>

      <div class="form-grid">
        <div class="form-field">
          <label for="drug-weight">Berat badan (kg)</label>
          <input type="number" id="drug-weight" min="2" max="30" step="0.1" placeholder="8.5">
          <div class="error-message" id="drug-weight-error"></div>
        </div>

        <div class="form-field">
          <label for="drug-age">Umur (bulan)</label>
          <input type="number" id="drug-age" min="0" max="71" step="1" placeholder="18">
          <div class="error-message" id="drug-age-error"></div>
        </div>

        <div class="form-field full-width">
          <label for="drug-select">Pilih Obat</label>
          <select id="drug-select">
            <option value="">Pilih obat yang akan dihitung dosisnya</option>
            <option value="paracetamol">Parasetamol (demam, nyeri)</option>
            <option value="ibuprofen">Ibuprofen (demam, nyeri, radang)</option>
            <option value="amoxicillin">Amoksisilin (antibiotik)</option>
            <option value="ors">ORS (rehidrasi)</option>
            <option value="zinc">Zinc (diare)</option>
          </select>
          <div class="error-message" id="drug-select-error"></div>
        </div>

        <div class="form-field full-width" id="formulation-field" style="display: none;">
          <label for="drug-formulation">Sediaan yang tersedia</label>
          <select id="drug-formulation">
            <option value="">Pilih sediaan</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button id="drug-calculate">Hitung Dosis</button>
        <p class="form-note">Selalu konsultasi dengan tenaga kesehatan sebelum memberikan obat kepada anak.</p>
      </div>
    </section>

    <!-- Drug Results -->
    <section id="drug-results" style="display: none;">
      <!-- Main Result Card -->
      <div class="result-card">
        <div class="result-header">
          <h3>Dosis Obat</h3>
          <span class="badge good">Kalkulasi</span>
        </div>
        <div class="dose-details" id="dose-details">
          <!-- Dose information will be populated here -->
        </div>
        <div class="result-advice" id="drug-notes">
          <!-- Medication notes -->
        </div>
      </div>

      <!-- Contraindications Card -->
      <div class="result-card" id="contraindications-card">
        <div class="result-header">
          <h3>Kontraindikasi & Peringatan</h3>
          <span class="badge warn">Penting</span>
        </div>
        <div id="contraindications-list">
          <!-- Contraindications will be populated here -->
        </div>
      </div>

      <!-- Formulation Card -->
      <div class="result-card" id="formulation-card" style="display: none;">
        <div class="result-header">
          <h3>Cara Pemberian</h3>
          <span class="badge">Panduan</span>
        </div>
        <div id="administration-details">
          <!-- Administration details -->
        </div>
      </div>
    </section>

    <!-- Info Box -->
    <section class="kpsp-info-box">
      <h4>ℹ️ Panduan Keamanan Obat Anak</h4>
      <ul>
        <li><strong>Selalu periksa:</strong> Dosis sesuai berat badan, umur, dan kondisi anak</li>
        <li><strong>Jangan melebihi:</strong> Dosis maksimal harian yang dianjurkan</li>
        <li><strong>Interaksi obat:</strong> Beri tahu dokter tentang obat lain yang sedang diminum</li>
        <li><strong>Tanda bahaya:</strong> Segera ke dokter jika ada reaksi alergi atau kondisi memburuk</li>
        <li><strong>Penyimpanan:</strong> Jauh dari jangkauan anak, pada suhu ruangan</li>
        <li><strong>Antibiotik:</strong> Selaluhabiskan sesuai anjuran，即使 kondisi sudah membaik</li>
      </ul>
    </section>
  `;

  document.querySelector('.main-content').appendChild(drugContent);

  // Drug selection handler
  const drugSelect = drugContent.querySelector('#drug-select');
  const formulationField = drugContent.querySelector('#formulation-field');
  const formulationSelect = drugContent.querySelector('#drug-formulation');

  drugSelect.addEventListener('change', function() {
    const selectedDrug = this.value;
    if (selectedDrug && ['paracetamol', 'ibuprofen', 'amoxicillin', 'zinc'].includes(selectedDrug)) {
      // Show formulation field
      formulationField.style.display = 'block';
      
      // Populate formulations
      formulationSelect.innerHTML = '<option value="">Pilih sediaan</option>';
      const formulations = DRUG_DATA.getFormulations(selectedDrug);
      formulations.forEach(form => {
        const option = document.createElement('option');
        option.value = form.concentration;
        option.textContent = form.name;
        formulationSelect.appendChild(option);
      });
    } else {
      formulationField.style.display = 'none';
    }
  });

  // Form validation
  function validateDrugForm() {
    const weight = parseFloat(drugContent.querySelector('#drug-weight').value);
    const age = parseInt(drugContent.querySelector('#drug-age').value);
    const drug = drugSelect.value;

    let isValid = true;

    // Reset errors
    drugContent.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));
    drugContent.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));

    // Validate weight
    if (!weight || weight < 2 || weight > 30) {
      drugContent.querySelector('#drug-weight').classList.add('error');
      const weightError = drugContent.querySelector('#drug-weight-error');
      weightError.textContent = 'Masukkan berat badan yang valid (2-30 kg)';
      weightError.classList.add('visible');
      isValid = false;
    }

    // Validate age
    if (age === '' || age < 0 || age > 71) {
      drugContent.querySelector('#drug-age').classList.add('error');
      const ageError = drugContent.querySelector('#drug-age-error');
      ageError.textContent = 'Masukkan umur yang valid (0-71 bulan)';
      ageError.classList.add('visible');
      isValid = false;
    }

    // Validate drug selection
    if (!drug) {
      drugContent.querySelector('#drug-select').classList.add('error');
      const drugError = drugContent.querySelector('#drug-select-error');
      drugError.textContent = 'Silakan pilih obat';
      drugError.classList.add('visible');
      isValid = false;
    }

    return isValid;
  }

  // Calculate dose
  drugContent.querySelector('#drug-calculate').addEventListener('click', function() {
    if (!validateDrugForm()) return;

    const weight = parseFloat(drugContent.querySelector('#drug-weight').value);
    const age = parseInt(drugContent.querySelector('#drug-age').value);
    const drug = drugSelect.value;
    const formulation = formulationSelect.value;

    // Calculate dose
    let doseResult;
    if (drug === 'ors' || drug === 'zinc') {
      doseResult = DRUG_DATA.calculateORSZincDose(drug, age);
    } else {
      doseResult = DRUG_DATA.calculateDose(drug, weight);
    }

    if (!doseResult) return;

    // Update display
    updateDrugResults(doseResult, formulation);
  });

  // Update results display
  function updateDrugResults(doseResult, formulation) {
    const medication = doseResult.medication;
    
    // Show results section
    drugContent.querySelector('#drug-results').style.display = 'block';

    // Update dose details
    let doseHtml = '';
    if (doseResult.singleDose) {
      doseHtml = `
        <div class="dose-item">
          <strong>Dosis per kali:</strong>
          <span>${doseResult.singleDoseDisplay}</span>
        </div>
      `;
    } else {
      doseHtml = `
        <div class="dose-item">
          <strong>Dosis:</strong>
          <span>${doseResult.doseDisplay}</span>
        </div>
      `;
    }

    if (doseResult.dailyDose) {
      doseHtml += `
        <div class="dose-item">
          <strong>Dosis maksimal/hari:</strong>
          <span>${doseResult.dailyDoseDisplay}</span>
        </div>
      `;
    }

    if (doseResult.frequency) {
      doseHtml += `
        <div class="dose-item">
          <strong>Frekuensi:</strong>
          <span>${doseResult.frequency}</span>
        </div>
      `;
    }

    drugContent.querySelector('#dose-details').innerHTML = doseHtml;

    // Update notes
    drugContent.querySelector('#drug-notes').innerHTML = 
      `<strong>Catatan:</strong> ${medication.notes}`;

    // Update contraindications
    const contraCard = drugContent.querySelector('#contraindications-card');
    const contraList = drugContent.querySelector('#contraindications-list');
    
    if (medication.contraindications.length > 0) {
      contraCard.style.display = 'block';
      contraList.innerHTML = medication.contraindications
        .map(contra => `<div class="contra-item">• ${contra}</div>`)
        .join('');
    } else {
      contraCard.style.display = 'none';
    }

    // Update formulation details
    const formCard = drugContent.querySelector('#formulation-card');
    if (formulation && ['paracetamol', 'ibuprofen', 'amoxicillin', 'zinc'].includes(drugSelect.value)) {
      formCard.style.display = 'block';
      const concentration = parseFloat(formulation);
      const volume = DRUG_DATA.calculateVolume(doseResult.singleDose, concentration);
      
      const adminHtml = `
        <div class="admin-item">
          <strong>Sediaan:</strong>
          <span>${drugSelect.options[drugSelect.selectedIndex].text}</span>
        </div>
        <div class="admin-item">
          <strong>Konsentrasi:</strong>
          <span>${concentration} ${medication.unit}/ml</span>
        </div>
        ${volume ? `
        <div class="admin-item">
          <strong>Volume yang diberikan:</strong>
          <span>${volume} ml per dosis</span>
        </div>
        ` : ''}
      `;
      
      drugContent.querySelector('#administration-details').innerHTML = adminHtml;
    } else {
      formCard.style.display = 'none';
    }

    // Scroll to results
    drugContent.querySelector('#drug-results').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  return drugContent;
}

// Add CSS for drug-specific styles
function addDrugStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .dose-details, #administration-details {
      margin: 16px 0;
    }
    .dose-item, .admin-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .dose-item:last-child, .admin-item:last-child {
      border-bottom: none;
    }
    .contra-item {
      padding: 4px 0;
      font-size: 13px;
      color: #64748b;
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles
addDrugStyles();