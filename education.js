// Patient Education PDF Generator Module
// Generate educational materials for parents in simple Indonesian

const EDUCATION_DATA = {
  // Education topics
  topics: [
    {
      id: 'diarrhea',
      title: 'Diare pada Anak',
      icon: '💧',
      content: {
        definition: 'Diare adalah buang air besar lebih dari 3 kali sehari dengan konsistensi encer.',
        causes: [
          'Infeksi virus (paling umum)',
          'Infeksi bakteri',
          'Makanan/mainan yang terkontaminasi',
          'Antibiotik',
          'Alergi makanan'
        ],
        signs: [
          'Buang air besar encer/basah >3 kali/hari',
          'Muntah',
          'Demam',
          'Nafsu makan menurun',
          'Lemah/lesu'
        ],
        homeCare: [
          'Berikan ORS sedikit-sedikit tapi sering',
          'ASI继续kan menyusui',
          'Makanan lunak dan mudah dicerna',
          'Jaga kebersihan tangan',
          'Monitor tanda bahaya'
        ],
        dangerSigns: [
          'Tidak bisa minum/menyusu',
          'Muntah terus',
          'Lesu/kesulitan bangun',
          'Demam tinggi',
          'Buang air berdarah',
          'Dehidrasi berat (mata cekung, kulit lenta)'
        ],
        prevention: [
          'Cuci tangan sebelum makan',
          'Makanan yang bersih dan matang',
          'Air minum yang bersih',
          'ASI eksklusif 6 bulan',
          'Immunisasi lengkap'
        ]
      }
    },
    {
      id: 'fever',
      title: 'Demam pada Anak',
      icon: '🌡️',
      content: {
        definition: 'Demam adalah suhu tubuh >38°C (rektal) atau >37.5°C (ketiak).',
        causes: [
          'Infeksi virus (pilek, flu)',
          'Infeksi bakteri',
          'Imunisasi',
          'Berlebihan pakaian',
          'Dehidrasi'
        ],
        signs: [
          'Suhu tubuh tinggi',
          'Kulit hangat/kering',
          'Muka kemerah-merahan',
          'Nafsu makan menurun',
          'Rewel/cengeng',
          'Sakit kepala'
        ],
        homeCare: [
          'Kompres dengan air hangat',
          'Pakaian tipis dan longgar',
          'Cairan cukup (air putih, sup)',
          'Parasetamol jika >38.5°C',
          'Istirahat cukup'
        ],
        dangerSigns: [
          'Demam >3 hari tanpa perbaikan',
          'Kejang',
          'Tidak sadar/letargis',
          'Leher kaku',
          'Sesak napas',
          'Muntah terus',
          'Dehidrasi'
        ],
        prevention: [
          'Menjaga kebersihan',
          'Gizi seimbang',
          'Istirahat cukup',
          'Olahraga teratur',
          'Hindari kontak dengan orang sakit'
        ]
      }
    },
    {
      id: 'nutrition',
      title: 'Gizi dan Nutrisi Anak',
      icon: '🍎',
      content: {
        definition: 'Nutrisi adalah zat-zat yang dibutuhkan tubuh untuk tumbuh kembang dan menjaga kesehatan.',
        causes: [
          'Kekurangan kalori',
          'Kekurangan protein',
          'Kekurangan vitamin dan mineral',
          'Infeksi berulang',
          'Masalah penyerapan makanan'
        ],
        signs: [
          'BB tidak naik',
          'PB/TB tidak tumbuh',
          'Lemah/lesu',
          'Nafsu makan buruk',
          'Sering sakit',
          'Keriput/kurus'
        ],
        homeCare: [
          'ASI eksklusif 6 bulan',
          'MPASI bergizi setelah 6 bulan',
          'Makan 3x sehari + 2 camilan',
          'Protein hewani (daging, telur, ikan)',
          'Vegetable dan buah-buahan',
          'Air putih cukup'
        ],
        dangerSigns: [
          'BB turun drastis',
          'Tidak nafsu makan >3 hari',
          'Muntah terus',
          'Diare berlarut',
          'Demam tinggi',
          'Lesu ekstrem'
        ],
        prevention: [
          'ASI eksklusif 6 bulan',
          'MPASI nutritious beragam',
          'Kontrol pertumbuhan rutin',
          'Immunisasi lengkap',
          'Hygiene makanan'
        ]
      }
    },
    {
      id: 'anemia',
      title: 'Anemia pada Anak',
      icon: '🩸',
      content: {
        definition: 'Anemia adalah kondisi dimana kadar hemoglobin (Hb) dalam darah rendah.',
        causes: [
          'Kekurangan zat besi',
          'Kekurangan asam folat',
          'Kekurangan vitamin B12',
          'Perdarahan kronis',
          'Infeksi kronis',
          'Genetik (thalasemia)'
        ],
        signs: [
          'Pucat (muka, bibir, telapak)',
          'Lemah dan lesu',
          'Nafsu makan buruk',
          'Sering Pilek/infeksi',
          'Detak jantung cepat',
          'Rambut rontok'
        ],
        homeCare: [
          'Makanan tinggi zat besi (daging, hati, sayuran hijau)',
          'Vitamin C untuk penyerapan zat besi',
          'Kurangi teh/kopi saat makan',
          'Obat Fe sesuai anjuran dokter',
          'Kontrol Hb secara berkala'
        ],
        dangerSigns: [
          'Hb sangat rendah (<7 g/dL)',
          'Pucat berat',
          'Sesak napas',
          'Detak jantung cepat',
          'Lethargy',
          'Pembengkakan Limf'
        ],
        prevention: [
          'ASI dan MPASI mengandung zat besi',
          'Makanan tinggi zat besi',
          'Vitamin C cukup',
          'Kontrol pertumbuhan rutin',
          'Pengendalian infeksi'
        ]
      }
    },
    {
      id: 'immunization',
      title: 'Imunisasi Anak',
      icon: '💉',
      content: {
        definition: 'Imunisasi adalah memberikan vaccine untuk melindungi anak dari penyakit berbahaya.',
        causes: [
          'Penyakit yang dapat dicegah dengan vaccine',
          'Campak, polio, difteri, tetanus, hepatitis',
          'Penyakit pneumokokus',
          'Japanese encephalitis',
          'HPV (kanker serviks)'
        ],
        signs: [
          'Demam ringan (normal setelah vaccine)',
          'Nyeri di lokasi suntikan',
          'Kemerah-merahan',
          'Rewel sementara'
        ],
        homeCare: [
          'Kompres hangat di lokasi suntikan',
          'Parasetamol jika demam tinggi',
          'Istirahat yang cukup',
          'Berikan ASI/makan seperti biasa',
          'Monitor kondisi anak'
        ],
        dangerSigns: [
          'Demam tinggi >3 hari',
          'Kejang',
          'Sesak napas',
          'Pembengkakan wajah/leher',
          'Ruam di seluruh tubuh',
          'Rewel ekstrem'
        ],
        prevention: [
          'Ikuti jadwal imunisasi lengkap',
          'Immunisasi tepat waktu',
          'Jangan tunda tanpa alasan medis',
          'Konsultasi dokter jika sakit',
          'Dokumentasi vaccine'
        ]
      }
    }
  ],

  // Common advice template
  getAdviceTemplate: function() {
    return {
      general: [
        'Ikuti saran dokter dengan tertib',
        'Kontrol sesuai jadwal yang ditentukan',
        'Perhatikan tanda bahaya yang telah disebutkan',
        'Jaga kebersihan diri dan lingkungan',
        'Berikan dukungan psikologis pada anak',
        'Konsultasi jika ada keraguan atau pertanyaan'
      ]
    };
  },

  // Generate educational content
  generateEducationalContent: function(topicId, childName, customAdvice) {
    const topic = this.topics.find(t => t.id === topicId);
    if (!topic) return null;

    const advice = this.getAdviceTemplate();
    
    return {
      topic: topic,
      childName: childName,
      customAdvice: customAdvice,
      generalAdvice: advice.general
    };
  }
};

