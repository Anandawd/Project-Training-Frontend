import authModule from "@/stores/auth";

class EncryptionHelper {
  private iv: Uint8Array;

  constructor() {
    this.iv = new TextEncoder().encode("JHGHFsd56hsd63^9");
  }

  private async importKey(keyData: string) {
    const key = new TextEncoder().encode("^%^#@JHGHFsd56hsd63^93g$0gtr#vf3");
    return await window.crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC" },
      false,
      ["encrypt", "decrypt"]
    );
  }

  // Helper function to convert ArrayBuffer to Base64 string
  arrayBufferToBase64(buffer: ArrayBuffer) {
    const binary = String.fromCharCode.apply(null, new Uint8Array(buffer));
    return window.btoa(binary);
  }

  // Helper function to convert Base64 string to ArrayBuffer
  base64ToArrayBuffer(base64: string) {
    const binary = window.atob(base64);
    const length = binary.length;
    const buffer = new ArrayBuffer(length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < length; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

  private async encryptString(str: string, key: CryptoKey, iv: Uint8Array) {
    const data = new TextEncoder().encode(str);
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv: iv },
      key,
      data
    );
    return this.arrayBufferToBase64(encryptedData);
  }

  private async decryptString(
    base64String: string,
    key: CryptoKey,
    iv: Uint8Array
  ) {
    const data = this.base64ToArrayBuffer(base64String);
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: iv },
      key,
      data
    );
    return new TextDecoder().decode(decryptedData);
  }

  async encrypt(str: string, salt?: string) {
    const auth = authModule();
    const key = await this.importKey(auth.aesKey);
    const iv = this.generateIV(auth.aesIV, salt);
    return await this.encryptString(str, key, iv);
  }

  async decrypt(base64String: string, salt?: string) {
    const auth = authModule();
    const key = await this.importKey(auth.aesKey);
    const iv = this.generateIV(auth.aesIV, salt);
    return await this.decryptString(base64String, key, iv);
  }

  private generateIV(iv: string, salt?: string) {
    let newIV = iv;
    if (salt) {
      if (salt.length > iv.length) {
        newIV = salt.slice(0, iv.length);
      } else {
        const keyR = iv.slice(0, salt.length);
        newIV = iv.replace(keyR, salt);
      }
    }
    const IV = new TextEncoder().encode(newIV);
    return IV;
  }
}

export default EncryptionHelper;
