# Secure Certificate Verification System

## Overview

The **Secure Certificate Verification System** is a certificate verification system designed to ensure the authenticity and integrity of academic certificates. It leverages modern cryptographic techniques to encrypt, store, and verify certificate data securely. The system is built using **Next.js** for the API layer and **MongoDB** for data storage.

## Features

- **Certificate Encryption**: Certificates are encrypted using AES-256-GCM for secure storage.
- **Data Integrity Verification**: Ensures that certificate data has not been tampered with by validating its hash.
- **Certificate Verification API**: Provides an endpoint to verify certificates based on their unique ID.
- **Secure Key Derivation**: Uses PBKDF2 to derive encryption keys from a master key and salt.
- **HMAC-Based Integrity Checks**: Supports HMAC signatures for additional data integrity verification.
- **Random Certificate ID Generation**: Generates unique and secure certificate IDs.

## Folder Structure

```
security-project/
├── app/
│   └── api/
│       └── certificates/
│           └── verify/[certificateId]/route.ts  # API route for certificate verification
├── utils/
│   └── encryption.js                            # Encryption and decryption utilities
├── data/
│   └── certificates.json                        # Sample certificate data
├── lib/
│   └── mongodb.js                               # MongoDB connection utility
├── models/
│   └── Certificate.js                           # Mongoose model for certificates
└── README.md                                    # Project documentation
```

## Steps

Follow these steps to use the system:

1. **Set Up the Environment**:
   - Install **Node.js** (v16 or later) and ensure it is running on your machine.
   - Install **MongoDB** and start a MongoDB instance.

2. **Clone the Repository**:
   - Open a terminal and run:
     ```bash
     git clone https://github.com/your-username/security-project.git
     cd security-project
     ```

3. **Install Dependencies**:
   - Run the following command to install all required dependencies:
     ```bash
     npm install
     ```

4. **Configure Environment Variables**:
   - Create a `.env` file in the root directory of the project.
   - Add the following variables:
     ```
     ENCRYPTION_KEY=your-32-byte-encryption-key
     MONGODB_URI=your-mongodb-connection-string
     ```
   - Replace `your-32-byte-encryption-key` with a secure 32-byte key and `your-mongodb-connection-string` with your MongoDB connection string.

5. **Start the Development Server**:
   - Run the following command to start the server:
     ```bash
     npm run dev
     ```
   - The server will start at `http://localhost:3000`.

6. **Verify a Certificate**:
   - Use a tool like **Postman** or your browser to send a `GET` request to the following endpoint:
     ```
     http://localhost:3000/api/certificates/verify/[certificateId]
     ```
   - Replace `[certificateId]` with the unique ID of the certificate you want to verify (e.g., `UDSM-2024-123456`).

7. **Check the Response**:
   - If the certificate is valid and its data integrity is intact, you will receive a success response with the certificate details.
   - If the certificate is invalid, revoked, or tampered with, you will receive an error message.

8. **Test with Sample Data**:
   - The project includes sample certificate data in `data/certificates.json`. You can use this data to test the system.

## API Endpoints

### `GET /api/certificates/verify/[certificateId]`

Verifies the authenticity and integrity of a certificate.

#### Request Parameters:
- `certificateId` (string): The unique ID of the certificate to verify.

#### Response:
- **Success (200)**:
  ```json
  {
    "success": true,
    "message": "Certificate verified successfully",
    "certificate": {
      "certificateId": "UDSM-2024-123456",
      "studentName": "John Doe",
      "course": "Bachelor of Science in Computer Science",
      "institution": "University of Dar es Salaam",
      "graduationDate": "2024-07-15T00:00:00.000Z",
      "grade": "First Class",
      "issuedAt": "2024-01-01T00:00:00.000Z",
      "issuedBy": "University of Dar es Salaam",
      "status": "active",
      "verified": true,
      "integrityCheck": "PASSED"
    }
  }
  ```
- **Failure (400/404/500)**:
  ```json
  {
    "success": false,
    "message": "Error message describing the issue"
  }
  ```

## Cryptographic Details

- **Encryption Algorithm**: AES-256-GCM
- **Key Derivation**: PBKDF2 with SHA-256
- **Initialization Vector (IV)**: 16 bytes (128 bits)
- **Salt**: 32 bytes (256 bits)
- **Authentication Tag**: 16 bytes (128 bits)
- **Hashing Algorithm**: SHA-256

## How It Works

1. **Encryption**:
   - Certificate data is encrypted using AES-256-GCM.
   - A unique salt and IV are generated for each encryption.
   - The encrypted data, IV, salt, and authentication tag are stored in the database.

2. **Decryption**:
   - The stored encrypted data is decrypted using the same algorithm and key derivation process.
   - The decrypted data is validated against its hash to ensure integrity.

3. **Verification**:
   - The API validates the certificate ID format.
   - It retrieves the certificate from the database and decrypts its data.
   - The integrity of the decrypted data is verified using its hash.

## Prerequisites

- **Node.js**: v16 or later
- **MongoDB**: A running MongoDB instance
- **Environment Variables**:
  - `ENCRYPTION_KEY`: A 32-byte master key for encryption and decryption.

## Future Enhancements

- Add support for batch certificate verification.
- Implement a user-friendly frontend for certificate verification.
- Integrate with third-party authentication systems for secure access.
- Add audit logging for verification requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact

For questions or support, please contact [your-email@example.com].
