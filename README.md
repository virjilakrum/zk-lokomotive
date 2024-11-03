# zk-lokomotive: Zero-Knowledge Based Multichain File Transfer System

<div align="center">
  <img src="https://github.com/zk-Lokomotive/zk-lokomotive-sui/assets/158029357/e9a98533-894e-4902-9e8c-539d86d0e764" alt="logo" width="200"/>
</div>

[Baturalp Güvenç](https://github.com/virjilakrum)

# zk-lokomotive

## Introduction

[GitHub Repository](https://github.com/zk-Lokomotive/zkl-docs)

zk-lokomotive is an advanced, zero-knowledge proof-based file transfer system designed to operate seamlessly across multiple blockchain networks, including EVM-compatible chains, Solana, and Sui. By leveraging state-of-the-art zero-knowledge cryptography, Arweave for decentralized storage, and Wormhole for cross-chain interoperability, zk-lokomotive provides an unparalleled solution for secure, private, and efficient file transfers in a trustless environment.

## Demos

- **Avalanche-Sui Demo:** [Watch on YouTube](https://www.youtube.com/watch?v=WpamMm3GP8U)
- **Solana-Solana Demo:** [Watch on YouTube](https://www.youtube.com/watch?v=zspxfSJNXbs&feature=youtu.be)

## Presentation

[Download Presentation](https://drive.google.com/file/d/1-7DNFiOYlN1-er6wnDAVkYeQX_won9aD/view?usp=sharing)

---

## System Architecture

### Overview

Our architecture consists of three layers, with the platform in the middle and users at the edges.

![zk-Lokomotive Module Legend](https://github.com/zk-Lokomotive/zkl-docs/blob/main/diagrams/zkl%20module%20legend%20light.png)

We offer enterprise-level solutions where the platform is fully on-chain for unmatched privacy potential. With the use of a decentralized Cross-Chain Identity Registry (CCIR), we provide identity proving and account management on the blockchain, eliminating any centralized layers where data can be tampered with.

**Enterprise Deployment Module Legend**

![zk-Lokomotive Enterprise Module Legend](https://github.com/zk-Lokomotive/zkl-docs/blob/main/diagrams/zkl%20enterprise%20module%20legend%20light.png)

### Elements

Our infrastructure consists of three main modules, with the JavaScript/Svelte web application comprising four submodules.

#### Modules

1. **JavaScript/Svelte Web Application (Client)**

   The client is the user-facing module of zk-lokomotive, allowing users to send and receive files by linking their wallet accounts.

   **Submodules:**

   - **aus**

     Provides functionality for communicating with distributed file chains and decentralized networks like IPFS. Currently, we utilize Arweave.

   - **roadhog**

     Interfaces with various blockchain networks used in our platform to perform specific objectives by calling or querying smart contracts, Solana programs, etc.

   - **crypto**

     Performs cryptographic operations. We support the Elliptic Curve Integrated Encryption Scheme (ECIES) through the `ecies/rs-wasm` package, which consumes the Rust crate `eciesrs`.

   - **kds**

     Generates pseudo-random mnemonics using BIP-39 that are then derived into elliptic curve key pairs.

2. **Platform-Level Components**

   - **Cross-Chain Identity Registry (CCIR)**

     The CCIR serves as a decentralized identity and public key management system. It links wallet addresses to their elliptic public keys. On the CCIR, wallet users can only add or modify information about themselves after proving ownership of the private key to that wallet account. Everyone is allowed to query from a public EC key to the wallet address or vice versa.

     - [GitHub Repository](https://github.com/zk-Lokomotive/zkl-ccir)

   - **Arweave**

     We use Arweave for decentralized and persistent file storage, providing a decentralized file storage solution.

   - **Inbox**

     Inboxes are on-chain and network-specific implementations. The client calls these using the `roadhog` submodule when querying for incoming files or sending a file.

     The inbox can be logically defined as:

     ```plaintext
     type message = { q_e: string; e_plink: string; uPK: string; }
     let inbox : message StringMap.t ref = ref StringMap.empty
     ```

---

## Key Components

### 1. Key Derivation Service (KDS)

The KDS is a crucial component that provides:

- A deterministic Curve25519 key pair generator derived from BIP-39 mnemonics.
- A pseudo-random BIP-39 mnemonic generator utilizing the `web-bip-39` package.

This service ensures consistent and secure key generation across different platforms and devices.

- [NPM Package](https://www.npmjs.com/package/@zklx/kds)

### 2. Cross-Chain Identity Registry (CCIR)

The CCIR serves as a decentralized identity and public key management system. It allows:

- Lookup of identities across different blockchain networks.
- Retrieval of corresponding public keys for secure communications.

- [GitHub Repository](https://github.com/zk-Lokomotive/zkl-ccir)

### 3. Encrypted File Storage (EFS)

The EFS is a distributed storage solution that:

- Allows recipients to retrieve encrypted payloads uploaded for them.
- Utilizes Arweave for decentralized and persistent file storage.
- Ensures data privacy through encryption before storage.

### 4. Client

The client component is responsible for:

- Generating encrypted payloads for recipients.
- Retrieving recipient public keys via the CCIR.
- Initiating the file transfer process.

### 5. Crypto

Provides cryptographic functions for encryption and decryption of both binary data and strings using public and private keys. It utilizes `ecies-wasm` for the underlying cryptographic operations.

- [NPM Package](https://www.npmjs.com/package/@zklx/crypto)

### 6. Wormhole Messaging Module SDK

The zk-lokomotive Ethereum-Solana Wormhole Messaging module facilitates secure and efficient cross-chain communication between Ethereum and Solana blockchains. This implementation leverages modern ES6+ standards to provide a robust, maintainable, and highly interoperable solution for cross-chain messaging needs. By utilizing the Wormhole protocol as its foundation, this module ensures reliable message delivery while maintaining the security guarantees essential for cross-chain operations.

- [GitHub Repository](https://github.com/zk-Lokomotive/zkl-eswm-ES6)

**Why ES6?**

Our decision to implement this module using ES6+ standards stems from several key considerations:

- **Modern Development Practices:** ES6 introduces significant improvements in code organization through modules.
- **Enhanced Type Safety:** Integration with TypeScript.
- **Better Asynchronous Handling:** Promises and async/await patterns are crucial in blockchain development.
- **Code Reliability and Maintainability:** Essential for cross-chain operations.
- **Expressive and Concise Code:** Without sacrificing readability or performance.

---

## Cryptographic Activities

### System Elements

The system elements are described and discussed in the zk-lokomotive System Architecture document.

#### 1. Key Derivation Service (KDS)

Provides:

- A deterministic secp256k1 key pair generator from BIP-39 mnemonics.
- A pseudo-random BIP-39 mnemonic generator through the `web-bip-39` package.

#### 2. Cross-Chain Identity Registry (CCIR)

Allows:

- Lookup of identities and their corresponding public keys across different blockchain networks.

#### 3. Encrypted File Storage (EFS)

A distributed storage solution that allows recipients to retrieve payloads that were uploaded for them.

#### 4. Client

The sender generates the encrypted payload to be sent to the receiver, whose public key is retrieved via the CCIR.

### Workflows

#### Definitions

- **Q<sub>r</sub>:** Recipient’s public key on curve secp256k1.
- **G:** The generator point on curve secp256k1.
- **Z:** A symmetric key derived for the file to be sent, the shared secret.
- **F<sub>c</sub>:** The file contents, in plaintext.
- **F<sub>m</sub>:** File's metadata (name, etc.).
- **F:** The intermediate file format, ready to be encrypted.
- **F<sub>c</sub>:** The file contents, in ciphertext.
- **IV:** The initialization vector required for AES-GCM-256.
- **P:** The payload, what is sent to the recipient.

The intermediate file format **F** is as follows:

| Bytes           | Content                             | Length in Bytes               |
|-----------------|-------------------------------------|-------------------------------|
| [0]..4          | Length of **F<sub>m</sub>**         | 4 bytes                       |
| [4]..1024       | **F<sub>m</sub>**                   | 1020 bytes (255 * 4 bytes)    |
| [1024]...       | **F<sub>c</sub>**                   | Variable                      |

#### Workflow: Sending a File

1. Retrieve **Q<sub>r</sub>** from the CCIR.
2. Generate an ephemeral key pair, **Q<sub>e</sub>** and **d<sub>e</sub>**.
3. Compute the shared secret **Z** = **d<sub>e</sub>** × **Q<sub>r</sub>**.
4. Encrypt the intermediate file **F** using AES-GCM-256 with encryption key **Z** and a randomly generated initialization vector, **IV**.
5. Create the payload **P** by concatenating **Q<sub>e</sub>**, **IV**, **MAC**, and **F<sub>e</sub>**.
6. Upload the payload **P** to the Encrypted File Storage (EFS).

> **Note:** The MAC in the payload **P** at step 5 is a result of using AES-GCM-256, which is selected in the ECIES implementation in the Rust crate we consume through the `ecies/rs-wasm` package.

---

## Diagrams

[View Diagrams](https://github.com/zk-Lokomotive/zkl-docs/tree/main/diagrams)

## PDFs

[View PDFs](https://github.com/zk-Lokomotive/zkl-docs/tree/main/pdfs)

---

## Cross-Chain Functionality

zk-lokomotive leverages Wormhole for seamless cross-chain file transfers. Here's an overview of the process:

1. **File Tokenization:** The encrypted file is tokenized on the source chain.
2. **Wormhole Bridge:** The tokenized file is transferred through Wormhole's bridge.
3. **Cross-Chain Verification:** Zero-Knowledge proofs are verified on the destination chain.
4. **File Retrieval:** The recipient retrieves and decrypts the file using their private key.

Our project operates across different blockchains such as Ethereum, Solana, and Sui, leveraging Wormhole for cross-chain functionality.

---

## User Story

As a user of the zk-lokomotive platform, I want to securely transfer tokens and send messages between Ethereum and Solana blockchains using Wormhole's cross-chain interoperability protocol.

### Acceptance Criteria

1. **Ethereum to Solana Transfer:**

   - I can connect my Ethereum wallet (e.g., MetaMask) to the zk-lokomotive dApp.
   - I can select an ERC20 token and specify an amount to transfer.
   - I can enter a Solana recipient address.
   - I can include an optional message with my transfer.
   - The dApp initiates a Wormhole core bridge contract call on Ethereum.
   - A Verifiable Action Approval (VAA) is generated by the Guardian network.
   - The transfer is completed on Solana, with the recipient receiving equivalent SPL tokens.

2. **Solana to Ethereum Transfer:**

   - I can connect my Solana wallet (e.g., Phantom) to the zk-lokomotive dApp.
   - I can select an SPL token and specify an amount to transfer.
   - I can enter an Ethereum recipient address.
   - I can include an optional message with my transfer.
   - The dApp initiates a Wormhole core bridge program call on Solana.
   - A VAA is generated by the Guardian network.
   - The transfer is completed on Ethereum, with the recipient receiving equivalent ERC20 tokens.

3. **Message Passing:**

   - I can send arbitrary messages between Ethereum and Solana without token transfers.
   - Messages are securely transmitted and verified using Wormhole's VAA mechanism.

4. **Transaction Monitoring:**

   - I can view the status of my cross-chain transactions in real-time.
   - The dApp shows me when the VAA is generated and when it's redeemed on the target chain.

5. **Security Features:**

   - All transactions require my explicit approval through wallet signatures.
   - The dApp uses Wormhole's consistency levels to ensure finality before completing transfers.
   - I receive clear warnings about the irreversibility of cross-chain transactions.

6. **Error Handling:**

   - If a transaction fails at any stage, I receive a clear error message explaining the issue.
   - The dApp provides guidance on how to resolve common errors (e.g., insufficient gas, network congestion).

## Audit & Security 

Our team working with Ironnode Security: [https://www.ironnode.io/]



### Contributors
![Alt](https://repobeats.axiom.co/api/embed/8af38ce4e9ef72168a09aef4baed9f2aebe8c9be.svg "Repobeats analytics image")


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

**Encode Project ID:** `f8zlq506ekpdpdnjxf8zlysubo9pi2a0`
- [Wormhole](https://wormhole.com/) for cross-chain interoperability
- [Arweave](https://www.arweave.org/) for decentralized storage
- [Solana](https://solana.com/) for high-performance blockchain infrastructure
- [Ethereum](https://ethereum.org/) for smart contract capabilities

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
