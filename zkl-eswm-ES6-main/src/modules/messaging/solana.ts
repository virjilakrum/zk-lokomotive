// src/modules/messaging/solana.ts

import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    TransactionInstruction,
    SystemProgram,
    sendAndConfirmTransaction,
  } from '@solana/web3.js';
  import { CrossChainMessage, BridgeConfig } from './types';
  import { ChainError, ValidationError } from '../../utils/errors';
  import { validateMessage } from '../../utils/validation';
  
  /**
   * Configuration for Solana messenger
   */
  interface SolanaMessengerConfig extends BridgeConfig {
    /** Program ID of the messenger contract */
    programId: string;
    /** Payer keypair for transactions */
    payer?: Keypair;
  }
  
  /**
   * Handles messaging operations on Solana chain
   */
  export class SolanaMessenger {
    private connection: Connection;
    private programId: PublicKey;
    private payer?: Keypair;
  
    /**
     * Creates new SolanaMessenger instance
     * @param {SolanaMessengerConfig} config - Configuration options
     * @throws {ValidationError} If configuration is invalid
     */
    constructor(config: SolanaMessengerConfig) {
      this.validateConfig(config);
  
      try {
        this.connection = new Connection(config.rpcUrl, 'confirmed');
        this.programId = new PublicKey(config.programId);
  
        if (config.payer) {
          this.payer = config.payer;
        }
      } catch (error) {
        if (error instanceof Error) {
          throw new ValidationError(`Failed to initialize Solana messenger: ${error.message}`);
        } else {
          throw new ValidationError('Failed to initialize Solana messenger: An unknown error occurred');
        }
      }
    }
  
    /**
     * Validates messenger configuration
     * @param {SolanaMessengerConfig} config - Configuration to validate
     * @throws {ValidationError} If configuration is invalid
     */
    private validateConfig(config: SolanaMessengerConfig): void {
      if (!config.rpcUrl) {
        throw new ValidationError('RPC URL is required');
      }
  
      if (!config.programId || typeof config.programId !== 'string') {
        throw new ValidationError('Valid program ID is required');
      }
  
      try {
        new PublicKey(config.programId);
      } catch {
        throw new ValidationError('Invalid program ID format');
      }
  
      if (config.payer && !(config.payer instanceof Keypair)) {
        throw new ValidationError('Payer must be a valid Keypair');
      }
    }
  
    /**
     * Creates instruction for sending a message
     * @param {CrossChainMessage} message - Message to send
     * @param {Keypair} sender - Sender's keypair
     * @returns {TransactionInstruction} Constructed instruction
     * @throws {ValidationError} If parameters are invalid
     */
    private createSendMessageInstruction(
      message: CrossChainMessage,
      sender: Keypair
    ): TransactionInstruction {
      validateMessage(message);
  
      const data = Buffer.from(
        JSON.stringify({
          instruction: 'sendMessage',
          data: {
            ...message,
            sender: sender.publicKey.toBase58(),
          },
        })
      );
  
      return new TransactionInstruction({
        keys: [
          { pubkey: sender.publicKey, isSigner: true, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: this.programId,
        data,
      });
    }
  
    /**
     * Sends a cross-chain message
     * @param {CrossChainMessage} message - Message to send
     * @param {Keypair} sender - Sender's keypair
     * @returns {Promise<string>} Transaction signature
     * @throws {ChainError} If message sending fails
     */
    async sendMessage(message: CrossChainMessage, sender: Keypair): Promise<string> {
      if (!this.payer) {
        throw new ChainError('Solana', 'Payer not configured');
      }
  
      try {
        const instruction = this.createSendMessageInstruction(message, sender);
  
        const transaction = new Transaction().add(instruction);
  
        const signature = await sendAndConfirmTransaction(
          this.connection,
          transaction,
          [this.payer, sender]
        );
  
        return signature;
      } catch (error) {
        if (error instanceof Error) {
          throw new ChainError('Solana', `Failed to send message: ${error.message}`);
        } else {
          throw new ChainError('Solana', 'Failed to send message: An unknown error occurred');
        }
      }
    }
  
    /**
     * Processes a received Wormhole VAA
     * @param {string} vaa - Encoded VAA data
     * @returns {Promise<string>} Transaction signature
     * @throws {ChainError} If processing fails
     */
    async processVaa(vaa: string): Promise<string> {
      if (!this.payer) {
        throw new ChainError('Solana', 'Payer not configured');
      }
  
      if (!vaa || typeof vaa !== 'string') {
        throw new ValidationError('Valid VAA data is required');
      }
  
      try {
        const instruction = new TransactionInstruction({
          keys: [
            { pubkey: this.payer.publicKey, isSigner: true, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          programId: this.programId,
          data: Buffer.from(vaa, 'base64'),
        });
  
        const transaction = new Transaction().add(instruction);
  
        const signature = await sendAndConfirmTransaction(
          this.connection,
          transaction,
          [this.payer]
        );
  
        return signature;
      } catch (error) {
        if (error instanceof Error) {
          throw new ChainError('Solana', `Failed to process VAA: ${error.message}`);
        } else {
          throw new ChainError('Solana', 'Failed to process VAA: An unknown error occurred');
        }
      }
    }
  
    /**
     * Gets account data for a given public key
     * @param {string} address - Account address
     * @returns {Promise<Buffer>} Account data
     * @throws {ChainError} If fetching fails
     */
    async getAccountData(address: string): Promise<Buffer> {
      try {
        const publicKey = new PublicKey(address);
        const account = await this.connection.getAccountInfo(publicKey);
  
        if (!account) {
          throw new Error('Account not found');
        }
  
        return account.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new ChainError('Solana', `Failed to get account data: ${error.message}`);
        } else {
          throw new ChainError('Solana', 'Failed to get account data: An unknown error occurred');
        }
      }
    }
  }
  