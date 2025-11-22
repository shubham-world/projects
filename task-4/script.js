/* ==========================================
   PART 1: PRODUCT FILTERING & SORTING (Task 3)
   ========================================== */

// 1. Our Data (Array of Objects)
const products = [
    { id: 1, name: "Laptop", category: "tech", price: 800 },
    { id: 2, name: "T-Shirt", category: "fashion", price: 20 },
    { id: 3, name: "Headphones", category: "tech", price: 150 },
    { id: 4, name: "Sneakers", category: "fashion", price: 90 },
    { id: 5, name: "Smart Watch", category: "tech", price: 200 },
    { id: 6, name: "Jeans", category: "fashion", price: 50 }
];

// 2. Function to display products with animations and spinner
function displayProducts(items) {
    const container = document.getElementById("product-grid");
    const spinner = document.getElementById("loading-spinner");
    spinner.style.display = "block";
    container.innerHTML = "";
    setTimeout(() => {  // Simulate loading delay for smoothness
        items.forEach((product, index) => {
            const div = document.createElement("div");
            div.className = "product-item";
            div.style.animationDelay = `${index * 0.1}s`;
            div.innerHTML = `
                <h3>${product.name}</h3>
                <p>Cat: ${product.category}</p>
                <p><strong>$${product.price}</strong></p>
            `;
            container.appendChild(div);
        });
        spinner.style.display = "none";
    }, 300);
}

// 3. Filter Function with spinner
function filterProducts(category) {
    const spinner = document.getElementById("loading-spinner");
    spinner.style.display = "block";
    setTimeout(() => {
        if (category === 'all') {
            displayProducts(products);
        } else {
            const filtered = products.filter(item => item.category === category);
            displayProducts(filtered);
        }
    }, 200);
}

// 4. Sort Function with spinner
function sortProducts() {
    const sortValue = document.getElementById("sortSelect").value;
    const spinner = document.getElementById("loading-spinner");
    spinner.style.display = "block";
    setTimeout(() => {
        let sortedItems = [...products];
        if (sortValue === 'low') {
            sortedItems.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'high') {
            sortedItems.sort((a, b) => b.price - a.price);
        }
        displayProducts(sortedItems);
    }, 200);
}

// Initialize view
displayProducts(products);

/* ==========================================
   PART 2: LOCAL STORAGE TO-DO LIST (Task 2)
   ========================================== */

// 1. Load notes from Local Storage when page loads with spinner
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');
    loadNotes();
});

function addNote() {
    const input = document.getElementById("noteInput");
    const noteText = input.value.trim();
    if (!noteText) return;
    const currentNotes = JSON.parse(localStorage.getItem("myNotes")) || [];
    currentNotes.push(noteText);
    localStorage.setItem("myNotes", JSON.stringify(currentNotes));
    input.value = "";
    loadNotes();
}

function loadNotes() {
    const list = document.getElementById("noteList");
    const spinner = document.getElementById("notes-spinner");
    spinner.style.display = "block";
    list.innerHTML = "";
    setTimeout(() => {
        const currentNotes = JSON.parse(localStorage.getItem("myNotes")) || [];
        currentNotes.forEach((note, index) => {
            const li = document.createElement("li");
            li.textContent = note;
            li.style.animationDelay = `${index * 0.1}s`;
            list.appendChild(li);
        });
        spinner.style.display = "none";
    }, 300);
}

function clearNotes() {
    if (confirm('Are you sure you want to clear all notes?')) {
        localStorage.removeItem("myNotes");
        loadNotes();
    }
}

// Theme toggle function
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Mobile menu toggle
function toggleMenu() {
    const ul = document.querySelector('nav ul');
    ul.style.display = ul.style.display === 'flex' ? 'none' : 'flex';
}