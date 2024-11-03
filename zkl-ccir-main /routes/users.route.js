const express = require("express");
const router = express.Router({ mergeParams: true });

const { Users } = require("../models/index.js");
const {
  verifyToken,
  editProfile,
} = require("../middlewares/auth.middleware.js");

router.get("/", async (req, res) => {
  const { publicKey, address } = req.query;

  try {
    const query = {};
    if (publicKey) {
      query.publicKey = publicKey;
    }
    if (address) {
      query.address = address;
    }

    if (!publicKey && !address) {
      return res
        .status(400)
        .json({ error: "Please provide a publicKey or address to search." });
    }

    const users = await Users.find(query);

    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "No users found matching the criteria." });
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", verifyToken, editProfile, async (req, res) => {
  const { walletAddress, networkType, profileName, publicKey } = req.body;

  try {
    const user = new Users({
      walletAddress,
      networkType,
      profileName,
      publicKey,
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error:
          "Public key already exists, are you trying to impersonate someone?",
      });
    }
    console.error(error);
    res.status(500).json({ error });
  }
});

router.put("/:publicKey", verifyToken, editProfile, async (req, res) => {
  const { walletAddress, networkType, profileName, publicKey } = req.body;

  try {
    const updatedUser = await Users.findOneAndUpdate(
      { publicKey },
      {
        walletAddress,
        networkType,
        profileName,
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
