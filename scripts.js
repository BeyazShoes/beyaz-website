/*
 * Shared JavaScript for the BEYAZ website.
 */

// ─── Global UI ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initScrollHeader();

  const page = document.body.dataset.page;
  if (page === 'catalog') {
    initCatalog();
  } else if (page === 'product') {
    initProductPage();
  }
});

function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('nav ul');
  if (!hamburger || !navList) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('nav-open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
      navList.classList.remove('nav-open');
      hamburger.classList.remove('open');
    }
  });
}

function initScrollHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ─── Product Data ───────────────────────────────────────────────────────────

async function fetchProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (err) {
    console.error('Error loading products:', err);
    return [];
  }
}

// ─── Catalog Page ───────────────────────────────────────────────────────────

async function initCatalog() {
  const products = await fetchProducts();
  const grid = document.querySelector('.product-grid');
  const filterButtons = document.querySelectorAll('.filters button');
  let activeFilter = 'all';

  function buildBadges(product) {
    const badges = [];
    if (product.new) badges.push('<span class="badge badge-new">New</span>');
    if (product.bestSeller) badges.push('<span class="badge badge-bestseller">Best Seller</span>');
    return badges.length ? `<div class="product-badges">${badges.join('')}</div>` : '';
  }

  function render(items) {
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach((product) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-card-img-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-info">
          ${buildBadges(product)}
          <h4>${product.name}</h4>
          <div class="price">${product.price}</div>
          <div class="cta">
            <a class="button button-outline" href="product.html?id=${product.id}">View Details</a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  const searchInput = document.getElementById('catalog-search-input');

  function applyFilterAndSearch() {
    let filtered = products;
    if (activeFilter === 'men' || activeFilter === 'women') {
      filtered = filtered.filter((p) => p.category === activeFilter);
    } else if (activeFilter === 'new') {
      filtered = filtered.filter((p) => p.new);
    } else if (activeFilter === 'bestseller') {
      filtered = filtered.filter((p) => p.bestSeller);
    }
    if (searchInput && searchInput.value.trim()) {
      const query = searchInput.value.trim().toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }
    render(filtered);
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      activeFilter = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilterAndSearch();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilterAndSearch);
  }

  applyFilterAndSearch();
}

// ─── Product Detail Page ────────────────────────────────────────────────────

async function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const products = await fetchProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return;

  // Update page title
  document.title = `${product.name} – BEYAZ`;

  // Populate text fields
  document.querySelector('.product-title').textContent = product.name;

  const mainImgEl = document.querySelector('.product-image-main');
  mainImgEl.src = product.image;
  mainImgEl.alt = product.name;

  const setText = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = val || '—';
  };

  setText('.product-description', product.description);
  setText('.product-materials', product.materials);
  setText('.product-sizes', product.sizes);
  setText('.product-colorways', product.colorways);
  setText('.product-care', product.care);
  setText('.product-lead-time', product.lead_time);
  setText('.product-moq', product.moq);

  // Thumbnails
  const thumbnailsContainer = document.querySelector('.product-thumbnails');
  if (thumbnailsContainer && Array.isArray(product.images) && product.images.length > 1) {
    thumbnailsContainer.innerHTML = '';
    product.images.forEach((imgSrc) => {
      const thumb = document.createElement('img');
      thumb.src = imgSrc;
      thumb.alt = product.name;
      thumb.addEventListener('click', () => {
        mainImgEl.src = imgSrc;
      });
      thumbnailsContainer.appendChild(thumb);
    });
  }

  // Inquiry form hidden fields
  const form = document.querySelector('#inquiry-form');
  if (form) {
    form.querySelector('input[name="product_id"]').value = product.id;
    form.querySelector('input[name="product_name"]').value = product.name;
  }
}
