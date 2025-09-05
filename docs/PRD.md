### **Product Requirements Document: Aplikasi Todolist Multiuser (Proyek "Taskify")**

| **Versi** | **Tanggal** | **Penulis** | **Status** |
| :--- | :--- | :--- | :--- |
| 1.0 | 5 September 2025 | Akhmad Khanif Zyen | Final |

---

### **1. Latar Belakang & Visi Produk**

**1.1. Latar Belakang**
Saat ini, banyak individu dan tim kecil membutuhkan alat manajemen tugas yang sederhana namun efektif. Aplikasi yang ada di pasar seringkali jatuh ke dalam dua kategori: terlalu sederhana (hanya untuk satu pengguna tanpa fitur esensial) atau terlalu kompleks dan mahal (seperti Jira atau Asana). Terdapat celah pasar untuk aplikasi todolist yang bersih, cepat, dan mendukung kebutuhan dasar pengguna individu serta kolaborasi ringan.

**1.2. Visi Produk**
Menjadi aplikasi manajemen tugas yang paling intuitif dan andal bagi para profesional modern dan tim kecil, memungkinkan mereka untuk fokus pada apa yang paling penting dengan menghilangkan kerumitan yang tidak perlu.

### **2. Masalah yang Ingin Diselesaikan (Problem Statement)**

Pengguna (freelancer, pelajar, manajer tim kecil) kesulitan untuk:
*   Mengorganisir tugas-tugas pribadi dan pekerjaan dalam satu tempat yang aman dan terisolasi per akun.
*   Mengakses daftar tugas mereka dari perangkat mana pun dengan pengalaman yang konsisten.
*   Menggunakan aplikasi yang terasa cepat dan responsif tanpa *lag* atau waktu muat yang lama.

### **3. Tujuan & Sasaran (Goals & Objectives)**

*   **Tujuan Produk:** Menyediakan platform manajemen tugas yang minimalis, cepat, dan aman untuk banyak pengguna.
*   **Tujuan Bisnis:** Memvalidasi produk di pasar sebagai fondasi untuk fitur premium di masa depan (misalnya, kolaborasi tim).
*   **Sasaran (Objectives) untuk V1:**
    *   Meluncurkan aplikasi web fungsional dalam 3 bulan ke depan.
    *   Mencapai 100 pengguna aktif dalam bulan pertama setelah peluncuran.
    *   Memastikan 99% operasi CRUD (Create, Read, Update, Delete) tugas selesai di bawah 500ms.

### **4. Target Pengguna (User Personas)**

*   **Persona 1: Dina, Freelance Digital Marketer**
    *   **Kebutuhan:** Perlu melacak tugas untuk beberapa klien yang berbeda. Ingin aplikasi yang cepat, tidak mengganggu, dan bisa diakses dari laptop dan ponselnya. Keamanan data sangat penting.
    *   **Frustasi:** Aplikasi saat ini terlalu lambat atau penuh dengan fitur yang tidak ia butuhkan.
*   **Persona 2: Budi, Manajer Tim Kecil (3-5 orang)**
    *   **Kebutuhan:** Awalnya, ia membutuhkan tempat untuk melacak tugas-tugas pribadinya. Namun, ia tertarik pada potensi untuk nantinya bisa berbagi daftar tugas dengan timnya.
    *   **Frustasi:** Alat manajemen proyek terlalu rumit untuk kebutuhan timnya yang sederhana.

### **5. Fitur & Persyaratan (Features & Requirements) - V1.0**

Ini adalah lingkup untuk versi pertama (MVP - Minimum Viable Product).

#### **Epic 1: Autentikasi & Manajemen Akun Pengguna**
*   **User Story 1.1 (Pendaftaran):** Sebagai pengguna baru, saya ingin bisa mendaftar akun menggunakan email dan password agar data saya aman dan personal.
*   **User Story 1.2 (Login):** Sebagai pengguna terdaftar, saya ingin bisa login menggunakan email dan password, serta melalui penyedia OAuth (Google & GitHub) untuk akses yang lebih cepat.
*   **User Story 1.3 (Logout):** Sebagai pengguna yang sedang login, saya ingin bisa keluar dari akun saya dengan aman.
*   **Persyaratan Teknis:**
    *   Implementasi menggunakan Auth.js.
    *   Rute yang dilindungi (seperti `/dashboard`) hanya bisa diakses setelah login.
    *   Password harus di-hash sebelum disimpan di database.

