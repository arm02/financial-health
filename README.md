# Financial Health

## 📌 Overview
Financial Health App adalah aplikasi full-stack untuk membantu pengguna mengelola keuangan pribadi, memantau pinjaman, serta mengukur tingkat kesehatan finansial secara otomatis.

Aplikasi terdiri dari:
- **Backend API** — Golang
- **Frontend** — Angular
- **Database** — MariaDB

Dirancang modular, scalable, dan mudah di-deploy pada VPS.

## 🚀 Features
**1. Financial Records**
- Catatan pemasukan & pengeluaran
- Kategori transaksi
- Dashboard ringkasan bulanan / tahunan
- Grafik pemasukan vs pengeluaran

**2. Loan Management**
- Pinjaman masuk / pinjaman keluar
- Perhitungan bunga & amortisasi
- Reminder cicilan
- Status & history pembayaran

**3. Financial Health Check**

Menghasilkan skor kesehatan finansial berdasarkan:

- Emergency Fund Ratio
- Debt Service Ratio (DSR)
- Savings Ratio
- Liquidity Ratio
- Debt-to-Income
- Rekomendasi otomatis

**4. User Account**
- Register / Login (JWT)
- Multi-device session
- Personal settings

## 🏗️ Tech Stack

### Backend
- Golang ≥ 1.25.4
- Gin
- JWT Cookie Authentication
- MariaDB
- database/sql

## Frontend
- Angular 20
- RxJS

## ENV Backend
```code
PORT=8080
JWT_SECRET=jwt-secret
GIN_MODE=debug

#MYSQL
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=financial_health
DB_PORT=3306
```