# BEYAZ Istanbul Shoes – B2B Website

This repository contains a simple, static website for **BEYAZ** Istanbul Shoes.  
The goal of the site is to showcase handcrafted footwear to business buyers (boutiques, retailers, stylists and wholesalers) and to encourage wholesale inquiries.

## Structure

```
├── index.html          # Home page
├── about.html          # About the founder
├── catalog.html        # Product catalog with filters
├── product.html        # Template for individual product pages
├── wholesale.html      # Information on wholesale/how it works
├── contact.html        # Contact page with form
├── admin/
│   ├── index.html      # Netlify/Decap CMS admin interface
│   └── config.yml      # CMS configuration (editable products)
├── data/
│   └── products.json   # Sample product data used by the catalog and product pages
├── assets/
│   ├── css/
│   │   └── styles.css  # Shared styles
│   ├── js/
│   │   └── scripts.js  # Shared JavaScript (catalog & product logic)
│   └── images/
│       └── ...         # Logo, hero and product images
└── README.md
```

To update or add products without touching code, edit `data/products.json`.  
If you wish to provide a nicer editing interface, the included Netlify/Decap CMS configuration (`admin/config.yml`) can be used when the site is hosted on a platform that supports Git‑based CMS (e.g. Netlify).  
The site is fully static—no backend is required.  Simply open `index.html` in a browser or serve the folder with a static file server.