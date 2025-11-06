/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productSearch = document.getElementById("productSearch");
const productsContainer = document.getElementById("productsContainer");
const selectedProductsList = document.getElementById("selectedProductsList");
const generateRoutineBtn = document.getElementById("generateRoutine");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");

/* Array to store selected products */
let selectedProducts = [];

/* Array to store conversation history for chat context */
let conversationHistory = [];

/* Store all loaded products for search functionality */
let allProducts = [];

/* Store current filtered products */
let currentProducts = [];

/* Store current category selection */
let currentCategory = "";

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load selected products from localStorage on page load */
window.addEventListener("DOMContentLoaded", () => {
  loadSelectedProductsFromStorage();
});

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  allProducts = data.products;
  return allProducts;
}

/* Save selected products to localStorage */
function saveSelectedProductsToStorage() {
  localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
}

/* Load selected products from localStorage */
function loadSelectedProductsFromStorage() {
  const stored = localStorage.getItem("selectedProducts");
  if (stored) {
    selectedProducts = JSON.parse(stored);
    updateSelectedProductsDisplay();
  }
}

/* Clear all selected products */
function clearAllSelections() {
  selectedProducts = [];
  saveSelectedProductsToStorage();
  updateSelectedProductsDisplay();
  /* Update visual state of product cards */
  document.querySelectorAll(".product-card").forEach((card) => {
    card.classList.remove("selected");
  });
}

/* Toggle product selection when card is clicked */
function toggleProductSelection(product) {
  /* Check if product is already selected by finding its index */
  const index = selectedProducts.findIndex((p) => p.id === product.id);

  if (index > -1) {
    /* Product is selected, so remove it */
    selectedProducts.splice(index, 1);
  } else {
    /* Product is not selected, so add it */
    selectedProducts.push(product);
  }

  /* Save to localStorage and update the display */
  saveSelectedProductsToStorage();
  updateSelectedProductsDisplay();
}

/* Update the selected products section */
function updateSelectedProductsDisplay() {
  if (selectedProducts.length === 0) {
    selectedProductsList.innerHTML = `
      <p class="empty-message">No products selected yet. Click on products to add them.</p>
    `;
    return;
  }

  /* Create HTML for each selected product with a remove button */
  selectedProductsList.innerHTML = selectedProducts
    .map(
      (product) => `
      <div class="selected-item">
        <img src="${product.image}" alt="${product.name}">
        <div class="selected-info">
          <h4>${product.name}</h4>
          <p>${product.brand}</p>
        </div>
        <button class="remove-btn" onclick="removeProduct(${product.id})">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
    `
    )
    .join("");

  /* Add clear all button */
  selectedProductsList.innerHTML += `
    <button class="clear-all-btn" onclick="clearAllSelections()">
      <i class="fa-solid fa-trash"></i> Clear All
    </button>
  `;
}

/* Remove a specific product from selection */
function removeProduct(productId) {
  selectedProducts = selectedProducts.filter((p) => p.id !== productId);
  saveSelectedProductsToStorage();
  updateSelectedProductsDisplay();

  /* Update visual state of the product card if it's visible */
  const card = document.querySelector(`[data-product-id="${productId}"]`);
  if (card) {
    card.classList.remove("selected");
  }
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  currentProducts = products;

  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">
        No products found matching your criteria
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = products
    .map((product) => {
      /* Check if this product is already selected */
      const isSelected = selectedProducts.some((p) => p.id === product.id);

      return `
    <div class="product-card ${isSelected ? "selected" : ""}" 
         data-product-id="${product.id}"
         onclick="handleProductClick(${product.id})">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
        <button class="toggle-description" onclick="event.stopPropagation(); toggleDescription(${
          product.id
        })">
          <i class="fa-solid fa-info-circle"></i> Details
        </button>
        <div class="product-description" id="desc-${
          product.id
        }" style="display: none;">
          <p>${product.description}</p>
        </div>
      </div>
    </div>
  `;
    })
    .join("");
}

/* Handle product card click for selection */
function handleProductClick(productId) {
  /* Find the product in all products */
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  /* Toggle selection */
  toggleProductSelection(product);

  /* Update visual state of the card */
  const card = document.querySelector(`[data-product-id="${productId}"]`);
  if (card) {
    card.classList.toggle("selected");
  }
}

/* Toggle product description visibility */
function toggleDescription(productId) {
  const descElement = document.getElementById(`desc-${productId}`);
  if (descElement) {
    if (descElement.style.display === "none") {
      descElement.style.display = "block";
    } else {
      descElement.style.display = "none";
    }
  }
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  currentCategory = e.target.value;

  /* Apply both category and search filters */
  applyFilters();
});

