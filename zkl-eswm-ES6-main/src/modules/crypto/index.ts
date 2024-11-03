import * as eccrypto from 'eccrypto';
import { ec as EC } from 'elliptic';
// import { createHash, randomBytes } from 'crypto';
import {
  KeyType,
  IKey,
  KeyGenParams,
  KeyPair,
  EncryptConfig,
  DecryptConfig,
  EncryptedMessage,
} from './types';
import { ValidationError } from '../../utils/errors';

const DEFAULT_KEY_STRENGTH = 256;
const DEFAULT_CURVE = 'secp256k1';

/**
 * Base key implementation
 */
class Key implements IKey {
  readonly keyType: KeyType;
  private readonly keyData: Uint8Array;

  constructor(type: KeyType, data: Buffer | string) {
    this.validateKeyType(type);
    this.keyType = type;
    this.keyData = this.processKeyData(data);
  }

  private validateKeyType(type: KeyType): void {
    if (!Object.values(KeyType).includes(type)) {
      throw new ValidationError(`Invalid key type: ${type}`);
    }
  }

  private processKeyData(data: Buffer | string): Uint8Array {
    try {
      if (Buffer.isBuffer(data)) {
        return new Uint8Array(data);
      } else if (typeof data === 'string') {
        const hex = data.startsWith('0x') ? data.slice(2) : data;
        return new Uint8Array(Buffer.from(hex, 'hex'));
      }
      throw new Error('Invalid data format');
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(`Invalid key data: ${error.message}`);
      } else {
        throw new ValidationError('Invalid key data: An unknown error occurred');
      }
    }
  }

  get asHexString(): string {
    return Buffer.from(this.keyData).toString('hex');
  }

  get asByteArray(): Uint8Array {
    return this.keyData;
  }
}

/**
 * Generates a new key pair
 * @param {KeyGenParams} params - Key generation parameters
 * @returns {Promise<KeyPair>} Generated key pair
 * @throws {ValidationError} If generation fails
 */
export async function generateKeyPair(params: KeyGenParams = {}): Promise<KeyPair> {
  const { strength = DEFAULT_KEY_STRENGTH, curve = DEFAULT_CURVE, entropy } = params;

  try {
    const ec = new EC(curve);
    let keyPair;
    if (entropy) {
      keyPair = ec.genKeyPair({ entropy: Buffer.from(entropy).slice(0, 32) });
    } else {
      keyPair = ec.genKeyPair();
    }

    return {
      publicKey: new Key(KeyType.Public, keyPair.getPublic('hex')),
      privateKey: new Key(KeyType.Private, keyPair.getPrivate('hex')),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError(`Key pair generation failed: ${error.message}`);
    } else {
      throw new ValidationError('Key pair generation failed: An unknown error occurred');
    }
  }
}

/**
 * Validates encryption configuration
 * @param {EncryptConfig} config - Config to validate
 * @throws {ValidationError} If config is invalid
 */
function validateEncryptConfig(config: EncryptConfig): void {
  if (!config.message) {
    throw new ValidationError('Message is required');
  }

  if (!config.recipientKey || config.recipientKey.keyType !== KeyType.Public) {
    throw new ValidationError('Valid recipient public key is required');
  }

  if (config.message.length > 1024) {
    console.warn('Message length exceeds recommended maximum of 1024 characters');
  }
}

/**
 * Encrypts a message for a recipient
 * @param {EncryptConfig} config - Encryption configuration
 * @returns {Promise<string>} Encrypted message
 * @throws {ValidationError} If encryption fails
 */
export async function encryptMessage(config: EncryptConfig): Promise<string> {
  validateEncryptConfig(config);

  try {
    const encrypted = await eccrypto.encrypt(
      Buffer.from(config.recipientKey.asByteArray),
      Buffer.from(config.message)
    );

    const result: EncryptedMessage = {
      iv: encrypted.iv.toString('hex'),
      ephemPublicKey: encrypted.ephemPublicKey.toString('hex'),
      ciphertext: encrypted.ciphertext.toString('hex'),
      mac: encrypted.mac.toString('hex'),
      metadata: {
        timestamp: Date.now(),
        hasAad: !!config.aad,
      },
    };

    return JSON.stringify(result);
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError(`Encryption failed: ${error.message}`);
    } else {
      throw new ValidationError('Encryption failed: An unknown error occurred');
    }
  }
}

/**
 * Validates decryption configuration
 * @param {DecryptConfig} config - Config to validate
 * @throws {ValidationError} If config is invalid
 */
function validateDecryptConfig(config: DecryptConfig): void {
  if (!config.encryptedMessage) {
    throw new ValidationError('Encrypted message is required');
  }

  if (!config.privateKey || config.privateKey.keyType !== KeyType.Private) {
    throw new ValidationError('Valid private key is required');
  }
}

/**
 * Decrypts a message using recipient's private key
 * @param {DecryptConfig} config - Decryption configuration
 * @returns {Promise<string>} Decrypted message
 * @throws {ValidationError} If decryption fails
 */
export async function decryptMessage(config: DecryptConfig): Promise<string> {
  validateDecryptConfig(config);

  try {
    const encryptedData: EncryptedMessage = JSON.parse(config.encryptedMessage);

    const encrypted = {
      iv: Buffer.from(encryptedData.iv, 'hex'),
      ephemPublicKey: Buffer.from(encryptedData.ephemPublicKey, 'hex'),
      ciphertext: Buffer.from(encryptedData.ciphertext, 'hex'),
      mac: Buffer.from(encryptedData.mac, 'hex'),
    };

    const decrypted = await eccrypto.decrypt(Buffer.from(config.privateKey.asByteArray), encrypted);

    return decrypted.toString('utf8');
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ValidationError('Invalid encrypted message format');
    } else if (error instanceof Error) {
      throw new ValidationError(`Decryption failed: ${error.message}`);
    } else {
      throw new ValidationError('Decryption failed: An unknown error occurred');
    }
  }
}

/**
 * Derives a key pair from a private key
 * @param {IKey} privateKey - Private key to derive from
 * @returns {Promise<KeyPair>} Derived key pair
 * @throws {ValidationError} If derivation fails
 */
export async function deriveKeyPair(privateKey: IKey): Promise<KeyPair> {
  if (!privateKey || privateKey.keyType !== KeyType.Private) {
    throw new ValidationError('Valid private key is required');
  }

  try {
    const ec = new EC('secp256k1');
    const keyPair = ec.keyFromPrivate(privateKey.asByteArray);

    return {
      publicKey: new Key(KeyType.Public, keyPair.getPublic('hex')),
      privateKey: new Key(KeyType.Private, keyPair.getPrivate('hex')),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError(`Key derivation failed: ${error.message}`);
    } else {
      throw new ValidationError('Key derivation failed: An unknown error occurred');
    }
  }
}