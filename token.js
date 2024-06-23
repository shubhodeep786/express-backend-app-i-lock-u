require('dotenv').config(); // Load environment variables

const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // For generating secret

// Generate a 256-bit (32-byte) secret if not already provided in .env
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || generateAccessTokenSecret();

// Function to generate a new access token
function generateAccessToken(payload) {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: '1h' }); // Token expires in 1 hour
}

// Example usage:
const user = { id: 123, username: 'example_user' };
const accessToken = generateAccessToken(user);
console.log('Generated Access Token:', accessToken);
