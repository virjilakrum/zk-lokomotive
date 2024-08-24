# zk-lokomotive: Zero-Knowledge Based Multichain File Transfer System

<div align="center">
  <img src="https://github.com/zk-Lokomotive/zk-lokomotive-sui/assets/158029357/e9a98533-894e-4902-9e8c-539d86d0e764" alt="logo" width="200"/>
</div>

## Table of Contents

- [Introduction](#introduction)
- [System Architecture](#system-architecture)
- [Key Components](#key-components)
- [Cryptographic Workflows](#cryptographic-workflows)
- [Technical Implementation](#technical-implementation)
- [Cross-Chain Functionality](#cross-chain-functionality)
- [Getting Started](#getting-started)
- [Benchmarks](#benchmarks)
- [User Story](#user-story)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Introduction

zk-lokomotive is an advanced, zero-knowledge proof-based file transfer system designed to operate seamlessly across multiple blockchain networks, including EVM-compatible chains, Solana, and Sui. By leveraging state-of-the-art zero-knowledge cryptography, Arweave for decentralized storage, and Wormhole for cross-chain interoperability, zk-lokomotive provides an unparalleled solution for secure, private, and efficient file transfers in a trustless environment.

### Author

[Baturalp Güvenç](https://github.com/virjilakrum)


## System Architecture

The zk-lokomotive system architecture is designed with modularity, scalability, and cross-chain interoperability at its core. Below is a detailed breakdown of the system components and their interactions:

![ZKL-ARCH](https://github.com/user-attachments/assets/a987b7fc-fc0d-43c5-abbe-200604d9a407)

## Key Components

### 1. Key Derivation Service (KDS)

The KDS is a crucial component that provides:

- A deterministic Curve25519 keypair generator derived from BIP-39 mnemonics
- A pseudo-random BIP-39 mnemonic generator utilizing the web-bip-39 package

This service ensures consistent and secure key generation across different platforms and devices.

### 2. Cross-chain Identity Registry (CCIR)

The CCIR serves as a decentralized identity and public key management system. It allows:

- Lookup of identities across different blockchain networks
- Retrieval of corresponding public keys for secure communications

### 3. Encrypted File Storage (EFS)

The EFS is a distributed storage solution that:

- Allows recipients to retrieve encrypted payloads uploaded for them
- Utilizes Arweave for decentralized and persistent file storage
- Ensures data privacy through encryption before storage

### 4. Client

The client component is responsible for:

- Generating encrypted payloads for recipients
- Retrieving recipient public keys via the CCIR
- Initiating the file transfer process

## Cryptographic Workflows

### Sending a File

The process of sending an encrypted file involves several cryptographic operations to ensure security and privacy. Below is a detailed workflow:

#### Definitions

| Symbol | Description |
|--------|-------------|
| K_r    | Recipient's public key on Curve25519 |
| K_e    | A symmetric key derived for the file to be sent (256 bits) |
| E(K_e) | The symmetric key, encrypted using ECIES |
| F      | The file contents, in plaintext |
| F_c    | The file contents, in ciphertext |
| IV     | The initialization vector required for AES-GCM-256 |
| P      | The payload, what is sent to the recipient |

#### Workflow Steps

1. Retrieve the recipient's public key (K_r) from the CCIR.
2. Generate a random symmetric key (K_e) for the file (F).
3. Encrypt the file (F) using AES-GCM-256 with the encryption key (K_e) and a randomly generated initialization vector (IV), resulting in ciphertext (F_c).
4. Encrypt the symmetric key (K_e) using ECIES, resulting in E(K_e).
5. Create the payload (P) by concatenating F_c, IV, and E(K_e).
6. Upload the payload (P) to the Encrypted File Storage (EFS).

### Key Encryption through ECIES

Elliptic Curve Integrated Encryption Scheme (ECIES) is used for secure key exchange. The process involves:

1. Generate an ephemeral key pair on Curve25519.
2. Perform Diffie-Hellman key exchange with the recipient's public key.
3. Derive a shared secret using HKDF-SHA256.
4. Encrypt the symmetric key using AES-GCM with the derived shared secret.

## Technical Implementation 🏗️

### Smart Contract for File Transfer (Solidity)

```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZKFileTransfer is Ownable {
    IERC20 public token;
    mapping(bytes32 => bool) public completedTransfers;

    event FileTransferred(bytes32 indexed fileHash, address indexed recipient);

    constructor(address _token) {
        token = IERC20(_token);
    }

    function transferFile(bytes32 fileHash, address recipient, uint256 amount) external {
        require(!completedTransfers[fileHash], "Transfer already completed");
        require(token.transferFrom(msg.sender, recipient, amount), "Token transfer failed");

        completedTransfers[fileHash] = true;
        emit FileTransferred(fileHash, recipient);
    }

    // Additional functions for ZK proof verification and file retrieval
    function verifyZKProof(bytes32 fileHash, bytes calldata proof) external view returns (bool) {
        // Implement ZK proof verification logic
    }

    function retrieveFile(bytes32 fileHash) external view returns (string memory) {
        require(completedTransfers[fileHash], "File not transferred");
        // Implement file retrieval logic
    }
}
```

### Arweave Integration (JavaScript)

```javascript
const Arweave = require('arweave');

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});

async function uploadEncryptedFile(encryptedData, tags) {
    const transaction = await arweave.createTransaction({ data: encryptedData });
    
    tags.forEach(tag => {
        transaction.addTag(tag.name, tag.value);
    });

    await arweave.transactions.sign(transaction);
    const response = await arweave.transactions.post(transaction);

    return transaction.id;
}

async function retrieveEncryptedFile(transactionId) {
    const transaction = await arweave.transactions.get(transactionId);
    return transaction.data;
}
```

## Cross-Chain Functionality

zk-lokomotive leverages Wormhole for seamless cross-chain file transfers. Here's an overview of the process:

1. **File Tokenization**: The encrypted file is tokenized on the source chain.
2. **Wormhole Bridge**: The tokenized file is transferred through Wormhole's bridge.
3. **Cross-Chain Verification**: ZK proofs are verified on the destination chain.
4. **File Retrieval**: The recipient retrieves and decrypts the file using their private key.

## Getting Started

### Prerequisites

- Node.js (v14+)
- Rust (latest stable) or `nightly`
- Solana CLI
- Anchor Framework
- Ethereum development environment (Hardhat or Truffle)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zk-Lokomotive/zk-lokomotive.git
   cd zk-lokomotive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Solana environment:
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"
   solana --version
   ```

4. Install Anchor:
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
   anchor --version
   ```

5. Build the project:
   ```bash
   cd tokenswap_contract
   anchor build
   ```

6. Run tests:
   ```bash
   anchor test
   ```

## Benchmarks

To run cryptographic benchmarks:

```bash
git clone https://github.com/briansmith/crypto-bench && cd crypto-bench
cargo update && cargo +nightly bench
```

| Implementation | ECDH (Suite B) key exchange |
|----------------|:---------------------------:|
| _ring_         |     :white_check_mark:      |
| rust-crypto    |                             |
| rust-nettle    |                             |
| rust-openssl   |                             |
| sodiumoxide    |                             |
| Windows CNG    |                             |
| Common Crypto  |                             |

---

## User Story

As a user of the ZKL-Last platform, I want to securely transfer tokens and send messages between Ethereum and Solana blockchains using Wormhole's cross-chain interoperability protocol.

### Acceptance Criteria:

1. Ethereum to Solana Transfer:
   - I can connect my Ethereum wallet (e.g., MetaMask) to the ZKL-Last dApp.
   - I can select an ERC20 token and specify an amount to transfer.
   - I can enter a Solana recipient address.
   - I can include an optional message with my transfer.
   - The dApp initiates a Wormhole core bridge contract call on Ethereum.
   - A Verifiable Action Approval (VAA) is generated by the Guardian network.
   - The transfer is completed on Solana, with the recipient receiving equivalent SPL tokens.

2. Solana to Ethereum Transfer:
   - I can connect my Solana wallet (e.g., Phantom) to the ZKL-Last dApp.
   - I can select an SPL token and specify an amount to transfer.
   - I can enter an Ethereum recipient address.
   - I can include an optional message with my transfer.
   - The dApp initiates a Wormhole core bridge program call on Solana.
   - A VAA is generated by the Guardian network.
   - The transfer is completed on Ethereum, with the recipient receiving equivalent ERC20 tokens.

3. Message Passing:
   - I can send arbitrary messages between Ethereum and Solana without token transfers.
   - Messages are securely transmitted and verified using Wormhole's VAA mechanism.

4. Transaction Monitoring:
   - I can view the status of my cross-chain transactions in real-time.
   - The dApp shows me when the VAA is generated and when it's redeemed on the target chain.

5. Security Features:
   - All transactions require my explicit approval through wallet signatures.
   - The dApp uses Wormhole's consistency levels to ensure finality before completing transfers.
   - I receive clear warnings about the irreversibility of cross-chain transactions.

6. Error Handling:
   - If a transaction fails at any stage, I receive a clear error message explaining the issue.
   - The dApp provides guidance on how to resolve common errors (e.g., insufficient gas, network congestion).

## Technical Requirements:

1. Smart Contract Integration:
   - Deploy ZKL-Last contracts on Ethereum that interact with Wormhole's core bridge contract.
   - Implement a Solana program that interacts with Wormhole's core bridge program.
   - Use Wormhole's `publishMessage` function to emit cross-chain messages.

2. Token Bridge Usage:
   - Integrate Wormhole's token bridge for asset transfers between chains.
   - Implement token locking on the source chain and minting on the target chain.

3. VAA Handling:
   - Implement VAA retrieval from Wormhole's Guardian network.
   - Verify VAA signatures using Wormhole's `parseAndVerifyVM` function.

4. Relayer Integration:
   - Implement a relayer service to automatically submit VAAs to the target chain.
   - Use Wormhole's Generic Relayer for standard transfers.
   - Implement a specialized relayer for custom logic if required.

5. Wormhole Connect Integration:
   - Integrate Wormhole Connect UI components for a seamless user experience.
   - Customize Wormhole Connect to fit ZKL-Last's branding and specific requirements.

6. Chain-Specific Implementations:
   - For Ethereum: Use ethers.js for contract interactions and transaction signing.
   - For Solana: Use @solana/web3.js and @project-serum/anchor for program interactions.

7. Security Considerations:
   - Implement proper access controls in smart contracts and Solana programs.
   - Use Wormhole's emitter filtering to ensure messages are only accepted from trusted sources.
   - Implement replay protection to prevent double-spending attacks.

8. Testing and Auditing:
   - Develop comprehensive test suites for both Ethereum and Solana components.
   - Conduct thorough security audits of all smart contracts and programs.
   - Perform end-to-end testing of the entire cross-chain transfer process.


### Contributors

- [Baturalp Güvenç](https://github.com/virjilakrum) - Fullstack Blockchain Developer
- [Yigid Balaban](https://github.com/fybx) - Cryptography Specialist / UI & UX
- [Yunus Emre Yoldaş](https://github.com/gAtrium) - Backend Developer

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- [Wormhole](https://wormhole.com/) for cross-chain interoperability
- [Arweave](https://www.arweave.org/) for decentralized storage
- [Solana](https://solana.com/) for high-performance blockchain infrastructure
- [Ethereum](https://ethereum.org/) for smart contract capabilities
- [Celestia](https://celestia.org/) for data availability solutions

---

<div align="center">
  <img src="https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/1da98901-0a85-4ff9-b6ce-8e22b142efd8" alt="wormhole tweet" width="400"/>
</div>

### Awards and Recognitions

- Solana Renaissance Hackathon Wormhole Best Multichain Track Winner (1st Place) - April 2024 🥇
- Sui Overflow Local Track Winner (1st Place) - May 2024 🥇
- Solana Minihackathon (1st Place) - March 2024 🥇
- Solana Demoday (2nd Place) - March 2024 🥈
- EDCON Japan (Finalist) - May 2024 
- Maybe Encode Hackathon - Aug 2024 🤫


---

![Thank You](https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/af24913b-b649-4bf5-90e1-fdd99e68ca51)

For more information, please visit our [official website](https://zk-lokomotive.xyz)
