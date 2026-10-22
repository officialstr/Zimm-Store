// ==========================================================
// DATA PRODUK — dipakai BERSAMA oleh index.html (grid) dan
// produk.html (halaman detail). Cukup edit/tambah produk di
// sini, tidak perlu sentuh file HTML/JS lain.
//
// Field baru:
// - deskripsi : teks penjelasan lengkap di halaman detail
//               (opsional, kalau kosong dipakai teks bawaan)
// - galeri    : array foto tambahan selain "gambar" (opsional,
//               dipakai buat slide galeri di halaman detail)
// ==========================================================

// Ubah nama produk jadi "slug" buat URL, contoh:
// "Agera Premium Bodykit" -> "agera-premium-bodykit"
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Teks deskripsi bawaan kalau produk belum diisi field "deskripsi"
function deskripsiDefault(p) {
  if (p.kategori === 'jasa') {
    return `Layanan "${p.nama}" dari Zimm Store untuk Car Parking Multiplayer (CPM 1). Dikerjakan langsung oleh admin, proses aman dan cepat. Chat admin buat tanya detail atau nego sebelum order.`;
  }
  return `Livery ${p.nama} untuk Car Parking Multiplayer (CPM 1), sudah terpasang pada mobil dan siap digunakan. Pembelian sudah termasuk mobil beserta livery, sehingga tidak perlu menunggu lama untuk proses pemasangan.<br><br>Tinggal ambil mobil dalam beberapa menit dan langsung siap digunakan. Cocok untuk kamu yang ingin tampil keren dengan mobil yang siap pakai.`;
}