#### **Epic 2: Manajemen Tugas (Core Functionality)**
*   **User Story 2.1 (Membuat Tugas):** Sebagai pengguna yang login, saya ingin bisa menambahkan tugas baru dengan cepat melalui sebuah input field.
*   **User Story 2.2 (Melihat Tugas):** Sebagai pengguna, saya ingin melihat semua daftar tugas saya di halaman utama (dashboard).
*   **User Story 2.3 (Memperbarui Tugas):** Sebagai pengguna, saya ingin bisa menandai sebuah tugas sebagai "selesai" atau "belum selesai" dengan mengklik checkbox.
*   **User Story 2.4 (Menghapus Tugas):** Sebagai pengguna, saya ingin bisa menghapus tugas yang sudah tidak relevan lagi.
*   **Persyaratan Teknis:**
    *   Setiap tugas di database harus memiliki `userId` yang menunjuk ke pemiliknya.
    *   Semua query ke database untuk tugas **HARUS** disaring berdasarkan `userId` pengguna yang sedang login.
    *   Operasi CUD (Create, Update, Delete) akan diimplementasikan menggunakan Next.js Server Actions.
    *   UI harus memberikan feedback visual (misalnya, loading spinner) saat sebuah aksi sedang diproses.

#### **Epic 3: Antarmuka & Pengalaman Pengguna (UI/UX)**
*   **User Story 3.1 (Desain Responsif):** Sebagai pengguna, saya ingin bisa menggunakan aplikasi dengan nyaman baik di desktop maupun di perangkat mobile.
*   **User Story 3.2 (Desain Minimalis):** Sebagai pengguna, saya menginginkan antarmuka yang bersih dan fokus pada daftar tugas tanpa distraksi.
*   **Persyaratan Teknis:**
    *   UI dibangun menggunakan komponen dari Shadcn/UI dan styling dengan Tailwind CSS.
    *   Harus ada state untuk loading, error, dan kondisi kosong (ketika belum ada tugas).

### **6. Alur Pengguna (User Flow)**

1.  **Pengguna Baru:** Landing Page -> Klik "Daftar" -> Isi form email/password -> diarahkan ke `/dashboard`.
2.  **Pengguna Lama:** Landing Page -> Klik "Login" -> Login via email/password atau Google -> diarahkan ke `/dashboard`.
3.  **Penggunaan Harian:** Buka `/dashboard` -> Tambah todo baru -> Tandai beberapa todo sebagai selesai -> Hapus todo lama -> Logout.

### **7. Arsitektur Teknis**

*   **Framework:** Next.js 15 (App Router)
*   **Bahasa:** TypeScript
*   **UI Library:** Shadcn/UI, Tailwind CSS
*   **Autentikasi:** Auth.js
*   **Backend Logic:** Next.js Server Actions
*   **Validasi:** Zod
*   **ORM:** Drizzle ORM
*   **Database:** PostgreSQL
*   **Deployment:** Vercel (disarankan)

### **8. Metrik Keberhasilan (Success Metrics)**

*   **Tingkat Aktivasi Pengguna:** Persentase pengguna yang membuat setidaknya satu tugas dalam 24 jam setelah mendaftar. (Target: > 60%)
*   **Retensi Pengguna:** Persentase pengguna yang kembali ke aplikasi setelah 7 hari. (Target: > 20%)
*   **Performa:** Waktu muat halaman (LCP - Largest Contentful Paint) di bawah 2.5 detik.

### **9. Di Luar Lingkup (Out of Scope) untuk V1.0**

Untuk menjaga agar rilis pertama tetap fokus, fitur-fitur berikut **TIDAK** akan disertakan:
*   Berbagi daftar tugas antar pengguna.
*   Menetapkan tugas ke pengguna lain.
*   Tanggal jatuh tempo (due dates) dan pengingat.
*   Fitur lampiran file.
*   Kategori atau label untuk tugas.
*   Tampilan papan Kanban.
*   Aplikasi mobile native.

### **10. Pertimbangan Masa Depan (Future Considerations)**

Setelah V1.0 berhasil diluncurkan, roadmap potensial meliputi:
*   **V1.1:** Tambahkan tanggal jatuh tempo dan sorting tugas.
*   **V2.0:** Perkenalkan fitur "Spaces" atau "Projects" di mana pengguna bisa mengundang orang lain untuk berkolaborasi dalam satu daftar tugas bersama.
*   **V2.1:** Notifikasi real-time ketika tugas baru ditambahkan atau diperbarui di daftar bersama.