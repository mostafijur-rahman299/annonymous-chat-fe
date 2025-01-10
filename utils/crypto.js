// Helper Functions
function base64Encode(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer))).replace(/=/g, '');
}

function base64Decode(base64) {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

// Generate a group key for AES encryption
export async function generateGroupKey() {
    return await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true, // Extractable
        ["encrypt", "decrypt"]
    );
}

// Encrypt the group key with an RSA public key
export async function encryptGroupKey(groupKey, rsaPublicKey) {
    const exportedKey = await crypto.subtle.exportKey("raw", groupKey);
    return base64Encode(
        await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            rsaPublicKey,
            exportedKey
        )
    );
}


export async function decryptGroupKey(encryptedKey, rsaPrivateKey) {
    const binaryKey = base64Decode(encryptedKey);
    const decryptedKey = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        rsaPrivateKey,
        binaryKey
    );
    return await crypto.subtle.importKey(
        "raw",
        decryptedKey,
        { name: "AES-GCM" },
        true, // Extractable
        ["encrypt", "decrypt"]
    );
}


// Generate an RSA key pair for encryption
export async function generateRSAKeyPair() {
    return await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048, // Key length
            publicExponent: new Uint8Array([1, 0, 1]), // Common exponent
            hash: "SHA-256", // Hash algorithm
        },
        true, // Keys are extractable
        ["encrypt", "decrypt"]
    );
}

// Export the public key in Base64 format for sharing
export async function exportPublicKey(publicKey) {
    const exported = await crypto.subtle.exportKey("spki", publicKey);
    return base64Encode(exported);
}

// Import a Base64-encoded public key into a CryptoKey object
export async function importPublicKey(base64Key) {
    try {
        const binaryKey = base64Decode(base64Key);
        return await crypto.subtle.importKey(
            "spki",
            binaryKey.buffer,
            {
                name: "ECDH",
                namedCurve: "P-256",
            },
            true,
            [] // No usages for imported public key
        );
    } catch (e) {
        throw new Error("Failed to import public key: " + e.message);
    }
}

// Derive a shared secret using ECDH
export async function deriveSharedSecret(privateKey, publicKey) {
    try {
        const sharedSecret = await crypto.subtle.deriveBits(
            {
                name: "ECDH",
                public: publicKey,
            },
            privateKey,
            256 // Length of the secret in bits
        );
        return base64Encode(sharedSecret);
    } catch (e) {
        throw new Error("Failed to derive shared secret: " + e.message);
    }
}

// Encrypt a message using AES-GCM with the group key
export async function encryptMessage(message, groupKey) {
    try {
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12)); // Random Initialization Vector
        const ciphertext = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            groupKey,
            encoder.encode(message)
        );
        return {
            ciphertext: base64Encode(ciphertext), // Base64-encoded ciphertext
            iv: base64Encode(iv)                 // Base64-encoded IV
        };
    } catch (e) {
        throw new Error("Encryption failed: " + e.message);
    }
}

// Decrypt a message using AES-GCM with the group key
export async function decryptMessage(ciphertext, iv, groupKey) {
    try {
        const decodedCiphertext = base64Decode(ciphertext);
        const decodedIv = base64Decode(iv);

        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: decodedIv,
            },
            groupKey,
            decodedCiphertext
        );
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (e) {
        throw new Error("Failed to decrypt message: " + e.message);
    }
}
