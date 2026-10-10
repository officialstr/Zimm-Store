// Data produk (array PRODUK, fungsi slugify, cariProdukById) sekarang
// ada di data.js supaya bisa dipakai bareng sama produk.html. Pastikan
// data.js sudah di-include di index.html SEBELUM script.js ini.

// Satu kartu produk (dipakai grid beranda, strip pinned, dan halaman kategori)
function kartuHtml(p) {
  const kelas = ["card", p.kategori, p.owner];
  if (p.sold) kelas.push("sold");
  if (p.hotItem) kelas.push("hot-item");
  if (p.limited) kelas.push("limited");
  if (p.new) kelas.push("new");

  const badges = [];
  if (p.badge) badges.push(`<span class="badge ${p.badge.class}">${p.badge.text}</span>`);
  if (p.limited && !p.badge) badges.push(`<span class="badge badge-limited">⭐ Limited</span>`);
  if (p.new) badges.push(`<span class="badge badge-new">NEW</span>`);
  const badgeHtml = badges.length ? `<div class="badge-stack">${badges.join('')}</div>` : "";

  return `
    <div class="${kelas.join(' ')}">
      <a class="img-container" href="produk.html?id=${encodeURIComponent(p.id)}">
        ${badgeHtml}
        <img src="${p.gambar}" alt="${p.nama}">
      </a>
      <div class="card-body">
        <div class="title-wrap"><h4 onclick="this.classList.toggle('expanded')">${p.nama}</h4></div>
        <div class="card-footer">
          <div class="price-section">
            <span class="new-price">${p.harga}</span>
          </div>
          <a class="btn-detail" href="produk.html?id=${encodeURIComponent(p.id)}">Selengkapnya..</a>
        </div>
      </div>
    </div>`;
}

function isiGrid(list, pesanKosong) {
  const grid = document.getElementById('produkGrid');
  if (!grid) return;
  grid.innerHTML = list.length
    ? list.map(kartuHtml).join('')
    : `<p class="grid-kosong">${pesanKosong || 'Produk tidak ditemukan.'}</p>`;
  animasiKartu(grid);
}

