# Reminder Task

Ini adalah monorepo untuk aplikasi Reminder Task, yang dikelola menggunakan `pnpm workspaces`. Proyek ini terdiri dari dua aplikasi utama:

- `apps/api`: Backend API (NestJS + Prisma)
- `apps/web`: Frontend Web (Next.js + React)

## 1. Aplikasi & Teknologi

### `apps/api` (Backend)

Backend API yang dibuat dengan NestJS dan Prisma. API ini menyediakan fungsionalitas untuk manajemen tugas (tasks) dan kategori (categories), yang dilindungi oleh autentikasi JWT (Login/Register).

**Fitur Utama API:**

- Autentikasi Pengguna (Register, Login, Logout) menggunakan JWT.
- CRUD (Create, Read, Update, Delete) untuk **Tasks** (Tugas).
- CRUD (Create, Read, Update, Delete) untuk **Categories** (Kategori).
- Kategori bersifat _custom_ per pengguna dan juga mendukung kategori _Global_ (default).

**Teknologi API:**

- [NestJs](https://docs.nestjs.com/) - Framework API
- [Prisma](https://www.prisma.io/) - ORM (Object-Relational Mapper)
- [SQLite](https://www.sqlite.org/index.html) - Database (via Prisma)
- [JSON Web Token (JWT)](https://jwt.io/) - Autentikasi
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Hashing Password

### `apps/web` (Frontend)

Frontend Web yang dibuat dengan Next.js dan React. Aplikasi ini mengonsumsi data dari `apps/api` untuk menyediakan antarmuka (UI) bagi pengguna.

**Teknologi Web:**

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

## 2. Prasyarat (Prerequisites)

- [Node.js](https://nodejs.org/) (Rekomendasi v20 ke atas)
- [pnpm](https://pnpm.io/installation) (Package Manager)

---

## 3. Instalasi & Setup

Ikuti langkah-langkah ini untuk menjalankan proyek secara lokal.

### Langkah 1: Clone Proyek

```bash
git clone https://github.com/khmalz/reminder-task.git
cd reminder-task
```

### Langkah 2: Instal Dependencies (Penting\!)

Kita akan menginstal dependensi untuk **semua** aplikasi dari **root** proyek.

```bash
# Dijalankan dari folder root
pnpm install
```

Perintah ini akan membaca `pnpm-workspace.yaml` dan menginstal dependensi untuk `api` dan `web` sekaligus.

### Langkah 3: Setup Variabel Lingkungan (.env)

#### A. Untuk `apps/api` (Backend)

Buat file `.env` di dalam folder `apps/api/`. Kamu bisa menyalin dari `apps/api/.env.example` (jika ada) atau buat baru dan isi seperti ini:

**File: `apps/api/.env`**

```bash
# URL Koneksi Database (Prisma). Default menggunakan file SQLite.
# Perhatikan path 'file:./prisma/...' relatif dari root proyek
DATABASE_URL="file:./apps/api/prisma/dev.db"

# Kunci rahasia untuk menandatangani JWT. Ganti dengan string acak yang kuat!
SECRET_JWT="GANTI_DENGAN_RAHASIA_SUPER_AMAN_MILIKMU"

# Port server
PORT=3000
```

### Langkah 4: Setup Database Prisma (Krusial)

Semua perintah `prisma` harus dijalankan dari **root** menggunakan _flag_ `--filter api`. Kita akan menggunakan _script_ yang sudah ada di `apps/api/package.json`.

**A. Jalankan Migrasi Database**

Perintah ini akan membaca `apps/api/prisma/schema.prisma`, membuat file database, membuat semua tabel dan akan otomatis menjalankan seed database.

```bash
# Dijalankan dari root
pnpm --filter api run db:migrate
```

---

## 4. Menjalankan Aplikasi

Kita akan menjalankan kedua aplikasi (API dan Web) secara terpisah, keduanya dari **root**.

### A. Menjalankan `apps/api` (Backend)

Mode ini menggunakan `hmr` dari nestjs untuk otomatis me-restart server setiap kali ada perubahan file.

```bash
# Dijalankan dari root
pnpm --filter api run start:dev
```

Server API akan berjalan di `http://localhost:3000` (atau port yang ditentukan di `.env`).

### B. Menjalankan `apps/web` (Frontend)

Mode ini akan menjalankan server development Next.js.

```bash
# Dijalankan dari root
pnpm --filter web run dev
```

Server Next.js akan berjalan di `http://localhost:3001`.

_(Catatan: Jika port 3000 sudah dipakai oleh API, Next.js biasanya akan otomatis berjalan di port 3001)._

---

## 5. Menggunakan API

Contoh _request_ API dapat ditemukan di file-file berikut di dalam `apps/api/`:

- `apps/api/auth.http`
- `apps/api/category.http`
- `apps/api/task.http`
