# Kantin Kejujuran

Web project prasyarat seleksi Software Engineering Academy Compfest 2022.

## Arsitektur

#### Main Framework
- Next.js 

Next.js digunakan sebagai framework utama aplikasi web ini, mulai dari API hingga frontend.

#### Databases
- Prisma (sebagai ORM)
- MySQL database dari PlanetScale
- Cloudinary (menyimpan gambar)

#### Authentication
- NextAuth.js (mengelola session)
- bcryptjs (hashing password)

#### Styling
- Tailwindcss
- Mantine
- Tabler Icons React (Icons)

#### Deployment
- Vercel

## Fitur
- **Panel Siswa**

  Panel siswa adalah dashboard bagi siswa yang telah terdaftar untuk menambahkan produk yang ingin dijual, melihat riwayat penjualan dan pembelian, mengecek informasi saldo (baik kantin maupun siswa), serta melakukan penarikan pendapatan hasil penjualan dari saldo kantin.
  
- **Keranjang Belanja**

  Seperti namanya, keranjang belanja digunakan sebagai wadah menampung produk-produk yang ingin dibeli siswa terkait sebelum melakukan pembayaran.
  
- **Pencarian dan Pengurutan Produk**

  Terdapat fitur pencarian (judul dan deskripsi produk) serta pengurutan berdasarkan waktu (terbaru dan terlama) dan berdasarkan abjad (A-Z dan Z-A).
  
- **Autentikasi**

  Siswa yang ingin melakukan penjualan maupun pembelian produk, tetapi belum terdaftar dapat mendaftar terlebih dahulu dengan menggunakan menu `registrasi`, serta bagi siswa yang sudah pernah mendaftar dapat langsung masuk ke dalam sistem dengan menu `masuk` yang tersedia. Siswa lain maupun orang lain yang belum terdaftar hanya dapat **melihat** produk yang dijual di Kantin Kejujuran.

## List Siswa Telah Terdaftar
| ID | Nama | Password |
| -- | -- | -- |
| 00101 | user1 | pass_user1 |
| 00202 | user2 | pass_user2 |
| 00303 | user3 | pass_user3 |

## Local Setup

1. Clone repositori ini
2. Lakukan instalasi package dengan `npm i` atau `yarn`
3. Tambahkan file `.env` dan `.env.local` pada root direktori.
4. Pada file `.env` tambahkan,
   ```text
   DATABASE_URL=file./dev.db
   ```
5. Pada file `prisma/schema.prisma` ubah bagian,
   ```
   ...
   generator client {
     provider        = "prisma-client-js"
     binaryTargets   = "native"
   }

   datasource db {
     provider        = "sqlite"
     url             = env("DATABASE_URL")
   }
   ...
   ```
6. Lalu pada terminal jalankan,
   ```bash
   npx prisma db push
   npx prisma generate
   npx prisma studio
   ```
7. Tambahkan satu item pada tabel canteen melalui prisma studio yang terbuka di browser.
8. Pada file `.env.local` tambahkan,
   ```text
   NEXTAUTH_URL=http://localhost:3000/api/auth
   NEXTAUTH_SECRET=<Dapat menggunakan UUID>
   BASE_URL=http://localhost:3000
   CANTEEN_ID=<Id pada tabel canteen, baris pertama di prisma studio>
   NEXT_PUBLIC_CLOUDINARY_URL=<Diperoleh dengan mendaftar akun Cloudinary, dengan format https://api.cloudinary.com/v1_1/<cloud_name>/upload>
   ```
9. Pada file `components/DropzoneImage.tsx` ubah,
   ```ts
   const handleUploadImage = async (files: File[]) => {
      ...
      formData.append("upload_preset", <cloudinary_upload_preset_mode_unsigned>);
      ...
    };
   ```

## Tautan website

[https://kantin-kejujuran.vercel.app](https://kantin-kejujuran.vercel.app)
