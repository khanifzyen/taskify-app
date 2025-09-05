### **Software Design Document (SDD): Aplikasi Todolist "Taskify" v1.0**

| **Versi** | **Tanggal** | **Penulis** | **Status** |
| :--- | :--- | :--- | :--- |
| 1.0 | 5 September 2025 | Akhmad Khanif Zyen | Final |

---

### **1. Pendahuluan**

#### **1.1. Tujuan**
Dokumen ini menyediakan desain teknis terperinci untuk implementasi aplikasi web "Taskify" v1.0. Tujuannya adalah untuk memandu tim pengembangan dalam membangun perangkat lunak yang memenuhi semua persyaratan yang tercantum dalam Software Requirements Specification (SRS) v1.0.

#### **1.2. Ruang Lingkup**
Desain ini mencakup arsitektur sistem, desain database, dekomposisi komponen, antarmuka internal (Server Actions), strategi keamanan, dan rencana deployment. Desain ini secara spesifik menargetkan stack teknologi: Next.js 15, React 19, Auth.js, Drizzle ORM, PostgreSQL, dan Shadcn/UI.

#### **1.3. Referensi**
*   Product Requirements Document: Aplikasi Todolist "Taskify" v1.0
*   Software Requirements Specification: Aplikasi Todolist "Taskify" v1.0

---

### **2. Tinjauan Sistem**

Taskify akan dibangun sebagai aplikasi web full-stack monolitik menggunakan Next.js App Router. Pendekatan ini dipilih untuk memaksimalkan kohesi antara frontend dan backend, menyederhanakan proses pengembangan, dan memanfaatkan fitur-fitur modern seperti Server Components dan Server Actions.

Logika backend tidak akan diekspos melalui API REST tradisional, melainkan melalui Server Actions yang dipanggil langsung dari komponen frontend. Ini menciptakan arsitektur yang sangat terintegrasi dan type-safe dari ujung ke ujung.

#### **Diagram Arsitektur Tingkat Tinggi**
```
                                        +-----------------------+
                                        |      Browser (UI)     |
                                        | (React, Shadcn/UI)    |
                                        +-----------+-----------+
                                                    |
         (HTTPS / RPC Call, handled by Next.js)     |
                                                    |
+-------------------------------------v-------------------------------------+
|                                                                           |
|                        Next.js 15 Application Server (on Vercel)          |
|                                                                           |
|  +---------------------+   +-------------------+   +--------------------+ |
|  |  React Server       |   |  Server Actions   |   |  Auth.js Module    | |
|  |  Components (RSC)   |   | (create, update,  |   | (Middleware, Session| |
|  |  (Data Fetching)    |   |  delete logic)    |   |  Management)       | |
|  +---------------------+   +---------+---------+   +----------+---------+ |
|                                      |                        |           |
|  (Data Validation w/ Zod)            |                        |           |
|                                      |                        |           |
|  +-----------------------------------v------------------------v---------+ |
|  |                        Data Access Layer (Drizzle ORM)                | |
|  +----------------------------------------------------------------------+ |
|                                                                           |
+-------------------------------------+-------------------------------------+
                                      |
              (SQL over TCP/IP)       |
                                      |
                               +------v------+
                               | PostgreSQL  |
                               |  Database   |
                               +-------------+
```

---

### **3. Desain Arsitektur**

#### **3.1. Struktur Folder Proyek**
Struktur folder akan mengikuti konvensi Next.js App Router untuk memastikan organisasi kode yang baik.

```
/src
├── app/                  # Rute aplikasi (UI)
│   ├── (auth)/           # Grup rute untuk autentikasi
│   │   ├── login/
│   │   └── register/
│   ├── (main)/           # Grup rute utama yang terproteksi
│   │   ├── dashboard/
│   │   │   ├── page.tsx      # Halaman utama todolist (Server Component)
│   │   │   └── loading.tsx   # UI Loading
│   │   └── layout.tsx
│   ├── layout.tsx        # Root Layout
│   └── page.tsx          # Landing Page
├── components/
│   ├── ui/               # Komponen dari Shadcn
│   └── shared/           # Komponen kustom (e.g., TodoList.tsx, TodoForm.tsx)
├── lib/
│   ├── db/
│   │   ├── index.ts      # Inisialisasi client Drizzle
│   │   └── schema.ts     # Skema database Drizzle
│   ├── actions.ts        # Server Actions untuk semua mutasi data
│   ├── auth.ts           # Konfigurasi Auth.js
│   └── validators.ts     # Skema validasi Zod
├── middleware.ts         # Middleware Next.js untuk proteksi rute
└── drizzle.config.ts     # Konfigurasi Drizzle Kit
```

