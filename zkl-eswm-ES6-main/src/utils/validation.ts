// src/utils/validation.ts

import { ethers } from 'ethers';
import { PublicKey } from '@solana/web3.js';
import { ValidationError } from './errors';
import { 
  VAA,
  CrossChainMessage,
  ChainType,
  GuardianSignature,
  ConsistencyLevel,
  BridgeConfig
} from '../modules/wormhole/types';

/**
 * Validates a cross-chain message structure
 * @param {CrossChainMessage} message - Message to validate
 * @throws {ValidationError} If message structure is invalid
 */


export function validateMessage(message: CrossChainMessage): void {
  if (!message) {
    throw new ValidationError('Message is required');
  }

  // Validate source chain info
  if (!message.sourceChain || !message.sourceChain.type) {
    throw new ValidationError('Source chain information is required');
  }

  if (!Object.values(ChainType).includes(message.sourceChain.type)) {
    throw new ValidationError('Invalid source chain type');
  }

  if (!message.sourceChain.emitter) {
    throw new ValidationError('Source chain emitter address is required');
  }

  // Validate target chain info
  if (!message.targetChain || !message.targetChain.type) {
    throw new ValidationError('Target chain information is required');
  }

  if (!Object.values(ChainType).includes(message.targetChain.type)) {
    throw new ValidationError('Invalid target chain type');
  }

  if (!message.targetChain.recipient) {
    throw new ValidationError('Target chain recipient address is required');
  }

  // Validate payload
  if (!message.payload || typeof message.payload !== 'string') {
    throw new ValidationError('Message payload is required');
  }

  if (message.payload.length > 1024) {
    console.warn('Message payload exceeds recommended size of 1024 characters');
  }

  // Validate timestamp if present
  if (message.timestamp) {
    if (typeof message.timestamp !== 'number' || message.timestamp <= 0) {
      throw new ValidationError('Invalid timestamp');
    }

    if (message.timestamp > Date.now()) {
      throw new ValidationError('Timestamp cannot be in the future');
    }
  }

  // Chain-specific address validations
  try {
    switch (message.targetChain.type) {
      case ChainType.Ethereum:
        if (!ethers.utils.isAddress(message.targetChain.recipient)) {
          throw new ValidationError('Invalid Ethereum recipient address');
        }
        break;

      case ChainType.Solana:
        new PublicKey(message.targetChain.recipient);
        break;

      default:
        console.warn(`No specific validation for chain type: ${message.targetChain.type}`);
    }
  } catch (error) {
    if (error instanceof Error) {
    throw new ValidationError(`Invalid recipient address: ${error.message}`);}
    throw new ValidationError('Invalid recipient address: Unknown error');
  }
}

/**
 * Validates chain-specific addresses
 * @param {string} address - Address to validate
 * @param {ChainType} chainType - Type of chain
 * @returns {boolean} True if address is valid
 */
export function isValidChainAddress(address: string, chainType: ChainType): boolean {
  try {
    switch (chainType) {
      case ChainType.Ethereum:
        return ethers.utils.isAddress(address);

      case ChainType.Solana:
        new PublicKey(address);
        return true;

      default:
        console.warn(`No specific validation for chain type: ${chainType}`);
        return true;
    }
  } catch {
    return false;
  }
}

/**
 * Validates message size
 * @param {string} payload - Message payload
 * @param {number} maxSize - Maximum allowed size
 * @throws {ValidationError} If payload exceeds max size
 */
export function validateMessageSize(payload: string, maxSize: number = 1024): void {
  if (!payload) {
    throw new ValidationError('Payload is required');
  }

  if (payload.length > maxSize) {
    console.warn(`Message size (${payload.length}) exceeds recommended maximum (${maxSize})`);
  }
}

/**
 * Validates bytes32 string format
 * @param {string} value - Value to validate
 * @param {string} [fieldName] - Name of field for error message
 * @throws {ValidationError} If format is invalid
 */
export function validateBytes32(value: string, fieldName: string = 'value'): void {
  if (!value || !value.startsWith('0x') || value.length !== 66) {
    throw new ValidationError(
      `Invalid ${fieldName} format: must be 32 bytes hex string with 0x prefix`
    );
  }
}

/**
 * Validates a network chain ID
 * @param {number} chainId - Chain ID to validate
 * @returns {boolean} True if valid
 */
