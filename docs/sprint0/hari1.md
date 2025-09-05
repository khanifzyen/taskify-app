### **Dokumentasi Teknis: Sprint 0, Hari 1**

*   **Tanggal:** 5 September 2025
*   **Sprint:** 0 - Persiapan & Fondasi
*   **Fokus Hari Ini:** Inisialisasi proyek Next.js, konfigurasi dasar, dan setup Version Control System (Git).

---

### **Tujuan**

Menciptakan fondasi proyek yang solid, bersih, dan siap untuk pengembangan lebih lanjut. Di akhir hari ini, kita akan memiliki:
1.  Proyek Next.js 15 yang berjalan secara lokal.
2.  Konfigurasi TypeScript, Tailwind CSS, dan ESLint yang sudah terpasang.
3.  Repositori Git lokal yang melacak semua perubahan.
4.  Repositori remote di GitHub (atau platform lain) sebagai backup dan pusat kolaborasi.

---

### **Langkah-langkah Pengerjaan (Step-by-Step)**

#### **Langkah 1: Persiapan Lingkungan**

Sebelum memulai, pastikan perangkat Anda memiliki:
*   **Node.js:** Versi 20.x atau lebih baru. Verifikasi dengan menjalankan `node -v` di terminal.
*   **npm/pnpm/yarn:** Manajer paket. Panduan ini akan menggunakan `pnpm` karena efisiensinya, tapi `npm` atau `yarn` juga bisa digunakan.
*   **Git:** Terinstal di sistem Anda. Verifikasi dengan `git --version`.
*   **Akun GitHub/GitLab/Bitbucket:** Diperlukan untuk membuat repositori remote.

#### **Langkah 2: Inisialisasi Proyek Next.js**

1.  **Buka Terminal:** Navigasikan ke direktori tempat Anda ingin menyimpan proyek (misalnya, `~/Projects/`).

2.  **Jalankan Perintah Create Next App:** Perintah ini akan memandu Anda melalui proses setup interaktif.

    ```bash
    pnpm create next-app@latest
    ```
    *Jika menggunakan npm: `npx create-next-app@latest`*

3.  **Jawab Pertanyaan Setup:** Berikan jawaban berikut pada prompt yang muncul. Ini adalah konfigurasi yang direkomendasikan untuk proyek kita.

    ```
    What is your project named? taskify
    Would you like to use TypeScript? Yes
    Would you like to use ESLint? Yes
    Would you like to use Tailwind CSS? Yes
    Would you like to use `src/` directory? Yes
    Would you like to use App Router? (recommended) Yes
    Would you like to customize the default import alias (@/*)? No (atau Yes jika Anda ingin mengubahnya)
    ```

    *   **Mengapa `src/` directory?** Ini membantu memisahkan kode aplikasi (`src/`) dari file konfigurasi di root, membuat struktur lebih rapi seiring pertumbuhan proyek.

4.  **Masuk ke Direktori Proyek:** Setelah instalasi selesai, pindah ke folder proyek yang baru dibuat.
    ```bash
    cd taskify
    ```

#### **Langkah 3: Verifikasi Instalasi Proyek**

1.  **Jalankan Server Pengembangan:** Mulai server lokal untuk memastikan proyek berjalan tanpa error.
    ```bash
    pnpm dev
    ```

2.  **Buka Browser:** Buka browser dan kunjungi `http://localhost:3000`. Anda seharusnya melihat halaman selamat datang standar dari Next.js.

3.  **Hentikan Server:** Kembali ke terminal dan tekan `Ctrl + C` untuk menghentikan server pengembangan.

#### **Langkah 4: Inisialisasi Repositori Git**

Meskipun `create-next-app` biasanya sudah menginisialisasi Git, mari kita pastikan dan konfigurasikan dengan benar.

1.  **Cek Status Git:**
    ```bash
    git status
    ```
    Anda akan melihat bahwa semua file proyek baru sudah ada tetapi belum di-commit. `create-next-app` biasanya sudah membuat commit awal. Jika belum, ikuti langkah berikutnya.

2.  **(Jika Belum Ada Commit)** Buat Commit Awal:
    ```bash
    git add .
    git commit -m "Initial commit from create-next-app"
    ```

