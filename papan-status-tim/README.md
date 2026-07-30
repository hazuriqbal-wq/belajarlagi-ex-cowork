# Papan Status Tim

Satu layar sederhana yang menampilkan status kerja tiap anggota tim (Belum Mulai / Dikerjakan / Selesai), tugas singkat yang sedang dikerjakan, dan kapan status terakhir diubah. Setiap orang hanya bisa mengubah barisnya sendiri. Dibuat untuk dibuka dari HP, tanpa login/password.

## Cara Kerja Singkat

- Daftar nama anggota tim di-set langsung di kode (`config/team.ts`) — tidak ada tombol tambah/hapus anggota di UI.
- Saat pertama buka, tiap orang memilih namanya sendiri dari dropdown. Pilihan ini disimpan di browser (localStorage) di HP/laptop masing-masing, jadi tidak perlu pilih ulang tiap buka.
- Semua orang bisa melihat semua baris tanpa login. Hanya baris dengan nama yang sama dengan nama tersimpan di device itu yang punya tombol "Ubah Status".
- Data status disimpan di database Redis (lewat Vercel Marketplace/Upstash) supaya semua orang melihat data yang sama.
- Layar memperbarui data otomatis setiap 5 detik (polling), jadi perubahan orang lain akan muncul tanpa perlu refresh manual.

## 1. Edit Daftar Nama Tim

Buka `config/team.ts` dan ganti isi array `TEAM_MEMBERS` dengan nama tim kamu (5–10 nama):

```ts
export const TEAM_MEMBERS = [
  "Nama 1",
  "Nama 2",
  "Nama 3",
  // ...
] as const;
```

Simpan, commit, lalu push — setiap perubahan di file ini butuh deploy ulang agar tampil (otomatis kalau sudah terhubung ke Vercel via Git).

## 2. Deploy ke Vercel

1. Push folder ini ke repository GitHub kamu (sudah ada di branch ini).
2. Buka [vercel.com](https://vercel.com) → **Add New... → Project** → pilih repository ini.
3. Kalau project Next.js ini tidak persis di root repo, di bagian **Root Directory** saat import, pilih folder `papan-status-tim`.
4. Klik **Deploy** (build akan gagal dulu sampai database di-setup di langkah 3 — tidak apa-apa, lanjut dulu).

## 3. Setup Database (Redis via Vercel Marketplace)

Ini bagian penyimpanan status yang berubah-ubah. Kita pakai **Upstash Redis** lewat Vercel Marketplace karena setup-nya paling cepat (tanpa bikin tabel/skema) dan gratis untuk skala kecil (tim 5–10 orang jauh di bawah limit gratisnya).

Langkah-langkah di **Vercel Dashboard**:

1. Buka project kamu di Vercel → tab **Storage**.
2. Klik **Create Database** (atau **Browse Marketplace**) → pilih **Upstash** → pilih produk **Redis**.
3. Ikuti wizard-nya: pilih nama database bebas, pilih region yang paling dekat dengan pengguna kamu (misal Singapore), lalu klik **Create**.
4. Setelah database dibuat, akan ada langkah **Connect Project** — pilih project "Papan Status Tim" ini, centang semua environment (Production, Preview, Development), lalu **Connect**.
5. Vercel otomatis menambahkan environment variable berikut ke project kamu (kamu tidak perlu isi manual):
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - (beberapa variable lain juga ikut ditambahkan, biarkan saja — tidak dipakai tapi tidak mengganggu)
6. Buka tab **Deployments** → pilih deployment terakhir → klik titik tiga → **Redeploy**, supaya deployment baru membaca environment variable yang baru saja ditambahkan.

Setelah redeploy selesai, buka URL project kamu — aplikasi sudah bisa dipakai.

### Kalau kamu memasang "Upstash" versi lain (bukan lewat Storage tab)

Beberapa cara install Upstash di Vercel Marketplace memberi nama variable `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` (bukan `KV_REST_API_URL`/`KV_REST_API_TOKEN`). Aplikasi ini sudah mendukung kedua nama tersebut secara otomatis (lihat `lib/store.ts`), jadi tidak perlu ubah apa pun — cukup pastikan salah satu pasangan variable itu ada di **Settings → Environment Variables** project kamu.

## 4. Development di Komputer Sendiri (Opsional)

Kalau mau coba jalan di laptop sebelum deploy:

```bash
npm install
vercel link          # hubungkan folder ini ke project Vercel kamu
vercel env pull .env.local   # tarik environment variable dari Vercel (termasuk KV_REST_API_URL/TOKEN)
npm run dev
```

Buka `http://localhost:3000`.

## Struktur File Penting

- `config/team.ts` — daftar nama anggota tim (edit manual di sini).
- `app/page.tsx` — satu-satunya layar aplikasi (pilih nama, lihat & ubah status).
- `app/api/status/route.ts` — API untuk baca (`GET`) dan simpan (`POST`) status.
- `lib/store.ts` — logika baca/tulis ke Redis.

## Batasan yang Disengaja (Versi Pertama)

Sesuai spesifikasi awal, hal-hal berikut **sengaja tidak dibuat**: tambah/hapus anggota dari UI, banyak tugas per orang, notifikasi/WhatsApp, riwayat status, dashboard/laporan/statistik, role admin, dark mode/kustomisasi tampilan. Kalau butuh salah satu dari ini nanti, diskusikan dulu sebelum ditambah.
