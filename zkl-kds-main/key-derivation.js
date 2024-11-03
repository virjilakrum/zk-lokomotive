import {
  generateMnemonic as generateMnemonic_bip39,
  mnemonicToSeed
} from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import elliptic from "elliptic";
import { Key } from "./key.js";

const MNEMONIC_STRENGTH = 192;
//const CURVE = "curve25519"
const CURVE = "secp256k1";

/**
 * Generates a new key pair from a mnemonic.
 *
 * @param {string} mnemonic - The mnemonic to generate the key pair from.
 * @returns {Promise<{ publicKey: Key; privateKey: Key }>} A promise that resolves to an object containing the public and private keys.
 */
export async function generateKeypair(mnemonic) {
  const seed = (await mnemonicToSeed(mnemonic)).toString("hex");

  const ec = new elliptic.ec(CURVE);
  const keypair = ec.genKeyPair({
    entropy: seed.slice(0, 32)
  });

  return {
    publicKey: new Key("public", { fromHexString: keypair.getPublic("hex") }),
    privateKey: new Key("private", {
      fromHexString: keypair.getPrivate("hex")
    })
  };
}

/**
 * Generates a new mnemonic.
 *
 * @returns {string} The generated mnemonic.
 */
export function generateMnemonic() {
  return generateMnemonic_bip39(wordlist, MNEMONIC_STRENGTH);
}

/**
 * Gets a key pair from a private key.
 *
 * @param {Key} key - The private key to get the key pair from.
 * @returns {{ publicKey: Key; privateKey: Key }} An object containing the public and private keys.
 * @throws {TypeError} If the provided key is not a private key.
 */
export function getPairFromPrivate(key) {
  if (key.keyType != "private")
    throw new TypeError("Required property 'key' must be a private key");
  const ec = new elliptic.ec(CURVE);
  const keypair = ec.keyFromPrivate(key.asHexString);

  return {
    publicKey: new Key("public", { fromHexString: keypair.getPublic("hex") }),
    privateKey: new Key("private", {
      fromHexString: keypair.getPrivate("hex")
    })
  };
}