// Initialize education module
function initEducationModule() {
  const educationContent = document.createElement('div');
  educationContent.className = 'education-content';
  educationContent.style.display = 'none';
  
  educationContent.innerHTML = `
    <!-- Education Generator Card -->
    <section class="input-card">
      <div class="input-card-header">
        <h2 class="input-card-title">Generator Edukasi Pasien (PDF)</h2>
        <p class="input-card-desc">Buat lembar edukasi untuk orang tua dalam bahasa sederhana tentang kondisi anak.</p>
      </div>

      <div class="form-grid">
        <div class="form-field">
          <label for="education-topic">Pilih Topik</label>
          <select id="education-topic">
            <option value="">Pilih topik edukasi</option>
          </select>
          <div class="error-message" id="education-topic-error"></div>
        </div>

        <div class="form-field">
          <label for="education-child-name">Nama Anak (Opsional)</label>
          <input type="text" id="education-child-name" placeholder="Contoh: Budi">
          <div class="error-message" id="education-child-name-error"></div>
        </div>

        <div class="form-field full-width">
          <label for="education-custom-advice">Saran Khusus (Opsional)</label>
          <textarea id="education-custom-advice" rows="4" placeholder="Contoh: Minum obat 2x sehari setelah makan, kontrol ulang dalam 1 minggu..."></textarea>
          <div class="error-message" id="education-custom-advice-error"></div>
        </div>
      </div>

      <div class="form-actions">
        <button id="education-preview">Preview Edukasi</button>
        <button id="education-generate-pdf" disabled>Generate PDF</button>
        <p class="form-note">Preview akan muncul di bawah, kemudian bisa di-generate menjadi PDF untuk diunduh.</p>
      </div>
    </section>

    <!-- Preview Card -->
    <section class="summary-card" id="education-preview-section" style="display: none;">
      <h2>Preview Lembar Edukasi</h2>
      <div id="education-preview-content">
        <!-- Preview content will be populated here -->
      </div>
    </section>

    <!-- PDF Generation Info -->
    <section class="kpsp-info-box">
      <h4>ℹ️ Panduan Generator Edukasi</h4>
      <ul>
        <li><strong>Bahasa sederhana:</strong> Menggunakan istilah yang mudah dipahami orang tua</li>
        <li><strong>Struktur:</strong> Definisi, penyebab, tanda, perawatan, tanda bahaya, pencegahan</li>
        <li><strong>Customization:</strong> Bisa tambahkan nama anak dan saran khusus</li>
        <li><strong>PDF:</strong> Format yang mudah dicetak dan dibagikan</li>
        <li><strong>Offline:</strong> Semua proses berjalan di browser tanpa internet</li>
        <li><strong>Privasai:</strong> Data tidak dikirim ke server</li>
      </ul>
    </section>
  `;

  document.querySelector('.main-content').appendChild(educationContent);

  // Populate topics
  function populateTopics() {
    const topicSelect = educationContent.querySelector('#education-topic');
    EDUCATION_DATA.topics.forEach(topic => {
      const option = document.createElement('option');
      option.value = topic.id;
      option.textContent = `${topic.icon} ${topic.title}`;
      topicSelect.appendChild(option);
    });
  }

  populateTopics();

  // Generate educational content
  educationContent.querySelector('#education-preview').addEventListener('click', function() {
    const topicId = educationContent.querySelector('#education-topic').value;
    const childName = educationContent.querySelector('#education-child-name').value.trim();
    const customAdvice = educationContent.querySelector('#education-custom-advice').value.trim();

    if (!topicId) {
      alert('Silakan pilih topik edukasi.');
      return;
    }

    // Generate content
    const content = EDUCATION_DATA.generateEducationalContent(topicId, childName, customAdvice);
    if (!content) return;

    // Show preview
    showPreview(content);
    
    // Enable PDF generation
    educationContent.querySelector('#education-generate-pdf').disabled = false;
  });

  // Show preview
  function showPreview(content) {
    const previewSection = educationContent.querySelector('#education-preview-section');
    const previewContent = educationContent.querySelector('#education-preview-content');
    
    let html = `
      <div class="education-sheet">
        <div class="education-header">
          <div class="header-icon">${content.topic.icon}</div>
          <div class="header-title">
            <h2>${content.topic.title}</h2>
            ${content.childName ? `<p class="child-name">Untuk: ${content.childName}</p>` : ''}
          </div>
          <div class="header-date">${new Date().toLocaleDateString('id-ID')}</div>
        </div>
        
        <div class="education-content-section">
          <div class="content-block">
            <h3>Apa itu ${content.topic.title}?</h3>
            <p>${content.topic.content.definition}</p>
          </div>

          <div class="content-block">
            <h3>Penyebab</h3>
            <ul>
              ${content.topic.content.causes.map(cause => `<li>${cause}</li>`).join('')}
            </ul>
          </div>

          <div class="content-block">
            <h3>Tanda dan Gejala</h3>
            <ul>
              ${content.topic.content.signs.map(sign => `<li>${sign}</li>`).join('')}
            </ul>
          </div>

          <div class="content-block">
            <h3>Perawatan di Rumah</h3>
            <ul>
              ${content.topic.content.homeCare.map(care => `<li>${care}</li>`).join('')}
            </ul>
          </div>

          <div class="content-block danger">
            <h3>🚨 Tanda Bahaya (Kapan Segera ke Dokter)</h3>
            <ul>
              ${content.topic.content.dangerSigns.map(sign => `<li><strong>${sign}</strong></li>`).join('')}
            </ul>
          </div>

          <div class="content-block">
            <h3>Pencegahan</h3>
            <ul>
              ${content.topic.content.prevention.map(prev => `<li>${prev}</li>`).join('')}
            </ul>
          </div>

          ${content.customAdvice ? `
            <div class="content-block custom">
              <h3>Saran Khusus untuk ${content.childName || 'Anak'}</h3>
              <p>${content.customAdvice}</p>
            </div>
          ` : ''}

          <div class="content-block general">
            <h3>Saran Umum</h3>
            <ul>
              ${content.generalAdvice.map(advice => `<li>${advice}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="education-footer">
          <p><strong>Catatan:</strong> Lembar edukasi ini adalah panduan umum. Selalu konsultasi dengan tenaga kesehatan untuk penanganan spesifik.</p>
          <p class="source">Sumber: Pediatric Guidelines Indonesia</p>
        </div>
      </div>
    `;

    previewContent.innerHTML = html;
    previewSection.style.display = 'block';

    // Scroll to preview
    previewSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  // Generate PDF (simplified version)
  educationContent.querySelector('#education-generate-pdf').addEventListener('click', function() {
    // In a real implementation, you would use a library like jsPDF
    // For this demo, we'll simulate PDF generation
    alert('Fitur PDF akan menggunakan library jsPDF. Untuk demo ini, simpan sebagai PDF melalui browser:\n\n1. Klik Ctrl+P (Print)\n2. Pilih "Save as PDF"\n3. Atur margin dan format\n4. Save file');
    
    // Simulate PDF download
    window.print();
  });

  return educationContent;
}

// Add CSS for education-specific styles
function addEducationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .education-sheet {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 32px;
      margin: 20px 0;
      font-family: 'Times New Roman', serif;
      line-height: 1.6;
      max-width: 800px;
    }
    .education-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e2e8f0;
    }
    .header-icon {
      font-size: 48px;
      flex-shrink: 0;
    }
    .header-title h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
      color: #1e293b;
      font-weight: bold;
    }
    .child-name {
      margin: 0;
      font-size: 18px;
      color: #64748b;
      font-style: italic;
    }
    .header-date {
      margin-left: auto;
      font-size: 14px;
      color: #64748b;
    }
    .education-content-section {
      margin-bottom: 32px;
    }
    .content-block {
      margin-bottom: 24px;
    }
    .content-block h3 {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: #1e293b;
      font-weight: bold;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .content-block.danger {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 16px;
    }
    .content-block.danger h3 {
      color: #dc2626;
      border-bottom-color: #fecaca;
    }
    .content-block.custom {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 8px;
      padding: 16px;
    }
    .content-block.custom h3 {
      color: #0284c7;
    }
    .content-block.general {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 16px;
    }
    .content-block.general h3 {
      color: #16a34a;
    }
    .content-block ul {
      margin: 0;
      padding-left: 20px;
    }
    .content-block li {
      margin-bottom: 8px;
      font-size: 14px;
      color: #374151;
    }
    .content-block p {
      margin: 0;
      font-size: 14px;
      color: #374151;
    }
    .education-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      text-align: center;
    }
    .education-footer p {
      margin: 0 0 8px 0;
      font-size: 12px;
      color: #6b7280;
    }
    .source {
      font-style: italic;
      font-size: 11px !important;
    }

    /* Print styles */
    @media print {
      body * {
        visibility: hidden;
      }
      .education-sheet, .education-sheet * {
        visibility: visible;
      }
      .education-sheet {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        border: none;
        padding: 20px;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles
addEducationStyles();