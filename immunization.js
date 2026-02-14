// Immunization Schedule Module
// Indonesian National Immunization Program with catch-up recommendations

const IMMUNIZATION_DATA = {
  // Indonesian National Immunization Schedule (IDNI 2020)
  schedule: {
    birth: [
      { vaccine: 'HB0', name: 'Hepatitis B', minAge: 0, maxAge: 7, notes: 'Dalam 24 jam setelah lahir' }
    ],
    '1': [
      { vaccine: 'BCG', name: 'BCG', minAge: 1, maxAge: 2, notes: 'Satu dosis' },
      { vaccine: 'Polio1', name: 'Polio', minAge: 1, maxAge: 2, notes: 'OPV1' },
      { vaccine: 'DTP-HB-Hib1', name: 'DTP-HB-Hib', minAge: 1, maxAge: 2, notes: 'Pentavalen 1' }
    ],
    '2': [
      { vaccine: 'Polio2', name: 'Polio', minAge: 2, maxAge: 3, notes: 'OPV2' },
      { vaccine: 'DTP-HB-Hib2', name: 'DTP-HB-Hib', minAge: 2, maxAge: 3, notes: 'Pentavalen 2' }
    ],
    '3': [
      { vaccine: 'Polio3', name: 'Polio', minAge: 3, maxAge: 4, notes: 'OPV3' },
      { vaccine: 'DTP-HB-Hib3', name: 'DTP-HB-Hib', minAge: 3, maxAge: 4, notes: 'Pentavalen 3' }
    ],
    '4': [
      { vaccine: 'Polio4', name: 'Polio', minAge: 4, maxAge: 5, notes: 'OPV4' }
    ],
    '6': [
      { vaccine: 'MR1', name: 'Measles-Rubella', minAge: 6, maxAge: 11, notes: 'Campak-Rubela 1' },
      { vaccine: 'JapaneseEncephalitis1', name: 'Japanese Encephalitis', minAge: 9, maxAge: 11, notes: 'Epidemi - daerah endemis' }
    ],
    '9': [
      { vaccine: 'JapaneseEncephalitis1', name: 'Japanese Encephalitis', minAge: 9, maxAge: 11, notes: 'Epidemi - daerah endemis' }
    ],
    '18': [
      { vaccine: 'MR2', name: 'Measles-Rubella', minAge: 18, maxAge: 24, notes: 'Campak-Rubela 2' },
      { vaccine: 'DTP-HB-Hib4', name: 'DTP-HB-Hib', minAge: 18, maxAge: 24, notes: 'Pentavalen booster' }
    ],
    '24': [
      { vaccine: 'DT', name: 'Difteri-Tetanus', minAge: 24, maxAge: 71, notes: 'BIAS - kelas 1 SD' },
      { vaccine: 'HPV1', name: 'Human Papillomavirus', minAge: 9, maxAge: 14, notes: '2 dosis (0, 6-12 bulan)' },
      { vaccine: 'JapaneseEncephalitis2', name: 'Japanese Encephalitis', minAge: 24, maxAge: 71, notes: 'Epidemi - daerah endemis' }
    ]
  },

  // Vaccine intervals and contraindications
  intervals: {
    'HB0-HB1': { min: 4, max: null, notes: 'Minimal 4 minggu' },
    'DTP-HB-Hib_doses': { min: 4, max: 8, notes: 'Antar dosis 4-8 minggu' },
    'MR_doses': { min: 4, max: null, notes: 'Minimal 4 minggu' },
    'JapaneseEncephalitis_doses': { min: 24, max: null, notes: 'Minimal 24 minggu' },
    'HPV_doses': { min: 24, max: 52, notes: 'Dosis ke-2: 6-12 bulan setelah dosis pertama' }
  },

  // Contraindications and precautions
  contraindications: {
    general: [
      'Reaksi alergi berat (anafilaksis) pada dosis sebelumnya',
      'Immunodeficiency berat (untuk vaccine hidup)',
      'Kehamilan (untuk vaccine hidup)'
    ],
    specific: {
      'DTP': ['Encephalopathy dalam 7 hari setelah dosis sebelumnya', 'Gangguan saraf progresif'],
      'MR': ['Immunodeficiency', 'Kehamilan', 'Tuberculosis yang belum diobati'],
      'JapaneseEncephalitis': ['Alergi terhadap protein telur', 'Immunocompromised'],
      'HPV': ['Kehamilan', 'Reaksi alergi berat pada komponen vaccine']
    }
  },

  // Age-appropriate catch-up schedules
  catchUp: {
    // For children who missed vaccines
    getCatchUpSchedule: function(currentAge, receivedVaccines) {
      const catchUp = [];
      
      // HBV catch-up
      if (!receivedVaccines.includes('HB0') && currentAge >= 0) {
        catchUp.push({
          vaccine: 'HBV',
          name: 'Hepatitis B',
          schedule: currentAge < 12 ? '3 dosis (0, 1, 6 bulan)' : '3 dosis sesuai jadwal dewasa',
          priority: 'High'
        });
      }

      // DTP-HB-Hib catch-up
      if (currentAge < 12) {
        const missedDoses = this.calculateMissedDTP(currentAge, receivedVaccines);
        if (missedDoses > 0) {
          catchUp.push({
            vaccine: 'DTP-HB-Hib',
            name: 'DTP-HB-Hib',
            schedule: `${missedDoses} dosis tersisa (interval 4 minggu)`,
            priority: 'High'
          });
        }
      }

      // MR catch-up
      if (!receivedVaccines.includes('MR1') && currentAge >= 6) {
        const mrDoses = currentAge < 18 ? 1 : 2;
        catchUp.push({
          vaccine: 'MR',
          name: 'Measles-Rubella',
          schedule: `${mrDoses} dosis (interval minimal 4 minggu)`,
          priority: 'High'
        });
      }

      // Polio catch-up
      if (currentAge < 60) {
        const polioDoses = this.calculatePolioCatchUp(currentAge, receivedVaccines);
        if (polioDoses > 0) {
          catchUp.push({
            vaccine: 'Polio',
            name: 'Polio',
            schedule: `${polioDoses} dosis OPV/IPV`,
            priority: 'Medium'
          });
        }
      }

      return catchUp.sort((a, b) => {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    },

    calculateMissedDTP: function(currentAge, receivedVaccines) {
      const expectedDoses = currentAge < 12 ? Math.ceil(currentAge / 2) : 3;
      const receivedDTP = receivedVaccines.filter(v => v.startsWith('DTP-HB-Hib')).length;
      return Math.max(0, 3 - receivedDTP);
    },

    calculatePolioCatchUp: function(currentAge, receivedVaccines) {
      const expectedDoses = Math.min(4, Math.ceil(currentAge / 3));
      const receivedPolio = receivedVaccines.filter(v => v.startsWith('Polio')).length;
      return Math.max(0, expectedDoses - receivedPolio);
    }
  },

  // Determine vaccine status
  getVaccineStatus: function(vaccine, currentAge, receivedVaccines) {
    const schedule = this.getVaccineSchedule(vaccine);
    if (!schedule) return { status: 'Not in schedule', due: null };

    const isReceived = receivedVaccines.includes(vaccine);
    const ageInMonths = currentAge;

    // Check if age-appropriate
    if (ageInMonths < schedule.minAge) {
      return { 
        status: 'Not due yet', 
        due: `${schedule.minAge} bulan`,
        isOverdue: false
      };
    }

    // Check if overdue
    const maxAge = schedule.maxAge || 71; // Default to 71 months (5+ years)
    if (ageInMonths > maxAge && !isReceived) {
      return { 
        status: 'Overdue', 
        due: 'Segera',
        isOverdue: true
      };
    }

    // Check if due
    if (!isReceived && ageInMonths >= schedule.minAge) {
      return { 
        status: 'Due', 
        due: 'Sekarang',
        isOverdue: false
      };
    }

    // Received but may need booster
    if (isReceived) {
      const doses = this.countVaccineDoses(vaccine, receivedVaccines);
      const requiredDoses = this.getRequiredDoses(vaccine, currentAge);
      
      if (doses < requiredDoses) {
        return {
          status: 'Incomplete',
          due: `${requiredDoses - doses} dosis tersisa`,
          isOverdue: false
        };
      }
    }

    return { 
      status: 'Complete', 
      due: 'Selesai',
      isOverdue: false
    };
  },

  // Get all vaccines due for a specific age
  getVaccinesDue: function(currentAge, receivedVaccines) {
    const dueVaccines = [];

    for (let vaccine in this.schedule) {
      const vaccinesForAge = this.schedule[vaccine];
      vaccinesForAge.forEach(v => {
        const status = this.getVaccineStatus(v.vaccine, currentAge, receivedVaccines);
        if (status.status === 'Due' || status.status === 'Overdue') {
          dueVaccines.push({
            ...v,
            status: status.status,
            isOverdue: status.isOverdue,
            ageDue: v.minAge
          });
        }
      });
    }

    return dueVaccines;
  },

  // Helper functions
  getVaccineSchedule: function(vaccineName) {
    for (let age in this.schedule) {
      const vaccines = this.schedule[age];
      const found = vaccines.find(v => v.vaccine === vaccineName);
      if (found) return found;
    }
    return null;
  },

  countVaccineDoses: function(vaccineName, receivedVaccines) {
    return receivedVaccines.filter(v => v.startsWith(vaccineName)).length;
  },

  getRequiredDoses: function(vaccineName, currentAge) {
    // Default doses for each vaccine
    const doses = {
      'HB': 3,
      'BCG': 1,
      'DTP-HB-Hib': 4,
      'Polio': 4,
      'MR': 2,
      'JapaneseEncephalitis': 2,
      'HPV': 2,
      'DT': 1
    };

    // Check if age-appropriate for additional doses
    if (vaccineName === 'DTP-HB-Hib' && currentAge > 18) {
      return 4; // Including booster
    }

    return doses[vaccineName] || 1;
  }
};

// Initialize immunization module
function initImmunizationModule() {
  const immunizationContent = document.createElement('div');
  immunizationContent.className = 'immunization-content';
  immunizationContent.style.display = 'none';
  
  immunizationContent.innerHTML = `
    <!-- Immunization Card -->
    <section class="input-card">
      <div class="input-card-header">
        <h2 class="input-card-title">Jadwal Imunisasi</h2>
        <p class="input-card-desc">Jadwal imunisasi nasional Indonesia dengan rekomendasi catch-up dan status due/overdue.</p>
      </div>

      <div class="form-grid">
        <div class="form-field">
          <label for="immunization-age">Umur (bulan)</label>
          <input type="number" id="immunization-age" min="0" max="71" step="1" placeholder="18">
          <div class="error-message" id="immunization-age-error"></div>
        </div>

        <div class="form-field">
          <label for="immunization-birth-date">Tanggal lahir</label>
          <input type="date" id="immunization-birth-date">
          <div class="error-message" id="immunization-birth-date-error"></div>
        </div>

        <div class="form-field full-width">
          <label>Vaccine yang sudah diterima (centang yang sesuai)</label>
          <div class="vaccine-checklist">
            <!-- Vaccine checklist will be populated by JS -->
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button id="immunization-check">Cek Status Imunisasi</button>
        <p class="form-note">Jadwal berdasarkan Program Imunisasi Nasional Indonesia (IDNI 2020).</p>
      </div>
    </section>

    <!-- Summary Card -->
    <section class="summary-card">
      <h2>Status Imunisasi</h2>
      <p id="immunization-summary">Masukkan data untuk melihat status imunisasi anak.</p>
    </section>

    <!-- Results -->
    <section id="immunization-results" style="display: none;">
      <!-- Due/Overdue Vaccines -->
      <div class="result-card">
        <div class="result-header">
          <h3>Vaccine Due/Overdue</h3>
          <span class="badge bad">Prioritas</span>
        </div>
        <div id="due-vaccines-list">
          <!-- Due vaccines will be populated here -->
        </div>
      </div>

      <!-- Catch-up Schedule -->
      <div class="result-card" id="catchup-card" style="display: none;">
        <div class="result-header">
          <h3>Rekomendasi Catch-up</h3>
          <span class="badge warn">Perencanaan</span>
        </div>
        <div id="catchup-schedule">
          <!-- Catch-up schedule will be populated here -->
        </div>
      </div>

      <!-- Complete Vaccines -->
      <div class="result-card" id="complete-card" style="display: none;">
        <div class="result-header">
          <h3>Vaccine Lengkap</h3>
          <span class="badge good">Selesai</span>
        </div>
        <div id="complete-vaccines-list">
          <!-- Complete vaccines will be populated here -->
        </div>
      </div>

      <!-- Timeline -->
      <div class="result-card" id="timeline-card" style="display: none;">
        <div class="result-header">
          <h3>Timeline Imunisasi</h3>
          <span class="badge">Visual</span>
        </div>
        <div class="timeline-container">
          <div id="vaccine-timeline">
            <!-- Timeline will be populated here -->
          </div>
        </div>
      </div>
    </section>

    <!-- Info Box -->
    <section class="kpsp-info-box">
      <h4>ℹ️ Program Imunisasi Nasional Indonesia</h4>
      <ul>
        <li><strong>Wajib gratis:</strong> HBV, BCG, DTP-HB-Hib, Polio, MR, DT (BIAS)</li>
        <li><strong>Vaccine pilihan:</strong> Japanese Encephalitis (daerah endemis), HPV (9-14 tahun)</li>
        <li><strong>Kontraindikasi relatif:</strong> Demam tinggi (>38.5°C), penyakit sedang</li>
        <li><strong>Reaksi samping umum:</strong> Demam, nyeri, kemerahan di lokasi suntikan (1-3 hari)</li>
        <li><strong>Kapan ke dokter:</strong> Demam tinggi persisten, kejang, reaksi alergi berat</li>
        <li><strong>Catatan:</strong> Vaccine hidup (MR, BCG) jangan diberikan pada immunodeficiency</li>
      </ul>
    </section>
  `;

  document.querySelector('.main-content').appendChild(immunizationContent);

  // Populate vaccine checklist
  function populateVaccineChecklist() {
    const checklist = immunizationContent.querySelector('.vaccine-checklist');
    const allVaccines = [
      { key: 'HB0', name: 'Hepatitis B (lahir)' },
      { key: 'BCG', name: 'BCG' },
      { key: 'DTP-HB-Hib1', name: 'DTP-HB-Hib 1' },
      { key: 'DTP-HB-Hib2', name: 'DTP-HB-Hib 2' },
      { key: 'DTP-HB-Hib3', name: 'DTP-HB-Hib 3' },
      { key: 'DTP-HB-Hib4', name: 'DTP-HB-Hib 4 (booster)' },
      { key: 'Polio1', name: 'Polio 1' },
      { key: 'Polio2', name: 'Polio 2' },
      { key: 'Polio3', name: 'Polio 3' },
      { key: 'Polio4', name: 'Polio 4' },
      { key: 'MR1', name: 'Measles-Rubella 1' },
      { key: 'MR2', name: 'Measles-Rubella 2' },
      { key: 'DT', name: 'Difteri-Tetanus (BIAS)' },
      { key: 'JapaneseEncephalitis1', name: 'Japanese Encephalitis 1' },
      { key: 'JapaneseEncephalitis2', name: 'Japanese Encephalitis 2' },
      { key: 'HPV1', name: 'HPV 1' },
      { key: 'HPV2', name: 'HPV 2' }
    ];

    allVaccines.forEach(vaccine => {
      const id = `vaccine-${vaccine.key}`;
      const item = document.createElement('div');
      item.className = 'vaccine-checklist-item';
      item.innerHTML = `
        <input type="checkbox" id="${id}" value="${vaccine.key}">
        <label for="${id}">${vaccine.name}</label>
      `;
      checklist.appendChild(item);
    });
  }

  populateVaccineChecklist();

  // Get selected vaccines
  function getSelectedVaccines() {
    const checked = [];
    immunizationContent.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      checked.push(cb.value);
    });
    return checked;
  }

  // Form validation
  function validateImmunizationForm() {
    const age = parseInt(immunizationContent.querySelector('#immunization-age').value);
    const birthDate = immunizationContent.querySelector('#immunization-birth-date').value;

    let isValid = true;

    // Reset errors
    immunizationContent.querySelectorAll('input').forEach(el => el.classList.remove('error'));
    immunizationContent.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));

    // Validate age
    if (age === '' || age < 0 || age > 71) {
      immunizationContent.querySelector('#immunization-age').classList.add('error');
      const ageError = immunizationContent.querySelector('#immunization-age-error');
      ageError.textContent = 'Masukkan umur yang valid (0-71 bulan)';
      ageError.classList.add('visible');
      isValid = false;
    }

    // Validate birth date
    if (!birthDate) {
      immunizationContent.querySelector('#immunization-birth-date').classList.add('error');
      const birthDateError = immunizationContent.querySelector('#immunization-birth-date-error');
      birthDateError.textContent = 'Masukkan tanggal lahir';
      birthDateError.classList.add('visible');
      isValid = false;
    }

    return isValid;
  }

  // Check immunization status
  immunizationContent.querySelector('#immunization-check').addEventListener('click', function() {
    if (!validateImmunizationForm()) return;

    const age = parseInt(immunizationContent.querySelector('#immunization-age').value);
    const receivedVaccines = getSelectedVaccines();

    // Get due vaccines
    const dueVaccines = IMMUNIZATION_DATA.getVaccinesDue(age, receivedVaccines);

    // Get catch-up schedule
    const catchUpSchedule = IMMUNIZATION_DATA.catchUp.getCatchUpSchedule(age, receivedVaccines);

    // Get complete vaccines
    const completeVaccines = getCompleteVaccines(age, receivedVaccines);

    // Create timeline
    const timeline = createVaccineTimeline(age, receivedVaccines);

    // Update display
    updateImmunizationResults(dueVaccines, catchUpSchedule, completeVaccines, timeline, age);
  });

  function getCompleteVaccines(age, receivedVaccines) {
    const complete = [];
    
    for (let vaccine in IMMUNIZATION_DATA.schedule) {
      const vaccinesForAge = IMMUNIZATION_DATA.schedule[vaccine];
      vaccinesForAge.forEach(v => {
        const status = IMMUNIZATION_DATA.getVaccineStatus(v.vaccine, age, receivedVaccines);
        if (status.status === 'Complete') {
          complete.push(v);
        }
      });
    }

    return complete;
  }

  function createVaccineTimeline(age, receivedVaccines) {
    const timeline = [];
    
    for (let ageKey in IMMUNIZATION_DATA.schedule) {
      const ageMonths = parseInt(ageKey === 'birth' ? 0 : ageKey);
      const vaccines = IMMUNIZATION_DATA.schedule[ageKey];
      
      vaccines.forEach(v => {
        const status = IMMUNIZATION_DATA.getVaccineStatus(v.vaccine, age, receivedVaccines);
        timeline.push({
          ...v,
          age: ageMonths,
          status: status.status,
          isReceived: receivedVaccines.includes(v.vaccine),
          isOverdue: status.isOverdue || false
        });
      });
    }

    return timeline.sort((a, b) => a.age - b.age);
  }

  // Update results display
  function updateImmunizationResults(dueVaccines, catchUpSchedule, completeVaccines, timeline, currentAge) {
    // Show results section
    immunizationContent.querySelector('#immunization-results').style.display = 'block';

    // Update summary
    const summaryText = `Status untuk anak usia ${currentAge} bulan: ${dueVaccines.length} vaccine due, ${catchUpSchedule.length} catch-up, ${completeVaccines.length} lengkap`;
    immunizationContent.querySelector('#immunization-summary').textContent = summaryText;

    // Update due vaccines
    const dueList = immunizationContent.querySelector('#due-vaccines-list');
    if (dueVaccines.length > 0) {
      dueList.innerHTML = dueVaccines.map(vaccine => `
        <div class="vaccine-item ${vaccine.isOverdue ? 'overdue' : ''}">
          <div class="vaccine-info">
            <strong>${vaccine.name}</strong>
            <span class="vaccine-schedule">${vaccine.notes}</span>
          </div>
          <span class="vaccine-status ${vaccine.isOverdue ? 'bad' : 'warn'}">${vaccine.status}</span>
        </div>
      `).join('');
    } else {
      dueList.innerHTML = '<p class="no-vaccines">Tidak ada vaccine yang due saat ini.</p>';
    }

    // Update catch-up schedule
    const catchupCard = immunizationContent.querySelector('#catchup-card');
    const catchupList = immunizationContent.querySelector('#catchup-schedule');
    if (catchUpSchedule.length > 0) {
      catchupCard.style.display = 'block';
      catchupList.innerHTML = catchUpSchedule.map(vaccine => `
        <div class="catchup-item priority-${vaccine.priority.toLowerCase()}">
          <div class="vaccine-info">
            <strong>${vaccine.name}</strong>
            <span class="vaccine-schedule">${vaccine.schedule}</span>
          </div>
          <span class="vaccine-priority">${vaccine.priority}</span>
        </div>
      `).join('');
    } else {
      catchupCard.style.display = 'none';
    }

    // Update complete vaccines
    const completeCard = immunizationContent.querySelector('#complete-card');
    const completeList = immunizationContent.querySelector('#complete-vaccines-list');
    if (completeVaccines.length > 0) {
      completeCard.style.display = 'block';
      completeList.innerHTML = completeVaccines.map(vaccine => `
        <div class="vaccine-item complete">
          <div class="vaccine-info">
            <strong>${vaccine.name}</strong>
            <span class="vaccine-schedule">${vaccine.notes}</span>
          </div>
          <span class="vaccine-status good">Selesai</span>
        </div>
      `).join('');
    } else {
      completeCard.style.display = 'none';
    }

    // Update timeline
    const timelineCard = immunizationContent.querySelector('#timeline-card');
    const timelineContainer = immunizationContent.querySelector('#vaccine-timeline');
    if (timeline.length > 0) {
      timelineCard.style.display = 'block';
      timelineContainer.innerHTML = createTimelineHTML(timeline);
    } else {
      timelineCard.style.display = 'none';
    }

    // Scroll to results
    immunizationContent.querySelector('#immunization-results').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  function createTimelineHTML(timeline) {
    return timeline.map(item => {
      const statusClass = item.isReceived ? 'received' : 
                         item.isOverdue ? 'overdue' : 
                         item.age <= 0 ? 'not-due' : 'due';
      
      return `
        <div class="timeline-item ${statusClass}">
          <div class="timeline-age">${item.age === 0 ? 'Lahir' : item.age + ' bulan'}</div>
          <div class="timeline-vaccine">${item.name}</div>
          <div class="timeline-status">
            ${item.isReceived ? '✓' : item.isOverdue ? '⚠' : item.age <= 0 ? '○' : '⏰'}
          </div>
        </div>
      `;
    }).join('');
  }

  return immunizationContent;
}

