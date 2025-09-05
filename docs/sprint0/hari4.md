Tentu. Berikut adalah panduan pengerjaan yang detail dan komprehensif untuk Sprint 0, Hari 4, melanjutkan pekerjaan pada lapisan data.

---

### **Dokumentasi Teknis: Sprint 0, Hari 4**

*   **Tanggal:** 5 September 2025
*   **Sprint:** 0 - Persiapan & Fondasi
*   **Fokus Hari Ini:** Mendefinisikan skema database awal untuk modul autentikasi (Auth.js) dan menerapkan skema tersebut ke database PostgreSQL yang sudah disiapkan.

---

### **Tujuan**

Memberikan struktur konkret pada database kita agar dapat menyimpan data pengguna. Di akhir hari ini, kita akan memiliki:
1.  File skema Drizzle (`src/lib/db/schema.ts`) yang berisi semua tabel yang dibutuhkan oleh Auth.js.
2.  Skema tersebut berhasil diterapkan (dimigrasikan) ke database PostgreSQL di cloud.
3.  Tabel-tabel (`users`, `accounts`, `sessions`, `verificationTokens`) sudah ada dan dapat dilihat di dashboard database.
4.  Progres kerja tersimpan rapi di repositori Git.

---

### **Langkah-langkah Pengerjaan (Step-by-Step)**

#### **Langkah 1: Persiapan dan Sinkronisasi Kode**

Pastikan Anda memulai dengan basis kode terbaru dari repositori.
1.  **Buka Terminal:** Navigasikan ke direktori proyek `taskify`.
2.  **Pull Perubahan Terbaru:**
    ```bash
    git pull origin main
    ```

#### **Langkah 2: Mendefinisikan Skema Database untuk Auth.js**

Pada hari sebelumnya, kita telah membuat referensi ke file `src/lib/db/schema.ts` di dalam `drizzle.config.ts`. Sekarang saatnya untuk membuat dan mengisi file tersebut.

1.  **Buat File Skema:** Jika belum ada, buat file `schema.ts` di dalam direktori `src/lib/db/`.
2.  **Isi File Skema:** Buka file `src/lib/db/schema.ts` dan tempelkan kode skema di bawah ini. Skema ini adalah standar yang direkomendasikan untuk digunakan dengan `DrizzleAdapter` dari Auth.js.

    ```typescript
    // File: src/lib/db/schema.ts

    import {
      timestamp,
      pgTable,
      text,
      primaryKey,
      integer,
    } from 'drizzle-orm/pg-core';
    import type { AdapterAccount } from '@auth/core/adapters';

    /**
     * Tabel ini menyimpan informasi pengguna yang mendaftar di aplikasi Anda.
     * Informasi dasar seperti nama, email, dan gambar profil.
     */
    export const users = pgTable('user', {
      id: text('id').notNull().primaryKey(),
      name: text('name'),
      email: text('email').notNull().unique(),
      emailVerified: timestamp('emailVerified', { mode: 'date' }),
      image: text('image'),
    });

    /**
     * Tabel ini diperlukan untuk mendukung login melalui penyedia OAuth (Google, GitHub, dll).
     * Setiap baris menghubungkan 'user' dengan akun spesifik di penyedia OAuth.
     */
    export const accounts = pgTable(
      'account',
      {
        userId: text('userId')
          .notNull()
          .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').$type<AdapterAccount['type']>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
      },
      (account) => ({
        compoundKey: primaryKey({
          columns: [account.provider, account.providerAccountId],
        }),
      })
    );

    /**
     * Tabel ini menyimpan sesi login pengguna. Auth.js menggunakan ini
     * untuk memverifikasi siapa yang sedang login.
     */
    export const sessions = pgTable('session', {
      sessionToken: text('sessionToken').notNull().primaryKey(),
      userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
      expires: timestamp('expires', { mode: 'date' }).notNull(),
    });

    /**
     * Tabel ini digunakan untuk fitur "magic link" atau login tanpa password.
     * Menyimpan token verifikasi yang dikirim ke email pengguna.
     */
    export const verificationTokens = pgTable(
      'verificationToken',
      {
        identifier: text('identifier').notNull(),
        token: text('token').notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
      },
      (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
      })
    );
    ```
    *   **Penting:** Perhatikan penggunaan `onDelete: 'cascade'`. Ini adalah aturan database yang kuat: jika seorang pengguna dihapus dari tabel `users`, semua `accounts` dan `sessions` yang terkait dengannya akan otomatis ikut terhapus, menjaga kebersihan data.

