
# Secure Academic Certificate Verification System

**This is a MERN (MongoDB, Express.js, React.js, Node.js) stack web application designed to securely issue and verify academic certificates. It addresses the issue of certificate fraud by using cryptographic techniques to ensure data integrity and authenticity.**

## Features

* User Authentication: Secure registration and login for different user roles.
* Role-Based Access Control (RBAC):
  * `admin` role: Can issue new certificates.
  * `user` role: Can verify existing certificates.
* Certificate Issuance (Admin): Admins can issue certificates, storing student details and encrypting sensitive certificate data. A cryptographic hash of the original data is stored for integrity verification.
* Certificate Verification (User): Users can verify a certificate by entering its unique ID, checking its authenticity and integrity.
* Security Measures:
  * **Password hashing using** `bcrypt`.
  * **JWT for secure session management.**
  * **Input validation and sanitization (`express-validator`) to prevent XSS attacks.**
  * **AES-256 encryption for sensitive certificate data at rest.**
  * **SHA-256 hashing for certificate data integrity checks.**
  * **Conceptual HTTPS setup (comments in `server.js`).**

## How It Works

The system operates through the following key processes:

1. **User Authentication:**

   * When a user (admin or regular user) registers, their password is securely hashed using `bcrypt` before being stored in the database.
   * Upon login, the entered password is also hashed and compared with the stored hash to authenticate the user.
   * Upon successful login, a JWT (JSON Web Token) is issued to the client. This token is used for subsequent requests to identify and authorize the user.
2. **Certificate Issuance (Admin Role):**

   * An administrator, after logging in, can access the certificate issuance form.
   * The admin enters the required details such as student name, course, institution, graduation date, and grade.
   * When the admin submits the form:
     * The backend API (`/api/certificates/issue`) receives the data.
     * The data is validated on the server.
     * Sensitive certificate data is encrypted using AES-256 encryption with a unique Initialization Vector (`iv`), salt, and authentication tag.
     * A SHA-256 hash (a unique digital fingerprint) of the original certificate data is generated.
     * All the encrypted data, IV, salt, tag, and the data hash, along with the other certificate details, are stored in the MongoDB database. The `issuedBy` field links the certificate to the admin user who issued it.
3. **Certificate Verification (Public Access):**

   * Any user can access the certificate verification page.
   * The user enters a unique Certificate ID.
   * The frontend sends a request to the backend API (`/api/certificates/verify/:certificateId`).
   * The backend retrieves the certificate data based on the provided ID.
   * The backend then:
     * Decrypts the `encryptedData` using the stored IV, salt, and tag with the secret AES encryption key.
     * Generates a new SHA-256 hash of the decrypted data.
     * Compares this newly generated hash with the stored `dataHash`.
   * If the hashes match, it confirms the integrity of the certificate data (it hasn't been tampered with).
   * The system then returns the decrypted certificate details and a verification status (valid/invalid integrity).

## Security Principles Used

This system employs several security principles to ensure the authenticity and integrity of academic certificates:

1. **Encryption (Keeping Secrets Safe):** Sensitive certificate data is scrambled using AES-256 encryption. This means that even if someone gains unauthorized access to the database, the core information about the certificate is unreadable without the secret encryption key. This is like putting the important details in a digital lockbox.
2. **Integrity Protection (Ensuring No Tampering):** A SHA-256 hash (a unique digital fingerprint) is generated for each certificate's data. This hash is stored alongside the encrypted data. When a certificate is verified, a new hash is calculated from the decrypted data and compared to the stored hash. If they match, it proves that the certificate data has not been altered since it was issued. This is like having a tamper-proof seal on the certificate.
3. **Authentication (Verifying User Identity):** When users (especially admins) log in, their identity is verified using `bcrypt` to securely compare their entered password with the stored, hashed password. This ensures that only legitimate users can access the system's features.
4. **Authorization (Controlling Access):** Role-Based Access Control (RBAC) is used to ensure that only administrators can issue new certificates, while other users might only have permission to verify them. This prevents unauthorized actions within the system.

## Achieving Security in Node.js

These security principles were implemented in the Node.js backend using the following tools and techniques:

* **Encryption and Hashing:** The built-in `crypto` module in Node.js was used for AES-256 encryption (`crypto.createCipheriv`) and SHA-256 hashing (`crypto.createHash('sha256')`). This module provides the necessary cryptographic functions.
* **Password Hashing:** The `bcrypt` library was used to securely hash user passwords before storing them in the database, making it very difficult for attackers to retrieve the original passwords even if they gain access to the database.
* **Authentication and Authorization:** The `jsonwebtoken` library was used to create and verify JSON Web Tokens (JWTs). These tokens are issued upon successful login and are used to authenticate subsequent requests. The user's role (e.g., 'admin', 'user') is often included in the JWT, allowing the backend to implement authorization checks in API routes.
* **Input Validation:** While mentioned, the specifics of `express-validator` usage would be in the backend code (likely in the Express.js routes) to ensure that data received from the frontend is valid and sanitized to prevent common web vulnerabilities like Cross-Site Scripting (XSS).

## Tanzanian Context

**This system directly addresses** **certificate fraud**, a significant challenge in educational institutions globally, including in Tanzania. By providing a secure, verifiable digital record of academic achievements, it aims to:

* Enhance Trust: Restore confidence in academic credentials issued by Tanzanian universities.
* Combat Forgery: Make it significantly harder to create fake certificates.
* Streamline Verification: Provide a quick and reliable way for employers, other institutions, or individuals to verify academic qualifications.
* Accessibility: The simple UI and web-based approach aim to be accessible even with basic internet connectivity, common in various parts of Tanzania.

## Tech Stack

* Frontend: React.js (with radixUI for UI) with NextJs 15
* Backend: Node.js, Express.js
* Database: MongoDB (via Mongoose ODM)
* Authentication: `bcrypt`, `jsonwebtoken`
* Validation: `express-validator`
* Encryption: Node.js `crypto` module

## Setup Instructions

**Prerequisites:**

* **Node.js (LTS version recommended)**
* **npm (Node Package Manager)**
* **MongoDB Atlas account (or local MongoDB instance)**

### 1. Backend Setup (`server` directory)

**Navigate to the `server` directory:**
