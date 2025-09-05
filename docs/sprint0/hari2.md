### **Dokumentasi Teknis: Sprint 0, Hari 2 (Revisi)**

*   **Tanggal:** [Isi Tanggal]
*   **Sprint:** 0 - Persiapan & Fondasi
*   **Fokus Hari Ini:** Integrasi UI library (Shadcn), penataan layout dasar aplikasi, dan penambahan komponen UI pertama.

---

### **Tujuan**

Membangun fondasi visual dan struktur antarmuka pengguna (UI) yang akan digunakan di seluruh aplikasi. Di akhir hari ini, kita akan memiliki:
1.  Shadcn/UI terintegrasi penuh ke dalam proyek menggunakan CLI yang benar.
2.  File `globals.css` yang dikonfigurasi untuk tema dasar.
3.  Struktur layout root (`src/app/layout.tsx`) yang mencakup komponen dasar seperti Header dan Footer.
4.  Beberapa komponen UI dari Shadcn/UI (seperti `Button`, `Input`) yang sudah terinstal dan siap digunakan.

---

### **Langkah-langkah Pengerjaan (Step-by-Step)**

#### **Langkah 1: Persiapan dan Sinkronisasi Kode**

Sebelum memulai pekerjaan baru, pastikan workspace Anda sinkron dengan repositori remote.
1.  **Buka Terminal:** Navigasikan ke direktori proyek `taskify`.
2.  **Pull Perubahan Terbaru:**
    ```bash
    git pull origin main
    ```

#### **Langkah 2: Inisialisasi Shadcn**

Kita akan mengintegrasikan Shadcn/UI ke dalam proyek menggunakan CLI resminya yang terbaru.

1.  **Jalankan Perintah Inisialisasi:** Di terminal, jalankan perintah berikut.
    ```bash
    # KOREKSI: Menggunakan 'shadcn' bukan 'shadcn-ui'
    pnpm dlx shadcn@latest init
    ```
    *Jika menggunakan npm: `npx shadcn@latest init`*

2.  **Jawab Pertanyaan Konfigurasi:** CLI akan menanyakan beberapa hal untuk mengkonfigurasi `components.json`. Gunakan jawaban ini sebagai acuan:

    ```
    Would you like to use TypeScript (recommended)? yes
    Which style would you like to use? › Default
    Which color would you like to use as base color? › Slate
    Where is your global CSS file? › src/app/globals.css
    Do you want to use CSS variables for colors? › yes
    Where is your tailwind.config.js file? › tailwind.config.ts
    Configure import alias for components: › @/components
    Configure import alias for utils: › @/lib/utils
    Are you using React Server Components? › yes
    Write configuration to components.json. Proceed? › yes
    ```

3.  **Verifikasi Instalasi:** Setelah selesai, periksa perubahan berikut di proyek Anda:
    *   File baru `components.json` di root proyek.
    *   Folder baru `src/lib/utils.ts`.
    *   File `tailwind.config.ts` dan `src/app/globals.css` akan dimodifikasi dengan variabel dan styling dari Shadcn/UI.

#### **Langkah 3: Menambahkan Komponen UI Pertama**

Kita akan menambahkan beberapa komponen yang pasti akan kita butuhkan nanti: `Button`, `Input`, dan `Card`.
1.  **Gunakan Shadcn CLI:** Jalankan perintah berikut di terminal untuk menambahkan komponen tersebut. Skrip ini akan membuat file komponen di `src/components/ui/`.
    ```bash
    pnpm dlx shadcn@latest add button input card
    ```

2.  **Periksa File Baru:** Buka folder `src/components/ui/` dan Anda akan melihat `button.tsx`, `input.tsx`, dan `card.tsx`.

#### **Langkah 4: Membangun Struktur Layout Dasar**

