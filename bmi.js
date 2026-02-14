// BMI & Metabolic Risk Calculator Module
// BMI calculation with age-appropriate categories and lifestyle recommendations

const BMI_DATA = {
  // WHO BMI-for-age z-scores for children 0-5 years
  // Simplified thresholds (approximations)
  thresholds: {
    underweight: { severe: -3, moderate: -2 },
    normal: { min: -2, max: 1 },
    overweight: { min: 1, max: 2 },
    obese: { min: 2, max: 3 },
    severeObese: 3
  },

  // Calculate BMI
  calculateBMI: function(weight, heightCm) {
    if (!weight || !heightCm || weight <= 0 || heightCm <= 0) return null;
    
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    
    return {
      value: Math.round(bmi * 10) / 10,
      category: this.getBMICategory(bmi),
      interpretation: this.interpretBMI(bmi)
    };
  },

  // Get BMI category based on age
  getBMICategory: function(bmi) {
    // Simplified categorization for children
    if (bmi < 12) return { category: 'Sangat Kurus', risk: 'Tinggi', color: 'bad' };
    if (bmi < 15) return { category: 'Kurus', risk: 'Sedang', color: 'warn' };
    if (bmi < 22) return { category: 'Normal', risk: 'Rendah', color: 'good' };
    if (bmi < 25) return { category: 'Berat Berlebih', risk: 'Sedang', color: 'warn' };
    if (bmi < 30) return { category: 'Obesitas', risk: 'Tinggi', color: 'bad' };
    return { category: 'Obesitas Berat', risk: 'Sangat Tinggi', color: 'bad' };
  },

  // Interpret BMI value
  interpretBMI: function(bmi) {
    if (bmi < 12) {
      return {
        description: 'BMI sangat rendah, kemungkinan underweight berat.',
        advice: 'Konsultasi dengan dokter untuk evaluasi pertumbuhan dan nutrisi.'
      };
    }
    if (bmi < 15) {
      return {
        description: 'BMI di bawah normal, kemungkinan underweight.',
        advice: 'Perbanyak makanan bergizi tinggi kalori dan protein.'
      };
    }
    if (bmi < 22) {
      return {
        description: 'BMI dalam rentang normal.',
        advice: 'Pertahankan pola makan seimbang dan aktivitas fisik teratur.'
      };
    }
    if (bmi < 25) {
      return {
        description: 'BMI di atas normal, risiko overweight.',
        advice: 'Kurangi makanan tinggi gula dan lemak, tingkatkan aktivitas fisik.'
      };
    }
    if (bmi < 30) {
      return {
        description: 'BMI menunjukkan obesitas.',
        advice: 'Konsultasi untuk program penurunan berat badan terstruktur.'
      };
    }
    return {
      description: 'BMI menunjukkan obesitas berat.',
      advice: 'Perlu penanganan medis untuk menurunkan risiko komorbiditas.'
    };
  },

  // Metabolic risk indicators
  getMetabolicRisk: function(bmi, age) {
    const risks = [];
    
    // BMI-based risk
    if (bmi >= 25) {
      risks.push({
        indicator: 'BMI Elevated',
        risk: 'Tinggi',
        description: 'BMI di atas normal meningkatkan risiko metabolik'
      });
    }

    // Age-specific risks
    if (age < 60 && bmi > 20) {
      risks.push({
        indicator: 'Early Adiposity',
        risk: 'Sedang',
        description: 'Penumpukan lemak dini dapat berlanjut ke obesitas dewasa'
      });
    }

    return risks;
  },

  // Lifestyle recommendations
  getLifestyleRecommendations: function(bmiCategory, age) {
    const recommendations = [];

    if (bmiCategory === 'Sangat Kurus' || bmiCategory === 'Kurus') {
      recommendations.push({
        category: 'Nutrisi',
        items: [
          'Tingkatkan frekuensi makan (3 makanan utama + 2 camilan)',
          'Pilih makanan tinggi kalori dan protein (daging, ikan, telur, kacang)',
          'Tambahkan healthy fats (minyak zaitun, alpukat, kacang-kacangan)',
          'Pertimbangkan suplementasi jika diperlukan'
        ]
      });
      recommendations.push({
        category: 'Aktivitas',
        items: [
          'Aktivitas fisik moderat untuk membangun otot',
          'Hindari aktivitas yang terlalu menguras energi'
        ]
      });
    } else if (bmiCategory === 'Normal') {
      recommendations.push({
        category: 'Nutrisi',
        items: [
          'Pola makan seimbang dengan variasi蔬菜dan protein',
          'Batasi makanan tinggi gula dan lemak jenuh',
          'Minum air putih yang cukup'
        ]
      });
      recommendations.push({
        category: 'Aktivitas',
        items: [
          'Aktivitas fisik minimal 60 menit per hari',
          'Batasi screen time maksimal 2 jam per hari'
        ]
      });
    } else {
      recommendations.push({
        category: 'Nutrisi',
        items: [
          'Kurangi makanan tinggi gula dan lemak',
          'Perbanyak蔬菜dan buah-buahan',
          'Kurangi ukuran porsi makan',
          'Hindari makanan cepat saji dan minuman bersoda'
        ]
      });
      recommendations.push({
        category: 'Aktivitas',
        items: [
          'Aktivitas fisik minimal 60 menit per hari',
          'Batasi screen time maksimal 1 jam per hari',
          'Libatkan seluruh keluarga dalam aktivitas fisik'
        ]
      });
    }

    // Age-specific recommendations
    if (age < 24) {
      recommendations.push({
        category: 'Umur Spesifik',
        items: [
          'ASI eksklusif jika memungkinkan',
          'MPASI sesuai usia dengan tekstur yang tepat',
          'Pantau pertumbuhan secara berkala'
        ]
      });
    }

    return recommendations;
  }
};

