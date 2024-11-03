// src/modules/wormhole/bridge.ts

import {
    ChainId,
    CHAIN_ID_SOLANA,
    CHAIN_ID_ETH,
    parseSequenceFromLogSolana,
    getEmitterAddressEth,
    getEmitterAddressSolana,
  } from '@certusone/wormhole-sdk'; /* must be updated (29/10/2024) 
  
  here is an up to date one for native token transfer:
  
  https://github.com/wormhole-foundation/example-native-token-transfers
  
  and here is for more general purposes and has more examples:
  
  https://github.com/wormhole-foundation/demo-tutorials
  
  */
  import { BridgeError } from '../../utils/errors';
  
  /**
   * Bridge operation status
   */
  export enum BridgeStatus {
    Pending = 'pending',
    Completed = 'completed',
    Failed = 'failed',
  }
  
  /**
   * Bridge operation result
   */
  export interface BridgeResult {
    status: BridgeStatus;
    sequence?: string;
    emitterAddress?: string;
    signature?: string;
    error?: string;
  }
  
  /**
   * Gets the appropriate emitter address for a chain
   * @param {string} contractAddress - Contract address
   * @param {ChainId} chainId - Chain identifier
   * @returns {string} Emitter address
   * @throws {BridgeError} If chain is not supported
   */
  export function getEmitterAddress(contractAddress: string, chainId: ChainId): string {
    if (!contractAddress) {
      throw new BridgeError('Contract address is required');
    }
  
    try {
      switch (chainId) {
        case CHAIN_ID_ETH:
          return getEmitterAddressEth(contractAddress);
        case CHAIN_ID_SOLANA:
          return getEmitterAddressSolana(contractAddress);
        default:
          throw new Error(`Chain ${chainId} not supported`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BridgeError(`Failed to get emitter address: ${error.message}`);
      } else {
        throw new BridgeError('Failed to get emitter address: An unknown error occurred');
      }
    }
  }
  
  /**
   * Parses sequence number from Solana logs
   * @param {any} txResponse - Transaction response containing logs
   * @returns {string} Sequence number
   * @throws {BridgeError} If parsing fails
   */
  export function parseSequence(txResponse: any): string {
    try {
      const sequence = parseSequenceFromLogSolana(txResponse);
      if (!sequence) {
        throw new Error('Sequence not found in logs');
      }
      return sequence.toString();
    } catch (error) {
      if (error instanceof Error) {
        throw new BridgeError(`Failed to parse sequence: ${error.message}`);
      } else {
        throw new BridgeError('Failed to parse sequence: An unknown error occurred');
      }
    }
  }
  
  /**
   * Formats VAA for submission
   * @param {Uint8Array} vaaBytes - Raw VAA bytes
   * @returns {string} Formatted VAA
   * @throws {BridgeError} If formatting fails
   */
  export function formatVaa(vaaBytes: Uint8Array): string {
    if (!vaaBytes || !vaaBytes.length) {
      throw new BridgeError('VAA bytes are required');
    }
  
    try {
      return Buffer.from(vaaBytes).toString('base64');
    } catch (error) {
      if (error instanceof Error) {
        throw new BridgeError(`Failed to format VAA: ${error.message}`);
      } else {
        throw new BridgeError('Failed to format VAA: An unknown error occurred');
      }
    }
  }
  
  /**
   * Polls for VAA availability
   * @param {string} wormholeRpc - Wormhole RPC endpoint
   * @param {ChainId} emitterChain - Emitter chain ID
   * @param {string} emitterAddress - Emitter address
   * @param {string} sequence - Sequence number
   * @returns {Promise<string>} VAA bytes
   * @throws {BridgeError} If polling fails
   */
  export async function pollVaa(
    wormholeRpc: string,
    emitterChain: ChainId,
    emitterAddress: string,
    sequence: string
  ): Promise<string> {
    if (!wormholeRpc || !emitterChain || !emitterAddress || !sequence) {
      throw new BridgeError('All parameters are required for VAA polling');
    }
  
    const timeout = 60000; // 1 minute timeout
    const interval = 1000; // 1 second interval
    const startTime = Date.now();
  
    try {
      while (Date.now() - startTime < timeout) {
        const response = await fetch(
          `${wormholeRpc}/v1/signed_vaa/${emitterChain}/${emitterAddress}/${sequence}`
        );
  
        if (response.ok) {
          const data = await response.json();
          if (data.vaaBytes) {
            return data.vaaBytes;
          }
        }
  
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
  
      throw new Error('Timeout waiting for VAA');
    } catch (error) {
      if (error instanceof Error) {
        throw new BridgeError(`Failed to poll for VAA: ${error.message}`);
      } else {
        throw new BridgeError('Failed to poll for VAA: An unknown error occurred');
      }
    }
  }
  