// Add CSS for immunization-specific styles
function addImmunizationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .vaccine-checklist {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .vaccine-checklist-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: #f8fafc;
      border-radius: 8px;
    }
    .vaccine-checklist-item input[type="checkbox"] {
      margin: 0;
    }
    .vaccine-checklist-item label {
      font-size: 13px;
      margin: 0;
      cursor: pointer;
    }
    .vaccine-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .vaccine-item:last-child {
      border-bottom: none;
    }
    .vaccine-item.overdue {
      background: #fef2f2;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .vaccine-info {
      flex: 1;
    }
    .vaccine-schedule {
      display: block;
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
    .vaccine-status {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }
    .vaccine-status.good {
      background: #dcfce7;
      color: #16a34a;
    }
    .vaccine-status.warn {
      background: #fef3c7;
      color: #d97706;
    }
    .vaccine-status.bad {
      background: #fee2e2;
      color: #dc2626;
    }
    .catchup-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .catchup-item.priority-high {
      background: #fef2f2;
      border-left: 4px solid #dc2626;
    }
    .catchup-item.priority-medium {
      background: #fefce8;
      border-left: 4px solid #d97706;
    }
    .vaccine-priority {
      padding: 4px 8px;
      background: #1e293b;
      color: white;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }
    .timeline-container {
      max-height: 400px;
      overflow-y: auto;
      padding: 12px;
      background: #f8fafc;
      border-radius: 12px;
    }
    .timeline-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .timeline-item:last-child {
      border-bottom: none;
    }
    .timeline-age {
      min-width: 80px;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
    }
    .timeline-vaccine {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
    .timeline-status {
      font-size: 16px;
      min-width: 24px;
      text-align: center;
    }
    .timeline-item.received .timeline-status {
      color: #16a34a;
    }
    .timeline-item.overdue .timeline-status {
      color: #dc2626;
    }
    .timeline-item.due .timeline-status {
      color: #d97706;
    }
    .timeline-item.not-due .timeline-status {
      color: #94a3b8;
    }
    .no-vaccines {
      text-align: center;
      color: #64748b;
      font-style: italic;
      padding: 20px;
    }
    @media (max-width: 767px) {
      .vaccine-checklist {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles
addImmunizationStyles();