// Risk Score (Rule-based) Module
// Rule-based risk assessment for pediatric patients

const RISK_DATA = {
  // Risk factors and their weights
  riskFactors: [
    {
      category: 'Pertumbuhan',
      factors: [
        { id: 'weightLoss', text: 'Tren BB turun ≥2 SD dalam 2 bulan', weight: 3, category: 'growth' },
        { id: 'lowWeight', text: 'BB/U < -3 SD (gizi buruk)', weight: 3, category: 'growth' },
        { id: 'stunting', text: 'PB/U < -3 SD (stunting berat)', weight: 2, category: 'growth' },
        { id: 'weightHeightLow', text: 'BB/PB < -2 SD (wasting)', weight: 2, category: 'growth' },
        { id: 'noWeightGain', text: 'Tidak naik BB selama 2 bulan', weight: 2, category: 'growth' }
      ]
    },
    {
      category: 'Asupan Makan',
      factors: [
        { id: 'decreasedIntake', text: 'Asupan menurun >50% dari biasa', weight: 2, category: 'intake' },
        { id: 'poorAppetite', text: 'Nafsu makan buruk连续 3 hari', weight: 2, category: 'intake' },
        { id: 'breastfeedingIssue', text: 'Masalah menyusui (ibu/anak)', weight: 2, category: 'intake' },
        { id: 'feedingDifficulty', text: 'Kesulitan makan (menelan, mengunyah)', weight: 2, category: 'intake' }
      ]
    },
    {
      category: 'Diare & Dehidrasi',
      factors: [
        { id: 'persistentDiarrhea', text: 'Diare persisten (>14 hari)', weight: 3, category: 'diarrhea' },
        { id: 'bloodyDiarrhea', text: 'Diare berdarah', weight: 3, category: 'diarrhea' },
        { id: 'severeDehydration', text: 'Dehidrasi berat', weight: 3, category: 'diarrhea' },
        { id: 'recurrentDiarrhea', text: 'Diare berulang (>3x/bulan)', weight: 2, category: 'diarrhea' }
      ]
    },
    {
      category: 'Demam & Infeksi',
      factors: [
        { id: 'highFever', text: 'Demam tinggi (>39°C)连续 2 hari', weight: 2, category: 'fever' },
        { id: 'prolongedFever', text: 'Demam >7 hari', weight: 2, category: 'fever' },
        { id: 'recurrentInfection', text: 'Infeksi berulang (>3x/bulan)', weight: 2, category: 'fever' }
      ]
    },
    {
      category: 'Perkembangan',
      factors: [
        { id: 'developmentalDelay', text: 'Keterlambatan perkembangan', weight: 2, category: 'development' },
        { id: 'regression', text: 'Regresi perkembangan', weight: 3, category: 'development' },
        { id: 'noSocialSmile', text: 'Belum tersenyum sosial (3 bulan)', weight: 2, category: 'development' },
        { id: 'noHeadControl', text: 'Belum kontrol kepala (4 bulan)', weight: 2, category: 'development' }
      ]
    },
    {
      category: 'Social & Lingkungan',
      factors: [
        { id: 'lowBirthWeight', text: 'BB lahir <2500g', weight: 2, category: 'social' },
        { id: 'premature', text: 'Prematur (<37 minggu)', weight: 2, category: 'social' },
        { id: 'poorSocioeconomic', text: 'Kondisi sosial ekonomi buruk', weight: 1, category: 'social' },
        { id: 'lackSupport', text: 'Kurangnya dukungan keluarga', weight: 1, category: 'social' }
      ]
    }
  ],

  // Risk levels
  riskLevels: {
    high: {
      minScore: 7,
      label: 'Risiko Tinggi',
      color: 'bad',
      action: 'Rujuk ke fasilitas kesehatan lebih tinggi',
      timeline: 'Segera (dalam 24 jam)',
      description: 'Anak memerlukan evaluasi dan intervensi segera oleh tenaga kesehatan специалист.'
    },
    medium: {
      minScore: 4,
      maxScore: 6,
      label: 'Risiko Sedang',
      color: 'warn',
      action: 'Kontrol lebih ketat dan pemantauan intensif',
      timeline: 'Dalam 1 minggu',
      description: 'Anak memerlukan pemantauan lebih sering dan evaluasi ulang.'
    },
    low: {
      minScore: 0,
      maxScore: 3,
      label: 'Risiko Rendah',
      color: 'good',
      action: 'Pemantauan rutin dan edukasi orang tua',
      timeline: 'Sesuai jadwal kontrol reguler',
      description: 'Anak dalam kondisi baik, lanjutkan pemantauan tumbuh kembang.'
    }
  },

  // Calculate total risk score
  calculateRiskScore: function(selectedFactors) {
    let totalScore = 0;
    const matchedFactors = [];

    this.riskFactors.forEach(category => {
      category.factors.forEach(factor => {
        if (selectedFactors.includes(factor.id)) {
          totalScore += factor.weight;
          matchedFactors.push({
            ...factor,
            categoryName: category.category
          });
        }
      });
    });

    return {
      totalScore: totalScore,
      factors: matchedFactors,
      level: this.getRiskLevel(totalScore)
    };
  },

  // Determine risk level
  getRiskLevel: function(score) {
    if (score >= 7) return this.riskLevels.high;
    if (score >= 4) return this.riskLevels.medium;
    return this.riskLevels.low;
  },

  // Get recommendations based on selected factors
  getRecommendations: function(matchedFactors) {
    const recommendations = {
      growth: [],
      intake: [],
      diarrhea: [],
      fever: [],
      development: [],
      social: []
    };

    matchedFactors.forEach(factor => {
      if (recommendations[factor.category]) {
        recommendations[factor.category].push(factor.text);
      }
    });

    return recommendations;
  },

  // General advice based on risk level
  getGeneralAdvice: function(riskLevel) {
    const generalAdvice = [];

    if (riskLevel.label === 'Risiko Tinggi') {
      generalAdvice.push('Rujuk segera ke dokter spesialis anak');
      generalAdvice.push('Evaluasi laboratorium lengkap (darah lengkap, kimia darah, urinalisis)');
      generalAdvice.push('Pertimbangkan rawat inap jika diperlukan');
      generalAdvice.push('Konsultasi dengan ahli gizi untuk intervensi nutrisi');
    } else if (riskLevel.label === 'Risiko Sedang') {
      generalAdvice.push('Jadwalkan kontrol lebih sering (mingguan)');
      generalAdvice.push('Lakukan evaluasi pertumbuhan dengan plotting di KMS');
      generalAdvice.push('Edukasi orang tua tentang tanda bahaya');
      generalAdvice.push('Pertimbangkan rujukan jika tidak ada perbaikan dalam 2 minggu');
    } else {
      generalAdvice.push('Lanjutkan pemantauan tumbuh kembang rutin');
      generalAdvice.push('Berikan edukasi tentang nutrisi dan stimulasi sesuai usia');
      generalAdvice.push('Jadwalkan kontrol sesuai protokol balita sehat');
    }

    return generalAdvice;
  }
};

