# zkl-crypto

Cryptographic functions provider and example repository.

This module provides encryption and decryption functions for handling both binary data and strings using public and private keys. It utilizes `ecies-wasm` for the underlying cryptographic operations.

Package available on npm: https://www.npmjs.com/package/@zklx/crypto

## Functions

### `encryptFile(publicKey: Key, fileName: string, data: Uint8Array): Uint8Array`

Encrypts the given binary data for the recipient using the public key. The file name is included in the encrypted data.

- `publicKey`: The recipient's public key.
- `fileName`: The name of the file being encrypted.
- `data`: The plaintext data as a `Uint8Array`.

Returns the ciphertext as a `Uint8Array`.

### `decryptFile(privateKey: Key, data: Uint8Array): { data: Uint8Array, fileName: string }`

Decrypts the given ciphertext using the recipient's private key. Returns the decrypted data and the original file name.

- `privateKey`: The recipient's private key.
- `data`: The ciphertext data as a `Uint8Array`.

Returns an object containing the plaintext data and the original file name.

### `encryptString(publicKey: Key, string: string): string`

Encrypts the given string for the recipient using their public key. Returns the ciphertext as a hexadecimal string.

- `publicKey`: The recipient's public key.
- `string`: The plaintext string.

### `decryptString(privateKey: Key, string: string): string`

Decrypts the given ciphertext string (in hexadecimal format) using the recipient's private key. Returns the plaintext string.

- `privateKey`: The recipient's private key.
- `string`: The ciphertext string in hexadecimal format.

## Usage

```javascript
import { Key } from "@zklx/kds";
import { encryptString, decryptString, encryptFile, decryptFile } from "@zklx/crypto";

// Example usage:

const publicKey = new Key(/* ... */);
const privateKey = new Key(/* ... */);

// Encrypt a string
const plaintext = "Hello, World!";
const encryptedString = encryptString(publicKey, plaintext);

// Decrypt the string
const decryptedString = decryptString(privateKey, encryptedString);

console.log(decryptedString); // "Hello, World!"

// Encrypt binary data
const fileName = "document.txt";
const data = new Uint8Array([/* ... */]);
const encryptedData = encryptFile(publicKey, fileName, data);

// Decrypt the binary data
const { data: decryptedData, fileName: decryptedFileName } = decryptFile(privateKey, encryptedData);

console.log(decryptedFileName); // "document.txt"
console.log(decryptedData); // Uint8Array
```

## Example

To launch the example webpage:

```bash
pnpm install
npx webpack # use npx, pnpm - webpack integration is broken
```

## Error Handling

This module performs type checks on its inputs. It throws `TypeError` if arguments are not of the expected types. Additionally, the `decryptString` function issues a warning if the provided ciphertext string does not appear to be a valid hexadecimal string.

## Notes

- The `asHexString` method is added to `Uint8Array.prototype` if it does not already exist. This method converts a `Uint8Array` to a hexadecimal string representation.
- Ensure that your public and private keys are instances of the `Key` class provided by `zkl-kds/key`.

## License

This project is licensed under the GNU Lesser General Public License, version 2.1.

Authored by Yigid BALABAN, fyb@fybx.dev

2024 © zk-Lokomotive team

https://zk-lokomotive.xyz/

