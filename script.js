// Data produk (array PRODUK, fungsi slugify, cariProdukById) sekarang
// ada di data.js supaya bisa dipakai bareng sama produk.html. Pastikan
// data.js sudah di-include di index.html SEBELUM script.js ini.

// Fungsi render otomatis: mengubah data PRODUK (dari data.js) jadi card HTML
function renderProduk() {
  const grid = document.getElementById('produkGrid');
  if (!grid) return;

  grid.innerHTML = PRODUK.map(p => {
    const kelas = ["card", p.kategori, p.owner];
    if (p.sold) kelas.push("sold");
    if (p.hotItem) kelas.push("hot-item");
    if (p.limited) kelas.push("limited");
    if (p.new) kelas.push("new");

    // Kumpulin semua badge yang aktif (hot + limited + new bisa nyala bareng, disusun vertikal)
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
  }).join('');
}

// ==========================================================
// HALAMAN DETAIL PRODUK (produk.html)
// ==========================================================

const LABEL_KATEGORI = { livery: "Livery", jasa: "Jasa" };
const URL_ATURAN = "https://zimmstore.vercel.app/aturan.html";

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

  const orderFn = p.orderFn || "order";
  const orderNama = (p.orderNama || p.nama).replace(/'/g, "\\'");
  const btnOrderText = p.btnText || (p.sold ? "SOLD OUT" : "Order Sekarang");
  const btnOrderHtml = p.sold
    ? `<button class="btn-order sold-btn" disabled>${btnOrderText}</button>`
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
    p.kategori === produkSekarang.kategori &&
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
  // -1. Render produk dari data PRODUK di atas (harus paling awal,
  // biar fitur zoom & filter di bawah ini kebagian elemen yang baru dibuat)
  renderProduk();

  // -1b. Kalau ini halaman produk.html, render detail produknya
  renderProdukDetail();

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
      const slides = container.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) .clickable-img');
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

// 7. Fungsi Filter Kategori Aturan (khusus halaman aturan.html)
function filterAturan(kategori, element) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  document.querySelectorAll('.aturan-card').forEach(card => {
    card.style.display = card.classList.contains(kategori) ? 'block' : 'none';
  });
}
