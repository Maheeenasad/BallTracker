# BallTracker

This is a single-page web application (SPA) that provides an API for tracking the position of a ball in 3D space. It includes a web-based dashboard for displaying the ball's position in real-time.

## Features

- RESTful API endpoint for accepting the ball's position in 3D space.
- Relational database (MySQL) for storing the positions.
- User authentication for "ball monitors".
- Real-time 3D graph visualization using Three.js.
- WebSockets for real-time updates.

## Steps To run the Program
### 1. Set Up MySQL Database:

- Open XAMPP and start the MySQL service.
- Open phpMyAdmin (usually accessible at http://localhost/phpmyadmin).
- Create a new database named balltracker.
- Create two tables in the balltracker database:
users table:
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);
- positions table:
CREATE TABLE `positions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `x` float NOT NULL,
  `y` float NOT NULL,
  `z` float NOT NULL,
  PRIMARY KEY (`id`)
);
### 2. Set Up the Node.js Server:

- Open a terminal or command prompt.
- Navigate to the directory where you want to keep your project.
- Initialize a new Node.js project (if not already done):
npm init -y
- Install the necessary dependencies:
npm install express body-parser jwt bcryptjs mysql2 ws cors
- Create a file named server.js and paste the provided server code into it.
### 3. Set Up the Frontend:

- Create an index.html file in the same directory and paste the provided HTML and JavaScript code into it.
### 4. Run the Server:

- In the terminal, navigate to the project directory (if not already there).
- Start the server by running:
node server.js
- Ensure the server is running and listening on port 3000.
### 5. Open the Frontend:

- Open a web browser.
- Navigate to the location where you have saved index.html (e.g., you can open it directly from your file system by double-clicking the file or dragging it into the browser).
### 6. Test the Application:

- Register a new user using Postman or any API testing tool by making a POST request to http://localhost:3000/api/register with a JSON body containing username and password.
{
  "username": "your_username",
  "password": "your_password"
}
- Log in using the form on the web page.
- After logging in, you should be redirected to the dashboard where you can submit positions.
## Additional Notes
- Ensure your MySQL server credentials in server.js are correct:
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // Update with your MySQL root password if necessary
  database: 'balltracker'
});
- If you encounter any issues, check the console logs in both the terminal and the browser for error messages.
