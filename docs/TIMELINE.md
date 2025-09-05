### **Ringkasan Timeline Proyek: Taskify v1.0**

*   **Total Waktu Estimasi:** 6 Minggu
*   **Struktur:**
    *   **Sprint 0 (1 Minggu):** Persiapan & Fondasi
    *   **Sprint 1 (2 Minggu):** Fitur Inti: Autentikasi Pengguna
    *   **Sprint 2 (2 Minggu):** Fitur Inti: Manajemen Tugas (CRUD)
    *   **Sprint 3 (1 Minggu):** Polish, Pengujian Akhir & Deployment

---

### **Sprint 0: Persiapan & Fondasi (1 Minggu)**

**Tujuan Sprint:** Menyiapkan semua alat, proyek, dan infrastruktur dasar agar pengembangan fitur di sprint berikutnya bisa berjalan lancar dan cepat.

| Hari | Tugas | Checklist |
| :--- | :--- | :--- |
| **Hari 1** | **Inisialisasi Proyek & Git** | ☐ `create-next-app` dengan konfigurasi Next.js 15, TypeScript, Tailwind. <br> ☐ Inisialisasi repositori Git. <br> ☐ Buat repositori di GitHub/GitLab. <br> ☐ Lakukan commit dan push awal. |
| **Hari 2** | **Setup UI & Layout Dasar** | ☐ Inisialisasi Shadcn/UI (`npx shadcn-ui@latest init`). <br> ☐ Tambahkan beberapa komponen dasar (Button, Input, Card) untuk testing. <br> ☐ Buat struktur file `layout.tsx` utama, termasuk header & footer placeholder. |
| **Hari 3** | **Setup Database & ORM** | ☐ Provision database PostgreSQL (misal: Vercel Postgres, Supabase, Neon). <br> ☐ Simpan `DATABASE_URL` di file `.env.local`. <br> ☐ Install Drizzle ORM dan Drizzle Kit. <br> ☐ Buat file konfigurasi `drizzle.config.ts`. <br> ☐ Buat file koneksi database `lib/db/index.ts`. |
| **Hari 4** | **Skema Awal & Migrasi Pertama** | ☐ Buat file skema `lib/db/schema.ts`. <br> ☐ Definisikan tabel-tabel untuk Auth.js (`users`, `accounts`, `sessions`). <br> ☐ Jalankan `drizzle-kit generate` untuk membuat file migrasi. <br> ☐ Jalankan `drizzle-kit push` untuk menerapkan skema ke database. Verifikasi tabel di DB. |
| **Hari 5** | **Setup Deployment Awal** | ☐ Buat proyek baru di Vercel dan hubungkan ke repositori Git. <br> ☐ Konfigurasi environment variables di Vercel (`DATABASE_URL`). <br> ☐ Lakukan deployment pertama untuk memastikan aplikasi "Hello World" berjalan. <br> ☐ **Review Sprint 0:** Pastikan semua setup berhasil. |

---

### **Sprint 1: Autentikasi Pengguna (2 Minggu)**

**Tujuan Sprint:** Pengguna dapat mendaftar, login (via email/password & OAuth), logout, dan mengakses rute yang terproteksi.

| Hari | Tugas | Checklist |
| :--- | :--- | :--- |
| **Hari 6** | **Instalasi & Konfigurasi Auth.js** | ☐ Install `next-auth` dan `drizzle-adapter`. <br> ☐ Buat file konfigurasi `lib/auth.ts` dengan DrizzleAdapter. |
| **Hari 7** | **Halaman & Form Pendaftaran** | ☐ Buat rute `/register` dengan `page.tsx`. <br> ☐ Rancang form pendaftaran menggunakan komponen Shadcn/UI. |
| **Hari 8** | **Server Action: Pendaftaran** | ☐ Buat Server Action untuk menangani pendaftaran. <br> ☐ Implementasikan hashing password (gunakan `bcrypt`). <br> ☐ Tambahkan logika untuk menyimpan user baru ke DB via Drizzle. |
| **Hari 9**| **Halaman Login & Kredensial** | ☐ Buat rute `/login` dengan `page.tsx`. <br> ☐ Rancang form login (email/password). <br> ☐ Implementasikan `CredentialsProvider` di `lib/auth.ts`. |
| **Hari 10**| **Flow Login & Logout** | ☐ Hubungkan form login ke `signIn`. <br> ☐ Buat komponen di header yang menampilkan status login/logout. <br> ☐ Implementasikan fungsi `signOut`. <br> ☐ **Review Mingguan:** Pastikan alur daftar-login-logout via kredensial berfungsi. |
| **Hari 11**| **Implementasi OAuth (Google)** | ☐ Buat kredensial OAuth di Google Cloud Console. <br> ☐ Tambahkan `GoogleProvider` di `lib/auth.ts`. <br> ☐ Tambahkan tombol "Login with Google" di halaman login. |
| **Hari 12**| **Implementasi OAuth (GitHub)** | ☐ Buat aplikasi OAuth di GitHub. <br> ☐ Tambahkan `GitHubProvider` di `lib/auth.ts`. <br> ☐ Tambahkan tombol "Login with GitHub". <br> ☐ Uji coba kedua provider OAuth. |
| **Hari 13**| **Proteksi Rute (Middleware)** | ☐ Buat file `middleware.ts` di root `src`. <br> ☐ Konfigurasi middleware untuk melindungi rute `/dashboard`. <br> ☐ Uji coba akses rute terproteksi saat login dan logout. |
| **Hari 14**| **Validasi & Error Handling** | ☐ Install Zod. <br> ☐ Tambahkan validasi Zod di Server Action pendaftaran. <br> ☐ Tampilkan pesan error yang jelas di UI form jika validasi gagal. |
| **Hari 15**| **Refactoring & Sprint Review** | ☐ Rapikan kode autentikasi. <br> ☐ Lakukan pengujian menyeluruh untuk semua skenario auth. <br> ☐ **Review Sprint 1:** Presentasikan fungsionalitas autentikasi yang sudah selesai. |

