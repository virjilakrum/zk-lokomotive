import { Key } from "./zkl-kds/key.js";
import { generateKeypair, generateMnemonic } from "./zkl-kds/key-derivation.js";

const endpoint = "http://localhost:3000";

export const createUser = async function (name, networkType, walletAddress) {
  const authToken = localStorage.getItem("authToken");
  const mnemonic = generateMnemonic();
  const { publicKey, privateKey } = await generateKeypair(mnemonic);

  const response = await fetch(`${endpoint}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      profileName: name,
      networkType,
      publicKey: publicKey.asHexString,
      walletAddress,
    }),
  });

  if (response.ok) return;

  console.error("Backend error:", (await response.json()).error);
};

export const updateUser = async function (publicKey, updates = {}) {
  const allowedParams = ["profileName", "networkType", "address"];
  const body = {};

  for (const key of allowedParams) {
    if (key in updates) {
      body[key] = updates[key];
    }
  }

  if (Object.keys(body).length === 0) {
    console.error("No valid fields to update");
    return;
  }

  const response = await fetch(`${endpoint}/users/${publicKey}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const updatedUser = await response.json();
    console.log("User updated successfully:", updatedUser);
  } else {
    console.error((await response.json()).error);
  }
};