#### **Langkah 3: Menerapkan Skema ke Database (Migrasi)**

Sekarang kita akan menggunakan Drizzle Kit untuk "mendorong" skema yang baru kita definisikan ke database PostgreSQL kita.

1.  **Gunakan Perintah `push`:** Perintah `drizzle-kit push` adalah cara cepat untuk menyinkronkan skema Anda dengan database selama masa pengembangan. Ia akan membandingkan skema di file Anda dengan kondisi database dan membuat serta menjalankan SQL yang diperlukan untuk membuatnya cocok.

    Buka terminal dan jalankan:
    ```bash
    pnpm drizzle-kit push
    ```
    *   Karena Anda menggunakan Postgres, Drizzle Kit versi terbaru akan secara implisit menggunakan dialek `postgresql` dari `drizzle.config.ts` Anda.

2.  **Analisis Output:** Jika berhasil, Drizzle Kit akan menampilkan log yang menunjukkan tabel-tabel apa saja yang telah dibuat. Anda seharusnya melihat output yang mengkonfirmasi pembuatan tabel `user`, `account`, `session`, dan `verificationToken`.

    *   **Catatan tentang `push` vs `generate`+`migrate`:**
        *   `push`: Cocok untuk pengembangan cepat. Langsung menyinkronkan. Tidak meninggalkan jejak file migrasi.
        *   `generate` & `migrate`: Alur kerja yang lebih aman untuk produksi. `generate` membuat file SQL migrasi yang bisa Anda periksa, dan `migrate` menjalankannya. Kita akan menggunakan `push` untuk kesederhanaan di Sprint 0.

#### **Langkah 4: Verifikasi di Dashboard Database**

Langkah terakhir dan paling penting adalah memastikan tabel-tabel tersebut benar-benar ada di database Anda.
1.  **Buka Dashboard Vercel Postgres:** Kembali ke dashboard Vercel, navigasi ke tab "Storage", dan pilih database Postgres Anda.
2.  **Buka Data Browser:** Cari opsi untuk menelusuri data (biasanya bernama "Data" atau memiliki ikon tabel).
3.  **Verifikasi Tabel:** Anda sekarang seharusnya melihat empat tabel baru yang telah kita definisikan: `user`, `account`, `session`, dan `verificationToken`. Klik salah satunya untuk melihat strukturnya dan pastikan kolom-kolomnya sesuai dengan yang kita definisikan di `schema.ts`.

---

### **Akhir Hari: Finalisasi dan Commit**

Kita telah berhasil memberikan struktur pada database kita. Ini adalah tonggak penting. Saatnya menyimpan pekerjaan ini dengan aman.

#### **Langkah 5: Final Git Commit dan Push**

1.  **Stage Semua Perubahan:** Perubahan utama akan ada di `src/lib/db/schema.ts`.
    ```bash
    git add .
    ```

2.  **Buat Commit Komprehensif:**
    ```bash
    git commit -m "feat(db): define and migrate initial schema for Auth.js

    - Created the schema definition file at \`src/lib/db/schema.ts\`.
    - Defined the necessary tables for Auth.js DrizzleAdapter: \`users\`, \`accounts\`, \`sessions\`, and \`verificationTokens\`.
    - Used \`drizzle-kit push\` to apply the schema to the remote PostgreSQL database.
    - Verified the successful creation of tables in the database.
    - The database is now structurally ready to handle user authentication data."
    ```

3.  **Push ke Remote:**
    ```bash
    git push origin main
    ```

#### **Checklist Akhir Hari**
- [x] File `src/lib/db/schema.ts` telah dibuat dan diisi dengan skema Auth.js.
- [x] Perintah `drizzle-kit push` berhasil dijalankan tanpa error.
- [x] Tabel-tabel (`user`, `account`, `session`, `verificationToken`) telah diverifikasi keberadaannya di dashboard Vercel Postgres.
- [x] Semua pekerjaan hari ini telah di-commit dan di-push ke repositori remote.