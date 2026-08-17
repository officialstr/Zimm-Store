// ==========================================================
// DATA PRODUK — cukup edit/tambah di sini kalau mau ganti produk,
// tidak perlu sentuh HTML atau CSS sama sekali.
// ==========================================================
const PRODUK = [
  { nama: "CUSTOM DESIGN LIVERY", gambar: "img/altr/customlivery.jpg", hargaLama: "Start Rp 5.000", harga: "Start Rp 7.000", kategori: "jasa", owner: "zim",
    status: "⚡ PEMBUATAN CEPAT", btnText: "Design Sekarang", orderFn: "orderCustomDesign", orderNama: "Custom Design Livery",
    hotItem: true, badge: { text: "🔥 Hot Item", class: "badge-hot" } },
  { nama: "Jasa Pasang W16", gambar: "img/altr/W16.jpg", hargaLama: "Rp 7.000", harga: "Rp 5.000", kategori: "jarakSekarang", owner: "zim", hotItem: true, badge: { text: "🔥 Hot Item", class: "badge-hot" } },
  { nama: "MC/Rekber", gambar: "img/altr/MC-REKBER.jpg", hargaLama: "Start Rp 5.000", harga: "Start Rp 3.000", kategori: "Jasa", owner: "zim" },
  { nama: "Agera Premium Bodykit", gambar: "img/produk/ZIMM001.jpg", hargaLama: "Rp 20.000", harga: "Rp 15.000", kategori: "livery", owner: "zim" },
  { nama: "Ken Block Hoonicorn", gambar: "img/produk/ZIMM002.jpg", hargaLama: "Rp 25.000", harga: "Rp 20.000", kategori: "livery", owner: "zim" },
  { nama: "Ford Phoenix Livery", gambar: "img/produk/ZIMM003.jpg", hargaLama: "Rp 27.000", harga: "Rp 17.000", kategori: "livery", owner: "zim", limited: true, badge: { text: "LIMITED PROMO", class: "badge-limited" } },
  { nama: "Toyota GT86 Stance", gambar: "img/produk/SOLD001.jpg", hargaLama: "Rp 25.000", harga: "Rp 20.000", kategori: "livery", owner: "zim", sold: true },
  { nama: "Skyline R32 Jedi Order", gambar: "img/produk/ZIMM004.jpg", hargaLama: "Rp 27.000", harga: "Rp 25.000", kategori: "livery", owner: "zim" },
  { nama: "BMW NFS (ON POLICE SIRINE)", gambar: "img/produk/SOLD002.jpg", hargaLama: "Rp 23.000", harga: "Rp 20.000", kategori: "livery", owner: "zim", sold: true, orderNama: "BMW NFS" },
  { nama: "Jaspost Toyota Crown Anime", gambar: "img/produk/ZIMM005.jpg", hargaLama: "Rp 34.000", harga: "Rp 25.000", kategori: "livery", owner: "zim" },
  { nama: "Hilux Diesel 2GD", gambar: "img/produk/ZIMM006.jpg", hargaLama: "Rp 35.000", harga: "Rp 30.000", kategori: "livery", owner: "zim" },
  { nama: "Mercedes-Amg One", gambar: "img/produk/ZIMM007.jpg", hargaLama: "Rp 15.000", harga: "Rp 10.000", kategori: "livery", owner: "zim" },
  { nama: "GTR R35 Idul Adha", gambar: "img/produk/ZIMM008.jpg", hargaLama: "Rp 30.000", harga: "Rp 20.000", kategori: "livery", owner: "zim" },
  { nama: "BMW M5 G90", gambar: "img/produk/ZIMM009.jpg", hargaLama: "Rp 15.000", harga: "Rp 10.000", kategori: "livery", owner: "zim" },
  { nama: "Hilux Diesel Garuda", gambar: "img/produk/ZIMM010.jpg", hargaLama: "Rp 40.000", harga: "Rp 27.000", kategori: "livery", owner: "zim", limited: true, badge: { text: "LIMITED PROMO", class: "badge-limited" } },
  { nama: "Nissan Fairlady Nintendo", gambar: "img/produk/ZIMM011.jpg", hargaLama: "Rp 25.000", harga: "Rp 17.000", kategori: "livery", owner: "zim", limited: true, badge: { text: "LIMITED PROMO", class: "badge-limited" } },
  { nama: "Hilux Diesel Among Us", gambar: "img/produk/SOLD003.jpg", hargaLama: "Rp 36.000", harga: "Rp 25.000", kategori: "livery", owner: "zim", sold: true },
  { nama: "Toyota GT86 Stance V2", gambar: "img/produk/ZIMM012.jpg", hargaLama: "Rp 20.000", harga: "Rp 15.000", kategori: "livery", owner: "zim" },
  { nama: "Old BMW Stance", gambar: "img/produk/ZIMM013.jpg", hargaLama: "Rp 17.000", harga: "Rp 15.000", kategori: "livery", owner: "zim" },
  { nama: "Jaspost Subaru G-Shock", gambar: "img/produk/ZIMM014.jpg", hargaLama: "Rp 24.000", harga: "Rp 20.000", kategori: "livery", owner: "zim" },
  { nama: "Lexus LFA Rockstar", gambar: "img/produk/ZIMM015.jpg", hargaLama: "Rp 18.000", harga: "Rp 15.000", kategori: "livery", owner: "zim" },
  { nama: "Jaspost Mercedes Michelin", gambar: "img/produk/ZIMM016.jpg", hargaLama: "Rp 22.000", harga: "Rp 20.000", kategori: "livery", owner: "zim" },
  { nama: "Ken Block Hoonicorn V2", gambar: "img/produk/ZIMM017.jpg", hargaLama: "Rp 27.000", harga: "Rp 20.000", kategori: "livery", owner: "zim" },
];

