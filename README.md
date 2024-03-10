# zk-Lokomotive
File Transfer on Solana with zero-knowledge
**Security Technologies**


![diagram(37)](https://github.com/virjilakrum/zk-lokomotive/assets/158029357/2200dc5c-ff40-4a41-ba37-51b9a9c8206b)

Here's how the interaction between the two parties might work:

- The receiver assigns one RSA public key
  
- The sender encrypts the AES symmetric cipher with this public key
  
- Creates a zkproof when the sender can decrypt the encrypted data
  
- Sends the encrypted key and zkproof to the recipient via p2p somehow **(we need to figure this out)**
  
- Receiver decrypts the aes key, checks the proof and reports that it is ready for file transfer
  
- Sender pins file on ipfs network, assigns hashi to receiver

- Receiver receives the file

# Architecture Definition:

ZK File Transfer is a secure and private method for transferring files between two parties.

## Motivation:

Providing the amount of our data continues rapidly in the technological singularity. Traditional file formats often lack adequate privacy and security, especially when it comes to sensitive data. File services run on a central server, creating the risk of data breaches and privacy violations. We offer a different solution to this than traditional breaks, by combining the powerful capacities and polynomials of mathematics and the decentralized generality of Solana, thus challenging the trilemma.

## Solution:

Adopting a decentralized approach to file transfer, utilizing the principles of zero-knowledge proofs (zkSNARKs), can significantly enhance privacy and security. This method allows for the verification of file transmission without revealing the contents of the files to the network or a third party.

## Technical Description:

The ZK File Transfer, process uses advanced cryptographic techniques to ensure that files are transferred securely and privately:

1. **Encryption and Decryption:** Files are encrypted using a shared secret, which is generated through a secure key exchange mechanism (e.g., Elliptic Curve Diffie-Hellman (ECDH)). This ensures that only the recipient, who possesses the corresponding secret, can decrypt and access the file.
   
![Elliptic-Curve-Diffie-Hellman-ECDH-Key-Exchange-Protocol-Two-users-Alice-and-Bob](https://github.com/virjilakrum/zk-lokomotive/assets/158029357/678ce0b9-d149-42b4-b959-937c9e753b00)

> Elliptic-curve Diffie–Hellman (ECDH) is an anonymous key agreement protocol that allows two parties, each having an elliptic-curve public–private key pair, to establish a shared secret over an insecure channel. This shared secret may be directly used as a key, or to derive another key. The key, or the derived key, can then be used to encrypt subsequent communications using a symmetric-key cipher. It is a variant of the Diffie–Hellman protocol using elliptic-curve cryptography.
`

You can choose between 10 standard NIST curves of different sizes. 5 pseudo-random curves and 5 Koblitz curves providing from 80 to 256 bits symmetrically equivalent security.  See [ecdh.h](https://github.com/kokke/tiny-ECDH-c/blob/master/ecdh.h) for clarification.

You can define the macro `ECDH_COFACTOR_VARIANT` in [ecdh.c](https://github.com/kokke/tiny-ECDH-c/blob/master/ecdh.c) to enable the [co-factor variant of ECDH](https://crypto.stackexchange.com/questions/18222/difference-between-ecdh-with-cofactor-key-and-ecdh-without-cofactor-key) for safe non-ephemeral use.

# Binding ECDH on Rust (Ring)

These benchmarks currently only can be built/run using Nightly Rust because
they use Rust's built-in benchmarking feature, and that feature is marked
"unstable" (i.e. "Nightly-only").

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

`cargo +nightly bench -p crypto_bench_ring` runs all the tests for [*ring*](https://github.com/briansmith/ring).
|                                              |       *ring*       |     rust-crypto    | rust-nettle (Nettle) | rust-openssl (OpenSSL) | sodiumoxide (libsodium) | Windows CNG | Mac/iOS Common Crypto |
|----------------------------------------------|:------------------:|:------------------:|----------------------|:----------------------:|:-----------------------:|:-----------:|:---------------------:|
| ECDH (Suite B) key exchange                  | :white_check_mark: |                    |                      |                        |                         |             |                       |

```
// -----------------------------------------------------------------------------
// Eliptic Curve Diffie-Hellman [ECDH] Key Exchange Protocol
// -----------------------------------------------------------------------------
static void
crecip(felem out, const felem z) {
  felem a,t0,b,c;

  /* 2 */ fsquare_times(a, z, 1); // a = 2
  /* 8 */ fsquare_times(t0, a, 2);
  /* 9 */ fmul(b, t0, z); // b = 9
  /* 11 */ fmul(a, b, a); // a = 11
  /* 22 */ fsquare_times(t0, a, 1);
  /* 2^5 - 2^0 = 31 */ fmul(b, t0, b);
  /* 2^10 - 2^5 */ fsquare_times(t0, b, 5);
  /* 2^10 - 2^0 */ fmul(b, t0, b);
  /* 2^20 - 2^10 */ fsquare_times(t0, b, 10);
  /* 2^20 - 2^0 */ fmul(c, t0, b);
  /* 2^40 - 2^20 */ fsquare_times(t0, c, 20);
  /* 2^40 - 2^0 */ fmul(t0, t0, c);
  /* 2^50 - 2^10 */ fsquare_times(t0, t0, 10);
  /* 2^50 - 2^0 */ fmul(b, t0, b);
  /* 2^100 - 2^50 */ fsquare_times(t0, b, 50);
  /* 2^100 - 2^0 */ fmul(c, t0, b);
  /* 2^200 - 2^100 */ fsquare_times(t0, c, 100);
  /* 2^200 - 2^0 */ fmul(t0, t0, c);
  /* 2^250 - 2^50 */ fsquare_times(t0, t0, 50);
  /* 2^250 - 2^0 */ fmul(t0, t0, b);
  /* 2^255 - 2^5 */ fsquare_times(t0, t0, 5);
  /* 2^255 - 21 */ fmul(out, t0, a);
}
```
![An-example-of-ECC-version-of-Diffie-Hellman-Protocol](https://github.com/virjilakrum/zk-lokomotive/assets/158029357/338121bb-a462-40b1-a561-034dd9010c4f)


3. **Zero-Knowledge Proofs for File Integrity:** To verify that a file has been transmitted without revealing its content, zero-knowledge proofs are utilized. These proofs allow the sender to prove that the file matches a publicly agreed-upon hash without disclosing the file itself.

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

4. **Poseidon Hash for Data Integrity:** The integrity and authenticity of the file are ensured using the Poseidon hash function, a cryptographic hash function optimized for zero-knowledge proofs. This function is applied to the file before transmission, creating a digest that can be securely compared by the recipient.

![20-Table6-1](https://github.com/virjilakrum/zk-lokomotive/assets/158029357/6f57ca6d-f074-4106-aed1-067ab9277003)

4. **Decentralized Verification:** The verification process, including the checking of zero-knowledge proofs, is performed on a blockchain network (e.g., Solana). This decentralized approach eliminates the need for a trusted third party, enhancing the security and privacy of the file transfer.

5. **Efficient Data Storage on Blockchain:** To maintain efficiency and minimize blockchain storage requirements, only essential data (e.g., proofs, hashes) are stored on-chain. The actual file remains with the sender and recipient, ensuring privacy.

6. **Server:** The system operates on a peer-to-peer basis, with each participant running the ZK File Transfer client. This design supports direct, secure file transfers without intermediaries.

https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API

https://github.com/virjilakrum/zk-lokomotive

* WebRTC (Web Real-Time Communication) is a technology that enables Web applications and sites to capture and optionally stream audio and/or video media, as well as to exchange arbitrary data between browsers without requiring an intermediary. The set of standards that comprise WebRTC makes it possible to share data and perform teleconferencing peer-to-peer, without requiring that the user install plug-ins or any other third-party software.

    WebRTC Configuration: Use the RTCPeerConnection API to configure the WebRTC connection. Include STUN/TURN servers in the configuration to handle NAT traversal.
    Data Channels: Use RTCDataChannel for transferring the encrypted AES key, zk-SNARK proof, and IPFS hash. This channel can also be used for the actual file transfer if not using IPFS.
    Signaling Implementation: Implement a simple signaling mechanism using WebSockets or any real-time communication library. This is for exchanging WebRTC offer, answer, and ICE candidates. 
https://microsoft.github.io/MixedReality-WebRTC/versions/release/1.0/manual/helloworld-unity-signaler.html

8. **Client Interface:** The user interface for ZK File Transfer is designed to be intuitive, allowing users to easily send and receive files securely. The cryptographic operations are handled in the background, providing a seamless experience for the user.

9. **Wallet Connection** The "Wallet Connection" button facilitates a secure linkage between users and their digital wallets, designed specifically for compatibility with the Solana blockchain using @solana/web3js library. Leveraging the advanced capabilities of the Phantom Wallet, this integration enables efficient management of digital assets and seamless file transactions with a person.

https://docs.phantom.app/introduction/readme

https://solana-labs.github.io/solana-web3.js/

__
Anchor Solana Cli Build
__

```curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh```

```rustc --version```

```cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked```

```anchor --version```

```sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"```

```solana --version```

```cd tokenswap_contract```

```anchor build```

```anchor test```

finish 11:00