Sekarang kita akan membuat layout konsisten yang akan membungkus semua halaman di aplikasi kita.
1.  **Buat Komponen Header:** Buat file baru di `src/components/shared/Header.tsx`.
    *   Isi file `src/components/shared/Header.tsx` dengan kode berikut:
        ```tsx
        import Link from 'next/link';
        import { Button } from '@/components/ui/button';

        export function Header() {
          return (
            <header className="border-b">
              <div className="container mx-auto flex h-16 items-center justify-between">
                <Link href="/" className="text-2xl font-bold">
                  Taskify
                </Link>
                <nav>
                  <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </nav>
              </div>
            </header>
          );
        }
        ```

2.  **Buat Komponen Footer (Sederhana):** Buat file baru di `src/components/shared/Footer.tsx`.
    *   Isi file `src/components/shared/Footer.tsx`:
        ```tsx
        export function Footer() {
          return (
            <footer className="border-t py-4">
              <div className="container mx-auto text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Taskify. All rights reserved.</p>
              </div>
            </footer>
          );
        }
        ```

3.  **Integrasikan ke Root Layout:** Buka file `src/app/layout.tsx` dan modifikasi untuk menyertakan `Header` dan `Footer`.
    *   Ganti isi `layout.tsx` menjadi:
        ```tsx
        import type { Metadata } from 'next';
        import { Inter } from 'next/font/google';
        import './globals.css';
        import { Header } from '@/components/shared/Header';
        import { Footer } from '@/components/shared/Footer';

        const inter = Inter({ subsets: ['latin'] });

        export const metadata: Metadata = {
          title: 'Taskify - Your Simple Todolist App',
          description: 'Organize your tasks efficiently.',
        };

        export default function RootLayout({
          children,
        }: Readonly<{
          children: React.ReactNode;
        }>) {
          return (
            <html lang="en">
              <body className={`${inter.className} flex min-h-screen flex-col`}>
                <Header />
                <main className="flex-grow container mx-auto py-8">
                  {children}
                </main>
                <Footer />
              </body>
            </html>
          );
        }
        ```

#### **Langkah 5: Verifikasi Hasil**
1.  **Jalankan Server Pengembangan:**
    ```bash
    pnpm dev
    ```
2.  **Buka Browser:** Kunjungi `http://localhost:3000`. Hasilnya akan sama seperti sebelumnya: halaman dengan Header, Footer, dan tombol-tombol yang sudah memiliki styling. Namun, sekarang kita yakin bahwa instalasi dilakukan dengan cara yang benar dan didukung.

---

### **Akhir Hari: Finalisasi dan Commit**

Semua pekerjaan setup UI dan layout dasar telah selesai dengan menggunakan toolchain yang benar.

#### **Langkah 6: Final Git Commit dan Push**

1.  **Stage Semua Perubahan:**
    ```bash
    git add .
    ```

2.  **Buat Commit Komprehensif:**
    ```bash
    git commit -m "feat(ui): integrate Shadcn/UI and build basic app layout

    - Initialized Shadcn/UI using the official 'shadcn' CLI.
    - Configured the project with the default style and Slate color theme.
    - Added core UI components: Button, Input, and Card.
    - Created shared Header and Footer components for consistent page structure.
    - Updated the root layout to include the new Header and Footer, establishing a sticky footer layout.
    - The application now has a foundational visual structure and is ready for page and feature development."
    ```

3.  **Push ke Remote:**
    ```bash
    git push origin main
    ```

#### **Checklist Akhir Hari**
- [x] Shadcn/UI berhasil diinisialisasi dan dikonfigurasi menggunakan CLI `shadcn`.
- [x] Komponen UI dasar (`button`, `input`, `card`) telah ditambahkan ke proyek.
- [x] Komponen `Header` dan `Footer` telah dibuat.
- [x] `RootLayout` telah diperbarui untuk menciptakan struktur halaman yang konsisten.
- [x] Perubahan visual terverifikasi berjalan dengan baik di server pengembangan lokal.
- [x] Semua pekerjaan hari ini telah di-commit dan di-push ke remote.