/* Filter products when search input changes */
productSearch.addEventListener("input", () => {
  applyFilters();
});

/* Apply both category and search filters */
async function applyFilters() {
  const products = await loadProducts();
  const searchTerm = productSearch.value.toLowerCase().trim();

  let filteredProducts = products;

  /* Filter by category if selected */
  if (currentCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === currentCategory
    );
  }

  /* Filter by search term if provided */
  if (searchTerm) {
    filteredProducts = filteredProducts.filter((product) => {
      /* Search in name, brand, category, and description */
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    });
  }

  displayProducts(filteredProducts);
}

/* Generate routine with OpenAI when button is clicked */
generateRoutineBtn.addEventListener("click", async () => {
  if (selectedProducts.length === 0) {
    addMessageToChat(
      "assistant",
      "Please select at least one product to generate a routine."
    );
    return;
  }

  /* Disable button while generating */
  generateRoutineBtn.disabled = true;
  generateRoutineBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

  /* Create prompt with selected products information */
  const productsInfo = selectedProducts
    .map((p) => `- ${p.brand} ${p.name} (${p.category}): ${p.description}`)
    .join("\n");

  const prompt = `I have the following skincare/beauty products:\n\n${productsInfo}\n\nPlease create a personalized routine that explains when and how to use each product for best results. Include morning and evening steps if applicable.`;

  try {
    /* Call OpenAI API through Cloudflare Worker */
    const response = await callOpenAI(prompt, true);

    /* Add the routine to chat window */
    addMessageToChat("assistant", response);
  } catch (error) {
    addMessageToChat(
      "assistant",
      `Error generating routine: ${error.message}. Please make sure your Cloudflare Worker is set up correctly.`
    );
  } finally {
    /* Re-enable button */
    generateRoutineBtn.disabled = false;
    generateRoutineBtn.innerHTML =
      '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Routine';
  }
});

/* Chat form submission handler for follow-up questions */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  /* Add user message to chat */
  addMessageToChat("user", message);

  /* Clear input field */
  userInput.value = "";

  try {
    /* Call OpenAI API with conversation history */
    const response = await callOpenAI(message, false);

    /* Add assistant response to chat */
    addMessageToChat("assistant", response);
  } catch (error) {
    addMessageToChat(
      "assistant",
      `Error: ${error.message}. Please make sure your Cloudflare Worker is set up correctly.`
    );
  }
});

/* Add message to chat window */
function addMessageToChat(role, content) {
  /* Create message element */
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${role}-message`;

  /* Add icon based on role */
  const icon =
    role === "user"
      ? '<i class="fa-solid fa-user"></i>'
      : '<i class="fa-solid fa-robot"></i>';

  messageDiv.innerHTML = `
    <div class="message-icon">${icon}</div>
    <div class="message-content">${content}</div>
  `;

  chatWindow.appendChild(messageDiv);

  /* Scroll to bottom of chat */
  chatWindow.scrollTop = chatWindow.scrollHeight;

  /* Add to conversation history */
  conversationHistory.push({
    role: role,
    content: content,
  });
}

/* Call OpenAI API via Cloudflare Worker */
async function callOpenAI(userMessage, isRoutineGeneration) {
  // Worker URL should be defined in config.js as WORKER_URL
  if (typeof WORKER_URL === "undefined" || !WORKER_URL) {
    throw new Error(
      "Please set WORKER_URL in config.js to your Cloudflare Worker URL."
    );
  }

  /* Build messages array for OpenAI API */
  let messages = [];

  if (isRoutineGeneration) {
    /* For routine generation, start fresh with system message */
    conversationHistory = []; /* Clear previous conversation */
    messages = [
      {
        role: "system",
        content:
          "You are a helpful beauty and skincare advisor specializing in L'Oréal products. Provide personalized routines and answer questions about skincare, haircare, makeup, and fragrance.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ];
  } else {
    /* For follow-up questions, use conversation history */
    messages = [
      {
        role: "system",
        content:
          "You are a helpful beauty and skincare advisor specializing in L'Oréal products. Answer questions about the routine and related beauty topics.",
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      {
        role: "user",
        content: userMessage,
      },
    ];
  }

  /* Send request to Cloudflare Worker - Worker should forward request to OpenAI using its stored API key */
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages,
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Worker request failed: ${response.status} ${response.statusText} - ${text}`
    );
  }

  const data = await response.json();

  // Worker returns OpenAI's response JSON. Extract assistant message content.
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  } else if (data.error) {
    throw new Error(data.error.message || JSON.stringify(data.error));
  } else {
    throw new Error("Unexpected response format from Worker");
  }
}
