### **Dokumentasi Teknis: Sprint 0, Hari 3**

*   **Tanggal:** 5 September 2025
*   **Sprint:** 0 - Persiapan & Fondasi
*   **Fokus Hari Ini:** Penyediaan (provisioning) database PostgreSQL, instalasi Drizzle ORM, dan konfigurasi koneksi antara aplikasi Next.js dengan database.

---

### **Tujuan**

Membangun lapisan data (data layer) untuk aplikasi. Di akhir hari ini, kita akan memiliki:
1.  Sebuah instance database PostgreSQL yang aktif dan berjalan di cloud.
2.  Koneksi yang aman dan terkonfigurasi dari aplikasi Next.js ke database.
3.  Drizzle ORM dan Drizzle Kit terinstal dan siap digunakan untuk manajemen skema dan query.
4.  File-file konfigurasi yang diperlukan (`drizzle.config.ts` dan koneksi client) sudah dibuat.

---

### **Langkah-langkah Pengerjaan (Step-by-Step)**

#### **Langkah 1: Persiapan dan Sinkronisasi Kode**

Mulai hari dengan memastikan kode lokal Anda adalah yang terbaru.
1.  **Buka Terminal:** Navigasikan ke direktori proyek `taskify`.
2.  **Pull Perubahan Terbaru:**
    ```bash
    git pull origin main
    ```

#### **Langkah 2: Provisioning Database PostgreSQL**

Kita akan membuat database di cloud. Vercel Postgres adalah pilihan yang sangat baik karena terintegrasi langsung dengan Vercel, platform hosting kita nanti.

1.  **Buka Dashboard Vercel:** Login ke akun Vercel Anda.
2.  **Navigasi ke Tab Storage:** Di dalam dashboard proyek `taskify` Anda di Vercel, cari dan klik tab "Storage".
3.  **Buat Database Postgres Baru:**
    *   Klik tombol "Create Database" dan pilih "Postgres".
    *   Ikuti instruksi di layar. Biasanya Anda hanya perlu memilih region dan menyetujui.
    *   Setelah database dibuat, Vercel akan menampilkan beberapa connection string. **Penting:** Vercel menawarkan fitur untuk "Connect Project". Lakukan ini.
4.  **Hubungkan Proyek dan Ambil Environment Variables:**
    *   Saat Vercel menghubungkan database ke proyek, ia akan secara otomatis menambahkan environment variables (`POSTGRES_URL`, `POSTGRES_PRISMA_URL`, dll.) ke pengaturan proyek Anda.
    *   Untuk pengembangan lokal, klik tombol ".env.local" di dashboard database Vercel. Ini akan menampilkan isi file yang bisa Anda unduh atau salin.
    *   **Salin** konten tersebut dan **buat file baru** bernama `.env.local` di root direktori proyek `taskify` Anda, lalu tempel kontennya di sana.
    *   Isi file `.env.local` Anda akan terlihat seperti ini:
        ```env
        POSTGRES_URL="postgres://default:xxxxxxxx@xxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
        # ... variabel lainnya
        ```
    *   Kita hanya membutuhkan `POSTGRES_URL`. Untuk konsistensi dengan panduan Drizzle, kita akan menamainya `DATABASE_URL`. Tambahkan baris baru atau ganti nama variabel yang ada menjadi:
        ```env
        DATABASE_URL="postgres://default:xxxxxxxx@xxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
        ```

**Alternatif (jika menggunakan Supabase/Neon):** Jika Anda menggunakan penyedia lain, cukup salin *Connection String* yang mereka berikan dan tempel ke dalam file `.env.local` Anda dengan key `DATABASE_URL`.

#### **Langkah 3: Mengamankan Environment Variables**

File `.env.local` berisi rahasia (kredensial database). **File ini tidak boleh di-commit ke Git.**
1.  **Verifikasi `.gitignore`:** Buka file `.gitignore` di root proyek Anda. `create-next-app` secara default sudah menyertakan baris-baris berikut, yang sangat penting:
    ```gitignore
    # local env files
    .env*.local
    ```
    Ini memastikan file `.env.local` Anda tidak akan pernah terkirim ke repositori GitHub.

#### **Langkah 4: Instalasi Drizzle ORM dan Dependensinya**

Sekarang kita akan menginstal semua paket yang dibutuhkan untuk berinteraksi dengan database.
1.  **Install Dependensi Utama:** Buka terminal dan jalankan perintah berikut untuk menginstal library Drizzle dan driver Node.js untuk Postgres (`pg`).
    ```bash
    pnpm add drizzle-orm pg
    ```
