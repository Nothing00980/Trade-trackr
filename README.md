# Invoice Management System

A system to manage invoices, including searching, creating, and generating PDF invoices.

## Features

- **User Authentication**: Secure login and registration for users.
- **Invoice Generator**: Users can create their own invoices by filling out a form.
- **Import Bill Functionality**: Users can add their imported bills after logging in.
- **Search Functionality**: Search invoices by vendor name, date range, and review total amounts.
- **Generate PDF Invoices**: Create and download PDF versions of invoices.

## Screensnaps -- 


## Prerequisites

- Node.js
- MongoDB

## Installation

### Server

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/invoice-management-system.git
   cd invoice-management-system/server

2. Install dependencies:
   ```sh
   npm install
3.Create a .env file in the server directory and add your MongoDB URI and JWT secret:
```plaintext
  MONGODB_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
```
4.Start the server:
  ```sh
  npm start
```
## Client
Open client/index.html in your web browser.

## Usage
1. User Authentication:

- Register a new account or log in with an existing account.
2. Invoice Generator:

- Fill out the form to create a new invoice.
- The invoice will be generated and can be downloaded as a PDF.
 
3.Import Bill Functionality:

- After logging in, go to the import bill section.
- Add bills by filling out the required details.
4. Search Functionality:

- Use the search form to filter invoices by vendor name and date range.
- Review the total amount of the searched invoices.
## API Endpoints
### Authentication
- POST /register: Register a new user
- POST /login: Log in an existing user
### Invoice Management
- POST /create-invoice: Create a new invoice
- GET /search: Search invoices by vendor name and date range
## Example Usage
Create Invoice
curl -X POST http://localhost:3000/create-invoice \
-H "Content-Type: application/json" \
-d '{
    "wsaddress": "Warehouse Address",
    "wsgsstin": "WSGSTIN12345",
    "wspanno": "WSPAN12345",
    "rname": "Recipient Name",
    "rbname": "Recipient Business Name",
    "raddress": "Recipient Address",
    "rgstin": "RSGSTIN12345",
    "invoiceDetails": [
        {
            "description": "Item 1",
            "quantity": 2,
            "rate": 50,
            "amount": 100
        },
        {
            "description": "Item 2",
            "quantity": 1,
            "rate": 150,
            "amount": 150
        }
    ]
}'
### Search Invoices
curl -X POST http://localhost:3000/search \
-H "Authorization: Bearer <your_token>" \
-H "Content-Type: application/json" \
-d '{
    "vendorname": "Vendor Name",
    "startDate": "2023-01-01",
    "endDate": "2023-12-31"
}'

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.




