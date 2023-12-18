//creates the array to save the productId and the amount for each product to be read into the basket
//potentially this coule be lifted into the basket.js file, but I am not sure where it would go so to not mess up Jonathans code

// =========  GLOBAL Variables  =========
let basket = [];
let basketList;

// ========= In basket functionality  =========

// =========  updateQuantity()  =========
function updateQuantity(productId, change) {
  // Find item in basket and update its quantity
  const basketItem = basket.find(item => item.productId === productId);
  if (basketItem) {
    basketItem.amount = Math.max(basketItem.amount + change, 0);
    // Update the basket in local storage and re-render the list
    localStorage.setItem('basket', JSON.stringify(basket));
    populateBasketList();
  }
} // =========  END updateQuantity()  =========

// =========  setQuantity()  =========
function setQuantity(productId, newQuantity) {
  // Find item in basket and set new quantity
  const basketItem = basket.find(item => item.productId === productId);
  if (basketItem) {
    basketItem.amount = Math.max(newQuantity, 0);
    // Update the basket in local storage and re-render the list
    localStorage.setItem('basket', JSON.stringify(basket));
    populateBasketList();
  }
} // =========  END setQuantity()  =========

// =========  deleteItem() =========
function deleteItem(productId) {

const numericProductId = Number(productId);

  // Remove item from basket
  basket = basket.filter(item => item.productId !== productId);

  console.log('deleteItem', basket);
  // Update the basket in local storage and re-render the list
  localStorage.setItem('basket', JSON.stringify(basket));
  populateBasketList();
}// =========  END deleteItem()  =========

// =========  END In basket functionality  =========

function addToBasket(productId, amount) {
  let productIndex = basket.findIndex((item) => item.productId === productId);
  if (productIndex !== -1) {
    basket[productIndex].amount += amount;
  } else {
    basket.push({ productId, amount });
  }
  //save the basket to local storage to allow it to be read on other pages 
  localStorage.setItem('basket', JSON.stringify(basket));

  populateBasketList();
} // =========  END GLOBAL Variables  =========

// =========  updateBasketCount()  =========
function updateBasketCount() { //updates the basket icon to show the number of items in the basket
  const basketCountElement = document.querySelector(
    ".header-button__basket-count"
  );
  if (!basketCountElement) return; // If basket button doesn't exist, stop function
  let totalCount = basket.reduce((sum, item) => sum + item.amount, 0); //0 signifies the initial value of the sum 
  basketCountElement.textContent = totalCount; //updates basketCountElement with totalCount value
} // =========  END updateBasketCount()  =========

// ========= Populate teh basket list with products from items added to the basket array  =========
function populateBasketList() {
  if (!basketList) return; //Ensure the basketList is available

  basketList.innerHTML = ""; //Clear the current contents of the basket list

  basket.forEach(basketItem => { //Iterate through each item in the basket array
    const product = products.find(p => p.id === Number(basketItem.productId)); //Find the product in the products array that matches the productId in the basket array

    if (product) {
      //create list item
      let listItem = document.createElement('li');
      
      //create div for image
      const imgCon = document.createElement('div');
      imgCon.setAttribute('class', 'basket__img-con');

      //create and append image to image div
      if(product.image && product.image.length > 0) {
        const img = document.createElement('img');
        img.setAttribute('src', product.image[0].src);
        img.setAttribute('alt', product.image[0].alt);
        imgCon.appendChild(img);
      }

      // Append image div container to list item
      listItem.appendChild(imgCon);

      // Create container for product details
      const productDetails = document.createElement('div');
      productDetails.setAttribute('class', 'basket__items-details');

      // Create and append product name
      const productNameEl = document.createElement('span');
      productNameEl.textContent = product.name;
      productDetails.appendChild(productNameEl);

      // Create container for quantity manipulation
      const quantityContainer = document.createElement('div');
      quantityContainer.setAttribute('class', 'quantity-container');

      // Create and append decrement button
      const decrementButton = document.createElement('button');
      decrementButton.textContent = '-';
      decrementButton.onclick = () => updateQuantity(product.id, -1);
      quantityContainer.appendChild(decrementButton);

      // Create and append quantity field
      const quantityField = document.createElement('input');
      quantityField.type = 'number';
      quantityField.value = basketItem.amount;
      quantityField.onchange = (e) => setQuantity(product.id, Number(e.target.value));
      quantityContainer.appendChild(quantityField);

      // Create and append increment button
      const incrementButton = document.createElement('button');
      incrementButton.textContent = '+';
      incrementButton.onclick = () => updateQuantity(product.id, 1);
      quantityContainer.appendChild(incrementButton);

      productDetails.appendChild(quantityContainer);

      // Determine price text
      const priceText = typeof product.price.regular === 'number'
      ? `$${product.price.regular.toFixed(2)}`
      : 'Price not available';

      // Create and append product price
      const productPriceEl = document.createElement('span');
      productPriceEl.textContent = priceText;
      productDetails.appendChild(productPriceEl);

      // Append product details container to the list item
      listItem.appendChild(productDetails);

      // Create and append delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => {
        console.log('delete', product.id);
        deleteItem(Number(product.id));
      };

      listItem.appendChild(deleteButton);

      basketList.appendChild(listItem);
    }
  });
}
// =========  END Populate teh basket list with products from items added to the basket array  =========

// =========  resetBasket()  =========
function resetBasket() {
  basket = [];
  localStorage.removeItem('basket');
  updateBasketCount();
  populateBasketList();
} // =========  END resetBasket()  =========

// =========  DOM functionality  =========
document.addEventListener("DOMContentLoaded", function () { 
  //Retrieve the UL element.
  basketList = document.querySelector('.basket__items');

  const savedBasket = localStorage.getItem("basket"); //Keeps the basket count up to date when the page is refreshed
  if (savedBasket) {
    basket = JSON.parse(savedBasket);
  }
  updateBasketCount();
  populateBasketList();

  console.log('dom_basket', basketList);
  console.log('dom_basket', basket);
  console.log('products', products);
  console.log('localStorage', localStorage);

  const basketButton = document.querySelector('.header-button__basket');

  if (basketButton) {
    basketButton.addEventListener('click', function () {
      window.location.href = 'basket.html';
    });
  }

  const resetButton = document.querySelector('.header-button__basket-reset');
  if (resetButton) {
    resetButton.addEventListener('click', function (){
      resetBasket();
    });
  }  
}); // =========  END DOM functionality  =========


/* ===========  Testing new version ==================
for (let i = 0; i < 3 && i < products.length; i++) {
  let product = products[i];
  let listItem = document.createElement('li');

  // Check if product is a number or object, then display price
  const priceText =
    typeof product.price === 'number' ||
    (typeof product.price === 'object' && 'regular' in product.price)
      ? `$${(typeof product.price === 'number'
          ? product.price
          : product.price.regular
        ).toFixed(2)}`
      : 'Price not available';

  listItem.textContent = `${product.name} - ${priceText}`;

  basketList.appendChild(listItem);
  console.log('Image source:', product.image[0].src);
}// ==========  Testing new version ==============*/

//makes sure an update on any tab is reflected on all tabs
window.addEventListener("storage", function (basketMemory) {
  if (basketMemory.key === "basket") {
    basket = JSON.parse(basketMemory.newValue);
  }
});

console.log(products);