const PRODUK = [
  { nama: "CUSTOM DESIGN LIVERY", pinned: 2, gambar: "img/altr/customlivery.webp", hargaLama: "Start Rp 5.000", harga: "Start Rp 7.000", kategori: "jasa", game: "cpm1", owner: "zim",
    status: "⚡ PEMBUATAN CEPAT", orderFn: "orderCustomDesign", orderNama: "Custom Design Livery",
    closed: true, // true = closed order (tombol "Antrian Full"). Ubah ke false / hapus kalau sudah buka lagi.
    hotItem: true, badge: { text: "🔥 Hot Item", class: "badge-hot" },
    deskripsi: DESK.customDesign },
  { nama: "Jasa Pasang W16", pinned: 3, gambar: "img/altr/W16.webp", hargaLama: "Rp 7.000", harga: "Rp 5.000", kategori: "jasa", game: "cpm1", owner: "zim", hotItem: true, badge: { text: "🔥 Hot Item", class: "badge-hot" },
    deskripsi: DESK.w16 },
  { nama: "MC/Rekber", pinned: 1, gambar: "img/altr/MC-REKBER.webp", hargaLama: "Start Rp 5.000", harga: "Start Rp 3.000", kategori: "jasa", owner: "zim", orderFn: "orderMc",
    deskripsi: DESK.mcRekber },
  { nama: "Ken Block Hoonicorn", gambar: "img/produk/ZIMM002.webp", hargaLama: "Rp 25.000", harga: "Rp 20.000", kategori: "livery", owner: "zim" },
  { nama: "Ford Phoenix Livery", gambar: "img/produk/ZIMM003.webp", hargaLama: "Rp 27.000", harga: "Rp 20.000", kategori: "livery", owner: "zim", sold: true },
  { nama: "Toyota GT86 Stance", gambar: "img/produk/SOLD001.webp", hargaLama: "Rp 25.000", harga: "Rp 20.000", kategori: "livery", owner: "zim", sold: true },
  { nama: "Skyline R32 Jedi Order", gambar: "img/produk/ZIMM004.webp", hargaLama: "Rp 27.000", harga: "Rp 25.000", kategori: "livery", owner: "zim" },
  { nama: "BMW NFS (ON POLICE SIRINE)", gambar: "img/produk/SOLD002.webp", hargaLama: "Rp 23.000", harga: "Rp 20.000", kategori: "livery", owner: "zim", sold: true, orderNama: "BMW NFS" },
  { nama: "Hilux Diesel 2GD", gambar: "img/produk/ZIMM006.webp", hargaLama: "Rp 35.000", harga: "Rp 30.000", kategori: "livery", owner: "zim", sold: true },
  { nama: "Mercedes-Amg One", gambar: "img/produk/ZIMM007.webp", hargaLama: "Rp 15.000", harga: "Rp 10.000", kategori: "livery", owner: "zim" },
  { nama: "BMW M5 G90", gambar: "img/produk/ZIMM009.webp", hargaLama: "Rp 15.000", harga: "Rp 10.000", kategori: "livery", owner: "zim", sold: true },
  { nama: "Hilux Diesel Garuda", gambar: "img/produk/ZIMM010.webp", hargaLama: "Rp 40.000", harga: "Rp 30.000", kategori: "livery", owner: "zim" },
  { nama: "Nissan Fairlady Nintendo", gambar: "img/produk/ZIMM011.webp", hargaLama: "Rp 25.000", harga: "Rp 20.000", kategori: "livery", owner: "zim" },
  { nama: "Hilux Diesel Among Us", gambar: "img/produk/SOLD003.webp", hargaLama: "Rp 36.000", harga: "Rp 25.000", kategori: "livery", owner: "zim", sold: true },
  { nama: "Toyota GT86 Stance V2", gambar: "img/produk/ZIMM012.webp", hargaLama: "Rp 20.000", harga: "Rp 15.000", kategori: "livery", owner: "zim" },
  { nama: "Old BMW Stance", gambar: "img/produk/ZIMM013.webp", hargaLama: "Rp 17.000", harga: "Rp 15.000", kategori: "livery", owner: "zim", sold: true },
  { nama: "Jaspost Subaru G-Shock", gambar: "img/produk/ZIMM014.webp", hargaLama: "Rp 24.000", harga: "Rp 20.000", kategori: "livery", owner: "zim" },
  { nama: "Lexus LFA Rockstar (JASPOST)", gambar: "img/produk/ZIMM015.webp", hargaLama: "Rp 18.000", harga: "Rp 15.000", kategori: "livery", owner: "zim", sold: true },
  { nama: "Jaspost Mercedes Michelin", gambar: "img/produk/ZIMM016.webp", hargaLama: "Rp 22.000", harga: "Rp 20.000", kategori: "livery", owner: "zim" },
  { nama: "Ken Block Hoonicorn V2", gambar: "img/produk/ZIMM017.webp", hargaLama: "Rp 27.000", harga: "Rp 20.000", kategori: "livery", owner: "zim" },
{ nama: "Porsche 911 Gojo Satoru (Gratis W16)", gambar: "img/produk/ZIMM018.webp", hargaLama: "Rp 75.000", harga: "Rp 62.000", kategori: "livery", owner: "zim" , galeri: ["img/altr/gratis_w16.webp"] },
{ nama: "Hilux POKERZz 2GD", gambar: "img/produk/ZIMM019.webp", hargaLama: "Rp 43.000", harga: "Rp 35.000", kategori: "livery", owner: "zim" },
{ nama: "STOCK AKUN FF 2#", gambar: "img/ff/FF002.webp", hargaLama: "Rp 160.000", harga: "Rp 150.000", kategori: "akun", game: "ff", owner: "zim", deskripsi: DESK.FF002, new: true, galeri: ["img/ff/FF002-2.webp", "img/ff/FF002-3.webp", "img/ff/FF002-4.webp"] },
{ nama: "STOCK AKUN FF 3#", gambar: "img/produk/FF003.webp", hargaLama: "Rp 190.000", harga: "Rp 170.000", kategori: "akun", game: "ff", owner: "zim", deskripsi: DESK.FF003, sold: true },
{ nama: "STOCK AKUN FF 4#", gambar: "img/ff/FF004.webp", hargaLama: "Rp 200.000", harga: "Rp 185.000", kategori: "akun", game: "ff", owner: "zim", deskripsi: DESK.FF004, new: true, galeri: ["img/ff/FF004-2.webp", "img/ff/FF004-3.webp", "img/ff/FF004-4.webp", "img/ff/FF004-5.webp"] },
{ nama: "STOCK AKUN FF 5#", gambar: "img/ff/FF005.webp", hargaLama: "Rp 130.000", harga: "Rp 115.000", kategori: "akun", game: "ff", owner: "zim", deskripsi: DESK.FF005, new: true, galeri: ["img/ff/FF005-2.webp", "img/ff/FF005-3.webp", "img/ff/FF005-4.webp"], sold: true },
];

// Kasih tiap produk "id" (slug) otomatis dari namanya, dipakai di URL
// produk.html?id=... . Kalau ada nama kembar, tambahin angka di belakang.
(function bikinId() {
  const dipakai = {};
  PRODUK.forEach(p => {
    let id = slugify(p.nama);
    if (dipakai[id]) {
      dipakai[id]++;
      id = `${id}-${dipakai[id]}`;
    } else {
      dipakai[id] = 1;
    }
    p.id = id;
  });
})();

// Cari 1 produk berdasarkan id (dipakai di produk.html)
function cariProdukById(id) {
  return PRODUK.find(p => p.id === id);
}

// Kategori besar toko: "ff" (Free Fire), "cpm1" (CPM 1), "jasa".
// Produk bisa isi field `game` sendiri (wajib untuk produk Free Fire: game: "ff").
// Kalau kosong: kategori "livery" -> cpm1, sisanya -> jasa.
const GAME_LABEL = { ff: "Free Fire", cpm1: "CPM 1", jasa: "Jasa" };
function gameOf(p) {
  return p.game || (p.kategori === "livery" ? "cpm1" : "jasa");
}
