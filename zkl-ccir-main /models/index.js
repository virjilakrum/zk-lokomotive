const mongoose = require("mongoose");

const NonceSchema = new mongoose.Schema({
  walletAddress: String,
  nonce: String,
  networkType: String,
  createdAt: { type: Date, expires: 300, default: Date.now },
});

const AuthTokenSchema = new mongoose.Schema({
  walletAddress: String,
  authToken: String,
  networkType: String,
  createdAt: { type: Date, expires: 3600, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  networkType: { type: String, required: true },
  profileName: { type: String, required: true, default: "Anonymous" },
  publicKey: { type: String, required: true, unique: true },
});

const Nonces = mongoose.model("Nonce", NonceSchema);
const AuthTokens = mongoose.model("AuthToken", AuthTokenSchema);
const Users = mongoose.model("User", UserSchema);
Users.collection.createIndex({ publicKey: 1 }, { unique: true });

module.exports = { Nonces, AuthTokens, Users };