// Animasi kartu: muncul pelan (naik + memudar masuk) sekali saja saat pertama
// terlihat di layar. Mati otomatis kalau HP memakai mode "kurangi animasi".
function animasiKartu(root) {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const kartu = (root || document).querySelectorAll('.card:not(.reveal-done)');
  if (!kartu.length) return;

  if (!animasiKartu.io) {
    animasiKartu.io = new IntersectionObserver(entries => {
      let urutan = 0;
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        animasiKartu.io.unobserve(el);
        el.style.setProperty('--d', Math.min(urutan++, 8) * 60 + 'ms'); // muncul bergelombang
        el.classList.add('reveal-in');
        el.addEventListener('animationend', e => {
          if (e.target !== el) return;
          el.classList.remove('reveal', 'reveal-in'); // balik normal supaya efek hover tetap jalan
          el.style.removeProperty('--d');
        }, { once: true });
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  }
  kartu.forEach(el => {
    el.classList.add('reveal', 'reveal-done');
    animasiKartu.io.observe(el);
  });
}

// ==========================================================
// BERANDA (index.html): strip jasa pinned + 30 produk random
// ==========================================================
const JUMLAH_RANDOM = 30;

// Urutan random disimpan per sesi, jadi pas balik dari halaman detail
// (tombol Back) produknya tidak teracak ulang.
function ambilRandomBeranda() {
  try {
    const ids = JSON.parse(sessionStorage.getItem('zimmRandom') || 'null');
    if (ids) {
      const list = ids.map(cariProdukById).filter(Boolean);
      if (list.length) return list;
    }
  } catch (e) {}
  const pool = PRODUK.filter(p => !p.pinned && !p.sold);
  const list = acakArray(pool).slice(0, JUMLAH_RANDOM);
  try { sessionStorage.setItem('zimmRandom', JSON.stringify(list.map(p => p.id))); } catch (e) {}
  return list;
}

// 5 produk sold acak di paling bawah beranda ("Sudah Terjual").
// Urutannya juga disimpan per sesi, sama seperti produk random di atas.
const JUMLAH_SOLD = 5;
function ambilSoldBeranda() {
  try {
    const ids = JSON.parse(sessionStorage.getItem('zimmSold') || 'null');
    if (ids) {
      const list = ids.map(cariProdukById).filter(p => p && p.sold);
      if (list.length) return list;
    }
  } catch (e) {}
  const list = acakArray(PRODUK.filter(p => p.sold && !p.pinned)).slice(0, JUMLAH_SOLD);
  try { sessionStorage.setItem('zimmSold', JSON.stringify(list.map(p => p.id))); } catch (e) {}
  return list;
}

function renderSold() {
  const wrap = document.getElementById('soldWrap');
  const grid = document.getElementById('soldGrid');
  if (!wrap || !grid) return;
  const list = ambilSoldBeranda();
  if (!list.length) { wrap.style.display = 'none'; return; }
  grid.innerHTML = list.map(kartuHtml).join('');
  wrap.style.display = '';
  animasiKartu(grid);
}

function renderBeranda() {
  const strip = document.getElementById('pinnedStrip');
  if (!strip) return; // bukan halaman beranda
  strip.innerHTML = PRODUK.filter(p => p.pinned)
    .sort((x, y) => x.pinned - y.pinned)
    .map(kartuHtml).join('');
  animasiKartu(strip);
  isiGrid(ambilRandomBeranda());
  renderSold();
}

// Slider kategori (Free Fire - CPM 1 - Jasa): geser / tap slide samar = pindah
// ke tengah. Tap slide tengah atau tombol "Lihat Produk" = buka halaman kategori.
function initSliderKategori() {
  const el = document.querySelector('.katSwiper');
  const tombol = document.getElementById('btnLihatProduk');
  if (!el || !tombol || typeof Swiper === 'undefined') return;

  const update = s => { tombol.href = `kategori.html?game=${s.slides[s.activeIndex].dataset.game}`; };

  new Swiper(el, {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 12,
    loop: true,
    speed: 350,
    on: {
      init: update,
      slideChange: update,
      tap(s) {
        const sl = s.clickedSlide;
        if (!sl) return;
        if (sl === s.slides[s.activeIndex]) {
          window.location.href = `kategori.html?game=${sl.dataset.game}`;
        } else {
          s.slideTo(Array.from(s.slides).indexOf(sl));
        }
      }
    }
  });
}

// ==========================================================
// HALAMAN KATEGORI (kategori.html): semua produk sesuai kategori
// ==========================================================
function renderKategori() {
  const judul = document.getElementById('kategoriJudul');
  if (!judul) return; // bukan halaman kategori
  const game = new URLSearchParams(window.location.search).get('game');

  if (!GAME_LABEL[game]) {
    judul.textContent = 'Kategori Tidak Ditemukan';
    isiGrid([], 'Kategori yang kamu cari tidak ada.');
    return;
  }
  judul.textContent = GAME_LABEL[game];
  document.title = `${GAME_LABEL[game]} - ZIMM STORE`;
  isiGrid(
    PRODUK.filter(p => gameOf(p) === game),
    'Produk segera hadir. Hubungi admin untuk info lebih lanjut.'
  );
}

// ==========================================================
// HALAMAN DETAIL PRODUK (produk.html)
// ==========================================================

const LABEL_KATEGORI = { livery: "Livery", jasa: "Jasa" };
const URL_ATURAN = "https://zimmstores.my.id/aturan.html";

function renderProdukDetail() {
  const root = document.getElementById('produkDetailRoot');
  if (!root) return; // bukan halaman produk.html

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const p = id ? cariProdukById(id) : null;

  if (!p) {
    root.innerHTML = `
      <div class="produk-detail-deskripsi" style="text-align:center;">
        <h3>Produk Tidak Ditemukan</h3>
        <p>Produk yang kamu cari mungkin sudah tidak tersedia atau link-nya salah.</p>
      </div>`;
    return;
  }

  document.title = `${p.nama} - ZIMM STORE`;

  // Kumpulkan foto: gambar utama + galeri tambahan (kalau ada)
  const fotoList = [p.gambar, ...(p.galeri || [])];
  const slidesHtml = fotoList.map(src => `
    <div class="swiper-slide${p.sold ? ' sold-slide' : ''}"><img src="${src}" alt="${p.nama}"${p.sold ? '' : ' class="clickable-img"'}></div>
  `).join('');

  const kategoriBadge = LABEL_KATEGORI[p.kategori]
    ? `<span class="badge badge-kategori">${LABEL_KATEGORI[p.kategori]}</span>` : "";
  const extraBadges = [];
  if (p.badge) extraBadges.push(`<span class="badge ${p.badge.class}">${p.badge.text}</span>`);
  if (p.limited && !p.badge) extraBadges.push(`<span class="badge badge-limited">⭐ Limited</span>`);
  if (p.new) extraBadges.push(`<span class="badge badge-new">NEW</span>`);

  const status = p.status || "⚡ PROSES SATSET";
  const oldPriceHtml = p.hargaLama ? `<span class="old-price">${p.hargaLama}</span>` : "";
  const deskripsi = p.deskripsi || deskripsiDefault(p);

  // Jasa otomatis pakai orderJasa, livery pakai order
  const orderFn = p.orderFn || (p.kategori === "jasa" ? "orderJasa" : "order");
  const orderNama = (p.orderNama || p.nama).replace(/'/g, "\\'");
  const btnOrderText = p.sold ? "SOLD OUT"
    : p.closed ? "Antrian Full"
    : (p.btnText || "Order Sekarang");
  const btnOrderHtml = (p.sold || p.closed)
    ? `<button class="btn-order ${p.sold ? 'sold-btn' : 'closed-btn'}" disabled>${btnOrderText}</button>`
    : `<button class="btn-order" onclick="${orderFn}('${orderNama}', this)">${btnOrderText}</button>`;

  root.innerHTML = `
    <div class="produk-galeri ${fotoList.length <= 1 ? 'satu-foto' : ''}">
      <div class="swiper produkSwiper">
        <div class="swiper-wrapper">${slidesHtml}</div>
        <div class="swiper-pagination"></div>
      </div>
    </div>

    <div class="produk-detail-badge">${kategoriBadge}${extraBadges.join('')}</div>

    <h1 class="produk-detail-nama">${p.nama}</h1>
    <p class="produk-detail-status">${status}</p>

    <div class="produk-detail-harga">
      ${oldPriceHtml}
      <span class="new-price">${p.harga}</span>
    </div>

    <div class="produk-detail-deskripsi">
      <h3>Deskripsi</h3>
      <p>${deskripsi}</p>
    </div>

    <div class="produk-detail-actions">
      ${btnOrderHtml}
      <div class="produk-detail-row">
        <a class="btn-aturan" href="${URL_ATURAN}" target="_blank" rel="noopener">📋 Peraturan Order!</a>
        <button class="btn-share" onclick="shareProduk('${p.nama.replace(/'/g, "\\'")}')">🔗 Share</button>
      </div>
    </div>
  `;

  // Inisialisasi galeri swiper (kalau foto cuma 1, tetap aman, cuma gak ada dot aktif ganda)
  if (typeof Swiper !== 'undefined') {
    new Swiper(".produkSwiper", {
      slidesPerView: 1,
      loop: fotoList.length > 1,
      pagination: { el: ".swiper-pagination", clickable: true },
    });
  }

  renderProdukRelated(p);
}

// Acak urutan array pakai algoritma Fisher-Yates (gak ngubah array aslinya)
function acakArray(arr) {
  const hasil = [...arr];
  for (let i = hasil.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
  }
  return hasil;
}

// Render produk lain dengan kategori sama (kecuali produk ini sendiri & yang sold out)
function renderProdukRelated(produkSekarang) {
  const wrap = document.getElementById('produkRelatedWrap');
  const grid = document.getElementById('produkRelatedGrid');
  if (!wrap || !grid) return;

  const kandidat = PRODUK.filter(p =>
    gameOf(p) === gameOf(produkSekarang) &&
    p.id !== produkSekarang.id &&
    !p.sold
  );
  const related = acakArray(kandidat).slice(0, 6);

  if (related.length === 0) return;

  grid.innerHTML = related.map(p => {
    return `
    <div class="card ${p.kategori} ${p.owner}">
      <a class="img-container" href="produk.html?id=${encodeURIComponent(p.id)}">
        <img src="${p.gambar}" alt="${p.nama}">
      </a>
      <div class="card-body">
        <div class="title-wrap"><h4>${p.nama}</h4></div>
        <div class="card-footer">
          <div class="price-section">
            <span class="new-price">${p.harga}</span>
          </div>
          <a class="btn-detail" href="produk.html?id=${encodeURIComponent(p.id)}">Selengkapnya..</a>
        </div>
      </div>
    </div>`;
  }).join('');

  wrap.style.display = "";
  animasiKartu(grid);
}

// Fungsi Share: pakai Web Share API kalau didukung (HP), fallback copy link
function shareProduk(namaProduk) {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: `${namaProduk} - ZIMM STORE`, url }).catch(() => {});
    return;
  }
  navigator.clipboard.writeText(url).then(() => {
    const toast = document.getElementById('toastShare');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  });
}

