import { Options, Vue } from "vue-class-component";
import EncryptionHelper from "@/utils/crypto";
import authModule from "@/stores/auth";
const encryptionHelper = new EncryptionHelper();

@Options({
  components: {},
})
export default class Converter extends Vue {
  auth = authModule();
  plaintext: any = "";
  key: CryptoKey = null;
  encryptedData: any = "";
  decryptedData: any = "";
  publicKey: string = "";

  async generateKey() {
    await this.auth.generateAesKey();
    this.publicKey = this.auth.aesKey;
  }

  goToDashboard() {
    this.$router.push("/");
  }

  async encrypt() {
    // // convert the plaintext to an ArrayBuffer
    // const plaintextBuffer = new TextEncoder().encode(this.plaintext);

    // // generate a random IV
    // const iv = crypto.getRandomValues(new Uint8Array(16));

    // // encrypt the data with AES-CBC
    // const encryptedBuffer = await crypto.subtle.encrypt(
    //   { name: "AES-CBC", iv },
    //   this.key,
    //   plaintextBuffer
    // );

    // // concatenate the IV and encrypted data
    // const encryptedArray = new Uint8Array(
    //   iv.length + encryptedBuffer.byteLength
    // );
    // encryptedArray.set(iv, 0);
    // encryptedArray.set(new Uint8Array(encryptedBuffer), iv.length);
    // const encryptedData = Array.from(encryptedArray)
    //   .map((byte) => ("00" + byte.toString(16)).slice(-2))
    //   .join("");

    // set the encrypted data
    this.encryptedData = await encryptionHelper.encrypt(this.plaintext);
  }

  async decrypt() {
    // // convert the encrypted data to an ArrayBuffer
    // const encryptedArray = new Uint8Array(
    //   this.encryptedData.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16))
    // );
    // const iv = encryptedArray.slice(0, 16);
    // const encryptedData = encryptedArray.slice(16).buffer;

    // // decrypt the data with AES-CBC
    // const decryptedBuffer = await crypto.subtle.decrypt(
    //   { name: "AES-CBC", iv },
    //   this.key,
    //   encryptedData
    // );

    // convert the decrypted data to a string
    // const decryptedText = new TextDecoder().decode(decryptedBuffer);
    const decryptedText = await encryptionHelper.decrypt(this.encryptedData);

    // set the decrypted data
    this.decryptedData = decryptedText;
  }

  async mounted() {
    // generate a random AES key
    await crypto.subtle
      .generateKey({ name: "AES-CBC", length: 256 }, true, [
        "encrypt",
        "decrypt",
      ])
      .then((key) => {
        this.key = key;
      });
    // extract the raw key data
    const rawKeyData = await crypto.subtle.exportKey("raw", this.key);

    // convert the raw key data to a hexadecimal string
    const hexKey = Array.from(new Uint8Array(rawKeyData))
      .map((byte) => ("00" + byte.toString(16)).slice(-2))
      .join("");
  }
}
