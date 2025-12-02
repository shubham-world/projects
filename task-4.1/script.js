// -----------------------------
// THEME TOGGLE
const themeToggleBtn = document.getElementById('theme-toggle');

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const currentTheme = document.body.classList.contains('dark-theme')
    ? 'dark'
    : 'light';
  localStorage.setItem('theme', currentTheme);
}

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
});

// -----------------------------
// MOBILE NAVIGATION TOGGLE
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('nav ul');

function toggleMenu() {
  navLinks.classList.toggle('show');
}

// Close mobile menu on link click
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('show');
  });
});

// -----------------------------
// TO-DO / NOTES APP

const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const noteList = document.getElementById('noteList');
const clearNotesBtn = document.getElementById('clearNotesBtn');

function loadNotes() {
  noteList.innerHTML = '';
  const notes = JSON.parse(localStorage.getItem('myNotes')) || [];
  notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = note;
    noteList.appendChild(li);
  });
}

function addNote() {
  const noteText = noteInput.value.trim();
  if (noteText === '') return;

  const notes = JSON.parse(localStorage.getItem('myNotes')) || [];
  notes.push(noteText);
  localStorage.setItem('myNotes', JSON.stringify(notes));
  noteInput.value = '';
  loadNotes();
}

function clearNotes() {
  if (confirm('Are you sure you want to clear all notes?')) {
    localStorage.removeItem('myNotes');
    loadNotes();
  }
}

addNoteBtn.addEventListener('click', addNote);

// Enable adding note on Enter
noteInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addNote();
  }
});

clearNotesBtn.addEventListener('click', clearNotes);

// Load notes on page load
window.addEventListener('DOMContentLoaded', loadNotes);

// -----------------------------
// PRODUCT LISTING WITH FILTERING & SORTING

const products = [
  {
    id: 1,
    name: 'Laptop Pro 15',
    category: 'tech',
    price: 1200,
    rating: 4.7,
  },
  {
    id: 2,
    name: 'Sneaker Running',
    category: 'fashion',
    price: 90,
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Bluetooth Headphones',
    category: 'tech',
    price: 120,
    rating: 4.5,
  },
  {
    id: 4,
    name: 'Coffee Table',
    category: 'home',
    price: 250,
    rating: 4.4,
  },
  {
    id: 5,
    name: 'T-Shirt Casual',
    category: 'fashion',
    price: 19,
    rating: 4.0,
  },
  {
    id: 6,
    name: 'Desk Lamp',
    category: 'home',
    price: 45,
    rating: 4.6,
  },
  {
    id: 7,
    name: 'Smart Watch',
    category: 'tech',
    price: 230,
    rating: 4.8,
  },
  {
    id: 8,
    name: 'Jeans Denim',
    category: 'fashion',
    price: 75,
    rating: 3.9,
  },
];

const productGrid = document.getElementById('productGrid');
const filterCategory = document.getElementById('filterCategory');
const sortOption = document.getElementById('sortOption');

function renderProducts(productList) {
  productGrid.innerHTML = '';
  if (productList.length === 0) {
    productGrid.innerHTML = '<p>No products found.</p>';
    return;
  }

  productList.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.tabIndex = 0;
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>Category: ${capitalize(product.category)}</p>
      <p>Price: $${product.price.toFixed(2)}</p>
      <p class="rating" aria-label="Rating">${renderStars(product.rating)} ${product.rating.toFixed(1)}</p>
    `;
    productGrid.appendChild(div);
  });
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '★';
  }
  if (halfStar) {
    stars += '☆';
  }
  return stars;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function filterAndSortProducts() {
  let filtered = [...products];
  const category = filterCategory.value;
  const sort = sortOption.value;

  // Filter by category
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Sort products
  switch (sort) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating-high':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'rating-low':
      filtered.sort((a, b) => a.rating - b.rating);
      break;
  }

  renderProducts(filtered);
}

filterCategory.addEventListener('change', filterAndSortProducts);
sortOption.addEventListener('change', filterAndSortProducts);

// Initial render
window.addEventListener('DOMContentLoaded', filterAndSortProducts);
