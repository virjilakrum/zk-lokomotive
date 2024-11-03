const crypto = require('crypto');

function generateNonce() {
  return crypto.randomBytes(32).toString('hex');
}

function generateBearerToken() {
  return crypto.randomBytes(32).toString('base64');
}

module.exports = { generateNonce, generateBearerToken }
