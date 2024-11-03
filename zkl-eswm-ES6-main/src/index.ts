// src/index.ts

// Re-export everything from modules
export * from '../src/modules/crypto';
export * from '../src/modules/messaging';
export * from '../src/modules/wormhole';
export * from '../src/utils';

// Export specific types and functions that should be available at the root level
export type {
  CrossChainMessage,
  VAA,
  BridgeConfig,
  GuardianSignature,
  PostedMessage,
  GuardianSet,
  MessageReceipt
} from './modules/wormhole/types';

export {
  ChainType,
  ConsistencyLevel,
  ObservationStatus
} from './modules/wormhole/types';

// Export validation utilities
export {
  validateMessage,
  isValidChainAddress,
  validateMessageSize,
  validateBytes32,
  isValidChainId,
  validateBridgeConfig,
  validateGuardianSignature,
  validateVAA,
  isValidSolanaPublicKey,
  validatePayloadSize,
  isValidRpcUrl,
  validateTransactionHash
} from './utils/validation';

// Export error types
export {
  MessagingError,
  ValidationError,
  BridgeError,
  ChainError
} from './utils/errors';