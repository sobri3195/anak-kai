# Analisa Grafik Pertumbuhan Anak

Aplikasi statis untuk menghitung dan memvisualisasikan status pertumbuhan anak berdasarkan standar WHO. Semua perhitungan berjalan di browser (tanpa backend) sehingga mudah di-deploy ke hosting statis seperti Vercel.

## Fitur

- Input data anak: jenis kelamin, umur (bulan), berat badan, dan tinggi/panjang badan.
- Analisa detail untuk:
  - Panjang/Tinggi badan terhadap umur (PB/U).
  - Berat badan terhadap umur (BB/U).
  - Berat badan terhadap panjang/tinggi (BB/PB).
- Ringkasan status dan rekomendasi singkat untuk setiap indikator.
- Visualisasi posisi anak pada grafik WHO menggunakan canvas.

## Cara Menjalankan Lokal

Cukup buka `index.html` melalui browser atau gunakan server statis ringan:

```bash
npx serve .
```

## Deploy ke Vercel

1. Push repository ini ke GitHub/GitLab.
2. Di dashboard Vercel, pilih **New Project** dan import repository.
3. Gunakan konfigurasi default (Static/Other) karena hanya HTML, CSS, dan JavaScript.
4. Deploy.

Vercel akan otomatis menyajikan `index.html` sebagai halaman utama.

## Struktur Folder

- `index.html` – UI utama.
- `main.js` – logika perhitungan dan analisa.
- `canvas.js` – rendering grafik pada canvas.
- `charts/` – gambar grafik WHO.
- `data.json` – data standar pertumbuhan.

## Catatan

Gunakan aplikasi ini sebagai alat bantu awal. Untuk evaluasi medis, tetap konsultasikan ke tenaga kesehatan.
