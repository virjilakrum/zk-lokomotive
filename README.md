# zk-Lokomotive
File Transfer with zero-knowledge
**Security Technologies**


![diagram(37)](https://github.com/virjilakrum/zk-lokomotive/assets/158029357/2200dc5c-ff40-4a41-ba37-51b9a9c8206b)


# Architecture Definition:

ZK File Transfer is a secure and private method for transferring files between two parties.

## Motivation:

Traditional file transfer methods often lack sufficient privacy and security, especially when sensitive data is involved. Trust between parties cannot be assumed, particularly in remote or decentralized scenarios. Implementing file transfers on a centralized server poses risks of data breaches and privacy violations.

## Solution:

Adopting a decentralized approach to file transfer, utilizing the principles of zero-knowledge proofs (zkSNARKs), can significantly enhance privacy and security. This method allows for the verification of file transmission without revealing the contents of the files to the network or a third party.

## Technical Description:

The ZK File Transfer, process uses advanced cryptographic techniques to ensure that files are transferred securely and privately:

1. **Encryption and Decryption:** Files are encrypted using a shared secret, which is generated through a secure key exchange mechanism (e.g., Elliptic Curve Diffie-Hellman (ECDH)). This ensures that only the recipient, who possesses the corresponding secret, can decrypt and access the file.
   
![Elliptic-Curve-Diffie-Hellman-ECDH-Key-Exchange-Protocol-Two-users-Alice-and-Bob](https://github.com/virjilakrum/zk-lokomotive/assets/158029357/678ce0b9-d149-42b4-b959-937c9e753b00)
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

4. **Poseidon Hash for Data Integrity:** The integrity and authenticity of the file are ensured using the Poseidon hash function, a cryptographic hash function optimized for zero-knowledge proofs. This function is applied to the file before transmission, creating a digest that can be securely compared by the recipient.

![20-Table6-1](https://github.com/virjilakrum/zk-lokomotive/assets/158029357/6f57ca6d-f074-4106-aed1-067ab9277003)

4. **Decentralized Verification:** The verification process, including the checking of zero-knowledge proofs, is performed on a blockchain network (e.g., Solana). This decentralized approach eliminates the need for a trusted third party, enhancing the security and privacy of the file transfer.

5. **Efficient Data Storage on Blockchain:** To maintain efficiency and minimize blockchain storage requirements, only essential data (e.g., proofs, hashes) are stored on-chain. The actual file remains with the sender and recipient, ensuring privacy.

6. **Bittorent (optional) Architecture:** The system operates on a peer-to-peer basis, with each participant running the ZK File Transfer client. This design supports direct, secure file transfers without intermediaries.

7. **Client Interface:** The user interface for ZK File Transfer is designed to be intuitive, allowing users to easily send and receive files securely. The cryptographic operations are handled in the background, providing a seamless experience for the user.

__

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
