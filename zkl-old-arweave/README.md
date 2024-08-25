# arweave-crypto-storage
dApp for storage and send encrypted data using Arweave ( https://www.arweave.org/ )

### For run the dApp
```
$ npm install
```
```
$ npm start
```


### Store Encrypted Data
the dApp generate a private key using your wallet file, encrypt the data and store in Arweave

### Send Encrypted Data
1 - Users who can receive data should upload the Public Key in Arweave, the dApp generate a public key derivative from wallet file.

2 - To send an encrypted file we need the Arweave address of the receiver, we push the public key data from the Arweave blockchain

3 - For encrypt the file we generate a new wallet file using "arweave.wallets.generate". with this wallet file we generate a derivative private key and encrypt the data using AES. 

4 - With the Public Key of the user published in Blockchain we encrypted the Private Key that encrypted the data using RSA. Allowing only with the private key of the user it will be possible to decrypt the data

5 - For decrypted the file the user generate your private key from your wallet, and decrypt the encryption key that encrypt the data. with the encryption key decrypt the user can decrypt the data
