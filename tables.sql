CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand TEXT,
  model TEXT,
  price INTEGER,
  quantity INTEGER,
  product_desc TEXT,
  category TEXT,
  subcategory TEXT
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT,
  password TEXT
);

CREATE TABLE transactions (
  transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
  anum TEXT,
  product_id INTEGER,
  user_id INTEGER,
  quantity INTEGER,
  transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN Key (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE ratings (
  rating_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  user TEXT,
  rating INTEGER,
  review TEXT,
  review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(product_id, user)
);