/**
 * MAIN SCRIPT - SIPETANI DASHBOARD
 * Menangani logika navigasi sidebar, efek transisi iframe, dan debugging.
 * * Developed by: Kelompok 5 - Teknik Informatika UNPAM
 */

document.addEventListener('DOMContentLoaded', function () {

  // === 1. INISIALISASI VARIABEL ===
  const menuLinks = document.querySelectorAll('#leftMenu a');
  const contentFrame = document.getElementById('mainFrame');

  // === 2. PESAN SISTEM (DEBUGGING) ===
  console.log("%cSIPETANI System Loaded.", "color: #0ea44a; font-size: 14px; font-weight: bold;");

  // Fitur: Sapaan Berdasarkan Waktu di Console
  const hour = new Date().getHours();
  let greeting = "Selamat Pagi";
  if (hour >= 11 && hour < 15) greeting = "Selamat Siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat Sore";
  else if (hour >= 18) greeting = "Selamat Malam";

  console.log(`${greeting}, Tim Pengembang! Sistem siap digunakan.`);

  // === 3. LOGIKA NAVIGASI SIDEBAR ===
  menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {

      // Cek apakah ini tombol logout atau link eksternal (WA/Email)
      // Jika iya, biarkan browser menangani secara default (jangan di-prevent)
      if (this.classList.contains('logout-mode')) {
        return;
      }

      // Mencegah reload halaman atau perilaku default link
      // Kita akan handle perpindahan halaman lewat JS agar bisa kasih efek animasi
      e.preventDefault();

      // A. Update Tampilan Menu (Active State)
      // Hapus kelas 'active' dari semua menu
      menuLinks.forEach(item => item.classList.remove('active'));
      // Tambahkan kelas 'active' ke menu yang sedang diklik
      this.classList.add('active');

      // B. Efek Transisi Iframe (Fade Out -> Ganti Src -> Fade In)
      const targetPage = this.getAttribute('href');

      // 1. Fade Out (Layar jadi transparan)
      contentFrame.style.opacity = '0';
      contentFrame.style.transition = 'opacity 0.2s ease';

      // 2. Tunggu sebentar (200ms), lalu ganti halaman
      setTimeout(() => {
        contentFrame.src = targetPage;

        // 3. Setelah halaman baru selesai dimuat, Fade In (Muncul kembali)
        contentFrame.onload = () => {
          contentFrame.style.opacity = '1';
        };
      }, 200);
    });
  });
});