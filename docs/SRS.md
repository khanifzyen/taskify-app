### **Software Requirements Specification (SRS): Aplikasi Todolist "Taskify" v1.0**

| **Versi** | **Tanggal** | **Penulis** | **Status** |
| :--- | :--- | :--- | :--- |
| 1.0 | 5 September 2025 | Akhmad Khanif Zyen | Final |

---

### **1. Pendahuluan**

#### **1.1. Tujuan**
Dokumen ini bertujuan untuk memberikan deskripsi yang detail dan komprehensif mengenai persyaratan fungsional dan non-fungsional untuk aplikasi web "Taskify" versi 1.0. Dokumen ini akan menjadi sumber kebenaran tunggal (single source of truth) bagi tim pengembangan dan penjaminan kualitas (QA) selama siklus hidup pengembangan produk.

#### **1.2. Ruang Lingkup Produk**
Produk yang akan dikembangkan adalah aplikasi web Software as a Service (SaaS) untuk manajemen tugas (todolist) yang mendukung banyak pengguna (multiuser). Setiap pengguna akan memiliki akun pribadi dan data tugas yang terisolasi. Versi 1.0 akan fokus pada fungsionalitas inti autentikasi pengguna dan operasi dasar CRUD (Create, Read, Update, Delete) untuk tugas. Fitur kolaboratif seperti berbagi daftar tugas berada di luar ruang lingkup versi ini.

#### **1.3. Definisi, Akronim, dan Singkatan**
*   **CRUD:** Create, Read, Update, Delete. Operasi dasar pada data.
*   **UI:** User Interface (Antarmuka Pengguna).
*   **OAuth:** Open Authorization. Standar terbuka untuk delegasi akses.
*   **ORM:** Object-Relational Mapping. Teknik untuk mengonversi data antara sistem yang tidak kompatibel.
*   **SRS:** Software Requirements Specification.
*   **PRD:** Product Requirements Document.
*   **LCP:** Largest Contentful Paint. Metrik performa web.

#### **1.4. Referensi**
*   Product Requirements Document: Aplikasi Todolist "Taskify" v1.0

---

### **2. Deskripsi Umum**

#### **2.1. Perspektif Produk**
Taskify adalah aplikasi web mandiri yang akan di-host di platform Vercel. Aplikasi ini akan berinteraksi dengan layanan eksternal untuk autentikasi (Google OAuth, GitHub OAuth) dan akan bergantung pada database PostgreSQL sebagai satu-satunya penyimpan data persisten.

#### **2.2. Fungsi Produk**
Fungsi utama yang akan disediakan oleh Taskify v1.0 adalah:
1.  **Manajemen Akun Pengguna:** Pendaftaran, login (termasuk via OAuth), dan logout.
2.  **Manajemen Tugas:** Membuat, melihat, memperbarui status, dan menghapus tugas.
3.  **Isolasi Data:** Memastikan data tugas seorang pengguna tidak dapat diakses oleh pengguna lain.

#### **2.3. Karakteristik Pengguna**
Target pengguna adalah individu yang melek teknologi, seperti freelancer, pelajar, dan profesional, yang membutuhkan alat sederhana untuk mengelola tugas harian mereka. Pengguna diharapkan memiliki akses internet dan menggunakan peramban web modern (desktop atau mobile).

#### **2.4. Batasan (Constraints)**
*   **Teknologi:** Sistem HARUS dikembangkan menggunakan Next.js 15, React 19, Drizzle ORM, dan PostgreSQL.
*   **Platform:** Aplikasi HARUS dapat di-deploy dan berjalan secara optimal di Vercel.
*   **Keamanan:** Komunikasi antara klien dan server HARUS dienkripsi menggunakan HTTPS. Kata sandi pengguna HARUS di-hash sebelum disimpan.
*   **Bahasa:** Antarmuka pengguna HARUS dalam Bahasa Indonesia.

#### **2.5. Asumsi dan Ketergantungan**
*   API dari penyedia layanan OAuth (Google, GitHub) akan selalu tersedia dan berfungsi sesuai dokumentasi.
*   Pengguna memiliki alamat email yang valid untuk proses pendaftaran dan komunikasi.
*   Infrastruktur hosting (Vercel) dan database memiliki ketersediaan yang tinggi.

---

### **3. Persyaratan Spesifik**

#### **3.1. Persyaratan Fungsional**

**FR-AUTH: Modul Autentikasi Pengguna**
*   **FR-AUTH-001 (Pendaftaran):** Sistem HARUS menyediakan formulir pendaftaran dengan field `email` dan `password`. Setelah submit berhasil, sistem HARUS membuat rekam pengguna baru, memulai sesi login, dan mengarahkan pengguna ke halaman dashboard.
*   **FR-AUTH-002 (Login):** Sistem HARUS menyediakan formulir login dengan field `email` dan `password`. Jika kredensial valid, sistem HARUS memulai sesi login dan mengarahkan pengguna ke dashboard. Jika tidak, sistem HARUS menampilkan pesan error yang jelas.
*   **FR-AUTH-003 (Login OAuth):** Sistem HARUS menyediakan tombol login via Google dan GitHub. Saat diklik, pengguna HARUS diarahkan ke alur otorisasi penyedia terkait. Setelah berhasil, sistem HARUS membuat akun pengguna (jika belum ada), memulai sesi login, dan mengarahkan ke dashboard.
*   **FR-AUTH-004 (Logout):** Sistem HARUS menyediakan mekanisme (misalnya, tombol logout) yang akan mengakhiri sesi pengguna saat ini dan mengarahkannya ke halaman utama (landing page).
*   **FR-AUTH-005 (Proteksi Rute):** Halaman yang memerlukan autentikasi (misal, `/dashboard`) HARUS tidak dapat diakses oleh pengguna yang belum login. Upaya akses tanpa login HARUS diarahkan ke halaman login.

