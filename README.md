# zk-lokomotive (Zk Based Fully Secure and Trustless Multichain File Transfer System)

### [Solana Renaissance Hackathon Wormhole Best Multichain Track Winner 1st 😎🥇](https://earn.superteam.fun/listings/hackathon/build-multichain-apps-using-wormhole/) 

<div align="center">
  <img src="https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/1da98901-0a85-4ff9-b6ce-8e22b142efd8"alt="wormhole tweet" width="400"/>
</div>

Author: [Baturalp Güvenç](https://github.com/virjilakrum)


<div align="center">
  <img src="https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/a5504168-988c-464f-bf15-e6a650f46586" alt="logo" width="200"/>
</div>

## Team 

![loko](https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/f8d680a6-c860-4c5e-a63f-7b80be2fed1a)

## Demo Video (for Solana to Solana)

* Since we can fully integrate this into the crosschain in the future, this demo only represents file transfer with zk on the Solana network and support is received from [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) ([signaling](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling)) for **P2P** communication.
https://github.com/zk-Lokomotive/zk-lokomotive-wormhole/assets/158029357/81a7a8bb-0802-4158-8f48-fb1ddf4f5989





## Introduction to Private B2B File Transfer System

* This project aims to create a secure and efficient file transfer system bridging [Solana](https://solana.com/tr/docs) and [Ethereum](https://ethereum.org/en/developers/docs/) networks (**For now, we are trying to run it on these networks, and as we progress through milestones, we plan to make it available on all major networks and complete the integration with Wormhole.**) by integrating [ZK](https://en.wikipedia.org/wiki/Zero-knowledge_proof), [Arweave](https://docs.arweave.org/developers), and [Wormhole](https://docs.wormhole.com/wormhole). ZK ensures file integrity and privacy, Arweave facilitates file storage, and Wormhole enables cross-chain token and data-transfer. In addition, we use [Celestia](https://docs.celestia.org/) in the data-layer  and nodes ([light nodes](https://docs.celestia.org/nodes/light-node)) to ensure data availability and to keep the information "live". 

This project encompasses file transfer scenarios within the **Solana-Solana** (![for demo](
https://github.com/zk-Lokomotive/zk-lokomotive-wormhole/assets/158029357/81a7a8bb-0802-4158-8f48-fb1ddf4f5989)) and **Solana-EVM** ecosystems. 


* The architecture undergoes a significant shift for file transfer between **all networks**. In this scenario, We establish a bridge between Solana and EVM networks. The file is encrypted with zero-knowledge proofs (ZK) and transformed into a token in exchange for tokens. This token, encapsulating the ZK proof of the file's integrity, traverses the Solana-EVM bridge via Wormhole. Upon reception, the recipient validates the ZK proof to claim the file. Additionally, I retrieve the file from Arweave, ensuring its integrity based on the verified proof.

* In summary, this project implements a sophisticated file transfer mechanism, leveraging different technologies for seamless communication between Solana-Solana and nonEVM-EVM networks. Through meticulous encryption, tokenization, and validation processes, it ensures the secure and verifiable exchange of files while maintaining compatibility and interoperability across disparate blockchain ecosystems.

## Motivation:

Providing the amount of our data continues rapidly in the technological singularity. Traditional file formats often lack adequate privacy and security, especially when it comes to sensitive data. File services run on a central server, creating the risk of data breaches and privacy violations. We offer a different solution to this than traditional breaks, by combining the powerful capacities and polynomials of mathematics and the decentralized generality of Solana, thus challenging the trilemma.

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
    Alice retrieves the file from IPFS to ensure its integrity based on the verified proof.

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

## Used Technologies:

### Wormhole Integration

```rust


use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};
use std::{
    io::Write,
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct PostMessageData {
    /// Unique nonce for this message
    pub nonce: u32,

    /// Message payload
    pub payload: Vec<u8>,

    /// Commitment Level required for an attestation to be produced
    pub consistency_level: ConsistencyLevel,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub enum ConsistencyLevel {
    Confirmed,
    Finalized
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub enum Instruction{
    Initialize,
    PostMessage,
    PostVAA,
    SetFees,
    TransferFees,
    UpgradeContract,
    UpgradeGuardianSet,
    VerifySignatures,
}

```

- The provided Rust struct ZkFile and its methods demonstrate the usage of ZK to encrypt and prove files' integrity. from_bytes function encrypts a file content using ZK, while to_data function converts a ZkFile object to ZkFileData format.

```rust

use ipfs_api::IpfsClient;

fn upload_file(client: &IpfsClient, file_content: &[u8]) -> Result<String> {
    let mut add_result = client.add(file_content)?;
    Ok(add_result.hash.to_string())
}
```

- The provided Rust function upload_file demonstrates the usage of IPFS-http-client to interact with IPFS. It uploads file content to IPFS and returns the IPFS hash.

### Connection Overview

    File content is encrypted using ZKFile, generating a ZK proof.
    Encrypted file is uploaded to IPFS, obtaining an IPFS hash.
    ZkFile object, IPFS hash, and other metadata are converted to ZKFileData format.
    ZKFileData object is transferred to the recipient using Wormhole bridge.

# Architecture Definition:

<img width="1066" alt="diagram-1" src="https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/489427f8-d4fa-48d9-93a0-91bec10d5846">

ZK File Transfer is a secure and private method for transferring files between two parties.


## Technical Implementation of [Solana-Solana] File Transfer:
The architecture comprises two main components: the Solana-Solana file transfer system using WebRTC and the Solana-EVM file transfer system with the bridge architecture.

    Utilizes WebRTC for secure file transfer between users on the Solana network.
    Encryption and decryption of files using RSA and AES keys.
    Direct exchange of encrypted files between clients.

1. **WebRTC Configuration:** Utilize the RTCPeerConnection API to configure the WebRTC connection. Include STUN/TURN servers in the configuration for NAT traversal.

2. **Encryption and Decryption:** Use RSA keys for encryption and decryption of AES keys. Implement the exchange of AES keys between clients securely.

3. **IPFS Integration:** Retrieve files from IPFS based on the ZK proofs presented by the recipients.


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

![Thank You](https://github.com/zk-Lokomotive/zk-lokomotive/assets/158029357/af24913b-b649-4bf5-90e1-fdd99e68ca51)


