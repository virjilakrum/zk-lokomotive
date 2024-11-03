// src/modules/crypto/types.ts

/**
 * Represents supported key types
 */
export enum KeyType {
    /** Public encryption key */
    Public = 'public',
    /** Private encryption key */
    Private = 'private'
  }
  
  /**
   * Base interface for cryptographic keys
   */
  export interface IKey {
    /** Type of the key */
    readonly keyType: KeyType;
    /** Key as hex string */
    readonly asHexString: string;
    /** Key as byte array */
    readonly asByteArray: Uint8Array;
  }
  
  /**
   * Parameters for key generation
   */
  export interface KeyGenParams {
    /** Key strength in bits */
    strength?: number;
    /** Curve to use for generation */
    curve?: string;
    /** Additional entropy (optional) */
    entropy?: Buffer;
  }
  
  /**
   * Key pair container
   */
  export interface KeyPair {
    /** Public key */
    publicKey: IKey;
    /** Private key */
    privateKey: IKey;
  }
  
  /**
   * Encryption configuration
   */
  export interface EncryptConfig {
    /** Message to encrypt */
    message: string;
    /** Recipient's public key */
    recipientKey: IKey;
    /** Additional authenticated data (optional) */
    aad?: Buffer;
  }
  
  /**
   * Decryption configuration
   */
  export interface DecryptConfig {
    /** Encrypted message */
    encryptedMessage: string;
    /** Recipient's private key */
    privateKey: IKey;
    /** Additional authenticated data (optional) */
    aad?: Buffer;
  }
  
  /**
   * Encrypted message format
   */
  export interface EncryptedMessage {
    /** Initialization vector */
    iv: string;
    /** Ephemeral public key */
    ephemPublicKey: string;
    /** Encrypted content */
    ciphertext: string;
    /** Message authentication code */
    mac: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
  }
  