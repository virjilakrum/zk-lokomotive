/**
 * Represents a cryptographic key.
 */
export class Key {
  #key = new Uint8Array(1);

  /**
   * Creates a new Key instance.
   *
   * @param {string} type - The type of key, either "public" or "private".
   * @param {Object} details - Details about the key.
   * @param {Uint8Array} [details.fromByteArray] - The key as a byte array.
   * @param {string} [details.fromHexString] - The key as a hexadecimal string.
   * @throws {TypeError} If the type is not "public" or "private", or if details are provided but do not contain a valid key representation.
   */
  constructor(type, details) {
    if (type.toLowerCase() !== "public" && type.toLowerCase() !== "private")
      throw new TypeError(
        "Required property 'type' may only take 'public' or 'private' as values"
      );
    else this.keyType = type;

    if (!details || (!details.fromByteArray && !details.fromHexString))
      throw new TypeError(
        "Missing required property 'fromByteArray' or 'fromHexString' in parameter 'details'"
      );

    if (details.fromByteArray && details.fromHexString)
      console.warn(
        "Both 'fromByteArray' and 'fromHexString' present. Value of 'fromHexString' will be used."
      );

    if (details.fromByteArray) {
      this.#key = details.fromByteArray;
    } else if (details.fromHexString) {
      this.#key = Uint8Array.from(
        details.fromHexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );
    }
  }

  /**
   * Gets the key as a hexadecimal string.
   *
   * @returns {string} The key as a hexadecimal string.
   */
  get asHexString() {
    return this.#key.reduce(
      (str, byte) => str + byte.toString(16).padStart(2, "0"),
      ""
    );
  }

  /**
   * Gets the key as a byte array.
   *
   * @returns {Uint8Array} The key as a byte array.
   */
  get asByteArray() {
    return this.#key;
  }
}
