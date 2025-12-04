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
- Catatan pemasukan & pengeluaran **(On Progress)**
- Kategori transaksi **(On Progress)**
- Dashboard ringkasan bulanan / tahunan **(On Progress)**
- Grafik pemasukan vs pengeluaran **(On Progress)**

**2. Loan Management**
- Pinjaman masuk / pinjaman keluar **(BE Only & On Progress FE)**
- Perhitungan bunga & amortisasi **(On Progress)**
- Reminder cicilan **(On Progress)**
- Status & history pembayaran **(On Progress)**

**3. Financial Health Check**

Menghasilkan skor kesehatan finansial berdasarkan:

- Emergency Fund Ratio **(On Schedule)**
- Debt Service Ratio (DSR) **(On Schedule)**
- Savings Ratio **(On Schedule)**
- Liquidity Ratio **(On Schedule)**
- Debt-to-Income **(On Schedule)**
- Rekomendasi otomatis **(On Schedule)**

**4. User Account**
- Register / Login (JWT) **(BE Only & On Progress FE)**
- Multi-device session **(BE Only & On Progress FE)**
- Personal settings **(BE Only & On Progress FE)**

## 🏗️ Tech Stack

### Backend
- Golang ≥ 1.25.4
- Gin
- JWT Cookie Authentication
- MariaDB
- database/sql

### Frontend
- Angular 20
- RxJS

### Configuration
- `.env` Backend
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

- Running Project

Using Make File
```bash
make install -> install deeps
make dev -> run application
```

Manual Backend
```bash
go mod tidy
go mod vendor
go run cmd/server/main.go
```

Manual Frontend
```bash
npm install
npm run start
```

## 💬 Support & Feedback
Kami sangat terbuka terhadap masukan, kritik, dan saran untuk membuat aplikasi Financial Health ini semakin baik.

Jika Anda menemukan bug, memiliki ide fitur baru, atau ingin berkontribusi dalam pengembangan:
- Silakan buka issue di repository ini
- Atau kirim pull request langsung
- Atau hubungi kami melalui email / channel yang tersedia

## ❤️ Why Contribute?
Kami percaya bahwa membangun aplikasi finansial yang transparan, akurat, dan mudah digunakan membutuhkan kolaborasi.

Dengan kontribusi Anda, kita dapat:
- Membantu lebih banyak orang memahami kondisi finansialnya
- Menyediakan alat yang sederhana namun powerful untuk mengelola pinjaman & cashflow
- Berkontribusi pada ekosistem open-source Indonesia

## 🚀 Let’s Build Financial Wellness Together!

Ayo bersama-sama membangun aplikasi yang membantu pengguna mengambil keputusan finansial yang lebih sehat dan bijak.

Terima kasih sudah menggunakan & mendukung project ini! 💛