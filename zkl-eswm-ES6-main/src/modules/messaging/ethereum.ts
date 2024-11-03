// src/modules/messaging/ethereum.ts

import { ethers } from 'ethers';
import { CrossChainMessage, BridgeConfig } from './types';
import { Key } from '../crypto/key';
import { ValidationError } from '../../utils/errors';

/**
 * Ethereum messenger contract ABI
 */
const MESSENGER_ABI = [
  'function sendMessage(string publicKey1, string publicKey2, string encryptedMessage, uint16 targetChain) payable returns (uint64)',
  'function receiveMessage(bytes encodedMessage) external',
  'function getCurrentMessage() public view returns (string)',
  'function registerChain(uint16 chainId, bytes32 emitterAddress) external'
];

/**
 * Ethereum messaging service configuration
 */
interface EthereumMessengerConfig extends BridgeConfig {
  /** Deployed messenger contract address */
  messengerAddress: string;
  /** Private key for transaction signing */
  privateKey?: string;
}

/**
 * Handles messaging operations on Ethereum chain
 */
export class EthereumMessenger {
  private provider: ethers.providers.Provider;
  private contract: ethers.Contract;
  private signer?: ethers.Signer;

  /**
   * Creates new EthereumMessenger instance
   * @param {EthereumMessengerConfig} config - Configuration options
   * @throws {ValidationError} If configuration is invalid
   */
  constructor(config: EthereumMessengerConfig) {
    this.validateConfig(config);

    try {
      this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
      
      if (config.privateKey) {
        this.signer = new ethers.Wallet(config.privateKey, this.provider);
      }

      this.contract = new ethers.Contract(
        config.messengerAddress,
        MESSENGER_ABI,
        this.signer || this.provider
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(`Failed to initialize Ethereum messenger: ${error.message}`);
      } else {
        throw new ValidationError('Failed to initialize Ethereum messenger: An unknown error occurred');
      }
    }
  }

  /**
   * Validates messenger configuration
   * @param {EthereumMessengerConfig} config - Configuration to validate
   * @throws {ValidationError} If configuration is invalid
   */
  private validateConfig(config: EthereumMessengerConfig): void {
    if (!config.rpcUrl) {
      throw new ValidationError('RPC URL is required');
    }

    if (!config.messengerAddress || !ethers.utils.isAddress(config.messengerAddress)) {
      throw new ValidationError('Valid messenger contract address is required');
    }

    if (!config.bridgeAddress || !ethers.utils.isAddress(config.bridgeAddress)) {
      throw new ValidationError('Valid bridge contract address is required');
    }

    if (config.privateKey && !ethers.utils.isHexString(config.privateKey, 32)) {
      throw new ValidationError('Invalid private key format');
    }
  }

  /**
   * Sends a cross-chain message
   * @param {CrossChainMessage} message - Message to send
   * @param {Key} senderKey - Sender's key pair
   * @returns {Promise<string>} Transaction hash
   * @throws {Error} If message sending fails
   */
  async sendMessage(message: CrossChainMessage, senderKey: Key): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer not configured - private key required for sending messages');
    }

    try {
      const tx = await this.contract.sendMessage(
        senderKey.asHexString,
        message.targetChain.recipient,
        message.payload,
        message.targetChain.type,
        {
          value: ethers.utils.parseEther('0.1') // Wormhole fee
        }
      );

      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to send message: ${error.message}`);
      } else {
        throw new Error('Failed to send message: An unknown error occurred');
      }
    }
  }

  /**
   * Receives and processes a Wormhole VAA
   * @param {string} encodedVaa - Encoded VAA bytes
   * @returns {Promise<string>} Transaction hash
   * @throws {Error} If message processing fails
   */
  async receiveMessage(encodedVaa: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer not configured - private key required for receiving messages');
    }

    try {
      const tx = await this.contract.receiveMessage(
        ethers.utils.arrayify(encodedVaa)
      );

      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process message: ${error.message}`);
      } else {
        throw new Error('Failed to process message: An unknown error occurred');
      }
    }
  }

  /**
   * Registers a foreign chain emitter
   * @param {number} chainId - Wormhole chain ID
   * @param {string} emitterAddress - Foreign chain emitter address
   * @returns {Promise<string>} Transaction hash
   * @throws {Error} If registration fails
   */
  async registerChain(chainId: number, emitterAddress: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer not configured - private key required for chain registration');
    }

    if (!chainId || chainId < 0) {
      throw new ValidationError('Invalid chain ID');
    }

    if (!ethers.utils.isHexString(emitterAddress, 32)) {
      throw new ValidationError('Invalid emitter address format');
    }

    try {
      const tx = await this.contract.registerChain(
        chainId,
        ethers.utils.hexZeroPad(emitterAddress, 32)
      );

      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to register chain: ${error.message}`);
      } else {
        throw new Error('Failed to register chain: An unknown error occurred');
      }
    }
  }

  /**
   * Gets current message from contract
   * @returns {Promise<string>} Current message
   */
  async getCurrentMessage(): Promise<string> {
    try {
      return await this.contract.getCurrentMessage();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get current message: ${error.message}`);
      } else {
        throw new Error('Failed to get current message: An unknown error occurred');
      }
    }
  }
}
