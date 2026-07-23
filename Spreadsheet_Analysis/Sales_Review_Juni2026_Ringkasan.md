# Sales Review – Juni 2026
Sumber: `Sales_Data` (190 transaksi) & `Product_Targets` (6 produk), workbook `sales_review_demo_slide19.xlsx`.
Semua angka revenue dihitung dari transaksi berstatus **Closed Won** (123 dari 190 transaksi), kecuali disebutkan lain.

## 1. Ringkasan Performa Juni 2026
- Total transaksi: 190 → Closed Won 123 (65%), Pending 22 (12%), Cancelled 45 (24%).
- Total Revenue (Closed Won): **Rp613.719.646**.
- Total Monthly Target (6 produk, sheet Product_Targets): Rp673.150.000.
- Achievement keseluruhan: **91,2%** dari Monthly Target — belum tercapai secara agregat.
- Rata-rata order value (Closed Won): Rp4.989.591.
- Potensi revenue hilang dari transaksi Pending + Cancelled (berdasarkan Target per transaksi): Rp281.800.000 — setara ~42% dari total Monthly Target (Rp673,15jt). Ini gap terbesar, bukan sekadar masalah produk/region.

## 2. Produk: Revenue Tertinggi & Terendah
| Produk | Revenue (Closed Won) |
|---|---|
| **Tertinggi:** Pro Dashboard Pack | Rp181.786.710 |
| AI Report Builder | Rp163.409.700 |
| Data Training Seat | Rp92.563.636 |
| Premium Support | Rp80.361.972 |
| Basic Analytics Pack | Rp70.336.230 |
| **Terendah:** Consulting Hour | Rp25.261.398 |

Catatan: revenue terendah (Consulting Hour) wajar karena target-nya juga paling kecil — lihat poin 4 untuk gap terhadap target.

## 3. Region & Channel Terbaik
**Region** (by revenue): Medan (Rp172,8jt) > Jakarta (Rp140,6jt) > Bandung (Rp129,5jt) > Bali (Rp85,6jt) > Surabaya (Rp85,2jt).
- Win rate tertinggi: Jakarta 74,3%. Win rate terendah: Surabaya 53,7% — hampir separuh transaksi Surabaya gagal closed.

**Channel** (by revenue): Referral (Rp175,1jt) ≈ Sales Team (Rp174,9jt) ≈ Website (Rp170,3jt) — tiga channel ini setara. Partner jauh tertinggal (Rp93,4jt, win rate hanya 56,1%).
- Win rate tertinggi: Referral 73,1%.

## 4. Produk / Region di Bawah Target
Dibanding **Monthly_Target** per produk (Product_Targets sheet):

| Produk | Revenue | Target | Achievement |
|---|---|---|---|
| **Premium Support** | Rp80.361.972 | Rp166.400.000 | **48,3%** ⚠️ terbesar gap-nya |
| **Consulting Hour** | Rp25.261.398 | Rp39.950.000 | **63,2%** ⚠️ |
| Data Training Seat | Rp92.563.636 | Rp90.000.000 | 102,8% ✅ |
| AI Report Builder | Rp163.409.700 | Rp155.400.000 | 105,2% ✅ |
| Pro Dashboard Pack | Rp181.786.710 | Rp165.000.000 | 110,2% ✅ |
| Basic Analytics Pack | Rp70.336.230 | Rp56.400.000 | 124,7% ✅ |

Region dengan risiko tertinggi: **Surabaya** — revenue terendah kedua DAN win rate terendah (53,7%), berarti masalah bukan cuma volume tapi juga tingkat konversi closing.

## 5. Data Quality Issues
| Issue | Invoice | Detail | Severity |
|---|---|---|---|
| Missing value | INV-1008 | Revenue kosong (NaN) untuk transaksi Cancelled — harusnya 0 seperti Cancelled lain, tidak konsisten | Medium |
| Duplicate Invoice_ID | INV-1021 | ID sama muncul 2x, produk/tanggal/region/channel sama tapi Units & Revenue beda (1 unit/Rp3,5jt vs 2 unit/Rp7jt) — indikasi double entry | **High** |
| Discount tidak wajar | INV-1103 | Discount 45%, jauh di atas rentang normal 0–15% pada baris lain — perlu verifikasi approval | Medium |
| Units tidak wajar | INV-1056 | Consulting Hour 15 unit tapi rate/unit hanya Rp60.000, padahal transaksi lain rata-rata Rp700rb–950rb/unit — kemungkinan salah input | **High** |

Rekomendasi: kedua issue "High" (INV-1021, INV-1056) sebaiknya dikonfirmasi ke tim sales sebelum angka dipakai untuk laporan resmi — berpotensi mengubah total revenue jika salah input.

## 6. Saran 3 Chart untuk Leadership Update
1. **Bar chart — Revenue vs Target per Produk**: menunjukkan langsung produk mana yang under/over target (poin 4), paling actionable untuk leadership.
2. **Stacked/grouped bar — Revenue per Region dengan win rate sebagai overlay line**: menyoroti Surabaya sebagai region bermasalah (revenue rendah + win rate rendah).
3. **Donut/bar — Distribusi status transaksi (Closed Won/Pending/Cancelled) dengan value Rp**: memvisualkan potensi revenue Rp281,8jt yang hilang — ini gap terbesar dan paling mudah dipahami eksekutif.

## 7. Next Step Praktis untuk Manager
- Konfirmasi ke tim sales soal INV-1021 (duplicate) dan INV-1056 (units 15) sebelum angka Juni difinalisasi — dampaknya ke total revenue.
- Investigasi kenapa Premium Support & Consulting Hour jauh di bawah target (48,3% & 63,2%) — cek apakah masalah pricing, availability, atau lead quality.
- Follow up 22 transaksi Pending (senilai potensi target tertentu) sebelum tutup periode — ini quick win termudah untuk naikkan achievement.
- Review kualitas closing di Surabaya (win rate 53,7%, terendah) dan Partner channel (win rate 56,1%, terendah) — kemungkinan butuh coaching atau evaluasi partner.
- Tetapkan aturan input data (validasi Invoice_ID unik, batas wajar Units/Discount) agar isu di poin 5 tidak berulang bulan depan.
