const crypto = require('crypto');

// Function to encrypt data
function encryptData(data, key) {
    // Create a random initialization vector
    const iv = crypto.randomBytes(16);

    // Create a Cipher object using AES-256-CBC algorithm
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);

    // Encrypt the data
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    // Return the IV and the encrypted data as a single string
    return `${iv.toString('hex')}:${encrypted}`;
}

// Function to decrypt data
function decryptData(encryptedData, key) {
    // Split the IV and the encrypted data
    const [iv, encrypted] = encryptedData.split(':');

    // Create a Decipher object using AES-256-CBC algorithm
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));

    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}

module.exports = { encryptData, decryptData }