**FR-TODO: Modul Manajemen Tugas**
*   **FR-TODO-001 (Membuat Tugas):** Pengguna yang terautentikasi HARUS dapat memasukkan teks tugas ke dalam sebuah input field dan menyimpannya. Tugas baru HARUS muncul di daftar tugas tanpa perlu me-refresh halaman secara manual.
*   **FR-TODO-002 (Membaca Tugas):** Saat berada di dashboard, sistem HARUS menampilkan daftar semua tugas yang dimiliki oleh pengguna yang sedang login. Tugas HARUS diurutkan berdasarkan waktu pembuatan (terbaru di atas).
*   **FR-TODO-003 (Memperbarui Status Tugas):** Setiap item tugas HARUS memiliki elemen interaktif (misalnya, checkbox). Mengklik elemen ini HARUS mengubah status `completed` (selesai/belum selesai) dari tugas tersebut di database. Perubahan visual HARUS langsung terlihat di UI.
*   **FR-TODO-004 (Menghapus Tugas):** Setiap item tugas HARUS memiliki opsi untuk dihapus. Setelah konfirmasi (opsional), sistem HARUS menghapus rekam tugas terkait dari database secara permanen. Tugas yang dihapus HARUS hilang dari daftar di UI.
*   **FR-TODO-005 (Isolasi Data):** Sistem HARUS memastikan bahwa query ke database untuk operasi CRUD pada tugas selalu menyertakan filter berdasarkan `userId` dari pengguna yang sedang aktif sesinya. Pengguna A TIDAK BOLEH dapat melihat, memodifikasi, atau menghapus data milik pengguna B.

#### **3.2. Persyaratan Non-Fungsional**

**NFR-PERF: Kinerja**
*   **NFR-PERF-001 (Waktu Muat):** Halaman dashboard HARUS memiliki LCP (Largest Contentful Paint) di bawah 2.5 detik pada koneksi internet 4G rata-rata.
*   **NFR-PERF-002 (Responsivitas Aksi):** Waktu dari pengguna melakukan aksi (misalnya, menambah atau menghapus tugas) hingga UI diperbarui HARUS di bawah 500 milidetik untuk 95% kasus.

**NFR-SEC: Keamanan**
*   **NFR-SEC-001 (Enkripsi Transportasi):** Seluruh lalu lintas data antara browser klien dan server HARUS dienkripsi menggunakan protokol TLS 1.2 atau lebih tinggi (HTTPS).
*   **NFR-SEC-002 (Penyimpanan Kredensial):** Kata sandi pengguna HARUS di-hash menggunakan algoritma modern yang kuat (misalnya, bcrypt) sebelum disimpan di database. Plain text password TIDAK BOLEH disimpan.
*   **NFR-SEC-003 (Manajemen Sesi):** Token sesi HARUS disimpan dengan aman (misalnya, menggunakan cookie HttpOnly) untuk mencegah serangan Cross-Site Scripting (XSS).

**NFR-USAB: Kebergunaan (Usability)**
*   **NFR-USAB-001 (Desain Responsif):** Antarmuka aplikasi HARUS dapat beradaptasi dan berfungsi penuh pada berbagai ukuran layar, mulai dari 360px (mobile) hingga 1920px (desktop).
*   **NFR-USAB-002 (Kompatibilitas Browser):** Aplikasi HARUS berfungsi dengan baik pada dua versi mayor terakhir dari peramban berikut: Google Chrome, Mozilla Firefox, Apple Safari, dan Microsoft Edge.

**NFR-RELI: Keandalan (Reliability)**
*   **NFR-RELI-001 (Ketersediaan):** Aplikasi ditargetkan memiliki ketersediaan layanan (uptime) sebesar 99.5%.

#### **3.3. Persyaratan Antarmuka Eksternal**
*   **3.3.1. Antarmuka Pengguna (UI):**
    *   **Halaman Utama (Landing Page):** Berisi informasi singkat tentang produk dan tombol CTA (Call to Action) untuk "Login" dan "Daftar".
    *   **Halaman Login/Daftar:** Berisi formulir yang sesuai dan opsi untuk login via OAuth.
    *   **Halaman Dashboard:** Tampilan utama setelah login. Berisi form untuk menambah tugas baru dan daftar tugas yang ada.
*   **3.3.2. Antarmuka Perangkat Lunak (API):**
    *   Aplikasi akan berinteraksi dengan Google Identity Platform (OAuth 2.0) API.
    *   Aplikasi akan berinteraksi dengan GitHub Identity (OAuth 2.0) API.

#### **3.4. Persyaratan Database**
*   Sistem HARUS menggunakan database PostgreSQL.
*   Skema database HARUS mencakup tabel untuk `users`, `accounts`, `sessions`, `verificationTokens` (sesuai standar Auth.js), dan `todos`.
*   Tabel `todos` HARUS memiliki foreign key `userId` yang merujuk ke tabel `users`.
*   Relasi antara `users` dan `todos` HARUS memiliki aturan `ON DELETE CASCADE` untuk memastikan integritas data saat pengguna dihapus.