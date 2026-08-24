// Note: For production, use a proper encryption library
// Simple XOR encryption (for demo purposes)
// In production, use: bcrypt, crypto-js, or Node.js crypto



const ENCRYPTION_KEY = "nexus_secure_key_2024"

// Encode string to base64
const encodeBase64 = (str: string): string => {
    return btoa(unescape(encodeURIComponent(str)))

}

// Decode base64 to string

const decodeBase64 = (str: string): string => {
    return decodeURIComponent(escape(atob(str)))
}

// XOR cipher


const xorCipher = (str: string, key: string): string => {
    let result = ""
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        result += String.fromCharCode(charCode);
    }
    return result
}


// Encrypt API key


export const encryptApiKey = (apiKey: string): string => {
    const xorEncrypted = xorCipher(apiKey, ENCRYPTION_KEY);
    return encodeBase64(xorEncrypted);
}

// Decrypt API key
export const decryptApiKey = (encrypted: string): string => {

    const xorDecrypted = decodeBase64(encrypted);
    return xorCipher(xorDecrypted, ENCRYPTION_KEY)
}

// Mask API key for display (show only last 4 chars)

export const maskApiKey = (apiKey: string): string => {
    if (!apiKey) return '';
    if (apiKey.length <= 8) return '••••••••';
    const visible = apiKey.slice(-4);
    return '••••••••' + visible;


}

// Validate API key format (basic check)
export const isValidApiKey = (apiKey: string): boolean => {
    return apiKey.length >= 8;

}