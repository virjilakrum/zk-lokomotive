// src/modules/crypto/key.ts

import { KeyType, IKey } from '../messaging/types';

/**
 * Represents a cryptographic key with secure storage and conversion methods
 */
export class Key implements IKey {
  private readonly _key: Uint8Array;
  readonly keyType: KeyType;

  /**
   * Creates a new Key instance
   * 
   * @param {KeyType} type - Type of the key (public/private)
   * @param {Object} details - Key details
   * @param {Uint8Array} [details.fromByteArray] - Key as byte array
   * @param {string} [details.fromHexString] - Key as hex string
   * @throws {TypeError} If invalid parameters are provided
   */
  constructor(type: KeyType, details: {
    fromByteArray?: Uint8Array;
    fromHexString?: string;
  }) {
    // Validate key type
    if (!Object.values(KeyType).includes(type)) {
      throw new TypeError(`Invalid key type. Must be one of: ${Object.values(KeyType).join(', ')}`);
    }

    // Validate details
    if (!details || (!details.fromByteArray && !details.fromHexString)) {
      throw new TypeError('Either fromByteArray or fromHexString must be provided');
    }

    // Warn if both formats are provided
    if (details.fromByteArray && details.fromHexString) {
      console.warn('Both fromByteArray and fromHexString provided - using fromHexString');
    }

    this.keyType = type;

    // Initialize key data
    if (details.fromHexString) {
      this._key = this.hexStringToBytes(details.fromHexString);
    } else if (details.fromByteArray) {
      this._key = details.fromByteArray;
    } else {
      throw new TypeError('No valid key data provided');
    }

    // Validate key length
    if (this._key.length !== 32 && this._key.length !== 33) {
      throw new TypeError('Invalid key length. Must be 32 or 33 bytes');
    }
  }

  /**
   * Converts key to hexadecimal string
   * @returns {string} Hexadecimal representation of key
   */
  get asHexString(): string {
    return this._key.reduce(
      (str, byte) => str + byte.toString(16).padStart(2, '0'),
      ''
    );
  }

  /**
   * Gets key as byte array
   * @returns {Uint8Array} Byte array representation of key
   */
  get asByteArray(): Uint8Array {
    return this._key;
  }

  /**
   * Converts hex string to byte array
   * @param {string} hexString - Hex string to convert
   * @returns {Uint8Array} Resulting byte array
   * @throws {TypeError} If invalid hex string is provided
   */
  private hexStringToBytes(hexString: string): Uint8Array {
    if (!/^[0-9a-fA-F]+$/.test(hexString)) {
      throw new TypeError('Invalid hex string');
    }

    if (hexString.length % 2 !== 0) {
      throw new TypeError('Hex string must have even length');
    }

    return Uint8Array.from(
      hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );
  }
}