// Tampilan skeleton sementara sebelum renderProduk() selesai jalan
function renderSkeleton(jumlah = 6) {
  const grid = document.getElementById('produkGrid');
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
  let swiperUtama = null; // slider utama (dipakai juga buat tap slide samar)

  // -1. Render produk dari data PRODUK di atas (harus paling awal,
  // biar fitur zoom & filter di bawah ini kebagian elemen yang baru dibuat)
  renderBeranda();
  renderKategori();
  initSliderKategori();

  // -1b. Kalau ini halaman produk.html, render detail produknya
  renderProdukDetail();

  // 1. Inisialisasi Swiper Slider
  if (typeof Swiper !== 'undefined') {
    const wrapperUtama = document.querySelector('.mySwiper .swiper-wrapper');
    const dotsUtama = document.querySelector('.mySwiper .swiper-pagination');
    const slideAsli = Array.from(wrapperUtama.children);
    const jumlahAsli = slideAsli.length;

    // Swiper mode loop + slidesPerView:'auto' butuh slide yang cukup banyak
    // (kalau cuma 3 loop-nya rusak). Jadi slide digandakan sampai minimal 6,
    // sama seperti slider kategori. Salinan ditandai .slide-klon supaya
    // tidak ikut dihitung di zoom ("1 dari 3").
    while (wrapperUtama.children.length < 6 && jumlahAsli > 1) {
      slideAsli.forEach(s => {
        const c = s.cloneNode(true);
        c.classList.add('slide-klon');
        wrapperUtama.appendChild(c);
      });
    }

    const totalSlide = wrapperUtama.children.length; // sudah termasuk salinan, belum termasuk duplikat internal Swiper

    swiperUtama = new Swiper(".mySwiper", {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: -6,         // rapat ke slide tengah (negatif = makin menempel)
      loop: true,
      speed: 600,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
    });

    // Titik pagination dibuat manual: tetap sebanyak slide asli (3), bukan 6
    if (dotsUtama) {
      // Kelas bawaan Swiper yang memosisikan titik di tengah bawah (biasanya ditambah
      // otomatis oleh modul pagination, tapi sekarang titiknya dibuat manual)
      dotsUtama.classList.add('swiper-pagination-bullets', 'swiper-pagination-horizontal');
      dotsUtama.innerHTML = slideAsli.map(() => '<span class="swiper-pagination-bullet"></span>').join('');
      const dots = Array.from(dotsUtama.children);
      const updateDots = () => {
        const aktif = swiperUtama.realIndex % jumlahAsli;
        dots.forEach((d, i) => d.classList.toggle('swiper-pagination-bullet-active', i === aktif));
      };
      swiperUtama.on('slideChange', updateDots);
      updateDots();
      dots.forEach((d, i) => d.addEventListener('click', () => {
        let selisih = ((i - swiperUtama.realIndex) % jumlahAsli + jumlahAsli) % jumlahAsli;
        if (selisih > jumlahAsli / 2) selisih -= jumlahAsli;
        swiperUtama.slideToLoop((swiperUtama.realIndex + selisih + totalSlide) % totalSlide);
      }));
    }
  }

  // 2. Fitur Zoom Gambar (Lightbox) ala Facebook — full screen, tombol X,
  // keterangan "1 dari 2", swipe antar gambar, pinch-zoom + pan
  const overlay = document.getElementById('imageOverlay');
  const zoomedImg = document.getElementById('zoomedImage');
  const overlayCloseBtn = document.getElementById('overlayCloseBtn');
  const overlayCounter = document.getElementById('overlayCounter');
  const clickableImgs = document.querySelectorAll('.clickable-img');

  if (overlay && zoomedImg) {
    let scale = 1, panX = 0, panY = 0;
    let startDistance = 0, startScale = 1;
    let panStartX = 0, panStartY = 0;
    let lastTapTime = 0;
    let mode = null; // null | 'pinch' | 'pan' | 'swipe' | 'none' — cuma 1 mode aktif per gesture
    let swipeStartX = 0, swipeCurrentX = 0;
    let sedangGesture = false; // true saat/baru selesai gesture, cegah overlay ke-anggap "tap nutup"
    let rafPending = false;
    let isAnimating = false; // true selagi animasi pindah gambar jalan, biar gak nyerempet gesture lain
    let paksaSelesaikanAnimasi = null; // fungsi buat langsung "loncat" ke hasil akhir animasi yang lagi jalan (dipanggil kalau gesture baru masuk sebelum animasi kelar sendiri)

    let zoomGroup = [];  // daftar src gambar dalam 1 galeri/slider yang sama
    let zoomIndex = 0;   // index gambar yang lagi dibuka
    let baseW = 0, baseH = 0; // ukuran gambar asli (sebelum di-scale), buat hitung batas geser

    // Lapisan preview gambar tetangga (sebelum/sesudah) yang ngikutin jari real-time
    // pas swipe, biar keliatan 2 gambar geser bareng kayak Facebook Marketplace.
    let previewWrap = null, previewImg = null, previewArah = null, previewIndex = null;

    function buatOrUpdatePreview(arah) {
      if (zoomGroup.length <= 1) return;
      let idx = arah === 'left' ? zoomIndex + 1 : zoomIndex - 1;
      if (idx < 0) idx = zoomGroup.length - 1;
      if (idx >= zoomGroup.length) idx = 0;

      if (previewWrap && previewArah === arah) return; // udah ada & arah sama

      if (previewWrap) previewWrap.remove(); // arah ganti di tengah drag, buang yang lama

      previewArah = arah;
      previewIndex = idx;
      previewWrap = document.createElement('div');
      previewWrap.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:1;';
      previewImg = document.createElement('img');
      previewImg.src = zoomGroup[idx];
      previewImg.style.cssText = 'max-width:100%; max-height:100%;';
      previewWrap.style.transition = 'none';
      previewWrap.appendChild(previewImg);
      overlay.appendChild(previewWrap);
    }

    function updatePreviewPosisi(swipeX) {
      if (!previewWrap) return;
      const offset = previewArah === 'left' ? window.innerWidth : -window.innerWidth;
      previewWrap.style.transform = `translateX(${offset + swipeX}px)`;
    }

    function buangPreview() {
      if (previewWrap) previewWrap.remove();
      previewWrap = null; previewImg = null; previewArah = null; previewIndex = null;
    }

    function updateBaseSize() {
      baseW = zoomedImg.offsetWidth;
      baseH = zoomedImg.offsetHeight;
    }
    zoomedImg.addEventListener('load', updateBaseSize);
    window.addEventListener('resize', updateBaseSize);

    // Cegah gambar ditarik ngelewatin batas layar (nyisain area kosong item di pinggir)
    function batasiPan() {
      const maxPanX = Math.max(0, (baseW * scale - window.innerWidth) / 2);
      const maxPanY = Math.max(0, (baseH * scale - window.innerHeight) / 2);
      panX = Math.min(maxPanX, Math.max(-maxPanX, panX));
      panY = Math.min(maxPanY, Math.max(-maxPanY, panY));
    }

    function terapkanTransform(halus) {
      batasiPan();
      zoomedImg.style.transition = halus ? 'transform 0.25s ease' : 'none';
      zoomedImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    }

    // Batasi update transform maksimal 1x per frame biar gesture gak "stuck"/patah-patah
    function terapkanTransformHalus() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        terapkanTransform(false);
        rafPending = false;
      });
    }

    function resetZoom() {
      scale = 1; panX = 0; panY = 0;
      terapkanTransform(false);
    }

    function updateCounter() {
      if (!overlayCounter) return;
      overlayCounter.textContent = zoomGroup.length > 0 ? `${zoomIndex + 1} dari ${zoomGroup.length}` : '';
    }

    // Ambil semua gambar "clickable-img" yang satu slider/galeri sama kayak gambar yang diklik
    // (skip slide duplikat yang dibuat Swiper buat loop, biar hitungan "1 dari 2" gak kacau)
    function ambilGrupGambar(img) {
      const container = img.closest('.swiper') || img.parentElement;
      if (!container) return [img.src];
      const slides = container.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate):not(.slide-klon) .clickable-img');
      const imgs = slides.length ? Array.from(slides) : Array.from(container.querySelectorAll('.clickable-img'));
      return imgs.length ? imgs.map(i => i.src) : [img.src];
    }

    function bukaZoom(group, index) {
      zoomGroup = group;
      zoomIndex = index;
      mode = null;
      isAnimating = false;
      buangPreview();
      overlay.style.display = 'flex';
      zoomedImg.style.transition = 'none';
      zoomedImg.style.opacity = '1';
      zoomedImg.src = zoomGroup[zoomIndex];
      updateBaseSize();
      resetZoom();
      updateCounter();
      document.body.classList.add('zoom-lock'); // kunci scroll halaman biar gesture jari gak direbut browser
      // Tambah history dummy agar tombol back HP bisa digunakan untuk menutup
      window.history.pushState({ viewing: true }, "Viewing Image", "#viewing-image");
    }

    function tutupZoom() {
      overlay.style.display = 'none';
      resetZoom();
      buangPreview();
      document.body.classList.remove('zoom-lock');
      if (window.location.hash === "#viewing-image") {
        window.history.back();
      }
    }

    // Pindah ke gambar berikutnya/sebelumnya dalam galeri yang sama, dengan animasi slide.
    // Kalau dipanggil pas lagi drag (preview udah ada & posisinya lagi ngikutin jari),
    // animasi ini nerusin dari situ. Kalau dipanggil dari keyboard (belum ada drag
    // sama sekali), preview dibikin dulu dari posisi diam di luar layar.
    function pindahGambar(arah) { // arah: 'left' (next) atau 'right' (prev)
      if (isAnimating) return;

      if (zoomGroup.length <= 1) {
        // Cuma 1 foto: gak ada tempat dituju, balikin posisi aja
        zoomedImg.style.transition = 'transform 0.2s ease';
        zoomedImg.style.transform = 'translateX(0px)';
        return;
      }

      isAnimating = true;
      const durasi = 220; // ms

      if (!previewWrap || previewArah !== arah) {
        buatOrUpdatePreview(arah);
        const jarakAwalMasuk = arah === 'left' ? window.innerWidth : -window.innerWidth;
        previewWrap.style.transform = `translateX(${jarakAwalMasuk}px)`;
        void previewWrap.offsetWidth; // paksa reflow biar transisi berikut beneran jalan
      }

      // Keduanya digeser BERBARENGAN dalam 1 gerakan yang sama (nerusin dari posisi
      // sekarang kalau ini kelanjutan drag): gambar lama keluar, gambar baru masuk.
      const jarakKeluar = arah === 'left' ? -window.innerWidth : window.innerWidth;
      zoomedImg.style.transition = `transform ${durasi}ms ease`;
      previewWrap.style.transition = `transform ${durasi}ms ease`;
      zoomedImg.style.transform = `translateX(${jarakKeluar}px)`;
      previewWrap.style.transform = 'translateX(0px)';

      const newIndex = previewIndex;
      function selesaikan() {
        zoomIndex = newIndex;
        zoomedImg.src = zoomGroup[zoomIndex];
        updateBaseSize();
        updateCounter();
        scale = 1; panX = 0; panY = 0;

        // Tuker: gambar utama balik ke tengah (posisinya udah sama persis
        // dengan lapisan preview yang barusan selesai geser), lalu preview
        // dihapus — perpindahannya gak kelihatan sama sekali.
        zoomedImg.style.transition = 'none';
        zoomedImg.style.transform = 'translateX(0px)';
        buangPreview();
        isAnimating = false;
        paksaSelesaikanAnimasi = null;
      }

      const timeoutId = setTimeout(selesaikan, durasi);
      // Kalau ada gesture baru masuk sebelum durasi ini kelar (geser cepat
      // beruntun), animasi ini langsung "diloncatin" ke hasil akhir alih-alih
      // gesture barunya diabaikan/nunggu — biar swipe cepat gak kerasa macet.
      paksaSelesaikanAnimasi = function() {
        clearTimeout(timeoutId);
        selesaikan();
      };
    }

    // Batal geser (jari dilepas tapi belum lewat ambang batas): gambar utama &
    // preview sama-sama balik ke posisi istirahat masing-masing, lalu preview dibuang.
    function batalkanSwipe() {
      if (!previewWrap) {
        zoomedImg.style.transition = 'transform 0.2s ease';
        zoomedImg.style.transform = 'translateX(0px)';
        return;
      }
      isAnimating = true;
      const durasi = 200;
      const offsetIstirahat = previewArah === 'left' ? window.innerWidth : -window.innerWidth;
      zoomedImg.style.transition = `transform ${durasi}ms ease`;
      previewWrap.style.transition = `transform ${durasi}ms ease`;
      zoomedImg.style.transform = 'translateX(0px)';
      previewWrap.style.transform = `translateX(${offsetIstirahat}px)`;

      function selesaikan() {
        buangPreview();
        isAnimating = false;
        paksaSelesaikanAnimasi = null;
      }

      const timeoutId = setTimeout(selesaikan, durasi);
      paksaSelesaikanAnimasi = function() {
        clearTimeout(timeoutId);
        selesaikan();
      };
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

    // Buka zoom saat gambar (produk/slider/apapun) diklik
    clickableImgs.forEach(img => {
      img.addEventListener('click', () => {
        // Tap slide samar di slider utama = geser ke tengah dulu, bukan buka zoom
        const slideEl = img.closest('.mySwiper .swiper-slide');
        if (slideEl && swiperUtama && !slideEl.classList.contains('swiper-slide-active')) {
          swiperUtama.slideTo(Array.from(swiperUtama.slides).indexOf(slideEl));
          return;
        }
        const group = ambilGrupGambar(img);
        const idx = group.indexOf(img.src);
        bukaZoom(group, idx === -1 ? 0 : idx);
      });
    });

    // Tombol X buat nutup
    if (overlayCloseBtn) {
      overlayCloseBtn.addEventListener('click', tutupZoom);
    }

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

    // Double-tap (HP) untuk toggle zoom — cukup kena gambarnya biar akurat.
    // Dicek belum ada gerakan jari (mode masih null) biar gak ketuker sama swipe/pan.
    zoomedImg.addEventListener('touchend', (e) => {
      if (mode !== null) return;
      const sekarang = Date.now();
      if (sekarang - lastTapTime < 300 && e.touches.length === 0) {
        e.preventDefault();
        toggleDoubleTapZoom();
      }
      lastTapTime = sekarang;
    });

    // Gesture jari: pinch-zoom (2 jari), pan saat sudah zoom (1 jari),
    // atau swipe ganti gambar (1 jari, saat belum di-zoom & galeri > 1 foto).
    // Mode BARU ditentukan pas ada gerakan beneran (di touchmove), bukan
    // langsung pas jari nyentuh layar — biar tap/double-tap gak ketuker jadi swipe.
    // Dipasang di OVERLAY (bukan cuma gambar) karena saat pinch, jari sering
    // jatuh di luar batas gambar (area backdrop hitam)
    overlay.addEventListener('touchstart', (e) => {
      if (isAnimating && paksaSelesaikanAnimasi) {
        // Jari nyentuh layar lagi pas animasi pindah gambar sebelumnya masih
        // jalan (geser cepat beruntun). Daripada gesture baru ini diabaikan
        // sampai animasi lama kelar sendiri (kerasa "macet"/gak kegeser),
        // animasi lama langsung diselesaikan SEKARANG (loncat ke hasil akhir),
        // baru gesture baru ini diproses seperti biasa di bawah — mode dan
        // titik awal selalu diset ulang bersih, gak ada state basi kebawa.
        paksaSelesaikanAnimasi();
      }
      if (e.touches.length === 2) {
        e.preventDefault();
        mode = 'pinch';
        sedangGesture = true;
        startDistance = jarakDuaJari(e.touches[0], e.touches[1]);
        startScale = scale;
      } else if (e.touches.length === 1) {
        // Belum tentuin mode dulu — cuma nyimpen titik awal.
        // Mode baru di-set di touchmove kalau jarinya beneran gerak.
        mode = null;
        panStartX = e.touches[0].clientX - panX;
        panStartY = e.touches[0].clientY - panY;
        swipeStartX = e.touches[0].clientX;
        swipeCurrentX = 0;
      }
    }, { passive: false });

    overlay.addEventListener('touchmove', (e) => {
      if (mode === 'pinch' && e.touches.length === 2) {
        e.preventDefault();
        const jarakSekarang = jarakDuaJari(e.touches[0], e.touches[1]);
        scale = Math.min(Math.max(startScale * (jarakSekarang / startDistance), 1), 4);
        terapkanTransformHalus();
        return;
      }

      if (e.touches.length !== 1) return;

      // Baru putuskan mode di sini, begitu ada gerakan pertama
      if (mode === null) {
        if (scale > 1) {
          mode = 'pan';
        } else if (zoomGroup.length > 1) {
          mode = 'swipe';
          zoomedImg.style.transition = 'none';
        } else {
          mode = 'none'; // gak ada apa-apa buat digeser, diemin aja
        }
        sedangGesture = true;
      }

      if (mode === 'pan') {
        e.preventDefault();
        panX = e.touches[0].clientX - panStartX;
        panY = e.touches[0].clientY - panStartY;
        terapkanTransformHalus();
      } else if (mode === 'swipe') {
        e.preventDefault();
        swipeCurrentX = e.touches[0].clientX - swipeStartX;
        if (!rafPending) {
          rafPending = true;
          requestAnimationFrame(() => {
            rafPending = false;
            // Kalau pas frame ini kesampaian jalan, jarinya udah keburu diangkat
            // dan touchend sudah mulai animasi/reset duluan (mode udah bukan
            // 'swipe' lagi) — update basi ini harus dibuang, jangan dipakai,
            // soalnya bisa nimpa transform yang lagi dianimasikan touchend
            // (efeknya: gambar keliatan ketarik balik/geser sendiri tiba-tiba).
            if (mode !== 'swipe') return;
            zoomedImg.style.transform = `translateX(${swipeCurrentX}px)`;
            if (swipeCurrentX !== 0) {
              const arahSekarang = swipeCurrentX < 0 ? 'left' : 'right';
              buatOrUpdatePreview(arahSekarang);
              updatePreviewPosisi(swipeCurrentX);
            }
          });
        }
      }
    }, { passive: false });

    overlay.addEventListener('touchend', (e) => {
      if (mode === 'swipe' && e.touches.length === 0) {
        const ambangBatas = 60; // jarak minimal (px) biar dianggap swipe, bukan tap
        if (swipeCurrentX <= -ambangBatas) {
          pindahGambar('left');
        } else if (swipeCurrentX >= ambangBatas) {
          pindahGambar('right');
        } else {
          batalkanSwipe();
        }
        swipeCurrentX = 0;
      }

      if (e.touches.length === 0) {
        mode = null;
        if (scale < 1) { scale = 1; panX = 0; panY = 0; terapkanTransform(true); }
        // Jeda dikit sebelum overlay bisa di-tap nutup lagi,
        // biar ujung gesture barusan gak ke-anggap tap nutup
        setTimeout(() => { sedangGesture = false; }, 200);
      } else if (e.touches.length < 2) {
        // Salah satu dari 2 jari pinch diangkat duluan
        mode = null;
      }
    });

    // Zoom manual pakai scroll wheel (desktop)
    zoomedImg.addEventListener('wheel', (e) => {
      e.preventDefault();
      scale = Math.min(Math.max(scale + (e.deltaY > 0 ? -0.2 : 0.2), 1), 4);
      if (scale === 1) { panX = 0; panY = 0; }
      terapkanTransformHalus();
    });

    // Panah kiri/kanan (desktop) buat pindah gambar dalam galeri
    document.addEventListener('keydown', (e) => {
      if (overlay.style.display !== 'flex') return;
      if (e.key === 'Escape') tutupZoom();
      if (scale > 1) return; // lagi di-zoom, panah dipakai browser default aja
      if (e.key === 'ArrowRight') pindahGambar('left');
      if (e.key === 'ArrowLeft') pindahGambar('right');
    });
  }
}; // <-- Penutup window.onload sekarang di sini, semua variabel aman.

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

