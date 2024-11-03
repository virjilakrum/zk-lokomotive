const { AuthTokens } = require("../models/index.js");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const authToken = authHeader.split(" ")[1];

  try {
    const tokenRecord = await AuthTokens.findOne({ authToken });

    if (!tokenRecord) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.tokenRecord = tokenRecord;
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const editProfile = async (req, res, next) => {
  const { walletAddress } = req.body;
  const { tokenRecord } = req;

  if (tokenRecord.walletAddress !== walletAddress) {
    return res.status(403).json({
      error:
        "Forbidden: You are not allowed to edit this account's information.",
    });
  }

  next();
};

module.exports = { verifyToken, editProfile };