// Initialize risk score module
function initRiskModule() {
  const riskContent = document.createElement('div');
  riskContent.className = 'risk-content';
  riskContent.style.display = 'none';
  
  riskContent.innerHTML = `
    <!-- Risk Score Card -->
    <section class="input-card">
      <div class="input-card-header">
        <h2 class="input-card-title">Skor Risiko (Rule-based)</h2>
        <p class="input-card-desc">Penilaian risiko berbasis aturan untuk mengidentifikasi anak yang memerlukan intervensi segera atau pemantauan lebih intensif.</p>
      </div>

      <div class="risk-factors-section">
        <p class="section-desc">Pilih semua faktor risiko yang relevan:</p>
        
        <div class="risk-factors-container" id="risk-factors-container">
          <!-- Risk factors will be populated by JS -->
        </div>
      </div>

      <div class="form-actions">
        <button id="risk-calculate">Hitung Skor Risiko</button>
        <p class="form-note">Penilaian ini adalah skrining awal. Diagnosis dan penanganan final tetap memerlukan evaluasi klinis.</p>
      </div>
    </section>

    <!-- Summary Card -->
    <section class="summary-card">
      <h2>Hasil Penilaian Risiko</h2>
      <p id="risk-summary">Pilih faktor risiko untuk melihat hasil penilaian.</p>
    </section>

    <!-- Results -->
    <section id="risk-results" style="display: none;">
      <!-- Risk Level Card -->
      <div class="result-card">
        <div class="result-header">
          <h3>Level Risiko</h3>
          <span class="badge" id="risk-level-badge">-</span>
        </div>
        <p class="result-meta" id="risk-score">Skor total: -</p>
        <p class="result-detail" id="risk-description">-</p>
        <div class="result-advice" id="risk-action">
          <!-- Action will be populated here -->
        </div>
      </div>

      <!-- Matched Rules Card -->
      <div class="result-card" id="matched-rules-card">
        <div class="result-header">
          <h3>Faktor Risiko Teridentifikasi</h3>
          <span class="badge warn">Daftar Rule</span>
        </div>
        <div id="matched-rules-list">
          <!-- Matched rules will be populated here -->
        </div>
      </div>

      <!-- Recommendations Card -->
      <div class="result-card" id="recommendations-card">
        <div class="result-header">
          <h3>Rekomendasi Tindak Lanjut</h3>
          <span class="badge good">Panduan</span>
        </div>
        <div id="recommendations-list">
          <!-- Recommendations will be populated here -->
        </div>
      </div>

      <!-- Action Timeline Card -->
      <div class="result-card" id="timeline-card">
        <div class="result-header">
          <h3>Timeline Tindakan</h3>
          <span class="badge">Jadwal</span>
        </div>
        <div class="action-timeline">
          <div class="timeline-step">
            <div class="step-indicator"></div>
            <div class="step-content">
              <strong>Sekarang</strong>
              <p>Identifikasi dan dokumentasi faktor risiko</p>
            </div>
          </div>
          <div class="timeline-step">
            <div class="step-indicator"></div>
            <div class="step-content">
              <strong>Dalam 24 jam</strong>
              <p id="immediate-action">Evaluasi dan intervensi awal</p>
            </div>
          </div>
          <div class="timeline-step">
            <div class="step-indicator"></div>
            <div class="step-content">
              <strong>Follow-up</strong>
              <p id="followup-action">Pemantauan dan evaluasi ulang</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info Box -->
    <section class="kpsp-info-box">
      <h4>ℹ️ Panduan Skor Risiko</h4>
      <ul>
        <li><strong>Tinggi (≥7):</strong> Rujuk segera, evaluasi intensif</li>
        <li><strong>Sedang (4-6):</strong> Kontrol mingguan, pemantauan ketat</li>
        <li><strong>Rendah (0-3):</strong> Pemantauan rutin sesuai jadwal</li>
        <li><strong>Catatan:</strong> Skor ini bukan diagnosis, perlu konfirmasi klinis</li>
        <li><strong>Intervensi:</strong> Sesuaikan dengan penyebab risiko spesifik</li>
        <li><strong>Dokumentasi:</strong> Catat semua faktor dan rencana tindak lanjut</li>
      </ul>
    </section>
  `;

  document.querySelector('.main-content').appendChild(riskContent);

  // Populate risk factors
  function populateRiskFactors() {
    const container = riskContent.querySelector('#risk-factors-container');
    
    RISK_DATA.riskFactors.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'risk-category';
      categoryDiv.innerHTML = `
        <h3 class="category-title">${category.category}</h3>
        <div class="category-factors">
          ${category.factors.map(factor => `
            <div class="risk-factor-item">
              <input type="checkbox" id="rf-${factor.id}" value="${factor.id}" data-weight="${factor.weight}">
              <label for="rf-${factor.id}">
                ${factor.text}
                <span class="factor-weight">(${factor.weight} poin)</span>
              </label>
            </div>
          `).join('')}
        </div>
      `;
      container.appendChild(categoryDiv);
    });
  }

  populateRiskFactors();

  // Get selected factors
  function getSelectedFactors() {
    const selected = [];
    riskContent.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      selected.push(cb.value);
    });
    return selected;
  }

  // Calculate risk
  riskContent.querySelector('#risk-calculate').addEventListener('click', function() {
    const selectedFactors = getSelectedFactors();

    if (selectedFactors.length === 0) {
      alert('Silakan pilih setidaknya satu faktor risiko.');
      return;
    }

    // Calculate risk score
    const result = RISK_DATA.calculateRiskScore(selectedFactors);
    
    // Get recommendations
    const recommendations = RISK_DATA.getRecommendations(result.factors);
    
    // Get general advice
    const generalAdvice = RISK_DATA.getGeneralAdvice(result.level);

    // Update display
    updateRiskResults(result, recommendations, generalAdvice);
  });

  // Update results display
  function updateRiskResults(result, recommendations, generalAdvice) {
    // Show results section
    riskContent.querySelector('#risk-results').style.display = 'block';

    // Update summary
    riskContent.querySelector('#risk-summary').textContent = 
      `Skor Risiko: ${result.totalScore} - Level: ${result.level.label}`;

    // Update risk level badge
    const badge = riskContent.querySelector('#risk-level-badge');
    badge.className = 'badge ' + result.level.color;
    badge.textContent = result.level.label;

    // Update score
    riskContent.querySelector('#risk-score').textContent = 
      `Skor total: ${result.totalScore} poin`;

    // Update description
    riskContent.querySelector('#risk-description').textContent = result.level.description;

    // Update action
    riskContent.querySelector('#risk-action').innerHTML = `
      <strong>Tindakan:</strong> ${result.level.action}<br>
      <span style="font-size: 12px; color: #64748b;">${result.level.timeline}</span>
    `;

    // Update matched rules
    const rulesList = riskContent.querySelector('#matched-rules-list');
    if (result.factors.length > 0) {
      // Group by category
      const groupedFactors = {};
      result.factors.forEach(factor => {
        if (!groupedFactors[factor.categoryName]) {
          groupedFactors[factor.categoryName] = [];
        }
        groupedFactors[factor.categoryName].push(factor);
      });

      let rulesHtml = '';
      for (const [category, factors] of Object.entries(groupedFactors)) {
        rulesHtml += `
          <div class="matched-category">
            <h4>${category}</h4>
            ${factors.map(f => `
              <div class="matched-factor">
                <span class="factor-text">${f.text}</span>
                <span class="factor-points">+${f.weight}</span>
              </div>
            `).join('')}
          </div>
        `;
      }
      rulesList.innerHTML = rulesHtml;
    } else {
      rulesList.innerHTML = '<p class="no-factors">Tidak ada faktor risiko yang teridentifikasi.</p>';
    }

    // Update recommendations
    const recList = riskContent.querySelector('#recommendations-list');
    let recHtml = '';

    // Add category-specific recommendations
    for (const [category, factors] of Object.entries(recommendations)) {
      if (factors.length > 0) {
        recHtml += `
          <div class="rec-category">
            <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
            <ul>
              ${factors.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }

    // Add general advice
    recHtml += `
      <div class="rec-general">
        <h4>Saran Umum</h4>
        <ul>
          ${generalAdvice.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
    `;

    recList.innerHTML = recHtml;

    // Update timeline
    riskContent.querySelector('#immediate-action').textContent = 
      result.level.label === 'Risiko Tinggi' ? 'Rujuk dan intervensi segera' : 
      result.level.label === 'Risiko Sedang' ? 'Evaluasi dan jadwalkan kontrol' : 
      'Berikan edukasi dan jadwalkan kontrol rutin';
    
    riskContent.querySelector('#followup-action').textContent = 
      result.level.label === 'Risiko Tinggi' ? 'Follow-up sesuai rencana rujukan' : 
      result.level.label === 'Risiko Sedang' ? 'Kontrol dalam 1 minggu' : 
      'Pemantauan rutin sesuai jadwal';

    // Scroll to results
    riskContent.querySelector('#risk-results').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  return riskContent;
}

// Add CSS for risk-specific styles
function addRiskStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .risk-factors-section {
      margin: 24px 0;
    }
    .section-desc {
      margin: 0 0 20px 0;
      font-size: 14px;
      color: #64748b;
    }
    .risk-category {
      margin-bottom: 24px;
    }
    .category-title {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    .category-factors {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .risk-factor-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      transition: all 0.2s;
    }
    .risk-factor-item:hover {
      border-color: var(--primary);
      box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
    }
    .risk-factor-item input[type="checkbox"] {
      margin-top: 2px;
    }
    .risk-factor-item label {
      font-size: 13px;
      line-height: 1.5;
      cursor: pointer;
      margin: 0;
    }
    .factor-weight {
      display: block;
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .matched-category {
      margin-bottom: 16px;
    }
    .matched-category h4 {
      margin: 0 0 8px 0;
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }
    .matched-factor {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 6px;
    }
    .factor-text {
      font-size: 12px;
      color: #475569;
      flex: 1;
    }
    .factor-points {
      font-size: 12px;
      font-weight: 600;
      color: #dc2626;
      background: #fee2e2;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .rec-category {
      margin-bottom: 16px;
    }
    .rec-category h4 {
      margin: 0 0 8px 0;
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }
    .rec-category ul, .rec-general ul {
      margin: 0;
      padding-left: 20px;
    }
    .rec-category li, .rec-general li {
      margin-bottom: 6px;
      font-size: 13px;
      color: #475569;
      line-height: 1.5;
    }
    .rec-general {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }
    .rec-general h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }
    .no-factors {
      text-align: center;
      color: #64748b;
      font-style: italic;
      padding: 20px;
    }
    .action-timeline {
      padding: 16px 0;
    }
    .timeline-step {
      display: flex;
      gap: 16px;
      padding-bottom: 20px;
      position: relative;
    }
    .timeline-step:last-child {
      padding-bottom: 0;
    }
    .timeline-step:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 7px;
      top: 20px;
      bottom: 0;
      width: 2px;
      background: #e2e8f0;
    }
    .step-indicator {
      width: 16px;
      height: 16px;
      background: var(--primary);
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 4px;
    }
    .step-content {
      flex: 1;
    }
    .step-content strong {
      display: block;
      font-size: 14px;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .step-content p {
      margin: 0;
      font-size: 12px;
      color: #64748b;
    }
    @media (max-width: 767px) {
      .category-factors {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles
addRiskStyles();