// 3c. Order untuk jasa umum (MC/Rekber, Jasa W16, dll)
function orderJasa(nama, element) {
  const nomorWA = "6285119516679";
  const pesan = `*Halo Zimm Store Aku Ingin Memesan ${nama}*\n*Nama (In-Game):*\n*UID CPM 1:*`;

  window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');
}

// 3d. Order khusus MC/Rekber
function orderMc(nama, element) {
  const nomorWA = "6285119516679";
  const pesan = [
    "*Halo ZimmStore Aku Ingin Pakai Jasa MC/Rekber*",
    "",
    "_*BACA PERATURAN‼️:*_",
    "✅️ Pastikan tunggu admin merespon (bukan bot yang merespon) sebelum diculik ke grup.",
    "✅️ Jasa open pada 15.00-21.00 WIB.",
    "✅️ Pastikan barang legal.",
    "✅️ Terdapat FEE (Biaya Admin) dalam jasa ini.",
    "✅️ FEE Tetap terpotong saat transaksi gagal."
  ].join("\n");

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

// 5. Fungsi Search Produk (cari di semua produk, bukan cuma yang tampil)
function searchProduk() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const pinnedWrap = document.getElementById('pinnedWrap');
  const soldWrap = document.getElementById('soldWrap');
  if (!q) {
    if (pinnedWrap) pinnedWrap.style.display = "";
    isiGrid(ambilRandomBeranda());
    renderSold();
    return;
  }
  if (pinnedWrap) pinnedWrap.style.display = "none";
  if (soldWrap) soldWrap.style.display = "none"; // hasil pencarian sudah memuat produk sold juga
  isiGrid(PRODUK.filter(p => p.nama.toLowerCase().includes(q)));
}

