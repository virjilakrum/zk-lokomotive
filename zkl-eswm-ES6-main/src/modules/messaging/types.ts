// src/modules/messaging/types.ts

/**
 * Key types supported by the messaging system
 */
export enum KeyType {
    Public = 'public',
    Private = 'private'
  }
  
  /**
   * Supported blockchain networks
   */
  export enum ChainType {
    Ethereum = 'ethereum',
    Solana = 'solana'
  }
  
  /**
   * Basic key representation interface
   */
  export interface IKey {
    /** Type of the key (public/private) */
    readonly keyType: KeyType;
    /** Get key as hex string */
    readonly asHexString: string;
    /** Get key as byte array */
    readonly asByteArray: Uint8Array;
  }
  
  /**
   * Cross-chain message structure
   */
  export interface CrossChainMessage {
    /** Unique message identifier */
    id: string;
    /** Source chain information */
    sourceChain: {
      type: ChainType;
      emitter: string;
    };
    /** Target chain information */
    targetChain: {
      type: ChainType;
      recipient: string;
    };
    /** Encrypted message payload */
    payload: string;
    /** Message signature */
    signature?: string;
    /** Timestamp when message was created */
    timestamp: number;
  }
  
  /**
   * Message encryption parameters
   */
  export interface EncryptionParams {
    /** Public key of recipient */
    recipientPublicKey: string;
    /** Message content */
    content: string;
    /** Optional metadata */
    metadata?: Record<string, unknown>;
  }
  
  /**
   * Wormhole bridge configuration
   */
  export interface BridgeConfig {
    /** Bridge contract address */
    bridgeAddress: string;
    /** Chain ID in Wormhole ecosystem */
    wormholeChainId: number;
    /** RPC endpoint URL */
    rpcUrl: string;
  }