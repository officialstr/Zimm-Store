window.onload = function() {
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

  // 2. Fitur Zoom Gambar (Lightbox)
  const overlay = document.getElementById('imageOverlay');
  const zoomedImg = document.getElementById('zoomedImage');
  const clickableImgs = document.querySelectorAll('.clickable-img');

  if (overlay && zoomedImg) {
    // Fungsi untuk membuka zoom
    clickableImgs.forEach(img => {
      img.addEventListener('click', () => {
        overlay.style.display = 'flex';
        zoomedImg.src = img.src;
        // Tambah history dummy agar tombol back HP bisa digunakan untuk menutup
        window.history.pushState({viewing: true}, "Viewing Image", "#viewing-image");
      });
    });

    // Fungsi untuk menutup zoom saat overlay diklik
    overlay.addEventListener('click', () => {
      overlay.style.display = 'none';
      if (window.location.hash === "#viewing-image") {
          window.history.back();
      }
    });

    // Menangani tombol "Kembali" di HP/Browser untuk menutup zoom
    window.onpopstate = function() {
      overlay.style.display = 'none';
    };
  }
}; // <-- Penutup window.onload sekarang di sini, semua variabel aman.

// 3. Fungsi Order via WhatsApp
function order(nama, element) {
  const nomorWA = "6285119516679";
  const pesan = `*Halo Zimm Store Aku Ingin Memesan Stock Livery*\n*Nama (In-Game):*\n*UID CPM 1:*\n*Pesanan: ${nama}*`;

  window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');
}

// 3b. Fungsi Order khusus Custom Design Livery (dengan referensi desain)
function orderCustomDesign(nama, element) {
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
      card.style.display = 'block';
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
