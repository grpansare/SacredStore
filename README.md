# SacredStore - Religious E-commerce Platform

SacredStore is a comprehensive e-commerce solution designed specifically for religious products. It provides a seamless shopping experience for customers and powerful management tools for administrators, ensuring a smooth and efficient operation.

---

## Live Demo

Experience SacredStore live: [https://sacredstore-2.onrender.com](https://sacredstore-2.onrender.com)

---

## Features

### User-Facing Features

* **Product Catalog:** Browse a wide range of religious products with detailed descriptions and images.
* **Shopping Cart:** Easily add, remove, and update quantities of items in your cart before checkout.
* **Order History:** Keep track of all your past purchases with detailed order summaries.
* **Secure Checkout:** A streamlined and secure process for completing your purchase.
* **Razorpay Integration:** Convenient and secure online payments powered by Razorpay.
* **User Authentication:** Secure login and registration for personalized experiences.

### Admin Dashboard Features

* **Product Management:**
    * Add new products with descriptions, images, pricing, and category assignments.
    * Edit existing product details.
    * Manage product inventory.
    * Categorize products for easier navigation.



---

## Technologies Used

* **Backend:** Spring Boot (Java)
* **Frontend:** React.js
* **Database:** MySQL
* **Payment Gateway:** Razorpay

---

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Java Development Kit (JDK) 11 or higher**
* **Maven** or **Gradle** (for Spring Boot backend)
* **Node.js** (LTS version recommended) and **npm** (comes with Node.js)
* **MySQL Server** running locally or accessible remotely

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd SacredStore
    ```

2.  **Backend Setup (Spring Boot):**
    ```bash
    cd backend
    # If using Maven:
    mvn clean install
    # If using Gradle:
    # gradle build
    # Configure your database connection in src/main/resources/application.properties or application.yml
    # For example:
    # spring.datasource.url=jdbc:mysql://localhost:3306/sacredstore_db
    # spring.datasource.username=your_mysql_username
    # spring.datasource.password=your_mysql_password
    # Run the Spring Boot application
    mvn spring-boot:run
    # Or from your IDE (e.g., IntelliJ IDEA, Eclipse) run the main application class
    ```

3.  **Frontend Setup (React.js):**
    ```bash
    cd frontend
    npm install
    # Configure the API endpoint for your backend in a .env file (e.g., .env.development)
    # Example: REACT_APP_API_URL=http://localhost:8080/api
    npm start
    ```

### Configuration

* **Razorpay API Keys:** Obtain your API keys (Key ID and Key Secret) from the [Razorpay Dashboard](https://dashboard.razorpay.com/). You will need to set these in your **Spring Boot backend's configuration** (e.g., `application.properties` or environment variables).
* **Database Configuration:** Update the MySQL database connection settings in your Spring Boot `application.properties` or `application.yml` file. Remember to create the database (`sacredstore_db` or your chosen name) in MySQL beforehand.

---

## Usage

### For Customers

1.  Register or log in to your account.
2.  Browse products by category or use the search bar.
3.  Add desired items to your cart.
4.  Proceed to checkout, enter your shipping details, and make a secure payment via Razorpay.
5.  View your order history to track past purchases.

### For Administrators

1.  Log in to the admin dashboard using your administrator credentials.
2.  Use the navigation menu to:
    * Manage **Products**: Add new products, edit existing ones, update stock.

---

## Contributing

We welcome contributions to SacredStore! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

---

---

## Contact

For any inquiries or support, please contact grpansare2002@gmail.com].
