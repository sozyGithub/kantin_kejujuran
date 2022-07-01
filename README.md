# Kantin Kejujuran

Web project prasyarat seleksi Academy Software Engineering Compfest 2022.

## Arsitektur

#### Main Framework
- Next.js 

Next.js digunakan sebagai framework utama aplikasi web ini, mulai dari API hingga frontend.

#### Databases
- Prisma (sebagai ORM)
- MySQL database dari PlanetScale

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
  Panel siswa adalah dashboard bagi siswa yang telah teregistrasi untuk menambahkan produk yang ingin dijual, melihat riwayat penjualan dan pembelian, mengecek informasi saldo (baik kantin maupun siswa), serta melakukan penarikan pendapatan hasil penjualan dari saldo kantin.
- **Keranjang Belanja**
  Seperti namanya, keranjang belanja digunakan sebagai wadah menampung produk-produk yang ingin dibeli siswa terkait sebelum melakukan pembayaran.
- **Pencarian dan Pengurutan Produk**
  Terdapat fitur pencarian (judul dan deskripsi produk) serta pengurutan berdasarkan waktu (terbaru dan terlama) dan berdasarkan abjad (A-Z dan Z-A).
- **Autentikasi**
  Siswa yang ingin melakukan penjualan maupun pembelian produk, tetapi belum terdaftar dapat mendaftar terlebih dahulu dengan menggunakan menu `registrasi`, serta bagi siswa yang sudah pernah mendaftar dapat langsung masuk ke dalam sistem dengan menu `masuk` yang tersedia. Siswa lain maupun orang lain yang belum terdaftar hanya dapat **melihat** produk yang dijual di Kantin Kejujuran.


## Tautan website

[https://kantin-kejujuran.vercel.app](https://kantin-kejujuran.vercel.app)