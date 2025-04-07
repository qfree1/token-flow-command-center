
// This is a sample backend implementation for the Web3D Token Claim System
// For a production setup, you would deploy this separately from your frontend

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Web3 = require('web3');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import ABI (in production, you would store this in a separate file)
const tokenABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

// Constants
const TOKEN_CONTRACT_ADDRESS = '0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7'; // Real Web3D Token address
const ADMIN_ADDRESS = '0x4A58ad9EdaC24762D3eA8eB76ab1E2C114cBB4d4';
const BSC_RPC_URL = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/';

// Admin wallet private key - NEVER expose this in the frontend
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

// Check if admin private key is set
if (!ADMIN_PRIVATE_KEY) {
  console.error('ERROR: Admin private key not set. Please set ADMIN_PRIVATE_KEY in .env');
}

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider(BSC_RPC_URL));
const tokenContract = new web3.eth.Contract(tokenABI, TOKEN_CONTRACT_ADDRESS);

// In-memory storage (replace with a database in production)
let tokenAllocations = new Map();

// Routes
app.get('/', (req, res) => {
  res.send('Web3D Token Distribution API');
});

// Check admin authorization
const isAdminAuthorized = (req, res, next) => {
  const adminSignature = req.headers['x-admin-signature'];
  
  // This is a simplified check - in production, implement proper signature verification
  // or use JWT for secure admin authentication
  
  if (!adminSignature) {
    return res.status(401).json({ error: 'Admin authorization required' });
  }
  
  // Implement verification logic here
  
  next();
};

// Set token allocations (admin only)
app.post('/api/allocations/set', isAdminAuthorized, (req, res) => {
  try {
    const { wallets, amount } = req.body;
    
    if (!wallets || !amount || wallets.length === 0 || isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Invalid wallets or amount' });
    }
    
    // Validate wallet addresses
    const validWallets = wallets.filter(wallet => 
      wallet && wallet.startsWith('0x') && wallet.length === 42
    );
    
    if (validWallets.length === 0) {
      return res.status(400).json({ error: 'No valid wallet addresses provided' });
    }
    
    // Set allocations
    validWallets.forEach(wallet => {
      const normalizedWallet = wallet.toLowerCase();
      tokenAllocations.set(normalizedWallet, amount);
      console.log(`Set allocation for ${normalizedWallet}: ${amount} tokens`);
    });
    
    res.status(200).json({ 
      message: `Successfully set allocations for ${validWallets.length} wallets`,
      allocations: validWallets.length
    });
  } catch (error) {
    console.error('Error setting allocations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check token allocation for a wallet
app.get('/api/allocations/check', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }
    
    const walletAddress = address.toLowerCase();
    const allocation = tokenAllocations.get(walletAddress);
    
    if (!allocation) {
      return res.status(404).json({ error: 'No allocation found for this wallet' });
    }
    
    res.status(200).json({ address: walletAddress, amount: allocation });
  } catch (error) {
    console.error('Error checking allocation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Claim tokens - Directly transfer Web3D tokens to user
app.post('/api/tokens/claim', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }
    
    const walletAddress = address.toLowerCase();
    
    // Check if wallet has an allocation
    const allocation = tokenAllocations.get(walletAddress);
    if (!allocation) {
      return res.status(404).json({ error: 'No token allocation found for this wallet' });
    }
    
    // For BSC, we need the admin account with private key to send the transaction
    const adminAccount = web3.eth.accounts.privateKeyToAccount(ADMIN_PRIVATE_KEY);
    web3.eth.accounts.wallet.add(adminAccount);
    
    // Get gas price and gas limit for BSC
    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceHex = '0x' + BigInt(gasPrice).toString(16);
    const gasLimit = '0x' + (200000).toString(16); // Estimated gas limit for ERC20 transfers
    
    // Convert tokens to wei (assuming 18 decimals)
    const amountInWei = web3.utils.toWei(allocation, 'ether');
    
    // Create transaction
    const txData = tokenContract.methods.transfer(walletAddress, amountInWei).encodeABI();
    
    console.log(`Sending ${allocation} Web3D tokens from ${adminAccount.address} to ${walletAddress}`);
    
    // Send transaction
    const txResponse = await web3.eth.sendTransaction({
      from: adminAccount.address,
      to: TOKEN_CONTRACT_ADDRESS,
      gas: gasLimit,
      gasPrice: gasPriceHex,
      data: txData
    });
    
    console.log(`Transaction successful: ${txResponse.transactionHash}`);
    
    // Remove allocation after successful transfer
    tokenAllocations.delete(walletAddress);
    
    res.status(200).json({
      success: true,
      transaction: txResponse.transactionHash,
      message: `Successfully claimed ${allocation} tokens`
    });
  } catch (error) {
    console.error('Error claiming tokens:', error);
    res.status(500).json({ error: 'Failed to claim tokens: ' + error.message });
  }
});

// Get token balance
app.get('/api/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }
    
    // Call balanceOf function
    const balance = await tokenContract.methods.balanceOf(address).call();
    
    // Convert from wei to tokens (assuming 18 decimals)
    const tokenBalance = web3.utils.fromWei(balance, 'ether');
    
    res.status(200).json({
      address: address,
      balance: tokenBalance
    });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
