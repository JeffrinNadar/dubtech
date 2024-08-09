# TechDubs API Documentation
Contains user information and product information

## Check if the entered username and password match for logging in
**Request Format:** /techdubs/login

**Request Type:** POST

**Returned Data Format**: Text

**Description:** Returns the specified usernames associated user information such as passwords and username

**Example Request:** /techdubs/login

**Parameters:** username, password

**Example Response:**

```
User login was successful
```

**Error Handling:**
- Possible 500 error (plain text)
  - If there are any other server errors, returns error with 'An error ocurred on the server. Try again later.'

- Possible 400 error (all plain text)
  - If the username does not exist, returns error with 'username does not exist'
  - If the password is incorrect, returns error with 'incorrect password'


## Get the gallery images
**Request Format:** /get/products

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns the specified products information such as price, reviews, images, etc.

**Example Request:** /get/products/iphone

**Example Response:**

```json
{
  "iphone": {
    "iphone-13": {
      "product-info": "iphone 13 by Apple",
      "price": 800,
      "reviews": 4.5,
      "images": {
        "pic1": "link",
        "pic1-alt": "iphone13 front"
      },
      "stock": 5
    }
  }
}
```

**Error Handling:**
- Possible 500 errors (all plain text)
  - If the database doesn't exist, returns error with 'database does not exist'
  - If there are any other server errors, returns error with 'something went from on the server'

- Possible 400 error (plain text)
  - If the product is typed in wrong, returns an error with 'product does not exist'



## Change/Add a Character
**Request Format:** /addToCart

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** The user can add their items to a shopping cart

**Example Request:** /addToCart

**Example Response:**

```
added item to the cart
```

**Error Handling:**
- Possible 500 errors (all plain text)
  - If the database doesn't exist, returns error with 'database does not exist'
  - If there are any other server errors, returns error with 'something went from on the server'
  - If the product is out of stock, returns error with 'item is not available'

## Get Transaction Details
**Request Format:** /techdubs/user/transactions/

**Request Type:**  GET

**Returned Data Format**: JSON

**Description:** Retrieves transaction details for a specific user based on their user ID.

**Example Request:** /techdubs/user/transactions/1

**Example Response:**

```json
{
  "transactions": [
    {
      "id": "56rfytu9",
      "name": "iphone",
      "price": 800,
      "date": "2024-06-04 03:03:14"
    }
  ]
}
 item to the cart
 ```

**Error Handling:**
- Possible 500 error (Plain Text)
 - If there are any server errors, returns: 'An error occurred on the server. Please try again later.'
- Possible 400 error (Plain Text)
 - If the user is not logged in, returns: 'User is not logged in'
 - If the user ID is missing or incorrect, returns: 'User ID not provided or invalid'

 ## Purchase Products
**Request Format:** /techdubs/purchase

**Request Type:**  POST

**Returned Data Format**: JSON

**Description:** Allows users to purchase items in their cart.

**Example Request:** /techdubs/purchase

**Example Response:**

```json
{
  "transactions": [
    {
      "id": "56rfytu9",
      "name": "iphone",
      "price": 800,
      "date": "2024-06-04 03:03:14"
    }
  ]
}
 item to the cart
 ```

**Error Handling:**
- Possible 500 error (Plain Text)
 - If there are any server errors, returns: 'An error occurred on the server. Please try again later.'
- Possible 400 error (Plain Text)
 - If the user is not logged in, returns: 'User is not logged in'
 - If there was no product ID provided or one or more parameters are missing, returns: 'One or more params are missing'

 ## Add Review for a Product
**Request Format:** /techdubs/addReview

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Allows users to add a review and rating for a specific product.

**Example Request:** /techdubs/addReview

**Example Response:**

```json
  {
  "dubs": {
    "review": "Awesome new phone. Really love it. Would highly recommend.",
    "rating": 5,
    "date": "2024-06-04"
  }
}

```

**Error Handling:**
- Possible 500 errors (all plain text)
  - If there are any server errors, returns: 'An error occurred on the server. Please try again later.'

- Possible 400 error (plain text)
  - If one or more parameters are missing, returns: 'One or more params are missing.'
  - If the product does not exist, returns: 'Product does not exist'
  - If the user has already reviewed the product, returns: 'User has already reviewed product'

   ## Get Product Ratings
**Request Format:** /techdubs/ratings/

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Retrieves ratings and reviews for a specific product based on its product ID.

**Example Request:** /techdubs/ratings/1

**Example Response:**

```json
  {
  "ratings": [
    {
      "review": "Awesome new phone. Really love it. Would highly recommend.",
      "rating": 5,
      "user": "dubs",
      "date": "2024-06-04"
    }
  ]
}
```

**Error Handling:**
- Possible 500 errors (all plain text)
  - If there are any server errors, returns: 'An error occurred on the server. Please try again later.'

- Possible 400 error (plain text)
  - If the product ID is missing or incorrect, returns: 'Product ID not given.'

## Logout
**Request Format:** /techdubs/logout

**Request Type:** POST

**Returned Data Format**: Text

**Description:** Logs out the current user.

**Example Request:** /techdubs/logout

**Example Response:**

```
Successfully logged out
```

**Error Handling:**
- Possible 500 error (plain text)
  - If there are any other server errors, returns 'An error occurred on the server. Try again later.'

## Search Products
**Request Format:** /techdubs/search

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Searches for products based on the provided search query.

**Example Request:** /techdubs/search

**Parameters:** search

**Example Response:**
```json
{
  "products": [
    {
      "id": 1,
      "brand": "Apple",
      "model": "iPhone 13",
      "category": "Smartphone",
      "price": 800,
      "stock": 5
    }
  ]
}
```
**Error Handling:**
- Possible 500 error (plain text)
  - If there are any other server errors, returns 'An error occurred on the server. Try again later.'

## Get Product by ID

**Request Format:** /techdubs/products/

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Retrieves product details by its ID.

**Example Request:** /techdubs/products/1

**Example Response:**
```json
{
  "id": 1,
  "brand": "Apple",
  "model": "iPhone 13",
  "category": "Smartphone",
  "price": 800,
  "quanitity": 5
}
```
**Error Handling:**
- Possible 500 error (plain text)
  - If there are any other server errors, returns 'An error occurred on the server. Try again later.'

## Get Products Data

**Request Format:** /techdubs/products-data

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Retrieves all products data or based on a specified category.

**Example Request:** /techdubs/products-data

**Example Response:**
```json
{
  "products": [
    {
      "id": 1,
      "brand": "Apple",
      "model": "iPhone 13",
      "category": "Smartphone",
      "price": 800,
      "quantity": 5
    }
  ]
}
```
**Error Handling:**
- Possible 500 error (plain text)
  - If there are any other server errors, returns 'An error occurred on the server. Try again later.'

## Remove from Cart

**Request Format:** /techdubs/removeFromCart

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Removes an item from the user's shopping cart.

**Example Request:** /techdubs/removeFromCart

**Example Response:**
```
Item was successfully removed.
```
**Error Handling:**
- Possible 500 error (plain text)
  - If there are any other server errors, returns 'An error occurred on the server. Try again later.'

