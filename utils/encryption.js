const crypto = require("crypto")

class EncryptionService {
  constructor() {
    this.algorithm = "aes-256-gcm"
    this.keyLength = 32 // 256 bits
    this.ivLength = 16 // 128 bits
    this.tagLength = 16 // 128 bits
    this.saltLength = 32 // 256 bits
  }

  // Derive encryption key from master key and salt using PBKDF2
  deriveKey(masterKey, salt, iterations = 100000) {
    return crypto.pbkdf2Sync(masterKey, salt, iterations, this.keyLength, "sha256")
  }

  // Encrypt data with authenticated encryption (AES-256-GCM)
  encrypt(data, masterKey) {
    try {
      // Generate random salt and IV
      const salt = crypto.randomBytes(this.saltLength)
      const iv = crypto.randomBytes(this.ivLength)

      // Derive encryption key
      const key = this.deriveKey(masterKey, salt)

      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      cipher.setAAD(Buffer.from("certificate-data", "utf8"))

      // Encrypt data
      const dataString = JSON.stringify(data)
      let encrypted = cipher.update(dataString, "utf8", "hex")
      encrypted += cipher.final("hex")

      // Get authentication tag
      const tag = cipher.getAuthTag()

      return {
        encryptedData: encrypted,
        iv: iv.toString("hex"),
        salt: salt.toString("hex"),
        tag: tag.toString("hex"),
      }
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`)
    }
  }

  // Decrypt data with authentication verification
  decrypt(encryptedData, iv, salt, tag, masterKey) {
    try {
      // Convert hex strings back to buffers
      const ivBuffer = Buffer.from(iv, "hex");
      if (ivBuffer.length !== this.ivLength) {
        throw new Error("Invalid initialization vector length");
      }

      const saltBuffer = Buffer.from(salt, "hex");
      const tagBuffer = Buffer.from(tag, "hex");

      // Derive decryption key
      const key = this.deriveKey(masterKey, saltBuffer);

      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, key, ivBuffer);
      decipher.setAAD(Buffer.from("certificate-data", "utf8"));
      decipher.setAuthTag(tagBuffer);

      // Decrypt data
      let decrypted = decipher.update(encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  // Generate cryptographically secure hash
  generateHash(data, algorithm = "sha256") {
    return crypto.createHash(algorithm).update(JSON.stringify(data)).digest("hex")
  }

  // Generate secure random certificate ID
  generateCertificateId(institutionCode, year) {
    const randomBytes = crypto.randomBytes(3)
    const sequence = Number.parseInt(randomBytes.toString("hex"), 16).toString().padStart(6, "0")
    return `${institutionCode}-${year}-${sequence}`
  }

  // Verify data integrity using HMAC
  verifyIntegrity(data, signature, key) {
    const hmac = crypto.createHmac("sha256", key)
    hmac.update(JSON.stringify(data))
    const computedSignature = hmac.digest("hex")

    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(computedSignature, "hex"))
  }

  // Generate HMAC signature for data integrity
  generateSignature(data, key) {
    const hmac = crypto.createHmac("sha256", key)
    hmac.update(JSON.stringify(data))
    return hmac.digest("hex")
  }
}

module.exports = new EncryptionService()
