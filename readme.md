# University Research Opportunity Portal

## Project Description

The University Research Opportunity Portal is a web application for managing university research opportunities. Users can view, create, update, close, and delete opportunities.

## Technologies Used

* HTML
* CSS
* JavaScript
* Node.js
* Express.js
* MySQL
* Postman

## Features

* Display all research opportunities.
* View complete opportunity details.
* Create new opportunities.
* Update existing opportunities.
* Change an opportunity's status from Open to Closed.
* Delete opportunities.
* Validate required fields.
* Display success and error messages.

## Database Setup

The project uses a MySQL database named `research_portal`.

To create the database and table, run the SQL commands in `schema.sql`.

Configure your own database credentials in a local `.env` file. Never upload your `.env` file or database password to GitHub.

## REST API Endpoints

| Method | Endpoint                       | Purpose                       |
| ------ | ------------------------------ | ----------------------------- |
| GET    | `/api/opportunities`           | Retrieve all opportunities    |
| GET    | `/api/opportunities/:id`       | Retrieve an opportunity by ID |
| POST   | `/api/opportunities`           | Create an opportunity         |
| PUT    | `/api/opportunities/:id`       | Update an opportunity         |
| PATCH  | `/api/opportunities/:id/close` | Close an opportunity          |
| DELETE | `/api/opportunities/:id`       | Delete an opportunity         |

## How to Run

1. Install Node.js and MySQL.

2. Create the database and table using `schema.sql`.

3. Configure the local `.env` file with your MySQL credentials.

4. Open a terminal in the project folder.

5. Install dependencies:

   `npm install`

6. Start the server:

   `node server.js`

7. Open `http://localhost:3000` in your browser.

## API Testing

The exported Postman collection is included in `University_Research_Portal_API.json`. Import it into Postman to test the REST API endpoints.

## GitHub Repository

 link: GitHub Repository: https://github.com/waleed180405/university-research-opportunity-portal