// Initialize BMI module
function initBMIModule() {
  const bmiContent = document.createElement('div');
  bmiContent.className = 'bmi-content';
  bmiContent.style.display = 'none';
  
  bmiContent.innerHTML = `
    <!-- BMI Calculator Card -->
    <section class="input-card">
      <div class="input-card-header">
        <h2 class="input-card-title">BMI & Risiko Metabolik</h2>
        <p class="input-card-desc">Hitung Indeks Massa Tubuh (BMI) dan kategori risiko metabolik berdasarkan usia dan数据进行综合评估.</p>
      </div>

      <div class="form-grid">
        <div class="form-field">
          <label for="bmi-age">Umur (bulan)</label>
          <input type="number" id="bmi-age" min="0" max="2159" step="1" placeholder="24">
          <div class="error-message" id="bmi-age-error"></div>
        </div>

        <div class="form-field">
          <label for="bmi-gender">Jenis Kelamin</label>
          <select id="bmi-gender">
            <option value="boy">Laki-laki</option>
            <option value="girl">Perempuan</option>
          </select>
        </div>

        <div class="form-field">
          <label for="bmi-weight">Berat badan (kg)</label>
          <input type="number" id="bmi-weight" min="2" max="50" step="0.1" placeholder="12.5">
          <div class="error-message" id="bmi-weight-error"></div>
        </div>

        <div class="form-field">
          <label for="bmi-height">Tinggi badan (cm)</label>
          <input type="number" id="bmi-height" min="40" max="180" step="0.1" placeholder="85">
          <div class="error-message" id="bmi-height-error"></div>
        </div>
      </div>

      <div class="form-actions">
        <button id="bmi-calculate">Hitung BMI</button>
        <p class="form-note">BMI adalah indikator awal, bukan penentu tunggal status gizi.</p>
      </div>
    </section>

    <!-- Summary Card -->
    <section class="summary-card">
      <h2>Hasil Kalkulasi BMI</h2>
      <p id="bmi-summary">Masukkan data untuk melihat hasil BMI.</p>
    </section>

    <!-- Results -->
    <section id="bmi-results" style="display: none;">
      <!-- Main Result Card -->
      <div class="result-card">
        <div class="result-header">
          <h3>Status BMI</h3>
          <span class="badge" id="bmi-category-badge">-</span>
        </div>
        <p class="result-meta" id="bmi-value">BMI: -</p>
        <p class="result-detail" id="bmi-interpretation">-</p>
        <div class="result-advice" id="bmi-advice">-</div>
      </div>

      <!-- Metabolic Risk Card -->
      <div class="result-card" id="metabolic-risk-card">
        <div class="result-header">
          <h3>Indikator Risiko Metabolik</h3>
          <span class="badge">Skrining</span>
        </div>
        <div id="metabolic-risk-list">
          <!-- Risk indicators will be populated here -->
        </div>
      </div>

      <!-- Lifestyle Recommendations -->
      <div class="result-card" id="lifestyle-card">
        <div class="result-header">
          <h3>Saran Gaya Hidup</h3>
          <span class="badge good">Rekomendasi</span>
        </div>
        <div id="lifestyle-recommendations">
          <!-- Lifestyle recommendations will be populated here -->
        </div>
      </div>

      <!-- BMI Chart Reference -->
      <div class="result-card" id="bmi-chart-card">
        <div class="result-header">
          <h3>Referensi Kategori BMI</h3>
          <span class="badge">Panduan</span>
        </div>
        <div class="bmi-chart-reference">
          <div class="bmi-category-row">
            <span class="bmi-cat bad">Sangat Kurus</span>
            <span class="bmi-cat warn">Kurus</span>
            <span class="bmi-cat good">Normal</span>
            <span class="bmi-cat warn">Berat Berlebih</span>
            <span class="bmi-cat bad">Obesitas</span>
          </div>
          <div class="bmi-range-row">
            <span>&lt;12</span>
            <span>12-15</span>
            <span>15-22</span>
            <span>22-25</span>
            <span>&gt;25</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Info Box -->
    <section class="kpsp-info-box">
      <h4>ℹ️ Tentang BMI Anak</h4>
      <ul>
        <li><strong>BMI anak berbeda:</strong> Tidak sama dengan dewasa, menggunakan persentil berdasarkan usia dan jenis kelamin</li>
        <li><strong>Interpretasi:</strong> BMI bukan diagnosis, perlu evaluasi klinis lengkap</li>
        <li><strong>Faktor lain:</strong> Aktivitas fisik, pola makan, riwayat keluarga juga penting</li>
        <li><strong>Pemantauan:</strong> Ukur BMI secara berkala untuk melihat tren perkembangan</li>
        <li><strong>Kapan ke dokter:</strong> Jika BMI sangat rendah atau tinggi, atau terjadi perubahan tiba-tiba</li>
      </ul>
    </section>
  `;

  document.querySelector('.main-content').appendChild(bmiContent);

  // Form validation
  function validateBMIForm() {
    const age = parseInt(bmiContent.querySelector('#bmi-age').value);
    const weight = parseFloat(bmiContent.querySelector('#bmi-weight').value);
    const height = parseFloat(bmiContent.querySelector('#bmi-height').value);

    let isValid = true;

    // Reset errors
    bmiContent.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));
    bmiContent.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));

    // Validate age
    if (age === '' || age < 0 || age > 2159) {
      bmiContent.querySelector('#bmi-age').classList.add('error');
      const ageError = bmiContent.querySelector('#bmi-age-error');
      ageError.textContent = 'Masukkan umur yang valid';
      ageError.classList.add('visible');
      isValid = false;
    }

    // Validate weight
    if (!weight || weight < 2 || weight > 50) {
      bmiContent.querySelector('#bmi-weight').classList.add('error');
      const weightError = bmiContent.querySelector('#bmi-weight-error');
      weightError.textContent = 'Masukkan berat badan yang valid (2-50 kg)';
      weightError.classList.add('visible');
      isValid = false;
    }

    // Validate height
    if (!height || height < 40 || height > 180) {
      bmiContent.querySelector('#bmi-height').classList.add('error');
      const heightError = bmiContent.querySelector('#bmi-height-error');
      heightError.textContent = 'Masukkan tinggi badan yang valid (40-180 cm)';
      heightError.classList.add('visible');
      isValid = false;
    }

    return isValid;
  }

  // Calculate BMI
  bmiContent.querySelector('#bmi-calculate').addEventListener('click', function() {
    if (!validateBMIForm()) return;

    const age = parseInt(bmiContent.querySelector('#bmi-age').value);
    const weight = parseFloat(bmiContent.querySelector('#bmi-weight').value);
    const height = parseFloat(bmiContent.querySelector('#bmi-height').value);

    // Calculate BMI
    const bmiResult = BMI_DATA.calculateBMI(weight, height);
    if (!bmiResult) return;

    // Get metabolic risks
    const metabolicRisks = BMI_DATA.getMetabolicRisk(bmiResult.value, age);

    // Get lifestyle recommendations
    const lifestyleRecommendations = BMI_DATA.getLifestyleRecommendations(bmiResult.category.category, age);

    // Update display
    updateBMIResults(bmiResult, metabolicRisks, lifestyleRecommendations);
  });

  // Update results display
  function updateBMIResults(bmiResult, metabolicRisks, lifestyleRecommendations) {
    // Show results section
    bmiContent.querySelector('#bmi-results').style.display = 'block';

    // Update summary
    bmiContent.querySelector('#bmi-summary').textContent = 
      `BMI: ${bmiResult.value} - Kategori: ${bmiResult.category.category}`;

    // Update category badge
    const badge = bmiContent.querySelector('#bmi-category-badge');
    badge.className = 'badge ' + bmiResult.category.color;
    badge.textContent = bmiResult.category.category;

    // Update BMI value
    bmiContent.querySelector('#bmi-value').textContent = 
      `BMI: ${bmiResult.value} | Risiko: ${bmiResult.category.risk}`;

    // Update interpretation
    bmiContent.querySelector('#bmi-interpretation').textContent = bmiResult.interpretation.description;

    // Update advice
    bmiContent.querySelector('#bmi-advice').innerHTML = 
      `<strong>Saran:</strong> ${bmiResult.interpretation.advice}`;

    // Update metabolic risks
    const riskCard = bmiContent.querySelector('#metabolic-risk-card');
    const riskList = bmiContent.querySelector('#metabolic-risk-list');
    
    if (metabolicRisks.length > 0) {
      riskCard.style.display = 'block';
      riskList.innerHTML = metabolicRisks.map(risk => `
        <div class="risk-item">
          <strong>${risk.indicator}</strong>
          <span class="risk-level">Risiko ${risk.risk}</span>
          <p>${risk.description}</p>
        </div>
      `).join('');
    } else {
      riskCard.style.display = 'none';
    }

    // Update lifestyle recommendations
    const lifestyleCard = bmiContent.querySelector('#lifestyle-card');
    const lifestyleList = bmiContent.querySelector('#lifestyle-recommendations');
    
    lifestyleList.innerHTML = lifestyleRecommendations.map(rec => `
      <div class="lifestyle-category">
        <h4>${rec.category}</h4>
        <ul>
          ${rec.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    // Scroll to results
    bmiContent.querySelector('#bmi-results').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  return bmiContent;
}

// Add CSS for BMI-specific styles
function addBMIStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .risk-item {
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .risk-item:last-child {
      margin-bottom: 0;
    }
    .risk-item strong {
      display: block;
      margin-bottom: 4px;
      color: #1e293b;
    }
    .risk-level {
      display: inline-block;
      padding: 2px 8px;
      background: #fef3c7;
      color: #d97706;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .risk-item p {
      margin: 8px 0 0 0;
      font-size: 12px;
      color: #64748b;
    }
    .lifestyle-category {
      margin-bottom: 20px;
    }
    .lifestyle-category:last-child {
      margin-bottom: 0;
    }
    .lifestyle-category h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }
    .lifestyle-category ul {
      margin: 0;
      padding-left: 20px;
    }
    .lifestyle-category li {
      margin-bottom: 6px;
      font-size: 13px;
      color: #475569;
      line-height: 1.5;
    }
    .bmi-chart-reference {
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
    }
    .bmi-category-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .bmi-cat {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      flex: 1;
    }
    .bmi-cat.good {
      background: #dcfce7;
      color: #16a34a;
    }
    .bmi-cat.warn {
      background: #fef3c7;
      color: #d97706;
    }
    .bmi-cat.bad {
      background: #fee2e2;
      color: #dc2626;
    }
    .bmi-range-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles
addBMIStyles();