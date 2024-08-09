/**
 * Jeffrin Nadar and Mo Khair
 * CSE 154
 *
 * This is the app.js for our ecommerce website. This file contains all the endpoints which our
 * front end will make requests to. Such requests made will be to display products, buy products,
 * and log users in.
 */

'use strict';

const express = require("express");
const app = express();

const multer = require("multer");

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const SERVER_ERR_MSG = "An error occured on the server. Try again later.";

let loggedIn = true;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

/** Add the endpoints after here */

app.post('/techdubs/logout', function (req, res) {
  loggedIn = false;
  res.type('text').send("Successfully logged out");
});

app.post('/techdubs/login', async function (req, res) {
  let user = req.body.username;
  let pass = req.body.password;
  res.type('text');
  if (user && pass) {
    try {
      let query = "SELECT * FROM users WHERE user = ?";
      let db = await getDBConnection();
      let queryResult = await db.get(query, user);
      await db.close();
      if (!queryResult) {
        res.status(400).send('This username does not exist');
      } else {
        if (pass === queryResult.password) {
          loggedIn = true;
          res.json(queryResult);
        } else {
          res.status(400).send('The password is incorrect');
        }
      }
    } catch (err) {
      res.status(500).send(SERVER_ERR_MSG);
    }
  } else {
    res.status(400).send('Missing one or more required parameters');
  }
});

app.get('/techdubs/products', async function (req, res) {
  try {
    let query = "";
    let searchQuery = req.query.search;
    let params = [];
    if (searchQuery) {
      query = "SELECT * FROM products WHERE (brand LIKE ? OR model LIKE ? OR category LIKE ?)";
      params.push("%" + searchQuery + "%");
      params.push("%" + searchQuery + "%");
      params.push("%" + searchQuery + "%");
    } else {
      query = "SELECT * FROM products";
    }
    let db = await getDBConnection();
    let queryResult = await db.all(query, params);
    await db.close();
    let result = parseProducts(queryResult);
    res.json(result);
  } catch (err) {
    res.status(500).type('text').send(SERVER_ERR_MSG);
  }
});

app.post("/techdubs/search", async function (req, res) {
  try {
    let query = "";
    let searchQuery = req.body.search;
    let params = [];
    if (searchQuery) {
      query = "SELECT * FROM products WHERE (brand LIKE ? OR model LIKE ? OR category LIKE ?)";
    params.push("%" + searchQuery + "%");
      params.push("%" + searchQuery + "%");
      params.push("%" + searchQuery + "%");
    } else {
      query = "SELECT * FROM products";
    }
    let db = await getDBConnection();
    let queryResult = await db.all(query, params);
    await db.close();
    let result = parseProducts(queryResult);
    res.json(result);
  } catch (err) {
    res.status(500).type('text').send(SERVER_ERR_MSG);
  }
});

app.get("/techdubs/products/:id", async function (req, res) {
  let productId = req.params.id;
  if (productId) {
    try {
      let query = "SELECT * FROM products WHERE id = ?";
      let db = await getDBConnection();
      let queryResult = await db.get(query, productId);
      await db.close();
      if (!queryResult) {
        res.status(404).type('text').send(SERVER_ERR_MSG);
      } else {
        res.json(queryResult);
      }
    } catch (err) {
      res.status(500).type('text').send(SERVER_ERR_MSG);
    }
  } else {
    res.status(400).type('text').send(SERVER_ERR_MSG);
  }
});

app.get('/techdubs/products-data', async function (req, res) {
  try {
    let query = "";
    let category = req.query.category;
    let params = [];
    if (category && category !== 'All') {
      query = "SELECT * FROM products WHERE category = ?";
      params.push(category);
    } else {
      query = "SELECT * FROM products";
    }
    let db = await getDBConnection();
    let queryResult = await db.all(query, params);
    await db.close();
    let result = parseProducts(queryResult);
    res.json(result);
  } catch (err) {
    res.status(500).type('text').send(SERVER_ERR_MSG);
  }
});

app.post("/techdubs/addToCart", async function (req, res) {
  res.type('text');
  let id = req.body.id;
  if (id) {
    try {
      let productQuery = "SELECT * FROM products WHERE id = ?";
      let db = await getDBConnection();
      let productResult = await db.get(productQuery, id);
      if (!productResult) {
        await db.close();
        res.status(400).send('This item does not exist');
      } else if (productResult.quantity <= 0) {
        await db.close();
        res.send('Item is not in stock. Unable to add to cart');
      } else {
        let quantityQuery = "UPDATE products SET quantity = quantity - 1 WHERE id = ?";
        await db.run(quantityQuery, id);
        let stockResult = await db.get(productQuery, id);
        await db.close();
        res.send('Added to Cart. Stock is now ' + stockResult.quantity);
      }
    } catch (err) {
      res.status(500).send(SERVER_ERR_MSG);
    }
  } else {
    res.status(400).send('There was no product id provided');
  }
});

app.post("/techdubs/removeFromCart", async function (req, res) {
  res.type('text');
  let id = req.body.id;
  if (id) {
    try {
      let updateProduct = "UPDATE products SET quantity = quantity + 1 WHERE id = ?";
      let db = await getDBConnection();
      let result = await db.run(updateProduct, id);
      await db.close();
      if (result.changes === 0) {
        res.status(400).send("Product does not exist.");
      } else {
        res.send('Item was successfully removed.');
      }
    } catch (err) {
      res.status(500).send(SERVER_ERR_MSG);
    }
  } else {
    res.status(400).send('There was no product id provided');
  }
});

