// Daftar nama anggota tim. EDIT DI SINI untuk mengganti nama sesuai tim kamu.
// - Minimal 5, maksimal sekitar 10 nama, agar layar tidak terlalu panjang.
// - Urutan di sini menentukan urutan tampil di layar.
// - Setelah edit file ini, deploy ulang (push ke Git) agar perubahan tampil.
export const TEAM_MEMBERS = [
  "Ani",
  "Budi",
  "Citra",
  "Dewi",
  "Eka",
  "Fajar",
  "Gita",
  "Hendra",
] as const;

export type TeamMember = (typeof TEAM_MEMBERS)[number];