// 6. Fungsi Dropdown Menu Titik Tiga
function toggleMenu(event) {
    event.stopPropagation(); // Biar gak ketutup pas diklik
    const menu = document.getElementById("dropdownMenu");
    const icon = document.querySelector(".kebab-icon");
    const terbuka = menu.classList.toggle("show-menu");
    // Titik tiga berubah jadi silang pas menu kebuka, balik lagi pas ketutup
    if (icon) icon.classList.toggle("active", terbuka);
}

// Menutup menu otomatis jika klik di luar area
window.addEventListener('click', function(event) {
    const menu = document.getElementById("dropdownMenu");
    if (menu && menu.classList.contains('show-menu')) {
        if (!event.target.closest('.menu-wrapper')) {
            menu.classList.remove('show-menu');
            const icon = document.querySelector(".kebab-icon");
            if (icon) icon.classList.remove("active");
        }
    }
});

// 7. Fungsi Filter Kategori Aturan (khusus halaman aturan.html)
function filterAturan(kategori, element) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  document.querySelectorAll('.aturan-card').forEach(card => {
    card.style.display = card.classList.contains(kategori) ? 'block' : 'none';
  });
}

// 8. Tombol mengambang: "Hubungi Admin" (WhatsApp) di kanan bawah
//    + tombol kembali ke atas di tengah bawah (muncul setelah scroll)
function initTombolMengambang() {
  const nomorWA = "6285119516679";
  const pesan = "Halo Zimm Store, aku mau tanya";

  const wa = document.createElement('a');
  wa.className = 'wa-float';
  wa.href = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'Hubungi Admin lewat WhatsApp');
  wa.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    <span>Hubungi Admin</span>`;
  document.body.appendChild(wa);

  const atas = document.createElement('button');
  atas.type = 'button';
  atas.className = 'btn-top';
  atas.setAttribute('aria-label', 'Kembali ke atas');
  atas.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 15 12 9 18 15"/></svg>`;
  atas.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(atas);

  const cek = () => atas.classList.toggle('show', window.scrollY > 400);
  window.addEventListener('scroll', cek, { passive: true });
  cek();
}
initTombolMengambang();


// 9. Mode gelap: tombol bulan/matahari di navbar (kiri titik tiga).
//    Pilihan disimpan; kalau belum pernah memilih, ikut pengaturan HP.
//    (tema awal dipasang oleh script kecil di <head> tiap halaman)
function initTema() {
  const kanan = document.querySelector('.header-right');
  if (!kanan) return;
  const root = document.documentElement;

  const BULAN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const MATAHARI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'theme-toggle';

  const gelap = () => root.getAttribute('data-theme') === 'dark';
  const tampil = () => {
    btn.innerHTML = gelap() ? MATAHARI : BULAN;
    btn.setAttribute('aria-label', gelap() ? 'Ganti ke mode terang' : 'Ganti ke mode gelap');
  };

  btn.addEventListener('click', () => {
    if (gelap()) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'dark');
    try { localStorage.setItem('zimmTema', gelap() ? 'dark' : 'light'); } catch (e) {}
    tampil();
  });

  tampil();
  kanan.insertBefore(btn, kanan.firstChild);
}
initTema();
