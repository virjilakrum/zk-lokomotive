# zk-lokomotive  (Zk Based Fully Secure and Trustless Multichain File Transfer System)

* Zk based fully secure and trustless multichain file transfer system with [EVM-Solana-Sui-Avalanche-Wormhole].

Author: [Baturalp Güvenç](https://github.com/virjilakrum)

<div align="center">
  <img src="https://github.com/zk-Lokomotive/zk-lokomotive-sui/assets/158029357/e9a98533-894e-4902-9e8c-539d86d0e764" alt="logo" width="200"/>
</div>

---

### **Demo Video (Sui-Avalanche)**

[Sui Demo](https://youtu.be/WpamMm3GP8U)


### **Demo Video (Solana-Solana)**

[Solana Demo](https://youtu.be/zspxfSJNXbs)

---


* This project aims to create a secure and efficient file transfer system bridging [Solana](https://solana.com/tr/docs) and [Ethereum](https://ethereum.org/en/developers/docs/) networks (**For now, we are trying to run it on these networks, and as we progress through milestones, we plan to make it available on all major networks and complete the integration with Wormhole.**) by integrating [ZK](https://en.wikipedia.org/wiki/Zero-knowledge_proof), [Arweave](https://docs.arweave.org/developers), and [Wormhole](https://docs.wormhole.com/wormhole). ZK ensures file integrity and privacy, Arweave facilitates file storage, and Wormhole enables cross-chain token and data-transfer. In addition, we use [Celestia](https://docs.celestia.org/) in the data-layer  and nodes ([light nodes](https://docs.celestia.org/nodes/light-node)) to ensure data availability and to keep the information "live".

This project encompasses file transfer scenarios within the **Solana-Solana** (![for demo](
https://github.com/zk-Lokomotive/zk-lokomotive-wormhole/assets/158029357/81a7a8bb-0802-4158-8f48-fb1ddf4f5989)) and **Solana-EVM** ecosystems.


* The architecture undergoes a significant shift for file transfer between **all networks**. In this scenario, We establish a bridge between Solana and EVM networks. The file is encrypted with zero-knowledge proofs (ZK) and transformed into a token in exchange for tokens. This token, encapsulating the ZK proof of the file's integrity, traverses the Solana-EVM bridge via Wormhole. Upon reception, the recipient validates the ZK proof to claim the file. Additionally, I retrieve the file from Arweave, ensuring its integrity based on the verified proof.

* In summary, this project implements a sophisticated file transfer mechanism, leveraging different technologies for seamless communication between Solana-Solana and nonEVM-EVM networks. Through meticulous encryption, tokenization, and validation processes, it ensures the secure and verifiable exchange of files while maintaining compatibility and interoperability across disparate blockchain ecosystems.

## Motivation:

Providing the amount of our data continues rapidly in the technological singularity. Traditional file formats often lack adequate privacy and security, especially when it comes to sensitive data. File services run on a central server, creating the risk of data breaches and privacy violations. We offer a different solution to this than traditional breaks, by combining the powerful capacities and polynomials of mathematics and the decentralized generality of Solana, thus challenging the trilemma.

---

## **1. Introduction**
### **1.1 Project Overview**
Our project aims to enable secure, private, and efficient file transfers across different blockchain networks. Utilizing zkSNARKs for encryption, Arweave for decentralized storage, and the Wormhole bridge for cross-chain token transfer, we ensure that files can be shared securely from EVM to Solana networks.

### **1.2 Problem Statement**
Traditional file transfer methods often suffer from privacy and security vulnerabilities. Centralized servers are prone to data breaches, and current blockchain solutions lack seamless interoperability.

## **1.3 Motivation:**

Providing the amount of our data continues rapidly in the technological singularity. Traditional file formats often lack adequate privacy and security, especially when it comes to sensitive data. File services run on a central server, creating the risk of data breaches and privacy violations. We offer a different solution to this than traditional breaks, by combining the powerful capacities and polynomials of mathematics and the decentralized generality of Solana, thus challenging the trilemma.

## **2. Objectives**

### Demo Architecture
<img width="1147" alt="demo arch" src="https://github.com/user-attachments/assets/737c865f-6109-41fe-92d1-790cea185605">


- Encrypt files using zkSNARKs to ensure privacy and integrity.
- Store encrypted files on Arweave with a unique file hash.
- Tokenize the file hash for transfer across blockchain networks.
- Utilize the Wormhole bridge to securely transfer tokenized assets from EVM to Solana.
- Verify and retrieve the file on the receiving network, ensuring the file's integrity.

### Arweave - Solana

dApp for storage and send encrypted data using [Arweave](https://www.arweave.org/)

	1. Operations and Management on the Solana Network
	- User Authentication and Authorization: Authentication and authorization of users are performed on the Solana network.
	- Transaction Management: Sending and receiving data and other administrative operations are carried out on Solana.
	- Payment Transactions: Payment transactions between users are realized by taking advantage of Solana's fast and low-cost structure.
	2. Persistent Storage on Arweave Network
	- Data Storage: Encrypted data is uploaded to the Arweave network and stored permanently.
	- Data Access: Users can access data stored on Arweave through transactions performed on Solana.

### System Elements
The system elements are/will be described and discussed in the ZKL System Architecture document. This section is to provide a reminder/reference.
1. Key Derivation Service
The Key Derivation Service (or KDS for short) provides
1. a deterministic Curve25519 keypair generator from BIP-39 mnemonics,
2. a pseudo-random BIP-39 mnemonic generator through web-bip-39 package.
2. Cross-chain Identity Registry
The Cross-chain Identity Registry (or CCIR for short) provides a method to look up identities and their corresponding public keys.
3. Encrypted File Storage
The Encrypted File Storage is a distributed storage solution that allows the recipient to retrieve payloads that were uploaded for them.
4. Client
The client (the sender) generates the encrypted payload to be sent to the reciever, whose public key is retrieved via the CCIR. The workflow of sending an
encrypted file for a recipient is described in the next section.

<img width="836" alt="formulas" src="https://github.com/user-attachments/assets/77394956-0ad5-40bc-927d-26d061f56aca">

## User Story: Cross-Chain Token Transfer and Messaging with ZKL-Last

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




By implementing these features, ZKL-Last will provide a secure, efficient, and user-friendly cross-chain token transfer and messaging system leveraging Wormhole's advanced interoperability protocol.
```js
const arweave = Arweave.init({
    host: 'arweave.net',// Hostname or IP address for a Arweave node
    port: 80,           // Port, defaults to 1984
    protocol: 'https',  // Network protocol http or https, defaults to http
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
})


class FileMailer extends React.Component{
    state = {
        //file upload
        fileLoading:false,
        fileUpload:false,
        fileRawData:'',
        fileName:'',
        //user address and public key
        receiverArAddress:'',
        receiverPublicKey:'',
        receiverPushAddress:'',
        receiverNoPublicKey:false,
        receiverPublicKeyValid:false
    }

    change = e => {
        this.setState({[e.target.name]: e.target.value})
    }
```

🏗️ Below the line it's not up to date.
---



## Solution:

Adopting a decentralized approach to file transfer, utilizing the principles of zero-knowledge proofs (zkSNARKs), can significantly enhance privacy and security. This method allows for the verification of file transmission without revealing the contents of the files to the network or a third party.

## Scenario Secure Research File Sharing

**Scene: Biomedical Research University**

**Characters:**

    Alice: Biomedical researcher
    Bob: Collaborator

**Solana-Solana File Transfer:**

Location: Research Lab at the Biomedical Research University

Action:

    Alice prepares to share a research file with Bob securely within the Solana network.

Dialogue:

    Alice: Hi Bob, I've completed the analysis on our latest research data. I need your input on it.
    Bob: Sure Alice, I'm ready to collaborate. How should we proceed?
    Alice: We'll transfer the file securely using Solana's network. I'll encrypt the file with RSA keys and share the AES key with you.
    Bob: Sounds good. Let's get started.

Process:

    Alice encrypts the research file using RSA keys and prepares to share the AES key with Bob for decryption.
    Alice shares the AES key securely with Bob using their Solana wallet addresses as identifiers.
    Bob receives the AES key and decrypts the file, enabling him to review the research data.

Outcome:

    The research file is securely transferred from Alice to Bob within the Solana network, ensuring privacy and integrity.

---

**Solana-EVM File Transfer:**

Location: Research Lab at the Biomedical Research University

Action:

    Alice needs to share a research file with collaborators on an EVM-based network.

Dialogue:

    Alice: Bob, we have collaborators on an EVM-based network who need access to our research data. We'll need to transfer it securely.
    Bob: Understood. How do we proceed with this transfer?
    Alice: We'll use a bridge between Solana and the EVM network. I'll encrypt the file with zero-knowledge proofs and tokenize it for transfer.
    Bob: Got it. Let's make sure everything is set up correctly.

Process:

    Alice encrypts the research file with zero-knowledge proofs (ZK) and converts it into a token for transfer.
    Alice initiates the transfer of the tokenized file through the Solana-EVM bridge via Wormhole.
    Collaborators on the EVM-based network receive the token and validate the ZK proof to claim the file.
    Alice retrieves the file from Arweave to ensure its integrity based on the verified proof.

Outcome:

    The research file is securely transferred from Alice to collaborators on the EVM-based network, maintaining privacy and integrity across different blockchain ecosystems.


![Architecture](https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/e2fa9fa0-6bde-4433-82b5-3713dac536e4)


### Benefits:

    Privacy: ZK encryption guarantees that sensitive data can only be accessed by Alice and authorized collaborators.
    Integrity: ZK proofs confirm that research data has not been altered in a secure environment.
    Traceability: Solana and EVM blockchains provide a permanent record of transactions.
    Trust: The protocol uses both cryptographic techniques and blockchain technology to share research data in a trusted way.
    Wormhole Integration: Seamless communication between Solana and Ethereum allows collaborators and stakeholders to be on different blockchains.

### Enhancements

    Access Control: Access permission efficiency can be increased with advanced smart contracts in Solana.
    User Interface: An easy-to-use web or mobile interface to follow the entire process.
    Data Analytics: Analytics operations on data stored in Ethereum & Solana.


### Connection Overview

    File content is encrypted using ZKFile, generating a ZK proof.
    Encrypted file is uploaded to Arweave, obtaining an Arweave hash.
    ZkFile object, Arweave hash, and other metadata are converted to ZKFileData format.
    ZKFileData object is transferred to the recipient using Wormhole bridge.

# Architecture Definition:

<img width="1066" alt="diagram-1" src="https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/489427f8-d4fa-48d9-93a0-91bec10d5846">

ZK File Transfer is a secure and private method for transferring files between two parties.


## Technical Implementation of [Solana-Solana] File Transfer:

1. **WebRTC Configuration:** Utilize the RTCPeerConnection API to configure the WebRTC connection. Include STUN/TURN servers in the configuration for NAT traversal.

2. **Encryption and Decryption:** Use RSA keys for encryption and decryption of AES keys. Implement the exchange of AES keys between clients securely.

3. **Arweave Integration:** Retrieve files from Arweave based on the ZK proofs presented by the recipients.


## Technical Implementation of [Solana-EVM] File Transfer:

1. **Solana-EVM Bridge:** Establish a bridge between Solana and EVM networks for token transfer. Implement the conversion of files into tokens with ZK proofs.

2. **Wormhole Integration:** Utilize Wormhole for cross-chain communication between Solana and EVM networks. Transfer tokens representing ZK proofs through the Wormhole bridge.

---


```
git clone https://github.com/briansmith/crypto-bench && cd crypto-bench && cargo update && cargo +nightly bench
```

You must use Rust Nightly because `cargo bench` is used for these benchmarks,
and only Right Nightly supports `cargo bench`.

You don't need to run `cargo build`, and in fact `cargo build` does not do
anything useful for this crate.

`./cargo +nightly test` runs one iteration of every benchmark for every
implementation. This is useful for quickly making sure that a change to the
benchmarks does not break them. Do this before submitting a pull request.

`cargo update` in the workspace root will update all the libraries to the
latest version.

`cargo +nightly bench -p crypto_bench_ring` runs all the tests for [_ring_](https://github.com/briansmith/ring).

---

| | _ring_ | rust-crypto | rust-nettle (Nettle) | rust-openssl (OpenSSL) | sodiumoxide (libsodium) | Windows CNG | Mac/iOS Common Crypto |
|----------------------------------------------|:------------------:|:------------------:|----------------------|:----------------------:|:-----------------------:|:-----------:|:---------------------:|
| ECDH (Suite B) key exchange | :white_check_mark: | | | | | | |



```
echo 'prepare phase1'
node ../../../snarkjs/build/cli.cjs powersoftau new bn128 12 pot12_0000.ptau -v

echo 'contribute phase1 first'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v -e="random text"

echo 'apply a random beacon'
node ../../../snarkjs/build/cli.cjs powersoftau beacon pot12_0001.ptau pot12_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"

echo 'prepare phase2'
node ../../../snarkjs/build/cli.cjs powersoftau prepare phase2 pot12_beacon.ptau pot12_final.ptau -v

echo 'Verify the final ptau'
node ../../../snarkjs/build/cli.cjs powersoftau verify pot12_final.ptau
```

* Decentralized Verification: The verification process, including the checking of zero-knowledge proofs, is performed on a blockchain network (e.g., Solana). This decentralized approach eliminates the need for a trusted third party, enhancing the security and privacy of the file transfer.

* Efficient Data Storage on Blockchain: To maintain efficiency and minimize blockchain storage requirements, only essential data (e.g., proofs, hashes) are stored on-chain. The actual file remains with the sender and recipient, ensuring privacy.

* Server: The system operates on a peer-to-peer basis, with each participant running the ZK File Transfer client. This design supports direct, secure file transfers without intermediaries.

https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API

https://github.com/virjilakrum/zk-lokomotive

- WebRTC (Web Real-Time Communication) is a technology that enables Web applications and sites to capture and optionally stream audio and/or video media, as well as to exchange arbitrary data between browsers without requiring an intermediary. The set of standards that comprise WebRTC makes it possible to share data and perform teleconferencing peer-to-peer, without requiring that the user install plug-ins or any other third-party software.

      WebRTC Configuration: Use the RTCPeerConnection API to configure the WebRTC connection. Include STUN/TURN servers in the configuration to handle NAT traversal.
      Data Channels: Use RTCDataChannel for transferring the encrypted AES key, zk-SNARK proof, and IPFS hash. This channel can also be used for the actual file transfer if not using IPFS.
      Signaling Implementation: Implement a simple signaling mechanism using WebSockets or any real-time communication library. This is for exchanging WebRTC offer, answer, and ICE candidates.

  https://microsoft.github.io/MixedReality-WebRTC/versions/release/1.0/manual/helloworld-unity-signaler.html

* Client Interface: The user interface for ZK File Transfer is designed to be intuitive, allowing users to easily send and receive files securely. The cryptographic operations are handled in the background, providing a seamless experience for the user.

* Wallet Connection: The "Wallet Connection" button facilitates a secure linkage between users and their digital wallets, designed specifically for compatibility with the Solana blockchain using @solana/web3js library. Leveraging the advanced capabilities of the Phantom Wallet, this integration enables efficient management of digital assets and seamless file transactions with a person.

https://solana-labs.github.io/solana-web3.js/

    The function transfer_sol_to_eth in lib.rs is used to transfer assets from Solana to Ethereum.
    The bridge and solana_wallet variables are used to create a Wormhole bridge and Solana wallet.
    The wormhole_sdk::transfer function is used to initiate the asset transfer.
    The transfer_sol_to_eth function in main.rs is used for testing.
    The solana_provider variable is used to create Anchor's Solana provider.
    The ix variable is used to create a command to interact with the smart contract.
    The function solana_provider.send_and_confirm is used to send the transaction to the Solana network.

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**
_Anchor Solana Cli Build_
**

`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

`rustc --version`

`cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked`

`anchor --version`

`sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"`

`solana --version`

`cd tokenswap_contract`

`anchor build`

`anchor test`


## Prizes 🏆
---

<div align="center">
  <img src="https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/1da98901-0a85-4ff9-b6ce-8e22b142efd8"alt="wormhole tweet" width="400"/>
</div>

### [Solana Renaissance Hackathon Wormhole Best Multichain Track Winner 1st 😎🥇](https://earn.superteam.fun/listings/hackathon/build-multichain-apps-using-wormhole/)


Sui Overflow Local Track (Winner🥇) | May 2024
EDCON Japan (Finalist) | May 2024
Solana Global Renaissance Hackathon Multichain Track (Winner🥇) | April 2024
Solana Demoday (Winner🥈) | March 2024

---

![Thank You](https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/af24913b-b649-4bf5-90e1-fdd99e68ca51)