#### **3.2. Desain Alur Data (Data Flow)**

**Alur 1: Menampilkan Daftar Tugas (Read Operation)**
1.  Pengguna mengakses `/dashboard`.
2.  Next.js `middleware.ts` memeriksa sesi Auth.js. Jika tidak valid, redirect ke `/login`.
3.  Server Component `page.tsx` di `/dashboard` dieksekusi di server.
4.  Di dalam `page.tsx`, fungsi `getTodos()` (dari `lib/actions.ts`) dipanggil.
5.  `getTodos()` mengambil sesi pengguna saat ini, lalu menggunakan Drizzle untuk query `db.query.todos.findMany({ where: eq(todos.userId, session.user.id) })`.
6.  Data tugas yang sudah difilter dikembalikan ke Server Component.
7.  Next.js me-render HTML di server dan mengirimkannya ke klien.

**Alur 2: Menambahkan Tugas Baru (Create Operation)**
1.  Pengguna mengetik di `TodoForm.tsx` (sebuah Client Component).
2.  Pengguna menekan tombol "Submit".
3.  Atribut `action` pada `<form>` memanggil Server Action `createTodo(formData)`.
4.  Di server, `createTodo` melakukan:
    a. Memeriksa sesi pengguna (Auth.js). Gagal jika tidak ada.
    b. Memvalidasi `formData` menggunakan skema Zod. Gagal jika tidak valid.
    c. Menggunakan Drizzle untuk `db.insert(todos).values(...)` dengan `text` dan `userId`.
    d. Memanggil `revalidatePath('/dashboard')` untuk memberitahu Next.js agar me-refresh data di halaman tersebut.
5.  Next.js secara otomatis menjalankan kembali query di Server Component `page.tsx` dan mengirimkan UI yang sudah diperbarui ke klien.

---

### **4. Desain Database**

#### **4.1. Pemilihan Sistem Database**
**PostgreSQL** dipilih karena keandalannya, fitur set yang kaya (termasuk dukungan JSONB dan Full-Text Search untuk masa depan), dan ekosistem yang matang.

#### **4.2. Pemilihan ORM**
**Drizzle ORM** dipilih karena performanya yang tinggi (mendekati performa raw SQL), type-safety yang superior, dan sintaks yang mirip SQL, yang membuatnya intuitif bagi developer.

#### **4.3. Entity-Relationship Diagram (ERD)**
```
+-------------+       +---------------+       +-------------+
|    users    |       |   accounts    |       |    todos    |
+-------------+       +---------------+       +-------------+
| id (PK)     |-------| userId (FK)   |       | id (PK)     |
| name        |       | provider      |     .---| userId (FK) |
| email       |       | ...           |     | +-------------+
| ...         |       +---------------+     |
+-------------+                             |
      |                                     |
      '-------------------------------------'
    (1 to Many)                           (1 to Many)
```

#### **4.4. Skema Database Lengkap (Drizzle ORM)**
File ini akan berlokasi di `/lib/db/schema.ts`.

```typescript
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccount } from '@auth/core/adapters';

// ===================================
// 1. TABEL UNTUK AUTENTIKASI (AUTH.JS)
// ===================================

export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

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

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

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


// ===================================
// 2. TABEL UNTUK LOGIKA APLIKASI
// ===================================

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }), // Kunci isolasi data
  text: varchar('text', { length: 256 }).notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});


// ===================================
// 3. RELASI ANTAR TABEL UNTUK DRIZZLE
// ===================================

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
  accounts: many(accounts),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}));
```

---

### **5. Desain Komponen Rinci**

