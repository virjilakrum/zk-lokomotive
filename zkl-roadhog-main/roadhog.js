import { SiweMessage } from "siwe";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import * as solanaWeb3 from "@solana/web3.js";
import bs58 from "bs58";

const ENDPOINT = "http://localhost:3000";

const getNonce = async (walletAddress, networkType) => {
  const nonceResponse = await fetch(
    `${ENDPOINT}/auth/nonce?address=${walletAddress}&type=${networkType}`,
  );
  const { nonce } = await nonceResponse.json();
  return nonce;
};

export async function signIn(type) {
  let address, signature, message;

  message = {
    domain: window.location.host,
    statement: "Sign in to zk-Lokomotive",
    uri: window.location.origin,
    version: "1",
  };

  if (type === "ethereum") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    address = await signer.getAddress();
    const nonce = await getNonce(address, type);
    message = new SiweMessage({ ...message, address, chainId: 1, nonce });
    message = message.prepareMessage();
    signature = await signer.signMessage(message);
  } else if (type === "solana") {
    const provider = window.solana;
    await provider.connect();
    address = provider.publicKey.toString();
    const nonce = await getNonce(address, type);
    const encodedMessage = new TextEncoder().encode(
      JSON.stringify({ ...message, address, nonce, chainId: 900 }),
    );
    const signatureBytes = await provider.signMessage(encodedMessage, "utf8");
    signature = bs58.encode(signatureBytes.signature);
  } else {
    console.error(
      'roadhog/signIn: parameter type can be "ethereum" or "solana"',
    );
    return;
  }

  try {
    const response = await fetch(`${ENDPOINT}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        walletAddress: address,
        signature,
      }),
    });

    if (!response.ok) {
      throw new Error((await response.json()).error);
    }

    const { authToken } = await response.json();

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("networkType", type);

    return { success: true, authToken, address };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: error.message };
  }
}

export async function signOff() {
  const authToken = localStorage.getItem("authToken");
  const response = await fetch(`${ENDPOINT}/auth/signoff`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error((await response.json()).error);
  } else {
    localStorage.removeItem("authToken");
    return true;
  }
}