2.  **Install Dependensi Pengembangan:** Kita juga butuh `drizzle-kit` untuk mengelola migrasi skema dan `dotenv` untuk membantu `drizzle-kit` membaca file `.env.local`. Ini adalah dependensi pengembangan (`-D`).
    ```bash
    pnpm add -D drizzle-kit dotenv
    ```

#### **Langkah 5: Konfigurasi Drizzle Kit**

`drizzle-kit` memerlukan file konfigurasi untuk mengetahui di mana skema Anda berada dan bagaimana cara terhubung ke database.
1.  **Buat File Konfigurasi:** Buat file baru di root proyek Anda bernama `drizzle.config.ts`.
2.  **Isi File Konfigurasi:** Salin dan tempel kode berikut ke dalam `drizzle.config.ts`.
    ```typescript
    // File: drizzle.config.ts (Versi yang sudah diperbaiki)

    import type { Config } from 'drizzle-kit';
    import * as dotenv from 'dotenv';

    dotenv.config({ path: '.env.local' });

    if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env.local');
    }

    export default {
    schema: './src/lib/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql', // <-- INI YANG DITAMBAHKAN DAN PENTING
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    } satisfies Config;
    ```
    *   **Penjelasan:** File ini memberitahu Drizzle Kit untuk mencari skema di `src/lib/db/schema.ts` (yang akan kita buat besok) dan menggunakan `DATABASE_URL` dari environment variables untuk terhubung ke Postgres.

#### **Langkah 6: Membuat Database Client untuk Aplikasi**

Ini adalah "pintu masuk" utama aplikasi Anda ke database. Semua query akan melalui client ini.
1.  **Buat Folder dan File:** Buat struktur folder dan file berikut: `src/lib/db/index.ts`.
2.  **Isi File Client:** Salin dan tempel kode berikut ke dalam `src/lib/db/index.ts`.
    ```typescript
    import { drizzle } from 'drizzle-orm/postgres-js';
    import postgres from 'postgres';
    
    // Perbaikan: Instal 'postgres' library sebagai pengganti 'pg' untuk client
    // Jalankan: pnpm add postgres
    
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }

    // Untuk query client
    const client = postgres(connectionString);
    export const db = drizzle(client);
    ```
    **Catatan Penting:** Dokumentasi Drizzle merekomendasikan `postgres` (library dari `porsager`) untuk client aplikasi karena lebih modern dan efisien dibandingkan `pg`. Mari kita install:
    ```bash
    pnpm add postgres
    ```
    Sedangkan `pg` tetap dibutuhkan oleh `drizzle-kit`. Jadi, kita memiliki keduanya untuk tujuan yang berbeda.

#### **Langkah 7: Verifikasi Koneksi**

Meskipun kita belum punya skema, kita bisa menguji apakah Drizzle Kit dapat terhubung ke database.
1.  **Jalankan Perintah Check:** Di terminal, jalankan perintah berikut:
    ```bash
    pnpm drizzle-kit check
    ```
2.  **Analisis Output:** Jika semuanya terkonfigurasi dengan benar, Anda akan melihat pesan sukses seperti `✓ No schema changes found`. Ini membuktikan bahwa:
    *   File `.env.local` Anda terbaca.
    *   `DATABASE_URL` Anda valid.
    *   Drizzle Kit berhasil membuat koneksi ke database Vercel Postgres Anda.
    Jika ada error, biasanya terkait dengan `DATABASE_URL` yang salah atau masalah jaringan.

---

### **Akhir Hari: Finalisasi dan Commit**

Kita telah berhasil menyiapkan seluruh fondasi untuk lapisan data. Saatnya menyimpan progres ini.

#### **Langkah 8: Final Git Commit dan Push**

1.  **Stage Semua Perubahan:**
    ```bash
    git add .
    ```

2.  **Buat Commit Komprehensif:**
    ```bash
    git commit -m "feat(db): set up PostgreSQL database and Drizzle ORM

    - Provisioned a new PostgreSQL database using Vercel Postgres.
    - Configured the database connection string in `.env.local`.
    - Installed Drizzle ORM, Drizzle Kit, and the necessary Postgres drivers.
    - Created the Drizzle Kit configuration file (`drizzle.config.ts`).
    - Implemented the main database client instance for the application.
    - Verified the database connection successfully using `drizzle-kit check:pg`.
    - The data layer is now ready for schema definition and migrations."
    ```

3.  **Push ke Remote:**
    ```bash
    git push origin main
    ```

#### **Checklist Akhir Hari**
- [x] Database PostgreSQL telah dibuat di Vercel.
- [x] Connection string telah disimpan dengan aman di `.env.local`.
- [x] File `.gitignore` sudah diverifikasi untuk mengabaikan file `.env.local`.