// Web3D token contract address on BSC
export const TOKEN_CONTRACT_ADDRESS = '0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7';
// Admin wallet address
export const ADMIN_ADDRESS = '0x4A58ad9EdaC24762D3eA8eB76ab1E2C114cBB4d4';
// BSC RPC URLs - using multiple providers for better reliability
export const BSC_RPC_URLS = [
  'https://bsc-dataseed.binance.org/',
  'https://bsc-dataseed1.binance.org/',
  'https://bsc-dataseed2.binance.org/',
  'https://bsc-dataseed3.binance.org/',
  'https://bsc-dataseed4.binance.org/'
];
// Default BSC RPC URL (first in the list)
export const BSC_RPC_URL = BSC_RPC_URLS[0];
// API base URL - this would be your deployed backend URL in production
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-api.com/api' 
  : 'http://localhost:3001/api';

// Environment check for dev/prod modes
export const isDevelopment = process.env.NODE_ENV !== 'production';

// Updated claim contract address with the one you provided
export const CLAIM_CONTRACT_ADDRESS = '0xf658BAc41db26aA9765FdFFC0536A67f33eE9b5a';

// Chain ID for BSC mainnet
export const BSC_CHAIN_ID = 56;
// Chain ID for BSC testnet
export const BSC_TESTNET_CHAIN_ID = 97;

// Current network we're using (change to testnet if needed)
export const CURRENT_CHAIN_ID = BSC_CHAIN_ID;

// BNB decimals
export const BNB_DECIMALS = 18;

// Gas price boost multiplier (to ensure transactions don't get stuck)
export const GAS_PRICE_BOOST = 1.2;
// Gas limit boost multiplier
export const GAS_LIMIT_BOOST = 1.5;

// ABI for BEP20 token (Standard ERC20 compatible)
export const tokenABI = [
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
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "_owner", "type": "address" },
      { "name": "_spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

// ABI for Web3DClaim contract - Updated to match the contract you shared
export const claimContractABI = [
  {
    "inputs": [{"internalType": "address", "name": "_token", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Claimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "ClaimListUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "claimableAmount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "claimed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyClaimable",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address[]", "name": "users", "type": "address[]"},
      {"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}
    ],
    "name": "setClaimList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "web3dToken",
    "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
];
