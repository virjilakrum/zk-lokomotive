const express = require("express");
const router = express.Router({ mergeParams: true });
const siwe = require("siwe");
const bs58 = require("bs58");
const nacl = require("tweetnacl");

const { verifyToken } = require("../middlewares/auth.middleware.js");
const { Nonces, AuthTokens } = require("../models/index.js");
const { generateNonce, generateBearerToken } = require("../utils/index.js");

router.get("/nonce", async (req, res) => {
  const { address: walletAddress, type: networkType } = req.query;

  if (!walletAddress || !networkType) {
    return res
      .status(400)
      .json({ error: "Missing walletAddress or networkType" });
  }

  if (networkType !== "ethereum" && type !== "solana") {
    return res
      .status(400)
      .json({ error: 'Invalid networkType. Must be "ethereum" or "solana"' });
  }

  const nonce = generateNonce();

  try {
    await Nonces.findOneAndUpdate(
      { walletAddress, networkType },
      { walletAddress, nonce, networkType },
      { upsert: true, new: true },
    );

    res.json({ nonce });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/verify", async (req, res) => {
  const { message, walletAddress, signature } = req.body;

  if (!walletAddress || !signature) {
    return res
      .status(400)
      .json({ error: "Missing walletAddress or signature" });
  }

  const nonce = await Nonces.findOne({ walletAddress })
    .lean()
    .select("-__v -updatedAt");
  const networkType = nonce.networkType;

  try {
    if (networkType === "ethereum") {
      if (!message) {
        return res.status(400).json({ error: "Missing SiweMessage" });
      }
      const siweMessage = new siwe.SiweMessage(message);
      const fields = await siweMessage.verify({
        signature,
        nonce: nonce.nonce,
      });
      if (walletAddress == fields.walletAddress)
        throw new Error("Invalid signature");
    } else if (networkType === "solana") {
      const signatureUint8 = bs58.default.decode(signature);
      const messageUint8 = new TextEncoder().encode(nonce.nonce);
      const publicKeyUint8 = bs58.default.decode(walletAddress);

      const isValid = nacl.sign.detached.verify(
        messageUint8,
        signatureUint8,
        publicKeyUint8,
      );
      if (!isValid) {
        throw new Error("Invalid signature");
      }
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid networkType. Must be "ethereum" or "solana"' });
    }

    const authToken = generateBearerToken();

    await AuthTokens.findOneAndUpdate(
      { walletAddress, networkType },
      { authToken, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    await Nonces.deleteOne({ walletAddress, networkType });

    res.json({ authToken });
  } catch (error) {
    res.status(400).json({ error: `${error.message}, ${error.stack}` });
  }
});

router.delete("/signoff", verifyToken, async (req, res) => {
  const deletedAuth = AuthTokens.findOneAndDelete({
    authToken: tokenRecord.authToken,
  });

  if (!deletedAuth) {
    return res.status(400).json({ error: "Can't log out, not logged in?" });
  }

  return res.status(204).json({ error: "Logged out successfully." });
});

module.exports = router;