// Fungsi render otomatis: mengubah data PRODUK di atas jadi card HTML
function renderProduk() {
  const grid = document.querySelector('.produk-grid');
  if (!grid) return;

  grid.innerHTML = PRODUK.map(p => {
    const status = p.status || "⚡ PROSES SATSET";
    const btnText = p.btnText || (p.sold ? "SOLD OUT" : "Beli Sekarang");
    const orderFn = p.orderFn || "order";
    const orderNama = (p.orderNama || p.nama).replace(/'/g, "\\'");
    const kelas = ["card", p.kategori, p.owner];
    if (p.sold) kelas.push("sold");
    if (p.hotItem) kelas.push("hot-item");
    if (p.limited) kelas.push("limited");

    // Kumpulin semua badge yang aktif (hot + limited bisa nyala bareng, disusun vertikal)
    const badges = [];
    if (p.badge) badges.push(`<span class="badge ${p.badge.class}">${p.badge.text}</span>`);
    if (p.limited && !p.badge) badges.push(`<span class="badge badge-limited">⭐ Limited</span>`);
    const badgeHtml = badges.length ? `<div class="badge-stack">${badges.join('')}</div>` : "";

    // Harga lama (opsional) -> ditampilkan dicoret di atas harga baru
    const oldPriceHtml = p.hargaLama ? `<span class="old-price">${p.hargaLama}</span>` : "";

    return `
    <div class="${kelas.join(' ')}">
      <div class="img-container">
        ${badgeHtml}
        <img src="${p.gambar}" alt="${p.nama}" class="clickable-img">
      </div>
      <div class="card-body">
        <div class="title-wrap"><h4 onclick="this.classList.toggle('expanded')">${p.nama}</h4></div>
        <div class="card-footer">
          <p class="status">${status}</p>
          <div class="price-section">
            ${oldPriceHtml}
            <span class="new-price">${p.harga}</span>
          </div>
          <button class="btn-buy" data-owner="${p.owner}" onclick="${orderFn}('${orderNama}', this)">${btnText}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// Tampilan skeleton sementara sebelum renderProduk() selesai jalan
function renderSkeleton(jumlah = 6) {
  const grid = document.querySelector('.produk-grid');
  if (!grid) return;
  grid.innerHTML = Array.from({ length: jumlah }).map(() => `
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line w-70"></div>
        <div class="skeleton-line w-40"></div>
        <div class="skeleton-line w-40"></div>
        <div class="skeleton-line h-btn"></div>
      </div>
    </div>
  `).join('');
}

// Tampilkan skeleton dulu begitu script ini dieksekusi (DOM .produk-grid
// sudah ada di HTML pada titik ini), biar tidak blank sambil nunggu
// window.onload (yang baru jalan setelah SEMUA gambar selesai dimuat).
renderSkeleton();

window.onload = function() {
  // -1. Render produk dari data PRODUK di atas (harus paling awal,
  // biar fitur zoom & filter di bawah ini kebagian elemen yang baru dibuat)
  renderProduk();

  // 0. Popup Peraturan (muncul sekali per sesi kunjungan)
  const rulesOverlay = document.getElementById('rulesPopupOverlay');
  if (rulesOverlay && !sessionStorage.getItem('rulesPopupShown')) {
    setTimeout(function() {
      rulesOverlay.classList.add('active');
      document.body.classList.add('rules-popup-lock');
      sessionStorage.setItem('rulesPopupShown', 'true');
    }, 2000);
  }

  // 1. Inisialisasi Swiper Slider
  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper(".mySwiper", {
      slidesPerView: 1, 
      spaceBetween: 20,
      loop: true,
      loopPreventsSliding: false, 
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  // 2. Fitur Zoom Gambar (Lightbox) — double-tap zoom + pinch manual
  const overlay = document.getElementById('imageOverlay');
  const zoomedImg = document.getElementById('zoomedImage');
  const clickableImgs = document.querySelectorAll('.clickable-img');

  if (overlay && zoomedImg) {
    let scale = 1, panX = 0, panY = 0;
    let startDistance = 0, startScale = 1;
    let isPinching = false, isPanning = false;
    let panStartX = 0, panStartY = 0;
    let lastTapTime = 0;

    function terapkanTransform(halus) {
      zoomedImg.style.transition = halus ? 'transform 0.25s ease' : 'none';
      zoomedImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    }

    function resetZoom() {
      scale = 1; panX = 0; panY = 0;
      terapkanTransform(false);
    }

    function bukaZoom(src) {
      overlay.style.display = 'flex';
      zoomedImg.src = src;
      resetZoom();
      document.body.classList.add('zoom-lock'); // kunci scroll halaman biar gesture 2 jari gak direbut browser
      // Tambah history dummy agar tombol back HP bisa digunakan untuk menutup
      window.history.pushState({ viewing: true }, "Viewing Image", "#viewing-image");
    }

    function tutupZoom() {
      overlay.style.display = 'none';
      resetZoom();
      document.body.classList.remove('zoom-lock');
      if (window.location.hash === "#viewing-image") {
        window.history.back();
      }
    }

    function toggleDoubleTapZoom() {
      if (scale === 1) {
        scale = 2.5;
      } else {
        scale = 1; panX = 0; panY = 0;
      }
      terapkanTransform(true); // animasi halus khusus double-tap
    }

    function jarakDuaJari(t1, t2) {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    let sedangGesture = false; // true saat/baru selesai pinch atau geser, cegah overlay ke-anggap "tap nutup"

    // Buka zoom saat gambar (produk/slider/apapun) diklik
    clickableImgs.forEach(img => {
      img.addEventListener('click', () => bukaZoom(img.src));
    });

    // Menutup HANYA kalau menyentuh area luar gambar (backdrop), bukan gambarnya, dan bukan abis gesture
    overlay.addEventListener('click', (e) => {
      if (sedangGesture) return;
      if (e.target === overlay) {
        tutupZoom();
      }
    });

    // Menangani tombol "Kembali" di HP/Browser untuk menutup zoom
    window.onpopstate = function() {
      overlay.style.display = 'none';
      resetZoom();
      document.body.classList.remove('zoom-lock');
    };

    // Double-click (desktop) untuk toggle zoom
    zoomedImg.addEventListener('dblclick', (e) => {
      e.preventDefault();
      toggleDoubleTapZoom();
    });

    // Double-tap (HP) untuk toggle zoom — cukup kena gambarnya biar akurat
    zoomedImg.addEventListener('touchend', (e) => {
      if (isPinching) return;
      const sekarang = Date.now();
      if (sekarang - lastTapTime < 300 && e.touches.length === 0) {
        e.preventDefault();
        toggleDoubleTapZoom();
      }
      lastTapTime = sekarang;
    });

    // Pinch zoom manual (2 jari) + geser gambar saat sudah di-zoom (1 jari)
    // Dipasang di OVERLAY (bukan cuma gambar) karena saat pinch, jari sering
    // jatuh di luar batas gambar (area backdrop hitam)
    overlay.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        isPinching = true;
        sedangGesture = true;
        startDistance = jarakDuaJari(e.touches[0], e.touches[1]);
        startScale = scale;
      } else if (e.touches.length === 1 && scale > 1) {
        isPanning = true;
        sedangGesture = true;
        panStartX = e.touches[0].clientX - panX;
        panStartY = e.touches[0].clientY - panY;
      }
    }, { passive: false });

    overlay.addEventListener('touchmove', (e) => {
      if (isPinching && e.touches.length === 2) {
        e.preventDefault();
        const jarakSekarang = jarakDuaJari(e.touches[0], e.touches[1]);
        scale = Math.min(Math.max(startScale * (jarakSekarang / startDistance), 1), 4);
        terapkanTransform(false); // instan, ngikutin jari tanpa delay
      } else if (isPanning && e.touches.length === 1) {
        e.preventDefault();
        panX = e.touches[0].clientX - panStartX;
        panY = e.touches[0].clientY - panStartY;
        terapkanTransform(false); // instan, ngikutin jari tanpa delay
      }
    }, { passive: false });

    overlay.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) isPinching = false;
      if (e.touches.length === 0) {
        isPanning = false;
        if (scale < 1) { scale = 1; panX = 0; panY = 0; terapkanTransform(true); }
        // Jeda dikit sebelum overlay bisa di-tap nutup lagi,
        // biar ujung gesture barusan gak ke-anggap tap nutup
        setTimeout(() => { sedangGesture = false; }, 200);
      }
    });

    // Zoom manual pakai scroll wheel (desktop)
    zoomedImg.addEventListener('wheel', (e) => {
      e.preventDefault();
      scale = Math.min(Math.max(scale + (e.deltaY > 0 ? -0.2 : 0.2), 1), 4);
      if (scale === 1) { panX = 0; panY = 0; }
      terapkanTransform(false);
    });
  }
  // 8. Confetti Perayaan HUT RI (berlaku di semua halaman: index, faq, aturan)
  setTimeout(buatConfetti, 1000);
  setInterval(buatConfetti, 10000);

  // 9. Efek klik merah-putih di kartu produk/layanan & CTA (berlaku di semua halaman)
  pasangEfekMerdeka('.card');
  pasangEfekMerdeka('.btn-lanjut-pesan');
}; // <-- Penutup window.onload sekarang di sini, semua variabel aman.

// ==========================================================
// CONFETTI MERAH-PUTIH — muncul tiap 7 detik, jatuh pelan
// ==========================================================
function buatConfetti() {
  const jumlah = 60;
  for (let i = 0; i < jumlah; i++) {
    const potongan = document.createElement('div');
    potongan.className = 'confetti-piece';
    potongan.style.left = Math.random() * 100 + 'vw';
    potongan.style.background = Math.random() > 0.5 ? '#CE1126' : '#ffffff';
    const durasi = 2.5 + Math.random() * 1; // jatuh ±3 detik, ada jeda sebelum batch berikutnya
    potongan.style.animationDuration = durasi + 's';
    potongan.style.animationDelay = (Math.random() * 0.8) + 's';
    potongan.style.opacity = (Math.random() * 0.4 + 0.6).toString();
    potongan.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(potongan);
    setTimeout(() => potongan.remove(), (durasi + 1.5) * 1000);
  }
}

// ==========================================================
// EFEK KLIK MERAH-PUTIH — border beam jalan terus, tapi hanya 1 yang aktif dalam satu waktu
// ==========================================================
function pasangEfekMerdeka(selector) {
  let aktifSebelumnya = null;
  document.querySelectorAll(selector).forEach(tombol => {
    tombol.addEventListener('click', () => {
      // Matikan efek pada produk yang sebelumnya aktif (jika beda dari yang diklik sekarang)
      if (aktifSebelumnya && aktifSebelumnya !== tombol) {
        aktifSebelumnya.classList.remove('merdeka-spin');
      }
      tombol.classList.remove('merdeka-spin');
      void tombol.offsetWidth; // paksa reflow biar animasi bisa diulang tiap klik
      tombol.classList.add('merdeka-spin');
      aktifSebelumnya = tombol;
    });
  });
}

// 3. Fungsi Order via WhatsApp
function order(nama, element) {
  if (element && element.closest('.card.sold')) {
    return; // Produk sold out, order dibatalkan
  }
  const nomorWA = "6285119516679";
  const pesan = `*Halo Zimm Store Aku Ingin Memesan Stock Livery*\n*Nama (In-Game):*\n*UID CPM 1:*\n*Pesanan: ${nama}*`;

  window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');
}

// 3b. Fungsi Order khusus Custom Design Livery (dengan referensi desain)
function orderCustomDesign(nama, element) {
  if (element && element.closest('.card.sold')) {
    return; // Produk sold out, order dibatalkan
  }
  const nomorWA = "6285119516679";
  const pesan = `*Halo Zimm Store Aku Ingin Membuat Design Livery*\n*Nama (In-game):*\n*UID CPM 1:*\n*Pesanan: ${nama}*\n\n*Berikan Contoh/Referensi Desain Livery Yang Diinginkan Serta Kirimkan Juga Screenshot Pada Bagian Multiplayer CPM 1`;

  window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');
}

// 4. Fungsi Filter Kategori Produk
function filterProduk(kategori, element) {
  // Update tampilan tombol aktif
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  // Filter kartu produk
  document.querySelectorAll('.card').forEach(card => {
    if (kategori === 'all' || card.classList.contains(kategori)) {
      card.style.display = ""; // Kembalikan ke display flex bawaan CSS
    } else {
      card.style.display = 'none';
    }
  });
}

// 5. Fungsi Search Produk
function searchProduk() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();
  const grid = document.querySelector('.produk-grid');
  const cards = grid.getElementsByClassName('card');

  for (let i = 0; i < cards.length; i++) {
    // Ambil teks dari tag h4 di dalam card body
    const title = cards[i].querySelector('.card-body h4');
    const textValue = title.textContent || title.innerText;

    if (textValue.toLowerCase().indexOf(filter) > -1) {
      cards[i].style.display = ""; // Munculin kalau cocok
    } else {
      cards[i].style.display = "none"; // Sembunyiin kalau gak cocok
    }
  }
}

// 6. Fungsi Dropdown Menu Titik Tiga
function toggleMenu(event) {
    event.stopPropagation(); // Biar gak ketutup pas diklik
    const menu = document.getElementById("dropdownMenu");
    menu.classList.toggle("show-menu");
}

// Menutup menu otomatis jika klik di luar area
window.addEventListener('click', function(event) {
    const menu = document.getElementById("dropdownMenu");
    if (menu && menu.classList.contains('show-menu')) {
        if (!event.target.closest('.menu-wrapper')) {
            menu.classList.remove('show-menu');
        }
    }
});

// Fungsi tutup Popup Peraturan
function closeRulesPopup() {
  const rulesOverlay = document.getElementById('rulesPopupOverlay');
  if (rulesOverlay) {
    rulesOverlay.classList.remove('active');
    document.body.classList.remove('rules-popup-lock');
  }
}

// 7. Fungsi Filter Kategori Aturan (khusus halaman aturan.html)
function filterAturan(kategori, element) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  document.querySelectorAll('.aturan-card').forEach(card => {
    card.style.display = card.classList.contains(kategori) ? 'block' : 'none';
  });
}
