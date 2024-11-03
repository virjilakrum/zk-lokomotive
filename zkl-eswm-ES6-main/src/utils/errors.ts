// src/utils/errors.ts

/**
 * Base error class for messaging system
 */
export class MessagingError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'MessagingError';
    }
  }
  
  /**
   * Error thrown when validation fails
   */
  export class ValidationError extends MessagingError {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  }
  
  /**
   * Error thrown when crypto operations fail
   */
  export class CryptoError extends MessagingError {
    constructor(message: string) {
      super(message);
      this.name = 'CryptoError';
    }
  }
  
  /**
   * Error thrown when bridge operations fail
   */
  export class BridgeError extends MessagingError {
    constructor(message: string) {
      super(message);
      this.name = 'BridgeError';
    }
  }
  
  /**
   * Error thrown when chain-specific operations fail
   */
  export class ChainError extends MessagingError {
    readonly chainType: string;
  
    constructor(chainType: string, message: string) {
      super(`${chainType} error: ${message}`);
      this.name = 'ChainError';
      this.chainType = chainType;
    }
  }