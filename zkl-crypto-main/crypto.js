import init, * as ecies from "ecies-wasm";
import { Key } from "@zklx/kds";

init();
const td = new TextDecoder();
const te = new TextEncoder();

const METADATA_LENGTH = 4 + 1020; // [byte length, 255 chars * 4 bytes]

/**
 * Encrypts given data for the recipient
 *
 * @param {Key} publicKey The public key of the recipient
 * @param {string} fileName Name of the file
 * @param {Uint8Array} data The plaintext data
 * @returns {Uint8Array} The ciphertext data
 * @throws {TypeError} If arguments are of incorrect types
 */
export function encryptFile(publicKey, fileName, data) {
  if (!(publicKey instanceof Key)) {
    throw new TypeError("publicKey must be an instance of Key");
  }
  if (!(data instanceof Uint8Array)) {
    throw new TypeError("data must be an instance of Uint8Array");
  }
  if (!fileName) fileName = "Unknown file";

  const _data = new Uint8Array(METADATA_LENGTH + data.length);
  const fnBytes = te.encode(fileName);
  _data.set(int2byteArray(fnBytes.length));
  _data.set(fnBytes, 4);
  _data.set(data, METADATA_LENGTH);

  return encrypt(publicKey, _data);
}

/**
 * Decrypts given data with recipient's private key
 *
 * @param {Key} privateKey The private key of the recipient
 * @param {Uint8Array} data The ciphertext data
 * @returns {{data: Uint8Array, fileName: string}} The plaintext data
 * @throws {TypeError} If arguments are of incorrect types
 */
export function decryptFile(privateKey, data) {
  if (!(privateKey instanceof Key)) {
    throw new TypeError("privateKey must be an instance of Key");
  }
  if (!(data instanceof Uint8Array)) {
    throw new TypeError("data must be an instance of Uint8Array");
  }

  const plaintext = decrypt(privateKey, data);
  const fnLength = byteArray2int(plaintext.slice(0, 4));
  const fnBytes = plaintext.slice(4, 4 + fnLength);
  const fdBytes = plaintext.slice(METADATA_LENGTH, plaintext.length);
  const fileName = td.decode(fnBytes);

  return {
    data: fdBytes,
    fileName: fileName,
  };
}

/**
 * Encrypts given string for the recipient
 *
 * @param {Key} publicKey The public key of the recipient
 * @param {string} string The plaintext
 * @returns {string} The ciphertext as hexadecimal string
 * @throws {TypeError} If arguments are of incorrect types
 */
export function encryptString(publicKey, string) {
  if (!(publicKey instanceof Key)) {
    throw new TypeError("publicKey must be an instance of Key");
  }
  if (typeof string !== "string") {
    throw new TypeError("string must be of type string");
  }

  const byteArray = te.encode(string);
  const encryptedData = encrypt(publicKey, byteArray);
  return encryptedData.asHexString();
}

/**
 * Decrypts given string of ciphertext in hexadecimal
 *
 * @param {Key} privateKey The private key of the recipient
 * @param {string} string The ciphertext string in hexadecimal
 * @returns {string} The plaintext
 * @throws {TypeError} If arguments are of incorrect types
 */
export function decryptString(privateKey, string) {
  if (!(privateKey instanceof Key)) {
    throw new TypeError("privateKey must be an instance of Key");
  }
  if (typeof string !== "string") {
    throw new TypeError("string must be of type string");
  }
  if (!/^[0-9a-fA-F]+$/.test(string)) {
    console.warn("string does not seem to be a valid hexadecimal string");
  }

  const byteArray = Uint8Array.from(
    string.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
  );
  const decryptedData = decrypt(privateKey, byteArray);
  return td.decode(decryptedData);
}

function encrypt(publicKey, plaintext) {
  if (!(publicKey instanceof Key)) {
    throw new TypeError("publicKey must be an instance of Key");
  }
  if (!(plaintext instanceof Uint8Array)) {
    throw new TypeError("plaintext must be an instance of Uint8Array");
  }
  return ecies.encrypt(publicKey.asByteArray, plaintext);
}

function decrypt(privateKey, ciphertext) {
  if (!(privateKey instanceof Key)) {
    throw new TypeError("privateKey must be an instance of Key");
  }
  if (!(ciphertext instanceof Uint8Array)) {
    throw new TypeError("ciphertext must be an instance of Uint8Array");
  }
  return ecies.decrypt(privateKey.asByteArray, ciphertext);
}

/**
 * Converts a 32-bit signed integer into an array of 4 bytes (little-endian).
 *
 * @param {number} int - The 32-bit signed integer to convert. Must be in the range of a signed 32-bit integer (-2^31 to 2^31-1).
 * @returns {number[]} An array of 4 bytes, where the least significant byte is the first element (little-endian).
 * @example
 * // Convert 305419896 (0x12345678) to bytes
 * int2byteArray(305419896); // [120, 86, 52, 18]
 */
function int2byteArray(int) {
  return [
    int & 0xff ? int & 0xff : 0,
    (int >> 8) & 0xff ? (int >> 8) & 0xff : 0,
    (int >> 16) & 0xff ? (int >> 16) & 0xff : 0,
    (int >> 24) & 0xff ? (int >> 24) & 0xff : 0,
  ];
}

/**
 * Converts an array of 4 bytes (little-endian) into a 32-bit signed integer.
 *
 * @param {number[]} bytes - An array of 4 bytes where the least significant byte is the first element (little-endian).
 * @returns {number} The reconstructed 32-bit signed integer.
 * @example
 * // Convert [120, 86, 52, 18] back to an integer
 * byteArray2int([120, 86, 52, 18]); // 305419896 (0x12345678)
 */
function byteArray2int(bytes) {
  return bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
}

function asHexString() {
  return this.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    "",
  );
}

if (!Uint8Array.prototype.asHexString) {
  Uint8Array.prototype.asHexString = asHexString;
} else {
  console.warn("asHexString method already exists on Uint8Array.prototype");
}
