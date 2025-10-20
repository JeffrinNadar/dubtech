# 🛒 TechDubs E-commerce Website

This project is a fully-functional e-commerce website built with a classic web stack. The frontend is powered by **HTML**, **CSS**, and **Vanilla JavaScript** for a lightweight and dynamic user experience. The backend is built using **Node.js** with the **Express** framework and uses an **SQLite** database for data persistence.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You'll need the following software installed:

* **Node.js**: The runtime environment for the backend.
* **npm**: Node Package Manager (comes with Node.js) to install project dependencies.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/JeffrinNadar/dubtech.git
    cd dubtech
    ```

2.  **Install Node dependencies:**
    Navigate to the project's root directory and run the following command to install the required packages (`express`, `multer`, `sqlite3`, `sqlite`, etc.):

    ```bash
    npm install
    ```

3.  **Create the Database:**
    The backend connects to an SQLite database file named **`dubtech.db`**. You will need to create this file and populate it with the necessary tables (`users`, `products`, `ratings`, `transactions`).
    
    There is a file called **`tables.sql`** where you can run SQL commands to create the tables locally.

    You can use an SQLite tool to create the `dubtech.db` file and define your tables with initial data. If you prefer, you can use the current database and ignore this step.

### Running the Server

Start the Node.js server from the project's root directory:

```bash
node app.js
```

The application serves static files from the public directory and listens on port 8000 (or the port specified by the PORT environment variable).

### 🖥️ Accessing the Website
```
http://localhost:8000
```

Check out the API doc to learn more about the endpoints. 

### 🛠️ Built With
* **Frontend:** HTML, CSS, Vanilla JavaScript
* **Backend:** Node.js, Express
* **Database:** SQLite
* **Dependencies:** express, multer, sqlite3, sqlite

### 👥 Authors
* **Jeffrin Nadar**
* **Mo Khair**