3.  **Bersihkan Kode Bawaan (Opsional tapi Direkomendasikan):** Hapus konten placeholder di `src/app/page.tsx` agar kita mulai dari kanvas yang bersih.

    *   Buka file `src/app/page.tsx`.
    *   Hapus semua isinya dan ganti dengan boilerplate minimalis ini:
        ```tsx
        export default function HomePage() {
          return (
            <main>
              <h1>Welcome to Taskify</h1>
            </main>
          );
        }
        ```
    *   Lakukan commit untuk perubahan ini nanti di akhir hari.

#### **Langkah 5: Membuat dan Menghubungkan Repositori Remote**

1.  **Buat Repositori Baru di GitHub:**
    *   Buka GitHub di browser Anda.
    *   Klik tombol "+" di pojok kanan atas, lalu pilih "New repository".
    *   Beri nama repositori (misalnya, `taskify-app`).
    *   Pilih "Private" jika Anda tidak ingin kode ini bersifat publik.
    *   **Penting:** **Jangan** centang opsi "Add a README file", "Add .gitignore", atau "Choose a license". Proyek lokal kita sudah memiliki ini semua.
    *   Klik "Create repository".

2.  **Hubungkan Repositori Lokal ke Remote:** GitHub akan memberikan beberapa perintah. Gunakan yang berada di bawah judul "...or push an existing repository from the command line".

    *   **Tambahkan Remote:** Ganti `<URL_ANDA>` dengan URL repositori yang Anda dapatkan dari GitHub.
        ```bash
        git remote add origin <URL_ANDA>.git
        ```
        Contoh: `git remote add origin https://github.com/username/taskify-app.git`

    *   **Ubah Nama Branch (Best Practice):** Ubah nama branch default dari `master` ke `main`.
        ```bash
        git branch -M main
        ```

    *   **Verifikasi Remote:** Pastikan remote sudah terhubung dengan benar.
        ```bash
        git remote -v
        ```
        Anda seharusnya melihat URL `origin` untuk `fetch` dan `push`.

---

### **Akhir Hari: Finalisasi dan Commit**

Sekarang semua pekerjaan untuk hari ini telah selesai. Kita akan mengumpulkan semua perubahan ke dalam satu commit yang jelas dan deskriptif, lalu mendorongnya ke remote.

#### **Langkah 6: Final Git Commit dan Push**

1.  **Stage Semua Perubahan:** Buka terminal di root proyek dan tambahkan semua file yang telah diubah atau dibuat.
    ```bash
    git add .
    ```

2.  **Buat Satu Commit Komprehensif:** Tulis pesan commit yang merangkum semua pekerjaan hari ini.
    ```bash
    git commit -m "feat(setup): initialize Next.js 15 project with Git and remote repo

    - Initialized a new Next.js 15 project using `create-next-app`.
    - Configured with TypeScript, ESLint, and Tailwind CSS.
    - Structured the project with the `src/` directory.
    - Cleaned up the default boilerplate on the homepage.
    - Set up a local Git repository and connected it to a remote GitHub repository.
    - The project is now running locally and ready for further setup."
    ```
    *   **Struktur Pesan Commit:** Menggunakan [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (`feat(setup): ...`) adalah praktik yang sangat baik. Ini membantu otomatisasi dan membuat histori lebih mudah dibaca.

3.  **Push ke Remote:** Kirim commit Anda ke repositori di GitHub.
    ```bash
    git push -u origin main
    ```
    *   Opsi `-u` (`--set-upstream`) akan mengatur branch `main` lokal untuk melacak branch `main` di `origin`. Untuk push selanjutnya, Anda cukup menjalankan `git push`.

#### **Checklist Akhir Hari**
- [x] Proyek Next.js berhasil dibuat.
- [x] Proyek berjalan di `localhost:3000`.
- [x] Repositori Git lokal sudah diinisialisasi.
- [x] Repositori remote di GitHub sudah dibuat dan terhubung.
- [x] Semua pekerjaan hari ini sudah di-commit dan di-push ke remote.

---
### **Label Tugas Keseluruhan**
**[S0-H1] Project Initialization and Git Setup**