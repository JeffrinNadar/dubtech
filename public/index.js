/**
 * Jeffrin Nadar and Mo
 * CSE 154
 * 5/3/2024
 *
 * This is the index.js for our TechDubs ecommerce website. This file contains all the user
 * interactions such as browsing for products, logging into to an account, and purchasing items.
 */

'use strict';

(function() {
  window.addEventListener('load', init);

  let userID = -1;
  let prodId = "";
  let loggedUser = "";

  /** Initializes the functionality when the page loads */
  function init() {
    id('login-button').addEventListener('click', loginPage);
    if (id('view-button') !== null) {
      id('view-button').addEventListener('click', toggleView);
    }

    id('home').addEventListener('click', homePage);
    qs('.btnfront').addEventListener('click', productPage);
    id('productsLink').addEventListener('click', productPage);
    id('cart').addEventListener('click', cartPage);
    id('profile').addEventListener('click', profilePage);
    id('search').addEventListener('submit', searchProducts);
    id('transaction-btn').addEventListener('click', pastTransactions);

    qs(".login-form").addEventListener('submit', signInFunc);
    id('logout-button').addEventListener('click', logoutUser);
    id('category-filter').addEventListener('change', filterProduct);
    qs('.back').classList.add('hidden');
    id('review').addEventListener('submit', submitReview);
  }

/**
 * Filters products based on the selected category.
 */
function filterProduct() {
  let selected = id('category-filter').value;
  console.log(selected);
  fetchProducts(selected);
}

/**
 * Submits the review for the current product
 * @param {Event} evt - Event object that occurs after submission of the form
 */
async function submitReview(evt) {
  evt.preventDefault();
  let data = new FormData();
  let rating = id('quantity').value;
  let review = qs("#review textarea").value;
  data.append("username", loggedUser);
  data.append("id", userID);
  data.append("review", review);
  data.append("rating", rating);
  id('quantity').value = "";
  qs("#review textarea").value = "";
  try {
    let response = await fetch('/techdubs/addReview', {
      body: data,
      method: "POST"
    });
    await statusCheck(response);
    let result = await response.json();
    addNewReview(result);
  } catch (err) {
    displayError(err);
  }
}

function addNewReview(data) {
  let id = prodId.toString();
  let sect = qs(id + ' submitted-reviews');
  let head = gen('h4');
  let newSect = gen('sectuion');
  head.textContent = "User: " + data.user;
  let rating = gen('h4');
  rating.textContent = "Rating: " + data.rating;
  let review = gen('p');
  pastTransactions.textContent = "Review: " + data.review;
  newSect.appendChild(head);
  newSect.appendChild(rating);
  newSect.appendChild(review);
  sect.prepend(newSect);
}

/**
 * Fetches products based on the specified category.
 * @param {string} category - The selected category.
 */
function fetchProducts(category) {
  console.log(category);
  let endpoint = '/techdubs/products-data';
  if (category && category !== 'All') {
    endpoint += '?category=' + category;
  }
  id('shopTitles').textContent = category + ' Products';
  fetch(endpoint)
    .then(statusCheck)
    .then(response => response.json())
    .then(data => {
      displayProducts(data);
    })
    .catch(displayError);
}

/**
 * Displays the products on the page.
 * @param {Object} data - The response containing product data.
 */
function displayProducts(data) {
  let products = data.products;
  let productGrid = qs('.productgrid');
  productGrid.innerHTML = '';

  if (products.length === 0) {
    let noResultsMessage = gen('p');
    noResultsMessage.textContent = 'No products found for the selected category.';
    productGrid.appendChild(noResultsMessage);
  } else {
    products.forEach((e) => {
      let productDiv = gen('section');
      productDiv.classList.add('product');

      let productName = gen('h3');
      productName.textContent = e.model;

      let productPrice = gen('p');
      productPrice.textContent = '$' + e.price;

      let buyButton = gen('button');
      buyButton.classList.add('button');
      buyButton.classList.add('buy');
      buyButton.textContent = 'Buy';
      buyButton.id = e.id;

      let img = gen('img');
      img.src = '/img/' + e.model.toLowerCase().replace(/\s+/g, '') + '.jpeg';
      img.alt = e.model + ' image';

      productDiv.appendChild(img);
      productDiv.appendChild(productName);
      productDiv.appendChild(productPrice);
      productDiv.appendChild(buyButton);

      qs('.productgrid').appendChild(productDiv);
      buyButton.addEventListener('click', buyProduct);
    });
  }
}


  /**
   * Logs out the user and resets the page to the home state.
   */
  async function logoutUser() {
    try {
      let res = await fetch('/techdubs/logout', {
        body: "",
        method: "POST"
      });
      await statusCheck(res);
      res = await res.text();
      console.log(res);
      userID = -1;
      loggedUser = "";
      id('transaction-history').innerHTML = "";
    } catch (err) {
      displayError(err);
    }
    homePage();
    qs('.profileP').classList.add("hidden");
    id('profile').classList.add('hidden');
    id('login-button').classList.remove('hidden');
    id('logout-button').classList.add('hidden');
  }

  /**
   * Switches the view to the profile page.
   */
  function profilePage() {
    qs('.shopSection').classList.add("hidden");
    qs('.login').classList.add("hidden");
    qs('.cartSection').classList.add("hidden");
    qs('.homeSection').classList.add("hidden");
    qs('.profileP').classList.remove("hidden");
    qs('.review-form').classList.add('hidden');
  }

  /**
   * Handles sign in functionality.
   * @param {Event} evt - The click event object.
   */
  async function signInFunc(evt) {
    console.log('fluff');
    evt.preventDefault();
    let formData = new FormData(qs('.login-form'));
    id('nameinput').value = "";
    id('pass').value = "";

    try {
      let response = await fetch('/techdubs/login', {
        body: formData,
        method: "POST"
      });
      await statusCheck(response);
      let result = await response.json();
      userID = result.id;
      loggedUser = result.user;
      console.log(userID);
      console.log(loggedUser);

      qs('.shopSection').classList.add("hidden");
      qs('.login').classList.add("hidden");
      qs('.cartSection').classList.add("hidden");
      qs('.homeSection').classList.add("hidden");
      id('profile').classList.remove('hidden');
      id('login-button').classList.add('hidden');
      id('logout-button').classList.remove('hidden');
      qs('.profileP').classList.remove('hidden');
      qs('.review-form').classList.add('hidden');
      qs('.submitted-reviews').classList.add('hidden');
      id('errorArea').classList.add('hidden');
    } catch (err) {
      displayError(err);
    }
  }

  /**
   * Switches the view to the login page.
   */
  function loginPage() {
    qs('.shopSection').classList.add("hidden");
    qs('.homeSection').classList.add("hidden");
    qs('.cartSection').classList.add("hidden");
    qs('.profileP').classList.add("hidden");

    qs('.login').classList.remove("hidden");
    qs('.login-area').classList.remove("hidden");
    qs('.login-form').classList.remove("hidden");
    qs('.review-form').classList.add('hidden');
    qs('.submitted-reviews').classList.add('hidden');
    qs('.back').classList.add('hidden');
    qs('.buy-area').classList.add('hidden');

  }

  /**
   * Switches the view to the home page.
   */
  function homePage() {
    qs('.shopSection').classList.add("hidden");
    qs('.login').classList.add("hidden");
    qs('.cartSection').classList.add("hidden");
    qs('.homeSection').classList.remove("hidden");
    qs('.profileP').classList.add("hidden");
    qs('.buy-area').classList.add('hidden');
    id('login-page').classList.add('hidden');
    qs('.back').classList.add('hidden');
    qs('.buy-area').classList.add('hidden');
  }

  /**
   * Switches the view to the product page.
   */
  function productPage() {
    qs('.homeSection').classList.add("hidden");
    id('login-page').classList.add("hidden");
    qs('.profileP').classList.add("hidden");
    qs('.cartSection').classList.add("hidden");
    id('errorArea').classList.add('hidden');
    qs('.shopSection').classList.remove("hidden");
    id('search-results').classList.add('hidden');
    qs('.buy-area').classList.add('hidden');
    id('filtered-products').classList.add('hidden');
    qs('.productgrid').classList.remove('hidden');
    id('view-button').classList.remove('hidden');
    id('shopTitles').classList.remove('hidden');
    qs('.buy-area').classList.add('hidden');

    qs('.buy-product').innerHTML = '';

    fetch("/techdubs/products")
      .then(statusCheck)
      .then(response => response.json())
      .then(allProducts)
      .catch(displayError);
  }

  /**
   * Displays all products on the page.
   * @param {Object} res - Response object containing products.
   */
  function allProducts(res) {
    id('category-filter').classList.remove('hidden');
    let products = res.products;
    let productGrid = qs('.productgrid');
    console.log(qs('.productgrid'));

    productGrid.innerHTML = '';
    products.forEach((e) => {
      let productdiv = gen('section');
      productdiv.classList.add('product');
      let productimg = gen('img');
      let productdesc = gen('section');
      productdesc.classList.add('productdes');
      let productname = gen('h3');
      let productprice = gen('p');
      let buybutton = gen('button');

      productname.textContent = e.model;
      productprice.textContent = "$" + e.price;
      buybutton.classList.add('button');
      buybutton.classList.add('buy');
      buybutton.textContent = "Look";
      buybutton.id = e.id;

      productimg.src = '/img/' + e.model.toLowerCase().replace(/\s+/g, '') + '.jpeg';
      productimg.alt = e.model + ' image';

      productdesc.appendChild(productname);
      productdesc.appendChild(productprice);
      productdiv.appendChild(productimg);
      productdiv.appendChild(productdesc);
      productdesc.appendChild(buybutton);
      qs('.productgrid').appendChild(productdiv);
      buybutton.addEventListener('click', buyProduct);
    });
  }

  /**
   * Handles the buy product functionality.
   */
  function buyProduct() {
    console.log("Product ID:", this.id);
    togglePurchaseView();
    let urlprod = "/techdubs/products/";
    let productId = this.id;
    let blend = urlprod + productId;
    console.log(urlprod + productId);
    prodId = this.id;
    fetch(blend)
      .then(statusCheck)
      .then(response => response.json())
      .then(productInfo)
      .catch(displayError);
  }

  /**
   * Displays product information for purchasing.
   * @param {Object} res - Response object containing product details.
   */
  async function productInfo(res) {
    console.log(res);
    let products = res;
    qs('.buy-product').innerHTML = '';

    let itemdiv = gen('section');
    itemdiv.classList.add('buy-area');
    let itemimg = gen('img');
    let itemdesc = gen('section');
    itemdesc.classList.add('buy-product');
    let itemname = gen('h3');
    let itemprice = gen('p');
    let cartbutton = gen('button');
    let itemsdescription = gen('p');

    let reviewData;
    try {
      let response = await fetch('/techdubs/ratings/' + prodId);
      await statusCheck(response);
      let data = await response.json();
      reviewData = data;
    } catch (err) {
      displayError(err);
    }
    qs('.submitted-reviews').innerHTML = "";
    reviewData = reviewData.ratings;
    let totalRating = 0;
    if (reviewData.length === 0) {
      let rating = gen('p');
      rating.textContent = "Rating: N/A";
      let sect = gen('section');
      let para = gen('p');
      para.textContent = 'There are no reviews for this product';
      sect.appendChild(rating);
      sect.appendChild(para);
      qs('.submitted-reviews').appendChild(sect);
      itemdiv.appendChild(rating);
    } else {
      for (let i = 0; i < reviewData.length; i++) {
        let curr = reviewData[i];
        let sect = gen('section');
        let head = gen('h4');
        let rate = gen('h4');
        let review = gen('h4');
        review.textContent = "Review: " + curr.review;
        rate.textContent = "Rating: " + curr.rating;
        totalRating += parseFloat(curr.rating);
        head.textContent = "User: " + curr.user;
        sect.appendChild(head);
        sect.appendChild(rate);
        sect.appendChild(review);
        qs('.submitted-reviews').appendChild(sect);
      }
      let avgRating = gen('p');
      avgRating.textContent = "Rating: " + (totalRating / reviewData.length) + '/5';
      itemdiv.appendChild(avgRating);
    }

    itemimg.alt = "an image of " + products.model;
    itemimg.src = '/img/' + products.model.toLowerCase().replace(/\s+/g, '') + '.jpeg';
    itemname.textContent = products.model;

    itemprice.textContent = "$" + products.price;
    itemsdescription.textContent = products.product_desc;
    cartbutton.classList.add('button');
    cartbutton.classList.add('buy');
    cartbutton.textContent = "Cart";

    itemdesc.appendChild(itemname);
    itemdiv.appendChild(itemimg);
    itemdesc.appendChild(itemprice);
    itemdesc.appendChild(itemsdescription);
    itemdesc.appendChild(cartbutton);
    itemdiv.appendChild(itemdesc);

    qs('.buy-product').appendChild(itemdiv);
    cartbutton.addEventListener('click', function() {
      addCart(res);
    });

  }

  /**
   * Retrieves the users past transactions once they are logged in
   */
  async function pastTransactions() {
    try {
      let response = await fetch('/techdubs/user/transactions/' + userID);
      await statusCheck(response);
      let data = await response.json();
      displayTransactions(data);
    } catch (err) {
      displayError(err);
    }
  }

  /**
   * Displays all of the users past transactions
   * @param {JSON} data - data that contains transaction information of the user
   */
  function displayTransactions(data) {
    id('display-transaction').innerHTML = "";
    data = data.transactions;
    if (data.length === 0) {
      let sect = gen('section');
      let para = gen('p');
      para.textContent = "You have no purchases. Go buy something.";
      sect.appendChild(para);
      id('display-transaction').appendChild(sect);
    } else {
      for (let i = 0; i < data.length; i++) {
        let curr = data[i];
        let sect = gen('section');
        let anum = gen('h3');
        let model = gen('p');
        let price = gen('p');
        let date = gen('p');
        anum.textContent = "Confirmation Number: " + curr.id;
        model.textContent = "Model: " + curr.name;
        price.textContent = "Price: " + curr.price;
        date.textContent = "Date: " + curr.data;
        sect.appendChild(anum);
        sect.appendChild(model);
        sect.appendChild(price);
        sect.appendChild(date);
        id('display-transaction').appendChild(sect);
      }
    }
  }

  /**
   * Adds the selected product to the cart.
   */
  function addCart(res) {
    cartPage();
    console.log(res);
    let products = res;
    qs('.buy-product').innerHTML = '';

    let itemdiv = gen('section');
    itemdiv.classList.add('buy-area');
    let itemimg = gen('img');
    let itemdesc = gen('section');
    itemdesc.classList.add('buy-product');
    let itemname = gen('h3');
    let itemprice = gen('p');
    let cartbutton = gen('button');
    let bulkbutton = gen('button');
    let itemsdescription = gen('p');

    itemimg.alt = "an image of " + products.model;
    itemname.textContent = products.model;
    ;
    itemprice.textContent = "$" + products.price;
    itemsdescription.textContent = products.product_desc;
    console.log("Product Price:", products.price);
    cartbutton.classList.add('button');
    cartbutton.classList.add('buy');
    cartbutton.textContent = "Purchase";
    bulkbutton.classList.add('button');
    bulkbutton.classList.add('buy');
    bulkbutton.textContent = "Bulk";

    itemdesc.appendChild(itemname);
    itemdesc.appendChild(itemprice);
    itemdesc.appendChild(cartbutton);
    itemdesc.appendChild(bulkbutton);
    itemdiv.appendChild(itemdesc);
    qs('.buy-product').appendChild(itemdiv);
    cartbutton.addEventListener('click', confirm);
    bulkbutton.addEventListener('click', confirm);
  }

  function confirm() {
    if (userID !== -1) {
    id("confirm-button").classList.remove('hidden');
    id("cancel-button").classList.remove('hidden');
    id('confirm-button').addEventListener('click', purchased);
    id('cancel-button').addEventListener('click', () => {
      cartPage();
    });
  } else {
    console.log('Please log in to make a purchase');
  }
  }

  // determines if the user has purchased the product
  async function purchased() {
  try {
    let formData = new FormData();
    formData.append('id', userID);
    formData.append('cart', prodId);

    let response = await fetch('/techdubs/purchase', {
      method: 'POST',
      body: formData
    });

    await statusCheck(response);

    let data = await response.json();
    console.log('Data received from server:', data);
    purchaseConfirmation(data);
  } catch (err) {
    displayError(err);
  }
}

  function purchaseConfirmation(transactions) {
    qs('.buy-product').classList.add('hidden');
    qs('.buy-area').classList.add('hidden');
    id("confirm-button").classList.add('hidden');
    id("cancel-button").classList.add('hidden');
    let transac = transactions.transactions;
    transac.forEach(transaction => {
      let orderId = gen('p');
      orderId.textContent = `Order ID: ${transaction.id}`;
      console.log(transaction.id);

      let productName = gen('p');
      productName.textContent = `Product Name: ${transaction.name}`;

      let price = gen('p');
      price.textContent = `Price: ${transaction.price}`;

      let time = gen('p');
      time.textContent = `Time: ${transaction.data}`;

      let confirmationMessage = gen('div');
      confirmationMessage.classList.add('confirmation-message');

      confirmationMessage.appendChild(orderId);
      confirmationMessage.appendChild(productName);
      confirmationMessage.appendChild(price);
      confirmationMessage.appendChild(time);

      id('transaction-history').appendChild(confirmationMessage);
      qs('.recommended').appendChild(confirmationMessage);
    });
  }



  /**
   * Switches to the cart page.
   */
  function cartPage() {
    let confirmationMessages = qs('.recommended').querySelectorAll('.confirmation-message');
    confirmationMessages.forEach(message => message.remove());
    qs('.homeSection').classList.add('hidden');
    id('shopTitles').classList.add('hidden');
    id('view-button').classList.add('hidden');
    id('search-results').classList.add('hidden');
    id('category-filter').classList.add('hidden');


    id('backButton').classList.add('hidden');
    qs('.buy-product').classList.remove('hidden');
    qs('.review-form').classList.add('hidden');
    qs('.buy-area').classList.remove('hidden');
    qs('.cartSection').classList.remove('hidden');

    qs('.submitted-reviews').classList.add('hidden');
    qs('.submitted-reviews').classList.add('removesub');
    id("confirm-button").classList.add('hidden');
    id("cancel-button").classList.add('hidden');
    id('login-page').classList.add('hidden');
    qs('.productgrid').classList.add('hidden');
    qs('.shopSection').classList.add('hidden');
    qs('.back').classList.add('hidden');
    qs('.buy-area').classList.add('hidden');

  }

  /** Toggles the view when trying to purchase an item */
  function togglePurchaseView() {
    let backButton = qs('.back button');
    if (!backButton) {
      backButton = gen('button');
      backButton.textContent = "Back";
      qs('.back').appendChild(backButton);
      backButton.addEventListener('click', backFunction);
    }
    qs('.back').classList.remove('hidden');
    qs('.homeSection').classList.add('hidden');
    id('view-button').classList.add('hidden');
    id('search-results').classList.add('hidden');
    id('list-products').classList.add('hidden');

    qs('.buy-product').classList.remove('hidden');
    qs('.review-form').classList.remove('hidden');
    qs('.buy-area').classList.remove('hidden');
    qs('.submitted-reviews').classList.remove('hidden');
    qs('.submitted-reviews').classList.remove('removesub');
    qs('.titles').classList.remove('hidden');
    qs('.shopSection').classList.add('hidden');
    qs('.buy-area').classList.add('hidden');
  }

  /**
   * Displays an error message.
   * @param {Object} err - Error object.
   */
  function displayError(err) {
    id('errorArea').innerHTML = "";
    let errorMessage = gen('h3');
    errorMessage.textContent = "Oh no looks like there is an error!";
    console.log(err);
    id('errorArea').classList.remove("hidden");
    id('errorArea').appendChild(errorMessage);
  }

  /** Switches the view when in the products tab. Can be list or grid view */
  function toggleView() {
    id('list-products').classList.toggle('productgrid');
    id('list-products').classList.toggle('columnView');
  }

  /**
   * Navigates back to the product page.
   */
  function backFunction() {
    productPage();
    id('shopTitles').classList.remove('hidden');
    id('view-button').classList.remove('hidden');

  }

  /**
   * Searches for products based on user input.
   * @param {Event} evt - The submit event object.
   */
  function searchProducts(evt) {
    console.log('Search function called');
    evt.preventDefault();
    let searchInput = id("searches").value.trim();
    if (searchInput != "") {
      console.log(searchInput);
      qs('.homeSection').classList.add("hidden");
      qs('.login').classList.add("hidden");
      qs('.cartSection').classList.add("hidden");
      qs('.buy-product').innerHTML = '';
      qs('.buy-product').classList.add('hidden');
      id('backButton').classList.add('hidden');
      qs('.shopSection').classList.remove("hidden");
      id('shopTitles').classList.remove('hidden');
      id('view-button').classList.remove('hidden');

      let previousSearchHead = qs('.shopSection h3');
      if (previousSearchHead) {
        previousSearchHead.remove();
      }

      let searchHead = id('search-results');
      id('searches').value = "";
      searchHead.textContent = "Search results for " + searchInput;
      searchHead.classList.remove('hidden');
      id('category-filter').classList.add('hidden');

      let formData = new FormData();
      formData.append('search', searchInput);

      fetch('/techdubs/search', {
        method: "POST",
        body: formData
      })
        .then(statusCheck)
        .then(response => response.json())
        .then(displaySearch)
        .catch(displayError);
    }
  }

  /**
   * Displays the search results.
   * @param {Object} res - Response object containing search results.
   */
  function displaySearch(res) {
    let products = res.products;
    let productGrid = qs('.productgrid');
    productGrid.innerHTML = '';

    if (products.length === 0) {
      let noResultsMessage = gen('p');
      noResultsMessage.textContent = 'No results found for the search query.';
      productGrid.appendChild(noResultsMessage);
    } else {
      products.forEach((e) => {
        let productDiv = gen('section');
        productDiv.classList.add('product');

        let productName = gen('h3');
        productName.textContent = e.model;

        let productPrice = gen('p');
        productPrice.textContent = '$' + e.price;

        let buyButton = gen('button');
        buyButton.classList.add('button');
        buyButton.classList.add('buy');
        buyButton.textContent = 'Buy';
        buyButton.id = e.id;

        productDiv.appendChild(productName);
        productDiv.appendChild(productPrice);
        productDiv.appendChild(buyButton);

        qs('.productgrid').appendChild(productDiv);
        buyButton.addEventListener('click', buyProduct);
      });
    }
  }

  /**
   * Checks the status of the response.
   * @param {Object} res - Response object.
   * @returns {Object} - Response object if successful, otherwise throws an error.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns a new element with the matching tag.
   * @param {string} tagName - Element tag.
   * @returns {object} - DOM object with associated tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - Element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

})();