---

### **Sprint 2: Manajemen Tugas (CRUD) (2 Minggu)**

**Tujuan Sprint:** Pengguna yang sudah login dapat membuat, melihat, memperbarui, dan menghapus tugas milik mereka sendiri.

| Hari | Tugas | Checklist |
| :--- | :--- | :--- |
| **Hari 16**| **Skema & Migrasi Tabel `todos`** | ☐ Tambahkan skema `todos` di `lib/db/schema.ts`, termasuk relasi dengan `users`. <br> ☐ Jalankan `generate` dan `push` untuk memperbarui database. |
| **Hari 17**| **Halaman Dashboard: Read** | ☐ Bangun UI dasar halaman `/dashboard`. <br> ☐ Buat `page.tsx` sebagai Server Component. <br> ☐ Ambil dan tampilkan daftar todos milik pengguna yang sedang login. |
| **Hari 18**| **Komponen Form & UI Tambah Tugas** | ☐ Buat komponen Klien (`'use client'`) `TodoForm.tsx`. <br> ☐ Tambahkan form input dan tombol submit ke dashboard. |
| **Hari 19**| **Server Action: Create** | ☐ Buat Server Action `createTodo`. <br> ☐ Implementasikan validasi Zod untuk input teks. <br> ☐ Tambahkan logika untuk menyimpan todo baru ke DB (pastikan `userId` disertakan!). |
| **Hari 20**| **Hubungkan Form & Aksi** | ☐ Hubungkan `TodoForm.tsx` ke Server Action `createTodo`. <br> ☐ Gunakan `revalidatePath` agar daftar tugas otomatis ter-refresh. <br> ☐ **Review Mingguan:** Pastikan fungsionalitas Create & Read bekerja. |
| **Hari 21**| **Komponen & UI `TodoItem`** | ☐ Buat komponen Klien `TodoItem.tsx`. <br> ☐ Tampilkan teks todo, checkbox, dan tombol hapus. |
| **Hari 22**| **Server Action: Update** | ☐ Buat Server Action `updateTodoStatus`. <br> ☐ Implementasikan logika untuk mengubah status `completed` di DB. <br> ☐ Hubungkan checkbox di `TodoItem` ke Server Action ini. |
| **Hari 23**| **Server Action: Delete** | ☐ Buat Server Action `deleteTodo`. <br> ☐ Implementasikan logika untuk menghapus todo dari DB. <br> ☐ Hubungkan tombol hapus di `TodoItem` ke Server Action ini. |
| **Hari 24**| **Optimistic UI** | ☐ Implementasikan hook `useOptimistic` pada daftar todo. <br> ☐ Buat UI terasa instan saat menambah, mengubah, atau menghapus todo. |
| **Hari 25**| **Refactoring & Sprint Review** | ☐ Rapikan semua kode terkait CRUD. <br> ☐ Uji semua skenario (termasuk kasus edge seperti teks kosong). <br> ☐ **Review Sprint 2:** Presentasikan fungsionalitas CRUD todolist yang sudah lengkap. |

---

### **Sprint 3: Polish, Pengujian & Deployment (1 Minggu)**

**Tujuan Sprint:** Memastikan aplikasi siap produksi: responsif, bebas bug, handle error dengan baik, dan berhasil di-deploy.

| Hari | Tugas | Checklist |
| :--- | :--- | :--- |
| **Hari 26**| **Desain Responsif** | ☐ Uji dan perbaiki layout di berbagai ukuran layar (mobile, tablet, desktop). <br> ☐ Pastikan semua elemen interaktif mudah digunakan di perangkat sentuh. |
| **Hari 27**| **UI Feedback (Loading & Error)** | ☐ Tambahkan state loading (misal: spinner, tombol disabled) pada semua Server Actions. <br> ☐ Tampilkan notifikasi (toast) untuk pesan sukses atau error global. |
| **Hari 28**| **Pengujian End-to-End** | ☐ Lakukan pengujian manual untuk seluruh alur pengguna (Daftar -> Login -> CRUD -> Logout). <br> ☐ Uji di berbagai browser (Chrome, Firefox, Safari). |
| **Hari 29**| **Persiapan Produksi** | ☐ Finalisasi semua environment variables di Vercel Production. <br> ☐ Lakukan audit kecil pada kode untuk menghapus `console.log` yang tidak perlu. |
| **Hari 30**| **Deployment & Smoke Testing** | ☐ Deploy branch `main` ke domain produksi. <br> ☐ Lakukan smoke testing (pengujian cepat) di lingkungan produksi untuk memastikan fungsi utama berjalan. <br> ☐ **Project Go-Live!** 🎉 |