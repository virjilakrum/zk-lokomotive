import styles from "./core.module.scss";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import SignalingChannel from "../../webrtc/signaling-channel";
const { generateKeyPairSync } = require('crypto');
const crypto = require('crypto');
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { FC, useCallback } from 'react';


const _gvars = {};
export default function Core() {
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
    const [isMetaMaskLoggedIn, setIsMetaMaskLoggedIn] = useState(false);
    const [coreState, setCoreState] = useState(0);
    const [coreMessage, setCoreMessage] = useState("");
    const [file, setFile] = useState(null);
    const [receiver, setReceiver] = useState(null);

    const [signalingChannel, setSignalingChannel] = useState(null);
    const [ourId, setOurId] = useState(null);
    const [peerId, setPeerId] = useState(null);
    const [peerIdPartner, setPeerIdPartner] = useState(null);

    const [aesKey, setAesKey] = useState(null);
    const [aesIV, setAesIV] = useState(null);
    const [RSAkeyInstance, setRSAkeyInstance] = useState(null);
    const [pubKey, setpubKey] = useState(null);
    const [privKey, setprivKey] = useState(null);

    useEffect(() => {
        setIsMetaMaskInstalled(true);
    }, []);

    const checkMetaMaskInstalled = () => {
        if (typeof window.ethereum !== "undefined") {
            setIsMetaMaskInstalled(true);
        } else {
            setIsMetaMaskInstalled(false);
        }
    };

    const checkMetaMaskLoggedIn = async () => {
        if (isMetaMaskInstalled) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) {
                    setOurId(accounts[0]);
                    setIsMetaMaskLoggedIn(true);
                } else {
                    setIsMetaMaskLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking MetaMask login:", error);
            }
        }
    };

    const handleLogin = async () => {
        if (isMetaMaskInstalled) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                if (accounts.length > 0) {
                    setOurId(accounts[0]);
                    setIsMetaMaskLoggedIn(true);
                }
            } catch (error) {
                console.error("Error logging in with MetaMask:", error);
            }
        }
    };

    function getYouClass() {
        switch (coreState) {
            case 0:
                return "";
            case 1:
                return styles.core_you_awaiting_recv;
            case 2:
                return styles.core_you_recv;
            case 4:
                return styles.core_you_left;
            case 5:
                return styles.core_you_left;
        }
    }
    function getPartnerClass() {
        switch (coreState) {
            case 0:
                return "";
            case 1:
                return [styles.core_partner_flicker, styles.core_partner_visible, styles.core_partner_sending].join(' ');
            case 2:
                return [styles.core_partner_sending, styles.core_partner_visible].join(' ');
            case 4:
                return [styles.core_partner_flicker, styles.core_partner_visible, styles.core_partner_receiving].join(' ');
            case 5:
                return [styles.core_partner_visible, styles.core_partner_receiving].join(' ');

        }
    }
    return (
        <div className={styles.core_root}>
            <div className={[styles.core_you, getYouClass()].join(' ')}>
                {isMetaMaskInstalled && !isMetaMaskLoggedIn && (
                    <button onClick={() => {
                        solana.connect().then((x) => {
                            console.log(x.publicKey.toBase58());
                            _gvars.wallet = x;
                        setOurId(x.publicKey.toBase58());
                            setIsMetaMaskLoggedIn(true);
                    });
                    }}>
                        Connect to a solana wallet
                    </button>
                )}
                {isMetaMaskInstalled && isMetaMaskLoggedIn && coreState == 0 && <div className={styles.selection}>
                    <div onClick={
                        () => {
                            setCoreState(3);
                        }

                    }>
                        Send a file on solana
                    </div>
                    <div onClick={
                        async () => {

                            setCoreMessage("Waiting for partner to come online");


                            // Where the signaling server is hosted, for a local server the port must match the one set in the .env files inside the config directory
                            const port = process.env.PORT || 443;
                            const signalingServerUrl = "https://cinnamon.heatwavealien.dev:" + port;
                            // Token must match the value defined in the .env filed inside the config directory
                            const token = "SIGNALING123";
                            console.log(ourId)
                            const channel = new SignalingChannel(ourId, signalingServerUrl, token);
                            var rawFileBytes = []

                            channel.onMessage = async (message) => {
                                console.log(message);
                                let target = message.from;
                                if (message.message)
                                    switch (message.message.type) {
                                        case "senderOnline":
                                            setCoreMessage("Crafting an RSA keypair");
                                            const rsaKeyPair = await window.crypto.subtle.generateKey(
                                                {
                                                    name: "RSA-OAEP",
                                                    modulusLength: 2048,
                                                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                                                    hash: { name: "SHA-256" },
                                                },
                                                true,
                                                ["encrypt", "decrypt"]
                                            );
                                            const publicKey = await window.crypto.subtle.exportKey("spki", rsaKeyPair.publicKey);
                                            const privateKey = await window.crypto.subtle.exportKey("pkcs8", rsaKeyPair.privateKey);

                                            const privateKeyBytes = new Uint8Array(privateKey);
                                            localStorage.setItem("privateKey", JSON.stringify(Array.from(privateKeyBytes)));
                                            setpubKey(publicKey);
                                            setprivKey(privateKey);
                                            setRSAkeyInstance(rsaKeyPair);
                                            setCoreMessage("Sending sender the public key");
                                            channel.sendTo(target, { type: "rsaPub", rsaPublicKey: publicKey });
                                            setCoreMessage("Awaiting response");
                                            break;
                                        case "encryptedAesKey":
                                            setCoreMessage("Decrypting partner key");
                                            console.log("DECAESWHAT");
                                            const encryptedAesKey = message.message.aesKey;
                                            const encryptedIV = message.message.aesIV;

                                            const storedPrivateKey = JSON.parse(localStorage.getItem("privateKey"));
                                            const pkBytes = new Uint8Array(storedPrivateKey);
                                            const importedPrivateKey = await window.crypto.subtle.importKey(
                                                "pkcs8",
                                                pkBytes,
                                                {
                                                    name: "RSA-OAEP",
                                                    hash: { name: "SHA-256" },
                                                },
                                                true,
                                                ["decrypt"]
                                            );
                                            const RSAkeyInstance = importedPrivateKey;


                                            const decryptedAesKey = await window.crypto.subtle.decrypt(
                                                {
                                                    name: "RSA-OAEP",
                                                    hash: { name: "SHA-256" },
                                                },
                                                RSAkeyInstance,
                                                encryptedAesKey
                                            );
                                            console.log(encryptedAesKey);
                                            console.log(encryptedIV);
                                            setAesKey(decryptedAesKey);
                                            const decryptedIV = await window.crypto.subtle.decrypt(
                                                {
                                                    name: "RSA-OAEP",
                                                    hash: { name: "SHA-256" },
                                                },
                                                RSAkeyInstance,
                                                encryptedIV,
                                            );
                                            setAesIV(decryptedIV);
                                            console.log("Decrypted key and IV");
                                            console.log(decryptedAesKey);
                                            console.log(decryptedIV);
                                            localStorage.setItem("aesKey", JSON.stringify(Array.from(decryptedAesKey)));
                                            localStorage.setItem("aesIV", JSON.stringify(Array.from(decryptedIV)));

                                            setCoreMessage("Awaiting partner to send file hash");
                                            channel.sendTo(target, { type: "recvReady" });
                                            break;
                                        case "ipfsHash":
                                            setCoreMessage("Downloading file");
                                            const ipfsHash = message.ipfsHash;
                                            const filename = message.filename;
                                            // Create an IPFS client
                                            const ipfs = IPFS.create();

                                            // Download the IPFS file
                                            const downloadFile = async (ipfsHash) => {
                                                try {
                                                    const file = await ipfs.get(ipfsHash);
                                                    // Access the downloaded file using file[0].content
                                                    const decryptedFile = await crypto.subtle.decrypt(
                                                        {
                                                            name: "AES-GCM",
                                                            iv: aesIV
                                                        },
                                                        aesKey,
                                                        file[0].content
                                                    );
                                                    console.log('Decrypted file:', new Uint8Array(decryptedFile));

                                                } catch (error) {
                                                    console.error('Error downloading file:', error);
                                                }
                                            };

                                            // Call the downloadFile function with the IPFS hash
                                            setCoreState(2);
                                            downloadFile(ipfsHash);
                                            setCoreMessage("File received");
                                            const blob = new Blob([decryptedFile], { type: 'application/octet-stream' });

                                            // Create a temporary URL for the Blob
                                            const url = URL.createObjectURL(blob);

                                            // Create a link element to trigger the download
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = filename // Set the desired file name
                                            link.click();

                                            // Clean up the temporary URL
                                            URL.revokeObjectURL(url);

                                            break;
                                        case "fileSegment":
                                            setCoreMessage("Receiving file");

                                            const segment = message["message"]["segment"];
                                            const typedArray = new Uint8Array(segment);
                                            const array = [...typedArray];
                                            rawFileBytes.push(array);

                                            console.log(segment);
                                            console.log("Got a segment with length: " + segment.length);
                                            break;
                                        case "fileEnd":
                                            const uhh = async (rawFileBytes, aesKey, aesIV, message) => {
                                                setCoreMessage("File received");
                                                let length = 0;
                                                rawFileBytes.forEach(item => {
                                                    length += item.length;
                                                });
                                                let mergedArray = new Uint8Array(length);

                                                let offset = 0;
                                                rawFileBytes.forEach(item => {
                                                    mergedArray.set(item, offset);
                                                    offset += item.length;
                                                });
                                                console.log("Concated array length: " + mergedArray.length);
                                                const storedAesKey = await JSON.parse(await localStorage.getItem("aesKey"));
                                                const storedAesIV = await JSON.parse(await localStorage.getItem("aesIV"));
                                                console.log(storedAesKey);
                                                console.log(storedAesIV);
                                                try {

                                                    aesKey = await window.crypto.subtle.importKey(
                                                        "raw",
                                                        new Uint8Array(storedAesKey),
                                                        {
                                                            name: "AES-GCM"
                                                        },
                                                        false,
                                                        ["decrypt"]
                                                    );
                                                    aesIV = new Uint8Array(storedAesIV);
                                                    console.log("Grabbed aeskey:");
                                                    console.log(aesKey);
                                                    const decryptedFile = await window.crypto.subtle.decrypt(
                                                        {
                                                            name: "AES-GCM",
                                                            iv: aesIV
                                                        },
                                                        aesKey,
                                                        mergedArray
                                                    );
                                                }
                                                catch {

                                                };
                                                blob = new Blob([mergedArray], { type: 'application/octet-stream' });

                                                url = URL.createObjectURL(blob);
                                                link = document.createElement('a');
                                                link.href = url;
                                                link.download = message.message.filename // Set the desired file name
                                                link.click();
                                                URL.revokeObjectURL(url);
                                            }
                                            uhh(rawFileBytes, aesKey, aesIV, message);
                                            break;

                                    }
                            };
                            channel.connect();
                            setSignalingChannel(channel);
                            setCoreState(1);
                        }

                    }>
                        Receive a file from solana
                    </div>
                </div>}
                {isMetaMaskInstalled && isMetaMaskLoggedIn && coreState == 1 && <div className={styles.selection}>
                    <p onClick={
                        () => {

                        }
                    }>
                        {coreMessage}</p>
                </div>
                }
                {isMetaMaskInstalled && isMetaMaskLoggedIn && coreState == 2 && <div className={styles.selection}>
                    <p>{coreMessage}</p>
                </div>
                }

                {isMetaMaskInstalled && isMetaMaskLoggedIn && coreState == 3 && <div className={styles.send_prompt_root}>
                    {/* Theme these pls */}
                    <input type="file" onChange={
                        (e) => {
                            setFile(e.target.files[0]);
                            console.log(file);
                        }
                    } />
                    <input type="text" placeholder="Receiver's address" />
                    <button onClick={
                        () => {
                            const inputFile = document.querySelector('input[type="file"]');


                            const receiverInput = document.querySelector('input[type="text"]');
                            console.log("File handle");
                            console.log(file);


                            setReceiver(receiverInput.value);

                            //Instead of using the signaling server to transfer the damn file, we can use IPFS to store the file and send the hash to the receiver


                            // Where the signaling server is hosted, for a local server the port must match the one set in the .env files inside the config directory
                            const port = process.env.PORT || 443;
                            const signalingServerUrl = "https://cinnamon.heatwavealien.dev:" + port;
                            // Token must match the value defined in the .env filed inside the config directory
                            const token = "SIGNALING123";
                            console.log(receiver, signalingServerUrl, token)
                            const channel = new SignalingChannel(window.ethereum.selectedAddress, signalingServerUrl, token);
                            channel.onMessage = async (message) => {
                                let pardner = message.from;
                                console.log(message);
                                if (message.message)
                                    switch (message.message.type) {
                                        case "rsaPub":
                                            setCoreMessage("Encrypting AES key");
                                            const rsaPublicKey = message.message.rsaPublicKey;
                                            const rsaInstance = await window.crypto.subtle.importKey(
                                                "spki",
                                                rsaPublicKey,
                                                {
                                                    name: "RSA-OAEP",
                                                    hash: "SHA-256",
                                                },
                                                true,
                                                ["encrypt"]
                                            );
                                            console.log(rsaInstance);
                                            console.log(rsaPublicKey);
                                            const aesKey = crypto.randomBytes(32);
                                            const aesIV = crypto.randomBytes(16);

                                            const encryptedAesKey = await window.crypto.subtle.encrypt(
                                                {
                                                    name: "RSA-OAEP",
                                                    hash: "SHA-256",
                                                },
                                                rsaInstance,
                                                aesKey
                                            );
                                            const encryptedIV = await window.crypto.subtle.encrypt(
                                                {
                                                    name: "RSA-OAEP",
                                                    hash: "SHA-256",
                                                },
                                                rsaInstance,
                                                aesIV.buffer
                                            );
                                            //const encryptedIVBase64 = window.btoa(String.fromCharCode(...new Uint8Array(encryptedIV)));
                                            //const encryptedAesKeyBase64 = window.btoa(String.fromCharCode(...new Uint8Array(encryptedAesKey)));
                                            setAesKey(aesKey);
                                            setAesIV(aesIV);
                                            localStorage.setItem("aesKey", JSON.stringify(Array.from(aesKey)));
                                            localStorage.setItem("aesIV", JSON.stringify(Array.from(aesIV)));
                                            setCoreMessage("Sending encrypted AES key");
                                            console.log(pardner);
                                            channel.sendTo(pardner, { type: "encryptedAesKey", aesKey: encryptedAesKey, aesIV: encryptedIV });
                                            setCoreMessage("Awaiting partner to send file hash");
                                            break;
                                        case "recvReady":
                                            setCoreMessage("Encrypting and sending file");
                                            const fileReader = new FileReader();
                                            fileReader.onload = async (e) => {
                                                const storedAesKey = localStorage.getItem("aesKey");
                                                const storedAesIV = localStorage.getItem("aesIV");
                                                let aesIVBuffer;

                                                let importedAesKey;
                                                if (storedAesKey && storedAesIV) {
                                                    const aesKeyBuffer = new Uint8Array(JSON.parse(storedAesKey));
                                                    aesIVBuffer = new Uint8Array(JSON.parse(storedAesIV));
                                                    importedAesKey = await window.crypto.subtle.importKey(
                                                        "raw",
                                                        aesKeyBuffer,
                                                        { name: "AES-GCM" },
                                                        false,
                                                        ["encrypt", "decrypt"]
                                                    );

                                                } else {
                                                    // Handle case when aesKey and aesIV are not found in localStorage
                                                    // You can generate new aesKey and aesIV here
                                                }
                                                const fileData = e.target.result;
                                                console.log(importedAesKey);
                                                console.log("let the encryption begin");
                                                const encryptedFile = await window.crypto.subtle.encrypt(
                                                    {
                                                        name: "AES-GCM",
                                                        iv: aesIVBuffer
                                                    },
                                                    importedAesKey,
                                                    new Uint8Array(fileData)
                                                );
                                                console.log("Encrypted");
                                                setCoreState(5);
                                                const segmentSize = 1024 * 1024; // 1MB

                                                for (let i = 0; i < fileData.byteLength; i += segmentSize) {
                                                    console.log("Sending chunk");
                                                    const segment = fileData.slice(i, i + segmentSize);
                                                    const typedArray = new Uint8Array(segment);
                                                    const array = [...typedArray];
                                                    console.log(segment);
                                                    channel.sendTo(pardner, { type: "fileSegment", segment: array });
                                                }
                                                channel.sendTo(pardner, { type: "fileEnd", filename: file.name });
                                                //const ipfs = IPFS.create();
                                                //
                                                //const file = await ipfs.pin(encryptedFile);
                                                //channel.sendTo(receiver, { type: "ipfsHash", ipfsHash: file.cid.toString(), filename: file.name });
                                            };
                                            fileReader.readAsArrayBuffer(file);
                                            break;

                                    }
                            };
                            console.log(receiverInput.value)
                            channel.connect();
                            channel.sendTo(receiverInput.value, { type: "senderOnline" });
                            setSignalingChannel(channel);
                            setCoreState(4);

                        }

                    }>Send</button>
                </div>
                }
                {isMetaMaskInstalled && isMetaMaskLoggedIn && coreState == 4 && <div className={styles.send_prompt_root}>
                    <p onClick={
                        () => {
                            //setCoreState(5);
                        }

                    }>{coreMessage}</p>
                </div>
                }
                {isMetaMaskInstalled && isMetaMaskLoggedIn && coreState == 5 && <div className={styles.send_prompt_root}>
                    <p>SENDING</p>
                </div>
                }
                {!isMetaMaskInstalled && <p>Please install metamask to use zk-Lokomotive</p>}
            </div>




            {/* PARTNER */}
            <div className={[styles.core_partner, getPartnerClass()].join(' ')}></div>
            {isMetaMaskInstalled && isMetaMaskLoggedIn && (coreState == 2 || coreState == 5) && <div className={styles.transferAnim}>

            </div>
            }
        </div>
    );
}