// src/modules/wormhole/types.ts

/**
 * Chain types supported by the protocol
 */
export enum ChainType {
  /** Ethereum blockchain */
  Ethereum = 'ethereum',
  /** Solana blockchain */
  Solana = 'solana'
}

/**
 * Supported consistency levels for message posting
 */
export enum ConsistencyLevel {
  /** Transaction confirmed */
  Confirmed = 'confirmed',
  /** Transaction finalized */
  Finalized = 'finalized'
}

/**
 * Guardian signature structure
 */
export interface GuardianSignature {
  /** Index of the guardian */
  index: number;
  /** Signature data */
  signature: Buffer;
  /** Guardian's public key */
  guardianKey: string;
}

/**
 * Verified Action Approval (VAA) structure
 */
export interface VAA {
  /** Version of the VAA format */
  version: number;
  /** Guardian set index */
  guardianSetIndex: number;
  /** Signatures from guardians */
  signatures: GuardianSignature[];
  /** Timestamp of VAA creation */
  timestamp: number;
  /** Nonce value */
  nonce: number;
  /** Chain ID of emitter */
  emitterChainId: number;
  /** Address of emitter */
  emitterAddress: Buffer;
  /** Message sequence number */
  sequence: bigint;
  /** Required consistency level */
  consistencyLevel: ConsistencyLevel;
  /** Message payload */
  payload: Buffer;
}

/**
 * Cross-chain message structure
 */
export interface CrossChainMessage {
  /** Unique message identifier */
  id: string;
  /** Source chain information */
  sourceChain: {
    /** Type of source chain */
    type: ChainType;
    /** Emitter address on source chain */
    emitter: string;
  };
  /** Target chain information */
  targetChain: {
    /** Type of target chain */
    type: ChainType;
    /** Recipient address on target chain */
    recipient: string;
  };
  /** Message payload */
  payload: string;
  /** Message signature (optional) */
  signature?: string;
  /** Timestamp when message was created */
  timestamp: number;
}

/**
 * Wormhole message posting result
 */
export interface PostedMessage {
  /** VAA sequence number */
  sequence: string;
  /** Message ID */
  messageId: string;
  /** Emitter chain details */
  emitter: {
    /** Chain ID */
    chainId: number;
    /** Emitter address */
    address: string;
  };
  /** Transaction hash/signature */
  txHash: string;
}

/**
 * Guardian set information
 */
export interface GuardianSet {
  /** Set index */
  index: number;
  /** Guardian public keys */
  keys: string[];
  /** Set expiration timestamp */
  expirationTime: number;
}

/**
 * Wormhole observation status
 */
export enum ObservationStatus {
  /** Not yet observed */
  Pending = 'pending',
  /** Successfully observed */
  Observed = 'observed',
  /** Observation failed */
  Failed = 'failed'
}

/**
 * Bridge configuration
 */
export interface BridgeConfig {
  /** Wormhole bridge address */
  bridgeAddress: string;
  /** RPC endpoint URL */
  rpcUrl: string;
  /** Guardian RPC endpoint */
  guardianRpcUrl: string;
  /** Message consistency level */
  consistencyLevel: ConsistencyLevel;
  /** Network chain ID */
  chainId: number;
}

/**
 * Bridge initialization parameters
 */
export interface BridgeInitParams extends BridgeConfig {
  /** Optional provider override */
  provider?: any;
  /** Network name */
  network?: string;
}

/**
 * Message verification result
 */
export interface VerificationResult {
  /** Whether message is valid */
  isValid: boolean;
  /** Verification status */
  status: ObservationStatus;
  /** Error message if verification failed */
  error?: string;
  /** Guardian signatures if verified */
  signatures?: GuardianSignature[];
}

/**
 * Bridge transaction options
 */
export interface BridgeTransactionOptions {
  /** Gas limit for transaction */
  gasLimit?: number;
  /** Gas price in wei */
  gasPrice?: string;
  /** Nonce override */
  nonce?: number;
  /** Value in wei to send with transaction */
  value?: string;
}

/**
 * Message receipt information
 */
export interface MessageReceipt {
  /** Transaction hash */
  txHash: string;
  /** Block number */
  blockNumber: number;
  /** Timestamp */
  timestamp: number;
  /** Sequence number */
  sequence: string;
  /** Emitter information */
  emitter: {
    chain: number;
    address: string;
  };
}