export function isValidChainId(chainId: number): boolean {
  return Number.isInteger(chainId) && chainId > 0;
}

/**
 * Validates bridge configuration
 * @param {BridgeConfig} config - Configuration to validate
 * @throws {ValidationError} If configuration is invalid
 */
export function validateBridgeConfig(config: BridgeConfig): void {
  if (!config) {
    throw new ValidationError('Bridge configuration is required');
  }

  if (!config.bridgeAddress || !ethers.utils.isAddress(config.bridgeAddress)) {
    throw new ValidationError('Valid bridge address is required');
  }

  if (!config.rpcUrl || typeof config.rpcUrl !== 'string') {
    throw new ValidationError('Valid RPC URL is required');
  }

  if (!config.guardianRpcUrl || typeof config.guardianRpcUrl !== 'string') {
    throw new ValidationError('Valid guardian RPC URL is required');
  }

  if (!Object.values(ConsistencyLevel).includes(config.consistencyLevel)) {
    throw new ValidationError('Valid consistency level is required');
  }

  if (!isValidChainId(config.chainId)) {
    throw new ValidationError('Valid chain ID is required');
  }
}

/**
 * Validates guardian signature
 * @param {GuardianSignature} signature - Signature to validate
 * @throws {ValidationError} If signature is invalid
 */
export function validateGuardianSignature(signature: GuardianSignature): void {
  if (!signature) {
    throw new ValidationError('Guardian signature is required');
  }

  if (typeof signature.index !== 'number' || signature.index < 0) {
    throw new ValidationError('Valid guardian index is required');
  }

  if (!Buffer.isBuffer(signature.signature) || signature.signature.length !== 65) {
    throw new ValidationError('Valid signature buffer is required');
  }

  if (!signature.guardianKey || typeof signature.guardianKey !== 'string') {
    throw new ValidationError('Valid guardian public key is required');
  }
}

/**
 * Validates VAA structure
 * @param {VAA} vaa - VAA to validate
 * @throws {ValidationError} If VAA is invalid
 */
export function validateVAA(vaa: VAA): void {
  if (!vaa) {
    throw new ValidationError('VAA is required');
  }

  if (vaa.version !== 1) {
    throw new ValidationError('Unsupported VAA version');
  }

  if (!Array.isArray(vaa.signatures) || vaa.signatures.length === 0) {
    throw new ValidationError('VAA must have at least one signature');
  }

  vaa.signatures.forEach(sig => validateGuardianSignature(sig));

  if (!Buffer.isBuffer(vaa.emitterAddress)) {
    throw new ValidationError('Valid emitter address buffer is required');
  }

  if (!Buffer.isBuffer(vaa.payload)) {
    throw new ValidationError('Valid payload buffer is required');
  }
}

/**
 * Validates a Solana public key
 * @param {string} key - Public key to validate
 * @returns {boolean} True if valid
 */
export function isValidSolanaPublicKey(key: string): boolean {
  try {
    new PublicKey(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates message payload size
 * @param {Buffer} payload - Message payload
 * @param {number} maxSize - Maximum allowed size in bytes
 * @throws {ValidationError} If payload exceeds max size
 */
export function validatePayloadSize(payload: Buffer, maxSize: number): void {
  if (!Buffer.isBuffer(payload)) {
    throw new ValidationError('Payload must be a Buffer');
  }

  if (payload.length > maxSize) {
    console.warn(`Payload size (${payload.length}) exceeds recommended maximum (${maxSize})`);
  }
}

/**
 * Validates RPC URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export function isValidRpcUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates transaction hash format
 * @param {string} hash - Transaction hash to validate
 * @param {string} chainType - Chain type (ethereum/solana)
 * @throws {ValidationError} If hash format is invalid
 */
export function validateTransactionHash(hash: string, chainType: string): void {
  if (!hash) {
    throw new ValidationError('Transaction hash is required');
  }

  switch (chainType.toLowerCase()) {
    case 'ethereum':
      if (!hash.match(/^0x[a-fA-F0-9]{64}$/)) {
        throw new ValidationError('Invalid Ethereum transaction hash format');
      }
      break;
    case 'solana':
      if (!hash.match(/^[a-zA-Z0-9]{88}$/)) {
        throw new ValidationError('Invalid Solana transaction signature format');
      }
      break;
    default:
      throw new ValidationError('Unsupported chain type');
  }
}