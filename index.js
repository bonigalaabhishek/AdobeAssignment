"use strict";
const apiUrl = 'https://fakestoreapi.com/products';
let allProducts = [];
let displayedProducts = [];
let currentPage = 1;
const productsPerPage = 10;

const productGrid = document.getElementById('product-grid');
const loadMoreButton = document.getElementById('load-more');
const loadingIndicator = document.getElementById('loading');
const searchBar = document.getElementById('search-bar');
const sortDropdown = document.getElementById('sort');
const filterButton = document.getElementById('filter-button');
const resultCount=document.getElementById("result-count");
const filterResultCount=document.getElementById("filter-result-count");
const categoryCheckboxes = document.querySelectorAll('.filters-category input[type="checkbox"]');
const categoryCheckboxes2 = document.querySelectorAll('.filters-category2 input[type="checkbox"]');

async function fetchProducts() {
    try {
        showLoading();
        const response = await fetch(apiUrl);
        allProducts = await response.json();
        displayedProducts = allProducts.slice(0, productsPerPage * currentPage);
        renderProducts(displayedProducts);
        hideLoading();
    } catch (error) {
        handleError(error);
    }
}

function renderProducts(products) {
    productGrid.innerHTML = '';
    let totalProducts = products.length;
    console.log(totalProducts,allProducts.length,displayedProducts.length)
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h4>${product.title.substring(0, 20)}...</h4>
            <p>$${product.price}</p>
            <h6>${product.description.substring(0, 40)}...</h6>
        `;
        productGrid.appendChild(productCard);
    });
    resultCount.innerText = `${totalProducts} Results`;
    filterResultCount.innerHTML=`See ${totalProducts} Results`
    if (totalProducts < allProducts.length) {
      document.getElementById('load-more').style.display = 'block'; 
  }else{
    document.getElementById('load-more').style.display = 'none'; 

  } 
}

// Filter products based on selected categories
function filterProductsByCategory() {
  // Get all selected categories
  const selectedCategories = [];
  categoryCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedCategories.push(checkbox.value);
    }
  });
  categoryCheckboxes2.forEach(checkbox => {
    if (checkbox.checked) {
      selectedCategories.push(checkbox.value);
    }
  });
console.log(selectedCategories)
  if (selectedCategories.length === 0) {
      displayedProducts = allProducts.slice(0, productsPerPage);
  } else {
      displayedProducts = allProducts.filter(product =>
          selectedCategories.includes(product.category)
      );
  }
  
  renderProducts(displayedProducts);
  if(selectedCategories.length>0){
    loadMoreButton.style.display = 'none';
  }


}

categoryCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', filterProductsByCategory);
});
categoryCheckboxes2.forEach(checkbox => {
  checkbox.addEventListener('change', filterProductsByCategory);
});
loadMoreButton.addEventListener('click', () => {
    currentPage++;
    const newProducts = allProducts.slice(0, productsPerPage * currentPage);
    renderProducts(newProducts);
});

// Filter products based on search
searchBar.addEventListener('input', (e) => {
    const searchQuery = e.target.value.toLowerCase();
    console.log(searchQuery.length)
    const filteredProducts = displayedProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery)
    );
    renderProducts(filteredProducts);
    if(searchQuery){
      loadMoreButton.style.display = 'none';
    }
    
   
});

sortDropdown.addEventListener('change', () => {
    const sortValue = sortDropdown.value;
    let currentPage=1;
    let sortedProducts = [...allProducts];

    if (sortValue === 'priceAsc') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'priceDesc') {
        sortedProducts.sort((a, b) => b.price - a.price);
    }

    displayedProducts = sortedProducts.slice(0, productsPerPage * currentPage);
    renderProducts(displayedProducts);
});

function showLoading() {
    loadingIndicator.style.display = 'block';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

function handleError(error) {
    productGrid.innerHTML = `<p>Error fetching products. Please try again later.</p>`;
    console.error('Error:', error);
}

fetchProducts();

document.addEventListener('DOMContentLoaded', function() {
  const filterText = document.getElementById('filter-text');
  const sortText = document.getElementById('sort-text');
  const sidebar = document.querySelector('.sidebar');
  const closeSidebar = document.getElementById('close-sidebar');

  filterText.addEventListener('click', () => {
      sidebar.classList.add('open');
  });

  // sortText.addEventListener('click', () => {
  //     sidebar.classList.add('open');
  // });

  // Close sidebar when close button is clicked
  closeSidebar.addEventListener('click', () => {
      sidebar.classList.remove('open');
  });
  filterResultCount.addEventListener('click', () => {
      sidebar.classList.remove('open');
  });
});

  