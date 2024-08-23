
# Genetica Test API

This project provides a basic API for managing gene data, executing computations within a Trusted Execution Environment (TEE), and interacting with users. The API endpoints are documented in the provided Postman collection.

## Prerequisites

- Node.js installed on your machine
- Postman for testing the API endpoints

To start the server, run:

```bash
node app.js
```

The server will start on `http://localhost:3000`.

## API Endpoints

The following API endpoints are available:

1. **Login**

   - **Method:** `POST`
   - **URL:** `http://localhost:3000/login`
   - **Body:** (URL-encoded)
     - `email`: User's email
     - `password`: User's password

2. **Submit Gene Data**

   - **Method:** `POST`
   - **URL:** `http://localhost:3000/submit-gene-data`
   - **Auth:** Bearer Token
   - **Body:** (URL-encoded)
     - `geneData`: Gene data to be submitted

3. **Get Gene Data**

   - **Method:** `GET`
   - **URL:** `http://localhost:3000/me/gene-data`
   - **Auth:** Bearer Token

4. **Execution in TEE**

   - **Method:** `POST`
   - **URL:** `http://localhost:3000/admin/execution`
   - **Body:** (URL-encoded)
     - `userId`: ID of the user whose data will be processed in the TEE