#### **5.1. Komponen Frontend (`/components/shared/`)**
*   `TodoForm.tsx`: Komponen Klien (`'use client'`). Berisi elemen `<form>` yang `action`-nya diikat ke Server Action `createTodo`. Menggunakan hook `useActionState` dari React 19 untuk menangani state pending dan error.
*   `TodoList.tsx`: Komponen Klien. Menerima daftar todos sebagai props. Bertanggung jawab untuk me-render `TodoItem` dan mengelola state UI sementara (misalnya, menggunakan `useOptimistic` untuk update instan).
*   `TodoItem.tsx`: Komponen Klien. Menampilkan teks satu todo dan sebuah checkbox. Checkbox akan memicu Server Action `updateTodoStatus`. Tombol hapus akan memicu `deleteTodo`.

#### **5.2. Logika Backend (`/lib/actions.ts`)**
Semua fungsi dalam file ini akan ditandai dengan direktif `'use server'`.
*   `async function getTodos(): Promise<Todo[]>`: Mengambil semua todo milik pengguna yang sedang login.
*   `async function createTodo(formData: FormData): Promise<{ error?: string }>`: Membuat todo baru.
*   `async function updateTodoStatus(todoId: number, completed: boolean): Promise<void>`: Mengubah status `completed` sebuah todo.
*   `async function deleteTodo(todoId: number): Promise<void>`: Menghapus sebuah todo.

#### **5.3. Modul Autentikasi (`/lib/auth.ts` dan `middleware.ts`)**
*   `auth.ts`: Mengkonfigurasi Auth.js.
    *   **Adapter:** `DrizzleAdapter(db)`.
    *   **Providers:** `Credentials({...})`, `Google`, `GitHub`.
    *   **Callbacks:** Mengatur callback `session` untuk menyertakan `userId` dalam objek sesi.
*   `middleware.ts`: Mengekspor `auth` dari `auth.ts`. Ini akan melindungi semua rute yang cocok dengan `matcher` (misalnya, `'/dashboard/:path*'`) dari akses yang tidak terautentikasi.

---

### **6. Desain Keamanan**

*   **Otorisasi (Isolasi Data):** Ini adalah aspek keamanan paling kritis. **Setiap Server Action yang berinteraksi dengan tabel `todos` HARUS dan WAJIB** pertama-tama mengambil `session.user.id` dan menambahkannya sebagai klausa `where` pada query Drizzle. Kegagalan melakukan ini akan menyebabkan kebocoran data antar pengguna.
*   **Validasi Input:** Semua input dari klien yang diterima oleh Server Actions (misalnya, `formData`) HARUS divalidasi menggunakan Zod di sisi server sebelum diproses lebih lanjut untuk mencegah data yang tidak valid dan potensi serangan (misalnya, injeksi).
*   **CSRF (Cross-Site Request Forgery):** Server Actions di Next.js memiliki perlindungan CSRF bawaan, sehingga tidak diperlukan implementasi manual.
*   **Manajemen Rahasia (Secrets):** `DATABASE_URL`, `AUTH_SECRET`, dan kunci API OAuth HARUS disimpan sebagai environment variables dan tidak boleh di-commit ke dalam repositori Git.

---

### **7. Strategi Deployment**

*   **Platform Hosting:** Vercel akan digunakan untuk hosting aplikasi Next.js.
*   **Platform Database:** Vercel Postgres, Neon, atau Supabase akan digunakan untuk hosting database PostgreSQL.
*   **Proses CI/CD:**
    1.  Developer melakukan `git push` ke branch `main` di GitHub.
    2.  Webhook Vercel secara otomatis memicu proses build baru.
    3.  Selama fase build, Vercel akan meng-install dependensi dan membuat build produksi dari aplikasi.
    4.  Skrip migrasi database (`npx drizzle-kit push:pg` atau skrip migrasi kustom) akan dijalankan sebagai bagian dari pipeline build (opsional, untuk produksi disarankan migrasi manual).
    5.  Setelah build berhasil, Vercel secara otomatis men-deploy versi baru dan mengalihkannya menjadi produksi.
*   **Environment Variables:** Konfigurasi untuk lingkungan Development, Preview, dan Production akan dikelola melalui dashboard Vercel.