export async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-256", // Common elliptic curve
        },
        true, // Keys are extractable
        ["deriveKey", "deriveBits"]
    );
    return keyPair;
}

export async function exportPublicKey(publicKey) {
    const exported = await window.crypto.subtle.exportKey("spki", publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported))); // Base64 encode
}

export async function importPublicKey(base64Key) {
    const binaryKey = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        binaryKey.buffer,
        {
            name: "ECDH",
            namedCurve: "P-256",
        },
        true,
        []
    );
    return publicKey;
}

export async function deriveSharedSecret(privateKey, publicKey) {
    const sharedSecret = await window.crypto.subtle.deriveBits(
        {
            name: "ECDH",
            public: publicKey,
        },
        privateKey,
        256 // Length of the secret in bits
    );
    return sharedSecret;
}

async function encryptMessage(message, groupKey) {
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
    return { ciphertext, iv }; // Send both ciphertext and IV
}

async function decryptMessage(ciphertext, iv, groupKey) {
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        groupKey,
        ciphertext
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

async function generateGroupKey() {
    return await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true, // Extractable
        ["encrypt", "decrypt"]
    );
}

async function encryptGroupKey(groupKey, participantPublicKey) {
    const exportedKey = await crypto.subtle.exportKey("raw", groupKey);
    return await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        participantPublicKey,
        exportedKey
    );
}
