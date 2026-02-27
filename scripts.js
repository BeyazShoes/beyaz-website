/*
 * Shared JavaScript for the BEYAZ website.
 *
 * Responsible for loading product data, filtering the catalog and populating
 * individual product pages based on the query string.
 */

// Utility to fetch JSON data from a relative path
async function fetchProducts() {
  try {
    // Load products from root-level JSON file (GitHub Pages site has products.json at project root)
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error loading products:', err);
    return [];
  }
}

// Initialize the catalog page
async function initCatalog() {
  const products = await fetchProducts();
  const grid = document.querySelector('.product-grid');
  const filterButtons = document.querySelectorAll('.filters button');
  let activeFilter = 'all';

  function render(items) {
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach((product) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-info">
          <h4>${product.name}</h4>
          <div class="price">${product.price}</div>
          <div class="cta">
            <a class="button button-outline" href="product.html?id=${product.id}">Details</a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function applyFilter(filter) {
    let filtered = products;
    if (filter === 'men' || filter === 'women') {
      filtered = products.filter((p) => p.category === filter);
    } else if (filter === 'new') {
      filtered = products.filter((p) => p.new);
    } else if (filter === 'bestseller') {
      filtered = products.filter((p) => p.bestSeller);
    }
    render(filtered);
  }

  // Set up filter button listeners
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = btn.dataset.filter;
      activeFilter = filter;
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(filter);
    });
  });

  // Render all products initially
  applyFilter(activeFilter);
}

// Initialize the product detail page
async function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;
  const products = await fetchProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return;
  // Populate elements
  document.querySelector('.product-title').textContent = product.name;
  // Main image
  const mainImgEl = document.querySelector('.product-image-main');
  mainImgEl.src = product.image;
  document.querySelector('.product-description').textContent = product.description;
  document.querySelector('.product-materials').textContent = product.materials;
  document.querySelector('.product-sizes').textContent = product.sizes;
  document.querySelector('.product-colorways').textContent = product.colorways;
  document.querySelector('.product-care').textContent = product.care;
  document.querySelector('.product-lead-time').textContent = product.lead_time;
  document.querySelector('.product-moq').textContent = product.moq;

  // Populate thumbnails if multiple images exist
  const thumbnailsContainer = document.querySelector('.product-thumbnails');
  if (thumbnailsContainer && Array.isArray(product.images) && product.images.length > 1) {
    thumbnailsContainer.innerHTML = '';
    product.images.forEach((imgSrc) => {
      const thumb = document.createElement('img');
      thumb.src = imgSrc;
      thumb.style.width = '60px';
      thumb.style.height = '60px';
      thumb.style.objectFit = 'cover';
      thumb.style.cursor = 'pointer';
      thumb.style.border = '1px solid #eee';
      thumb.addEventListener('click', () => {
        mainImgEl.src = imgSrc;
      });
      thumbnailsContainer.appendChild(thumb);
    });
  }

  // Set form hidden fields for inquiry
  const form = document.querySelector('#inquiry-form');
  if (form) {
    form.querySelector('input[name="product_id"]').value = product.id;
    form.querySelector('input[name="product_name"]').value = product.name;
  }
}

// Setup page specific logic based on body data attribute
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'catalog') {
    initCatalog();
  } else if (page === 'product') {
    initProductPage();
  }
});