app.get("/techdubs/ratings/:product", async function (req, res) {
  let id = req.params.product;
  if (id) {
    id = parseFloat(id);
    try {
      let query = "SELECT r.review, r.rating, r.user, r.review_date FROM ratings r, products p" +
        " WHERE p.id = r.product_id AND p.id = ?";
      let db = await getDBConnection();
      let queryResults = await db.all(query, id);
      await db.close();
      res.json(parseReviews(queryResults));
    } catch (err) {
      res.status(500).type('text').send(SERVER_ERR_MSG);
    }
  } else {
    res.status(400).type('text').send('Product id not given.');
  }
});

app.post("/techdubs/addReview", async function (req, res) {
  let user = req.body.username;
  let id = req.body.id;
  let review = req.body.review;
  let rating = req.body.rating;
  if (user && id && review && rating && loggedIn) {
    try {
      let product = "SELECT * FROM products WHERE id = ?";
      let db = await getDBConnection();
      let prod_res = await db.get(product, id);
      let exists = "SELECT * FROM ratings WHERE product_id = ? AND user = ?";
      let existRes = await db.get(exists, [id, user]);
      if (!prod_res) {
        await db.close();
        res.status(400).type('text').send('Product does not exist');
      } else if (existRes) {
        await db.close();
        res.status(400).type('text').send('User has already reviewed product');
      } else {
        let query = "INSERT INTO ratings (product_id, user, rating, review) " +
          "VALUES (?, ?, ?, ?)";
        let newRating = await db.run(query, [id, user, rating, review]);
        let resId = newRating.lastID;
        let newQuery = "SELECT * FROM ratings WHERE rating_id = ?";
        let result = await db.get(newQuery, resId);
        await db.close();
        let resultH = {
          "user": user,
          "review": result.review,
          "rating": result.rating,
          "date": result.review_date
        }
        res.json(resultH);
      }
    } catch (err) {
      res.status(500).type('text').send(SERVER_ERR_MSG);
    }
  } else {
    res.status(400).type('text').send('One or params is missing.');
  }
});

app.get('/techdubs/user/transactions/:id', async function(req, res) {
  let id = req.params.id;
  if (loggedIn && id) {
    try {
      let query = "SELECT t.anum, p.model, t.quantity, p.price, t.transaction_date" +
      " FROM products p, transactions t, users u WHERE u.id = ? AND u.id = t.user_id " +
      "AND t.product_id = p.id";
      let db = await getDBConnection();
      let transactions =  await db.all(query, id);
      await db.close();
      res.json(parseTransactions(transactions));
    } catch (err) {
      res.status(500).type('text').send(SERVER_ERR_MSG);
    }
  } else {
    res.status(400).type('text').send('User is not logged in');
  }
});

app.post('/techdubs/purchase', async function (req, res) {
  let id = req.body.id;
  if (loggedIn && id) {
    if (req.body.cart) {
      try {
        let alphaID = Math.floor(Math.random() * 10000000).toString(36);
        let arr = req.body.cart.split(',');
        let db = await getDBConnection();
        let query = "INSERT INTO transactions (anum, product_id, user_id, quantity)" +
        " VALUES(?, ?, ?, 1)";
        for (let i = 0; i < arr.length; i++) {
          let prodID = parseFloat(arr[i]);
          await db.run(query, [alphaID, prodID, id]);
        }
        let resQuery = "SELECT t.anum, p.model, t.quantity, p.price, t.transaction_date" +
          " FROM transactions t, products p WHERE t.anum = ? AND t.product_id = p.id";
        let results = await db.all(resQuery, alphaID);
        await db.close();
        res.json(parseTransactions(results));
      } catch (err) {
        console.log(err);
        res.status(500).type('text').send(SERVER_ERR_MSG);
      }
    } else {
      res.status(400).type('text').send('One or params is missing');
    }
  } else {
    res.status(400).type('text').send('User is not logged in');
  }
});

function parseTransactions(queryResult) {
  let result = {
    "transactions": []
  };

  for (let i = 0; i < queryResult.length; i++) {
    let curr = queryResult[i];
    result.transactions[i] = {
      "id": curr.anum,
      "name": curr.model,
      "price": curr.price,
      "data": curr.transaction_date
    };
  }

  return result;
}

function parseProducts(queryResult) {
  let result = {
    "products": []
  };
  for (let i = 0; i < queryResult.length; i++) {
    let curr  = queryResult[i];
    result.products[i] = curr;
  }
  return result;
}

function parseReviews(queryResults) {
  let result = {
    "ratings": []
  }
  for (let i = 0; i < queryResults.length; i++) {
    let curr = queryResults[i];
    result.ratings[i] = curr;
  }
  return result;
}

function parseNewReview(result, user) {
  let res = {
    user: {
      "review": result.review,
      "rating": result.rating,
      "date": result.review_date
    }
  }
  return res;
}

/** End of the endpoints section */

/**
 * Establishes a database connection to a database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'dubtech.db',
    driver: sqlite3.Database
  });
  return db;
}

const PORT = process.env.PORT || 8000;
app.use(express.static('public'));
app.listen(PORT);